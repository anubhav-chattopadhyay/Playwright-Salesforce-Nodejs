# Playwright Salesforce Automation

Test automation framework for the Salesforce Sales Cloud developer portal, built with Playwright and TypeScript.

## Overview

This framework automates key Sales Cloud workflows including lead creation and management. It uses a shared session strategy to avoid repeated logins across test runs, with MFA handled automatically via the Gmail API.

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation and test runner
- TypeScript — type-safe page objects and utilities
- [@faker-js/faker](https://fakerjs.dev/) — realistic test data generation
- [Google Gmail API](https://developers.google.com/gmail/api) — automated MFA code retrieval
- [dotenv](https://github.com/motdotla/dotenv) — environment variable management

## Project Structure

```
├── pageObjects/
│   ├── LoginPage.ts                        # Login and MFA verification
│   └── SalesConsole/
│       ├── SalesConsoleHome.ts             # Home page navigation
│       └── SalesLeads.ts                   # Leads page interactions
├── tests/
│   ├── auth.setup.ts                       # Session setup (runs before all tests)
│   └── Salesforce_SalesConsoleTests/
│       └── SalesLeadsTest.spec.ts          # Lead creation test
├── utils/
│   ├── gmailApiAuth.ts                     # Gmail API OTP extraction
│   ├── salesforceAuth.ts                   # Salesforce OAuth token helper
│   └── stepDecorator.ts                    # Playwright test.step decorator
├── globalSetup.ts                          # Loads .env before test run
├── playwright.config.ts
└── .env                                    # Credentials (not committed)
```

## Authentication

### MFA Handling via Gmail API

Salesforce sends a verification code by email when logging in from an unrecognised device. This framework automatically retrieves the code using the Gmail API instead of requiring manual entry.

The `gmailApiAuth.ts` utility:

1. Authenticates with Gmail using OAuth2 credentials stored in `gmail_client_creds.json`
2. Fetches the latest email from `noreply@salesforce.com`
3. Extracts the 6-digit verification code using a regex
4. Returns it to the login flow for automatic entry

### Session Sharing

To avoid logging in before every test run, the framework uses Playwright's `storageState` to persist the authenticated session to `auth.json`.

The `auth.setup.ts` project runs once before all tests:

1. If `instance-url.json` exists, navigates directly to the saved Salesforce org URL
2. Checks if the session is still active using `waitForURL` with a 15-second timeout
3. If the session is valid — returns early, all tests reuse the existing session
4. If the session has expired — performs a fresh login, saves the new session to `auth.json` and the org URL to `instance-url.json`

All test projects (`chromium`, `firefox`, `webkit`) declare `dependencies: ['setup']` and load `storageState: 'auth.json'`, so every parallel worker shares the same authenticated session without needing to log in individually.

### Prerequisites

- Node.js 18+
- A Salesforce Developer Edition org
- A Google Cloud project with Gmail API enabled

### Install dependencies

```bash
npm install
npx playwright install
```

### Environment variables

Create a `.env` file in the project root:

```
SF_USERNAME=your-salesforce-username
SF_PASSWORD=your-salesforce-password
SF_SECURITY_TOKEN=your-security-token
SF_CLIENT_ID=your-connected-app-consumer-key
SF_CLIENT_SECRET=your-connected-app-consumer-secret
```

### Gmail API credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → Enable Gmail API
2. Create OAuth2 credentials (Desktop app) → Download as `gmail_client_creds.json` and place in the project root
3. Run the auth script once to generate `token.json`:

```bash
npx ts-node utils/gmailApiAuth.ts
```

### Files not committed (in .gitignore)

| File                      | Purpose                         |
| ------------------------- | ------------------------------- |
| `.env`                    | Salesforce credentials          |
| `auth.json`               | Playwright session cookies      |
| `instance-url.json`       | Saved Salesforce org URL        |
| `gmail_client_creds.json` | Gmail OAuth2 client credentials |
| `token.json`              | Gmail OAuth2 access token       |

## Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run a specific test file
npx playwright test tests/Salesforce_SalesConsoleTests/SalesLeadsTest.spec.ts

# View the HTML report
npx playwright show-report
```
