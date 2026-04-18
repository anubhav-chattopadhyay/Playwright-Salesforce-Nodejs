import { Page, Locator, expect} from '@playwright/test'
import {getOtp} from  '../utils/gmailApiAuth'
import {step} from '../utils/stepDecorator'

export class LoginPage{
    readonly page: Page;
    btnUseEmail: Locator;
    txtLoginEmail: Locator;
    btnLoginContinue: Locator;
    txtLoginPassword: Locator;
    txtVerificationCode : Locator;
    btnVerify: Locator;
    lblErrorMessage : Locator;

    constructor(page: Page){
        this.page = page;
        this.btnUseEmail = this.page.locator("#gidr-email-log-in-button");
        this.txtLoginEmail = this.page.locator("//input[@name='username']");
        this.btnLoginContinue = this.page.locator("#Login");
        this.txtLoginPassword = this.page.getByRole("textbox", { name: 'password' });
        this.txtVerificationCode = this.page.locator("//input[@name='emc']")
        this.btnVerify = this.page.locator("//input[@value='Verify']");
        this.lblErrorMessage = this.page.locator("//div[@class='errorMsg']")
    }

    @step('Login to the Application with Verification Code')
    async loginWithVerificationCode(){
        await this.txtLoginEmail.fill(process.env.SF_USERNAME ?? "");
        await this.txtLoginPassword.fill(process.env.SF_PASSWORD ?? "");
        await this.btnLoginContinue.click();
        await expect(this.txtVerificationCode).toBeVisible({timeout:10000});
        await this.page.waitForTimeout(5000);
        await this.enterVerificationCode();
    }

    private async enterVerificationCode(maxRetries: number = 3){

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const otpCode = await getOtp();

            if (!otpCode) {
                await this.page.waitForTimeout(10000);
                continue;
            }
            console.log("attempt #" + attempt)
            await this.txtVerificationCode.fill(otpCode);
            await this.btnVerify.click();
            await this.page.waitForTimeout(1000);
            const errorVisible = await this.lblErrorMessage.isVisible({ timeout: 5000 }).catch(() => false);
            if (!errorVisible) return;

            await this.page.waitForTimeout(5000);
        }
        throw new Error('Verification failed after maximum retries');
    }
}