import { expect, Locator, Page } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { step } from "../../utils/stepDecorator";


export class SalesLeads{

    readonly page:Page;
    lblTotalLeadsCount: Locator;
    btnNew : Locator;
    drpDownOption : (selection:string)=> Locator;
    btnSalutation: Locator;
    txtLastName: Locator;
    txtFirstName: Locator;
    txtCompanyName: Locator;
    txtPhone: Locator;
    txtTitle: Locator;
    txtFax: Locator;
    txtMobile: Locator;
    txtEmail: Locator;
    txtWebsite: Locator;
    txtNumberOfEmployees: Locator;
    txtAnnualRevenue: Locator;
    btnLeadSource: Locator;
    btnIndustry: Locator;
    btnLeadStatus: Locator;
    btnRating: Locator;
    drpCountry: Locator;
    txtAddress: Locator;
    txtCity: Locator;
    drpState: Locator;
    txtZipCode: Locator;
    btnProductInterest: Locator;
    txtCurrentGenerator: Locator;
    txtSicCode: Locator;
    btnPrimary: Locator;
    txtNoOfLocation: Locator;
    btnSave : Locator;
    lblLeadName : Locator;
    btnLeadsNav : Locator;
    

    constructor(page:Page){
        this.page = page;
        this.lblTotalLeadsCount = this.page.locator("//button[@data-api-name='TotalLead']//p[text()='Total Leads']/../following-sibling::p");
        this.btnNew = this.page.locator("//button[@name='New']");

        this.drpDownOption = (select:string)=> this.page.locator(`//lightning-base-combobox-item[@data-value='${select}']`);
        this.btnSalutation = this.page.locator("//button[@name='salutation']");
        this.txtFirstName = this.page.locator("//input[@name='firstName']");
        this.txtLastName = this.page.locator("//input[@name='lastName']");
        this.txtCompanyName = this.page.locator("//input[@name='Company']");
        this.txtTitle = this.page.locator("//input[@name='Title']");
        this.txtPhone = this.page.locator("//input[@name='Phone']")
        this.txtFax = this.page.locator("//input[@name='Fax']");
        this.txtMobile = this.page.locator("//input[@name='MobilePhone']");
        this.txtEmail = this.page.locator("//input[@name='Email']");
        this.txtWebsite = this.page.locator("//input[@name='Website']");
        this.txtAnnualRevenue = this.page.locator("//input[@name='AnnualRevenue']");
        this.txtNumberOfEmployees = this.page.locator("//input[@name='NumberOfEmployees']");
        this.btnLeadSource = this.page.locator("//button[@aria-label='Lead Source']");
        this.btnIndustry = this.page.locator("//button[@aria-label='Industry']");
        this.btnLeadStatus = this.page.locator("//button[@aria-label='Lead Status']");
        this.btnRating = this.page.locator("//button[@aria-label='Rating']");

        //Address Info
        this.drpCountry = this.page.locator("//input[@name='country']");
        this.txtAddress = this.page.locator("//textarea[@name='street']");
        this.txtCity = this.page.locator("//input[@name='city']");
        this.txtAddress = this.page.locator("//textarea[@name='street']");
        this.drpState = this.page.locator("//input[@name='province']");
        this.txtZipCode = this.page.locator("//input[@name='postalCode']");

        //Additional Info
        this.btnProductInterest = this.page.locator("//button[@aria-label='Product Interest']");
        this.txtCurrentGenerator = this.page.locator("//input[@name='CurrentGenerators__c']");
        this.txtSicCode = this.page.locator("//input[@name='SICCode__c']")
        this.btnPrimary = this.page.locator("//button[@aria-label='Primary']");
        this.txtNoOfLocation = this.page.locator("//input[@name='NumberofLocations__c']");

        this.btnSave = this.page.locator("//button[@name='SaveEdit']")
        this.lblLeadName = this.page.locator("//lightning-formatted-name");
        this.btnLeadsNav = this.page.locator("//a[@title='Leads']")
    }


    @step('Get the Total Count of Leads')       
    async getTotalLeadCount(){
        var leadCount = await this.lblTotalLeadsCount.textContent({timeout:10000});
        return leadCount ?? '0';
    }

    @step('Click on New Sales Leads')       
    async clickNewSalesLead()    {
        await this.btnNew.click({timeout:10000})
    }

    @step('Enter Details for New Sales Leads')       
    async enterSalesLeadInfo(){
        var leadInfo = await this.generateLeadInfoData();
        
        await this.txtFirstName.fill(leadInfo.firstName);
        await this.txtLastName.fill(leadInfo.lastName);
        await this.txtPhone.fill(leadInfo.phone);
        await this.txtMobile.fill(leadInfo.mobile);
        await this.btnSalutation.click();
        await this.drpDownOption(leadInfo.salutation).click();
        await this.txtCompanyName.fill(leadInfo.companyName);
        await this.txtFax.fill(leadInfo.fax);
        await this.txtTitle.fill(leadInfo.title);
        await this.btnLeadSource.click();
        await this.drpDownOption(leadInfo.leadSource).click();
        await this.txtEmail.fill(leadInfo.email);
        await this.txtWebsite.fill(leadInfo.website);
        await this.btnRating.click();
        await this.drpDownOption(leadInfo.rating).click();
        await this.txtNumberOfEmployees.fill(leadInfo.noOfEmployees);
        await this.drpCountry.click();
        await this.drpDownOption(leadInfo.country).click();
        await this.txtAddress.fill(leadInfo.streetAddress);
        await this.txtCity.fill(leadInfo.city);
        await this.drpState.click();
        await this.drpDownOption(leadInfo.state).click();
        await this.txtZipCode.fill(leadInfo.zipCode);
        await this.txtSicCode.fill(leadInfo.sicCode);
        await this.txtNoOfLocation.fill(leadInfo.noOfLocations);
        await this.txtCurrentGenerator.fill(leadInfo.currentGenerator);
        await this.btnPrimary.click();
        await this.drpDownOption('Yes').click();

        return leadInfo;
    }

    @step('Save the Lead Info and Ensure It Is Created')       
    async saveLeadAndVerifyCreated(leadName:string){
        await this.btnSave.click({timeout:10000});
        await expect(this.lblLeadName).toContainText(leadName,{timeout:10000});
    }

    async generateLeadInfoData(){
        const leadInfo = {
            "salutation" : "Mr.",
            "firstName" : faker.person.firstName(),
            "lastName" : faker.person.lastName(),
            "companyName" : faker.company.name(),
            "phone" : faker.phone.number({style:'national'}),
            "mobile" : faker.phone.number({style:'national'}),
            "title" : faker.person.jobTitle(),
            "email" : faker.internet.username() + "@example.com",
            "website" : faker.internet.url(),
            "fax" : faker.phone.number(),
            "leadSource" : "Web",
            "industry" : "Technology",
            "annualRevenua" : faker.number.bigInt(100000n).toString(),
            "rating" : "Warm",
            "noOfEmployees" : faker.number.int(100).toString(),
            "country": "US",
            "streetAddress" : faker.location.streetAddress(),
            "city" : faker.location.city(),
            "state" :  "TX",
            "zipCode" : faker.location.zipCode('#####'),
            "sicCode" : faker.number.int(100000).toString(),
            "noOfLocations" : faker.number.int(100).toString(),
            "currentGenerator" : faker.string.alpha(10),
            "description": faker.string.alpha(20)
        };
        
        return leadInfo;
    }

}