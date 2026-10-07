import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class UALComparePage
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

    // check url on the UAL compare page
    async ualNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/ual/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}"`);

        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/ual/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
        );
    }

    // -------------------- Verify UAL compare methods --------------------

    // verify UAL when being compared method
    async verifyCompareUAL()
    {
        //-------------------- TITLE --------------------
        await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();
        
        await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
        await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

        //-------------------- UAL FROM --------------------
        await this.testSteps.LogInfo('Verifying "31 December 2025" text has been removed from the UAL from section');
        await expect(this.page.locator('//div[normalize-space()="UAL from"]//following-sibling::div/del[normalize-space()="31 December 2025"]')).toBeVisible();
        
        await this.testSteps.LogInfo('Verifying "1 November 2024" text has been added to the UAL from section');
        await expect(this.page.locator('//div[normalize-space()="UAL from"]//following-sibling::div/ins[normalize-space()="1 November 2024"]')).toBeVisible();

        //-------------------- AGE --------------------
        await this.testSteps.LogInfo('Verifying age text has been removed');
        await expect(this.page.locator(`//div[normalize-space()="Age"]//following-sibling::div/del[normalize-space()="${this.testData.Unlawfully.age}"]`)).toBeVisible();
        
        await this.testSteps.LogInfo('Verifying age text has been added');
        await expect(this.page.locator(`//div[normalize-space()="Age"]//following-sibling::div/ins[normalize-space()="${this.testData.Unlawfully.ageEdited}"]`)).toBeVisible();

        //-------------------- PRISON --------------------
        await this.testSteps.LogInfo('Verifying "Maghaberry" text has been removed from the Prison section');
        await expect(this.page.locator('//div[normalize-space()="Prison"]//following-sibling::div/del[normalize-space()="Maghaberry"]')).toBeVisible();
        
        await this.testSteps.LogInfo('Verifying "Hydebank Wood" text has been added to the Prison section');
        await expect(this.page.locator('//div[normalize-space()="Prison"]//following-sibling::div/ins[normalize-space()="Hydebank Wood"]')).toBeVisible();

        //-------------------- OFFENCE --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.offence}" text has been removed from the Offence section`);
        await expect(this.page.locator(`//div[normalize-space()="Offence"]//following-sibling::div/del[normalize-space()="${this.testData.Unlawfully.offence}"]`)).toBeVisible();
        
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.offenceEdited}" text has been added to the Offence section`);
        await expect(this.page.locator(`//div[normalize-space()="Offence"]//following-sibling::div/ins[normalize-space()="${this.testData.Unlawfully.offenceEdited}"]`)).toBeVisible();

        //-------------------- DESCRIPTION --------------------
        await this.testSteps.LogInfo('Verifying "a new" text has been removed from the Description section');
        await expect(this.page.locator('//div[normalize-space()="Description"]//following-sibling::div/del[normalize-space()="a new"]')).toBeVisible();
        
        await this.testSteps.LogInfo('Verifying "an edited" text has been added to the Description section');
        await expect(this.page.locator('//div[normalize-space()="Description"]//following-sibling::div/ins[normalize-space()="an edited"]')).toBeVisible();

        //-------------------- EYE COLOUR --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.eyeColour}" text has been removed from the Eye Colour section`);
        await expect(this.page.locator(`//div[normalize-space()="Eye colour"]//following-sibling::div/del[normalize-space()="${this.testData.Unlawfully.eyeColour}"]`)).toBeVisible();
        
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.eyeColourEdited}" text has been added to the Eye Colour section`);
        await expect(this.page.locator(`//div[normalize-space()="Eye colour"]//following-sibling::div/ins[normalize-space()="${this.testData.Unlawfully.eyeColourEdited}"]`)).toBeVisible();

        //-------------------- HAIR COLOUR --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.hairColour}" text has been removed from the Hair Colour section`);
        await expect(this.page.locator(`//div[normalize-space()="Hair colour"]//following-sibling::div/del[normalize-space()="${this.testData.Unlawfully.hairColour}"]`)).toBeVisible();
        
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.hairColourEdited}" text has been added to the Hair Colour section`);
        await expect(this.page.locator(`//div[normalize-space()="Hair colour"]//following-sibling::div/ins[normalize-space()="${this.testData.Unlawfully.hairColourEdited}"]`)).toBeVisible();

        //-------------------- DISTINGUISHING MARKS --------------------
        await this.testSteps.LogInfo(`Verifying "a new" text has been removed from the Distinguishing Marks section`);
        await expect(this.page.locator('//div[normalize-space()="Distinguishing marks"]//following-sibling::div/del[normalize-space()="a new"]')).toBeVisible();
        
        await this.testSteps.LogInfo(`Verifying "an edited" text has been added to the Distinguishing Marks section`);
        await expect(this.page.locator('//div[normalize-space()="Distinguishing marks"]//following-sibling::div/ins[normalize-space()="an edited"]')).toBeVisible();

        //-------------------- RELEASE TYPE --------------------
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.releaseType}" text has been removed from the Release Type section`);
        await expect(this.page.locator(`//div[normalize-space()="Release type"]//following-sibling::div/del[normalize-space()="${this.testData.Unlawfully.releaseType}"]`)).toBeVisible();
        
        await this.testSteps.LogInfo(`Verifying "${this.testData.Unlawfully.releaseTypeEdited}" text has been added to the Release Type section`);
        await expect(this.page.locator(`//div[normalize-space()="Release type"]//following-sibling::div/ins[normalize-space()="${this.testData.Unlawfully.releaseTypeEdited}"]`)).toBeVisible();
    }
}
