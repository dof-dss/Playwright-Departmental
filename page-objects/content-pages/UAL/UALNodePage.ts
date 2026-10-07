import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
    topics: (string | null)[];
};

export class UALNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // XPath Selectors
    private readonly topicLinkXPath = (topicName: string) => `//a[text()="${topicName}"]`;

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

    // check url after saving create UAL
    async ualNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /unlawfully-at-large/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/unlawfully-at-large/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify UAL methods --------------------

    // verify UAL method
    async verifyUAL({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Unlawfully.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Unlawfully.title);

        // verify offence
        await this.testSteps.LogInfo(`Verifying Offence "${this.testData.Unlawfully.offence}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.offence)).toBeVisible();

        // verify description
        await this.testSteps.LogInfo(`Verifying Description "${this.testData.Unlawfully.description}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.description)).toBeVisible();

        // verify age
        await this.testSteps.LogInfo(`Verifying Age "${this.testData.Unlawfully.age}" is visible`);
        await expect(this.page.locator(`//div[contains(text(), 'Age')]/following-sibling::div[contains(text(), '${this.testData.Unlawfully.age}')]`)).toBeVisible();

        // verify prison
        await this.testSteps.LogInfo(`Verifying Prison "${this.testData.Unlawfully.prison}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.prison)).toBeVisible();

        // verify eye colour
        await this.testSteps.LogInfo(`Verifying Eye Colour "${this.testData.Unlawfully.eyeColour}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.eyeColour)).toBeVisible();

        // verify hair colour
        await this.testSteps.LogInfo(`Verifying Hair Colour "${this.testData.Unlawfully.hairColour}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.hairColour)).toBeVisible();

        // verify distinguishing marks
        await this.testSteps.LogInfo(`Verifying Distinguishing Marks "${this.testData.Unlawfully.distinguishingMarks}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.distinguishingMarks)).toBeVisible();

        // verify release type
        await this.testSteps.LogInfo(`Verifying Release Type "${this.testData.Unlawfully.releaseType}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.releaseType)).toBeVisible();
    }

    // verify edited UAL method
    async verifyEditedUAL({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Unlawfully.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Unlawfully.titleEdited);

        // verify edited offence
        await this.testSteps.LogInfo(`Verifying Offence "${this.testData.Unlawfully.offenceEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.offenceEdited)).toBeVisible();

        // verify edited description
        await this.testSteps.LogInfo(`Verifying Description "${this.testData.Unlawfully.descriptionEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.descriptionEdited)).toBeVisible();

        // verify edited age
        await this.testSteps.LogInfo(`Verifying Age "${this.testData.Unlawfully.ageEdited}" is visible`);
        await expect(this.page.locator(`//div[contains(text(), 'Age')]/following-sibling::div[contains(text(), '${this.testData.Unlawfully.ageEdited}')]`)).toBeVisible();

        // verify edited prison
        await this.testSteps.LogInfo(`Verifying Prison "${this.testData.Unlawfully.prisonEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.prisonEdited)).toBeVisible();

        // verify edited eye colour
        await this.testSteps.LogInfo(`Verifying Eye Colour "${this.testData.Unlawfully.eyeColourEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.eyeColourEdited)).toBeVisible();

        // verify edited hair colour
        await this.testSteps.LogInfo(`Verifying Hair Colour "${this.testData.Unlawfully.hairColourEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.hairColourEdited)).toBeVisible();

        // verify edited distinguishing marks
        await this.testSteps.LogInfo(`Verifying Distinguishing Marks "${this.testData.Unlawfully.distinguishingMarksEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.distinguishingMarksEdited)).toBeVisible();

        // verify edited release type
        await this.testSteps.LogInfo(`Verifying Release Type "${this.testData.Unlawfully.releaseTypeEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Unlawfully.releaseTypeEdited)).toBeVisible();
    }
}
