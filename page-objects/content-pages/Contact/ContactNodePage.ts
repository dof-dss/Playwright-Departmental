import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    topics: (string | null)[];
};

export class ContactNodePage
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

    // check url after saving create contact
    async contactNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /contacts/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/contacts/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Contact methods --------------------

    // verify contact method
    async verifyContact({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Contact.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Contact.title);

        // Verify topics (all visible except topic4 which should be hidden)
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

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.body}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.body)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Contact Map IS visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }

    // verify edited contact method
    async verifyEditedContact({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Contact.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Contact.titleEdited);

        // Verify topics (edited - only topic2 should be visible)
        const editedTopics = topics;

        if (editedTopics[1])
        {
            await this.testSteps.LogInfo(`Verifying Edited Site topic "${editedTopics[1]}" is visible`);
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

        await this.testSteps.LogInfo(`Verifying Contact Body Field topic  "${this.testData.Contact.bodyEdited}" IS visible`);
        await expect(this.page.getByText(this.testData.Contact.bodyEdited)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Contact Map IS visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }
}
