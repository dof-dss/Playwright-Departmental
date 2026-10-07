import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    topics: (string | null)[];
};

export class NewsNodePage
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

    // check url after saving create news
    async newsNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /news/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/news/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify News methods --------------------

    //verify news method
    async verifyNews({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

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

        // verify intro paragraph
        await this.testSteps.LogInfo(`Verifying introductory Paragraph "${this.testData.News.introductoryParagraph}" is visible`);
        await expect(this.page.getByText(this.testData.News.introductoryParagraph)).toBeVisible();

        // verify image is uploaded and displayed (does not verify if it is correct image just that it is on page)
        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//div[@class="media-image"]/img')).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.News.body}" is visible`);
        await expect(this.page.getByText(this.testData.News.body)).toBeVisible();

        // verify note to editors field
        await this.testSteps.LogInfo(`Verifying Note to Editors "${this.testData.News.notesToEditor}" is visible`);
        await expect(this.page.getByText(this.testData.News.notesToEditor)).toBeVisible();
    }

    //verify news method
    async verifyNewsWithGallery()
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);
        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Gallery.title}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.title)).toBeVisible();
    }


    //verify edited news method
    async verifyEditedNews({ topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.News.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.titleEdited);

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

        await this.testSteps.LogInfo(`Verifying introductory Paragraph "${this.testData.News.introductoryParagraphEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.introductoryParagraphEdited)).toBeVisible();

        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//div[@class="media-image"]/img')).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Body "${this.testData.News.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.bodyEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Note to Editors "${this.testData.News.notesToEditorEdited}" is visible`);
        await expect(this.page.getByText(this.testData.News.notesToEditorEdited)).toBeVisible();
    }
}