import fs from 'fs';
import path from 'path'
import { google } from 'googleapis';


const CREDENTIALS_PATH = path.join(process.cwd(), 'gmail_client_creds.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];


export async function getOtp() : Promise<string | null>{
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have a saved token
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("Token not found. Run a separate auth script first to generate token.json");
  }
  const token = fs.readFileSync(TOKEN_PATH, 'utf8');
  oAuth2Client.setCredentials(JSON.parse(token));

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const listRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'noreply@salesforce.com', // Optional filter
    maxResults: 1,
  });

  const messages = listRes.data.messages;
  if (!messages || messages.length === 0) {
    console.log('No messages found.');
    return null;
  }


  const messageId = messages[0].id!;
  const messageRes = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });

  // 3. Decode the body (handling Base64URL encoding)
  const part = messageRes.data.payload?.parts?.find(p => p.mimeType === 'text/plain') || messageRes.data.payload;
  const encodedBody = part?.body?.data;
  
  if (!encodedBody) return null;

  const body = Buffer.from(encodedBody, 'base64').toString('utf-8');

  // 4. Extract 6-digit OTP using Regex
  const otpMatch = body.match(/Verification Code:\s*(\d{6})/i);
  return otpMatch ? otpMatch[1] : null;
}
  
