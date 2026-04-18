import {test,expect} from '@playwright/test'
import { SalesConsoleHome } from '../../pageObjects/SalesConsole/SalesConsoleHome';
import { SalesLeads } from '../../pageObjects/SalesConsole/SalesLeads';
import * as fs from 'fs';

test("Generate a new Salesforce lead", async({page}) =>{

    const salesHome = new SalesConsoleHome(page);
    const salesLeads = new SalesLeads(page);
    const { instanceUrl } = JSON.parse(fs.readFileSync('instance-url.json', 'utf-8'));

    await page.goto(`${instanceUrl}/lightning/page/home`);

    await salesHome.verifyConsoleHomeLanding();
    await salesHome.navigateToLeads();
    var leadsCount = await salesLeads.getTotalLeadCount();
    await salesLeads.clickNewSalesLead();
    var leadsInfo = await salesLeads.enterSalesLeadInfo();

    await salesLeads.saveLeadAndVerifyCreated(leadsInfo.firstName + " " + leadsInfo.lastName);
    await salesLeads.btnLeadsNav.click();
    var newLeadsCount = await salesLeads.getTotalLeadCount();
    expect(parseInt(newLeadsCount)).toBeGreaterThan(parseInt(leadsCount));

})
