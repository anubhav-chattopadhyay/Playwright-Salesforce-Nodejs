import { Page,Expect, Locator, expect } from "@playwright/test";
import { step } from "../../utils/stepDecorator";

export class SalesConsoleHome{

    readonly page:Page;
    consoleHeader : Locator;
    btnShowNavigationApps : Locator;
    btnNavigateToSection : (section:string) => Locator
    btnShowNavMenu : Locator;
    lnkLeads : Locator;

    constructor(page:Page){
        this.page = page;
        this.consoleHeader = this.page.locator("//h1[text()='Seller Home']");
        this.btnShowNavigationApps = this.page.getByRole("button",{name:"Show Navigation Menu"});
        this.btnNavigateToSection = (section:string) => this.page.locator(`//a[@data-itemid='${section}']`)
        this.btnShowNavMenu = this.page.getByRole("button",{name:'Show Navigation Menu'});
        this.lnkLeads = this.page.locator("//a[@title='Leads']");

    }

    @step('Verify User Lands on the Home Page')
    async verifyConsoleHomeLanding(){
        await expect(this.consoleHeader).toBeVisible({timeout:20000});
    }

    // for classical view
    async navigateToSection(section:string){
        await this.btnShowNavMenu.click();
        await this.btnNavigateToSection(section).click();
    }

    @step('Verify User Navigates to Leads')   
    async navigateToLeads(){
        await this.lnkLeads.click();
    }


}