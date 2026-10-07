import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class HeritageSiteComparePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create heritage site
    async heritageSiteNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/heritage-sites/${this.testSetUpData.contentTitleforTest.contentTitle}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/heritage-sites/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify Heritage Site methods --------------------

    // verify heritage site when being compared method
    async verifyCompareHeritageSite()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from Title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "Edited" text has been added to Title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- ADDRESS --------------------
        // await this.testSteps.LogInfo(`Verifying old Country value "${this.testData.HeritageSite.addressCountry}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressCountry}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Country value "${this.testData.HeritageSite.addressCountryEdited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressCountryEdited}")]`).first()).toBeVisible();

        // await this.testSteps.LogInfo(`Verifying old Address Line 1 value "${this.testData.HeritageSite.addressStreetLine1}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressStreetLine1}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Address Line 1 value "${this.testData.HeritageSite.addressStreetLine1Edited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressStreetLine1Edited}")]`).first()).toBeVisible();

        // await this.testSteps.LogInfo(`Verifying old Address Line 2 value "${this.testData.HeritageSite.addressStreetLine2}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressStreetLine2}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Address Line 2 value "${this.testData.HeritageSite.addressStreetLine2Edited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressStreetLine2Edited}")]`).first()).toBeVisible();

        // await this.testSteps.LogInfo(`Verifying old Address Line 3 value "${this.testData.HeritageSite.addressStreetLine3}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressStreetLine3}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Address Line 3 value "${this.testData.HeritageSite.addressStreetLine3Edited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressStreetLine3Edited}")]`).first()).toBeVisible();

        // await this.testSteps.LogInfo(`Verifying old Town value "${this.testData.HeritageSite.addressTown}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressTown}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying old Postcode value "${this.testData.HeritageSite.addressPostcode}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.addressPostcode}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Townland value "${this.testData.HeritageSite.addressTownLandEdited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressTownLandEdited}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited City value "${this.testData.HeritageSite.addressCityEdited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressCityEdited}")]`).first()).toBeVisible();
        // // await this.testSteps.LogInfo(`Verifying edited County value "${this.testData.HeritageSite.addressCountyEdited}" is in an ins tag`);
        // // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressCountyEdited}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Eircode value "${this.testData.HeritageSite.addressEIRCodeEdited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.addressEIRCodeEdited}")]`).first()).toBeVisible();

        //-------------------- CONTACT --------------------
        await this.testSteps.LogInfo(`Verifying old Phone Number value "${this.testData.HeritageSite.contactPhone}" is in a del tag`);
        await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.contactPhone}")]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited Phone Number value "${this.testData.HeritageSite.contactPhoneEdited}" is in an ins tag`);
        await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.contactPhoneEdited}")]`).first()).toBeVisible();
        
        
        // await this.testSteps.LogInfo(`Verifying old Email value "${this.testData.HeritageSite.contactEmail}" is in a del tag`);
        // await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.contactEmail}")]`).first()).toBeVisible();
        // await this.testSteps.LogInfo(`Verifying edited Email value "${this.testData.HeritageSite.contactEmailEdited}" is in an ins tag`);
        // await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.contactEmailEdited}")]`).first()).toBeVisible();

        //-------------------- WEBSITE --------------------
        await this.testSteps.LogInfo('Verifying old Website link text appears in a removed state');
        await expect(this.page.locator(`//del//a[text()="${this.testData.HeritageSite.websiteLinkText}"]`).first()).toBeVisible();
        await this.testSteps.LogInfo('Verifying edited Website link text appears in an added state');
        await expect(this.page.locator(`//ins//a[text()="${this.testData.HeritageSite.websiteLinkTextEdited}"]`).first()).toBeVisible();
        await this.testSteps.LogInfo('Verifying old Website URL appears in a removed state');
        await expect(this.page.locator(`//del//a[@href="${this.testData.HeritageSite.websiteURL}"]`).first()).toBeVisible();
        await this.testSteps.LogInfo('Verifying edited Website URL appears in an added state');
        await expect(this.page.locator(`//ins//a[@href="${this.testData.HeritageSite.websiteURLEdited}"]`).first()).toBeVisible();

        //-------------------- ADDITIONAL INFORMATION --------------------
        await this.testSteps.LogInfo(`Verifying old Open to the public value "${this.testData.HeritageSite.openToThePublic}" is in a del tag`);
        await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.openToThePublic}")]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited Open to the public value "${this.testData.HeritageSite.openToThePublicEdited}" is in an ins tag`);
        await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.openToThePublicEdited}")]`).first()).toBeVisible();

        await this.testSteps.LogInfo(`Verifying old Grid reference value "${this.testData.HeritageSite.gridreference}" is in a del tag`);
        await expect(this.page.locator(`//del[contains(text(),"${this.testData.HeritageSite.gridreference}")]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited Grid reference value "${this.testData.HeritageSite.gridreferenceEdited}" is in an ins tag`);
        await expect(this.page.locator(`//ins[contains(text(),"${this.testData.HeritageSite.gridreferenceEdited}")]`).first()).toBeVisible();

        await this.testSteps.LogInfo(`Verifying old SM number value "12345" is in a del tag`);
        await expect(this.page.locator(`//span[contains(text(),"SM number:")]//following-sibling::span/del[contains(text(),"12345")]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited SM number value "67890" is in an ins tag`);
        await expect(this.page.locator(`//span[contains(text(),"SM number:")]//following-sibling::span/ins[contains(text(),"67890")]`).first()).toBeVisible();

        await this.testSteps.LogInfo(`Verifying old Historic Map Viewer URL value "${this.testData.HeritageSite.HistoricMapViewer}" is in a del tag`);
        await expect(this.page.locator(`//del//a[@href="${this.testData.HeritageSite.HistoricMapViewer}"]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited Historic Map Viewer URL value "${this.testData.HeritageSite.HistoricMapViewerEdited}" is in an ins tag`);
        await expect(this.page.locator(`//ins//a[@href="${this.testData.HeritageSite.HistoricMapViewerEdited}"]`).first()).toBeVisible();

        await this.testSteps.LogInfo(`Verifying old NISMR URL value "${this.testData.HeritageSite.nismrLink}" is in a del tag`);
        await expect(this.page.locator(`//del//a[@href="${this.testData.HeritageSite.nismrLink}"]`).first()).toBeVisible();
        await this.testSteps.LogInfo(`Verifying edited NISMR URL value "${this.testData.HeritageSite.nismrLinkEdited}" is in an ins tag`);
        await expect(this.page.locator(`//ins//a[@href="${this.testData.HeritageSite.nismrLinkEdited}"]`).first()).toBeVisible();

        //-------------------- BODY FIELD --------------------
        await this.testSteps.LogInfo('Verifying "new" text has been removed from Body field');
        await expect(this.page.locator('//p/del[text()="new"]')).toBeVisible();

        await this.testSteps.LogInfo('Verifying "edited" text has been added to Body field');
        await expect(this.page.locator('//p/ins[text()="edited"]')).toBeVisible();
    }
}
