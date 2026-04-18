import axios from 'axios';

export interface SalesforceAuthResult {
    accessToken: string;
    instanceUrl: string;
}

export async function getSalesforceAccessToken(): Promise<SalesforceAuthResult> {
    
    const params = new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.SF_CLIENT_ID!,
        client_secret: process.env.SF_CLIENT_SECRET!,
        username: process.env.SF_USERNAME!,
        password: process.env.SF_PASSWORD! + (process.env.SF_SECURITY_TOKEN ?? ''),
    });

    try {
        const response = await axios.post(
            'https://login.salesforce.com/services/oauth2/token',
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        return {
            accessToken: response.data.access_token,
            instanceUrl: response.data.instance_url,
        };
    } catch (error: any) {
        const detail = error.response?.data ?? error.message;
        throw new Error(`Salesforce OAuth failed: ${JSON.stringify(detail)}`);
    }
}
