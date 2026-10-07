import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    topics: (string | null)[];
};

export class SecurePublicationNodePage
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

    // check url after saving create publication
    async securePublicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/publications/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Publication methods --------------------

    //verify secure publication method
    async verifySecurePublication({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.SecurePublication.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.SecurePublication.title);

        // Verify topics (all visible except topic4 which should be hidden)
        // Topic 1 is always visible
        if (topics[0])
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[0]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[0]!))).toBeVisible();
        }

        if (topics[1] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[1]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[1]))).toBeVisible();
        }
        if (topics[2] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[2]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[2]))).toBeVisible();
        }
        // Topic 4 should be hidden if present
        if (topics[3] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[3]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[3]!))).toBeHidden();
        }

        // verify publication published date
        await this.testSteps.LogInfo(`Verifying Date Published "${this.testData.SecurePublication.verifyDatePublished}" is visible`);
        await expect(this.page.locator(`//span[contains(text(),"Date published: ")]//following-sibling::span/time[contains(text(),"${this.testData.SecurePublication.verifyDatePublished}")]`)).toBeVisible();

        // verify publication last updated text is not present
        await this.testSteps.LogInfo(`Verifying Last updated "${this.testData.SecurePublication.verifyLastUpdatedDate}" is NOT visible`);
        await expect(this.page.locator(`//span[contains(text(),"Last updated: ")]//following-sibling::span/time[contains(text(),"${this.testData.SecurePublication.verifyLastUpdatedDate}")]`)).toBeHidden();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.SecurePublication.summary}" is visible`);
        await expect(this.page.getByText(this.testData.SecurePublication.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.SecurePublication.body}" is visible`);
        await expect(this.page.getByText(this.testData.SecurePublication.body)).toBeVisible();
    }


    //verify edited secure publication method
    async verifyEditedSecurePublication({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.SecurePublication.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.SecurePublication.titleEdited);

        // Verify topics (edited - only topic2 should be visible)
        const editedTopics = topics;

        // Only topic2 is visible; others should be hidden
        await this.testSteps.LogInfo(`Verifying Edited Site topic "${editedTopics[1]}" is visible`);
        if (editedTopics[1])
        {
            await expect(this.page.locator(this.topicLinkXPath(editedTopics[1]))).toBeVisible();
        }
        if (editedTopics[0])
        {
            await this.testSteps.LogInfo(`Verifying Edited Site topic "${editedTopics[0]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(editedTopics[0]))).toBeHidden();
        }
        if (editedTopics[2])
        {
            await this.testSteps.LogInfo(`Verifying Edited Site topic "${editedTopics[2]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(editedTopics[2]))).toBeHidden();
        }
        if (editedTopics[3])
        {
            await this.testSteps.LogInfo(`Verifying Edited Site topic "${editedTopics[3]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(editedTopics[3]))).toBeHidden();
        }

        // verify secure publication published date
        await this.testSteps.LogInfo('Verifying Date Published "31 December 2025" is visible');
        await expect(this.page.locator('//span[contains(text(),"Date published")]//following-sibling::span/time[contains(text(),"31 December 2025")]')).toBeVisible();

        // verify secure publication last updated date
        await this.testSteps.LogInfo(`Verifying Last updated "${this.testData.SecurePublication.verifyLastUpdatedDate}" is visible`);
        await expect(this.page.locator(`//span[contains(text(),"Last updated: ")]//following-sibling::span/time[contains(text(),"${this.testData.SecurePublication.verifyLastUpdatedDate}")]`)).toBeVisible();

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.SecurePublication.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.SecurePublication.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.SecurePublication.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.SecurePublication.bodyEdited)).toBeVisible();
    }



}