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

export class ApplicationNodePage
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

    // check url after saving create application
    async applicationNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /services/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/services/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+)`)
        );
    }

    // -------------------- Verify Application methods --------------------

    //verify application method
    async verifyApplication({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Application.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Application.title);

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

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Application.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Application.summary)).toBeVisible();

        // verify Before you start H2
        await this.testSteps.LogInfo('Verifying "Before you Start" heading is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Before you start' })).toBeVisible();

        // verify before you start
        await this.testSteps.LogInfo(`Verifying Before you start "${this.testData.Application.beforeyoustart}" is visible`);
        await expect(this.page.getByText(this.testData.Application.beforeyoustart)).toBeVisible();

        // verify application link text
        await this.testSteps.LogInfo(`Verifying Link text "${this.testData.Application.LinkText}" is visible`);
        await expect(this.page.getByRole('link', { name: this.testData.Application.LinkText })).toBeVisible();

        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
            // click application link text
            await this.testSteps.LogInfo(`Clicking Link text "${this.testData.Application.LinkText}"`);
            await this.page.getByRole('link', { name: this.testData.Application.LinkText }).click();
            // verify link by checking title (link url is page title for internal link edit test will be external)
            await this.testSteps.LogInfo(`Verifying title of content on new page "${this.testData.Application.LinkText}" is visible`);
            await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Application.LinkText);
            // navigate back to previous page 
            await this.testSteps.LogInfo('Navigating back to previous page');
            await this.page.goBack();
        }

        // verify Additional information H2
        await this.testSteps.LogInfo('Verifying Additional info heading is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Additional information' })).toBeVisible();

        // verify addtional info
        await this.testSteps.LogInfo(`Verifying Additional Info "${this.testData.Application.additionalinfo}" is visible`);
        await expect(this.page.getByText(this.testData.Application.additionalinfo)).toBeVisible();
    }


    //verify edited application method
    async verifyEditedApplication({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testSetUpData.contentTitleforTest.contentTitle}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Application.titleEdited);

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

        // verify summary
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Application.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Application.summaryEdited)).toBeVisible();

        // verify Before you start H2
        await this.testSteps.LogInfo('Verifying Before you start Heading is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Before you start' })).toBeVisible();

        // verify before you start
        await this.testSteps.LogInfo(`Verifying Before you start "${this.testData.Application.beforeyoustart}" is visible`);
        await expect(this.page.getByText(this.testData.Application.beforeyoustartEdited)).toBeVisible();

        // verify application link text
        // external links have visually hidden text appended to the accessible name, so an anchored regex is used instead of an exact match
        await this.testSteps.LogInfo(`Verifying Link text "${this.testData.Application.LinkTextEdited}" is visible`);
        await expect(this.page.getByRole('link', { name: new RegExp(`^${this.testData.Application.LinkTextEdited}\\b`) })).toBeVisible();


        if (!preview)
        {
            // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
            // Start waiting for the new tab before the click
            const pagePromise = this.page.context().waitForEvent('page');
            // click application link text
            // external links have visually hidden text appended to the accessible name, so an anchored regex is used instead of an exact match
            await this.testSteps.LogInfo(`Clicking On Link text "${this.testData.Application.LinkTextEdited}"`);
            await this.page.getByRole('link', { name: new RegExp(`^${this.testData.Application.LinkTextEdited}\\b`) }).click();
            // Wait for the new page object to be ready
            const newTab = await pagePromise;
            // verify link by checking url of new page 
            await this.testSteps.LogInfo(`Verifying Link URL "${this.testData.Application.LinkURLEdited}"`);
            await expect(newTab).toHaveURL(this.testData.Application.LinkURLEdited);
            // close new tab
            await this.testSteps.LogInfo('Closing New tab');
            await newTab.close();
        }

        // verify Additional information H2
        await this.testSteps.LogInfo('Verifying Additional information is visible');
        await expect(this.page.getByRole('heading', { level: 2, name: 'Additional information' })).toBeVisible();
        // verify addtional info
        await this.testSteps.LogInfo(`Verifying Additional Information "${this.testData.Application.additionalinfoEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Application.additionalinfoEdited)).toBeVisible();
    }
}