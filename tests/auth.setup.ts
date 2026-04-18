import { test as setup } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage';
import * as fs from 'fs';

const authFile = 'auth.json';
const instanceFile = 'instance-url.json';

setup('authenticate', async ({ page }) => {
    if (fs.existsSync(instanceFile)) {
        const { instanceUrl } = JSON.parse(fs.readFileSync(instanceFile, 'utf-8'));
        await page.goto(`${instanceUrl}/lightning/page/home`);
        try {
            await page.waitForURL('**lightning/page/home', { timeout: 15000 });
            return;
        } catch {
            // session expired, fall through to login
            console.log("starting new session");
        }
    }

    const loginPage = new LoginPage(page);
    await page.goto('https://login.salesforce.com/');
    await loginPage.loginWithVerificationCode();

    const instanceUrl = new URL(page.url()).origin;
    fs.writeFileSync(instanceFile, JSON.stringify({ instanceUrl }));
    await page.context().storageState({ path: authFile });
});
