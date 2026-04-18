import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'gmail_client_creds.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

export async function generateToken() {
  // 1. Load client secrets from credentials.json
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // 2. Generate a URL for the user to visit
  // const authUrl = oAuth2Client.generateAuthUrl({
  //   access_type: 'offline', // CRITICAL: This ensures we get a refresh_token
  //   scope: SCOPES,
  //   prompt: 'consent'       // Forces Google to show the consent screen so we get a refresh token
  // });

  //console.log('Authorize this app by visiting this url:', authUrl);

  // 3. Ask the user for the code from the URL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //rl.question('Enter the code from that page here: ', (code) => {
   // rl.close();
    var code  = '4/0Aci98E9ZihAivQdz3sOcfbmSw9De1JSdQgchTIF5E2E_VEtd6Arf-9VQVczyl_SnUq6ueA'
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      
      // 4. Save the token to disk for future test runs
      if (token) {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      }
    });
  //});
}

generateToken();