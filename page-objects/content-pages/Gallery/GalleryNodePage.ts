import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData, galleryImageDetails } from '../../../test-data/TestDataObject';
import path from 'path';

export interface VerifyOptions
{
    preview: boolean;
    topics: (string | null)[];
    existingImageName?: string;
    existingImageValues?: GalleryImageMediaData;
};

export interface GalleryImageMediaData
{
    altText: string;
    title: string;
    caption: string;
}

export interface VerifyGalleryAnonOptions
{
    existingImageName?: string;
};

export class GalleryNodePage
{
    // logging
    private readonly testSteps: TestSteps;
    private readonly topicsHelper: TopicsTreeHelper;

    // XPath Selectors
    private readonly topicLinkXPath = (topicName: string) => `//a[text()="${topicName}"]`;

    private async verifyExistingGalleryImage(data: GalleryImageMediaData)
    {
        await this.testSteps.LogInfo(`Verifying image is visible`);

        await this.testSteps.LogInfo(`Verifying image Alt text "${data.altText}" is visible`);
        await expect(this.page.locator(`//img[@alt="${data.altText}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying image Title text "${data.title}" is visible`);
        await expect(this.page.locator(`//img[@title="${data.title}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying image caption text "${data.caption}" is visible`);
        await expect(this.page.locator(`//figcaption[normalize-space(.)="${data.caption}"]`)).toBeVisible();

        await this.testSteps.LogInfo(`Clicking image ${data.caption}`);
        const image = this.page.getByRole('img', { name: data.altText });
        await expect(image).toBeVisible();
        await image.click();
        await this.page.waitForTimeout(1000);

        await this.testSteps.LogInfo(`Closing image ${data.caption}`);
        const closeButton = this.page.getByRole('button', { name: 'Close' });
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await this.page.waitForTimeout(1000);
    }


    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
        private GalleryImageDetails: typeof galleryImageDetails
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
        this.topicsHelper = new TopicsTreeHelper(this.page, this.testSetUpData, this.testData);

    }

    // -------------------- URL CHECK --------------------

    // check url after saving create gallery
    async galleryNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.testSteps.LogInfo(`Verifying URL path is /galleries/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/galleries/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Gallery methods --------------------
    async verifyGallery({ preview, topics, existingImageName, existingImageValues }: VerifyOptions)
    {

        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Gallery.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Gallery.title);

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
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Gallery.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.summary)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Gallery.body}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.body)).toBeVisible();

        // verify images
        if (!preview && !existingImageName)
        {
            await this.testSteps.LogInfo('Verifying Images are all successfully uploaded');
            let i = 1;
            for (const img of galleryImageDetails)
            {
                const { alt, title, caption } = img;

                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Verifying image ${i} is visible`);
                await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeEnabled();

                await this.testSteps.LogInfo(`Verifying image ${i} Alt text "${alt}" is visible`);
                await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeVisible();

                await this.testSteps.LogInfo(`Verifying image ${i} Title text "${title}" is visible`);
                await expect(this.page.locator(`//img[@title="${title}"]`)).toBeVisible();

                await this.testSteps.LogInfo(`Verifying image ${i} caption text "${caption}" is visible`);
                await expect(this.page.locator(`//figcaption[normalize-space(.)="${caption}"]`)).toBeVisible();

                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Clicking image ${i}`);
                const image = this.page.getByRole('img', { name: alt });
                await expect(image).toBeVisible();
                await image.click();
                await this.page.waitForTimeout(1000);

                await this.testSteps.LogInfo(`Closing image ${i}`);
                const closeButton = this.page.getByRole('button', { name: 'Close' });
                await expect(closeButton).toBeVisible();
                await closeButton.click();
                await this.page.waitForTimeout(1000);

                i++;
            }
        } else if (existingImageName)
        {
            await this.verifyExistingGalleryImage(existingImageValues ?? {
                altText: this.testData.Media.galleryImageAltText,
                title: this.testData.Media.galleryImageTitle,
                caption: this.testData.Media.galleryImageCaption,
            });
        }
    }

    async verifyGalleryAnon(options?: VerifyGalleryAnonOptions)
    {
        await this.testSteps.LogInfo('Navigating to created News that Gallery has been linked too');
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.page.goto(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`);
        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`)
        );

        // verify title
        await this.testSteps.LogInfo(`Verifying News title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

        await this.testSteps.LogInfo(`Verifying Gallery link text is visible after being added through CK Editor "${this.testData.Gallery.title}"`);
        await expect(this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Clicking Gallery link text that was added through CK Editor "${this.testData.Gallery.title}"`);
        await this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`).click();

        if (this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            await this.verifyGallery({
                preview: false,
                topics: this.topicsHelper.getTopics(),
                existingImageName: options?.existingImageName,
            });
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying unpublished Gallery "${this.testData.Gallery.title}" displays a 404 error `);
            //expect Page not found error
            const notFoundHeading = this.page.locator('//h1[normalize-space(.)="Page not found (404)"]').or(this.page.locator('//h1[normalize-space(.)="Page not found"]'));
            await expect(notFoundHeading).toBeVisible();
        }
    }

    //verify edited gallery method
    async verifyEditedGallery({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Gallery.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Gallery.titleEdited);

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
        await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Gallery.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.summaryEdited)).toBeVisible();

        // verify body field
        await this.testSteps.LogInfo(`Verifying Body "${this.testData.Gallery.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Gallery.bodyEdited)).toBeVisible();

        // verify images
        await this.testSteps.LogInfo('Verifying Edited Image has been uploaded');
        await expect(this.page.locator(`//img`)).toBeEnabled();

        await this.testSteps.LogInfo(`Verifying Edited image has No Alt `);
        await expect(this.page.locator(`//img[@alt=""]`)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying Edited image Title is not visible`);
        await expect(this.page.locator(`//img[@title=""]`)).toBeHidden();

        await this.testSteps.LogInfo(`Verifying Edited image caption is not present visible`);
        await expect(this.page.locator(`//figcaption[normalize-space(.)=""]`)).toBeHidden();

        if (!preview)
        {
            await this.testSteps.LogInfo(`Clicking edited image 1`);
            const image = this.page.locator(`//img`);
            await expect(image).toBeVisible();
            await image.click();
            await this.page.waitForTimeout(500);

            await this.testSteps.LogInfo(`Closing image 1`);
            const closeButton = this.page.getByRole('button', { name: 'Close' });
            await expect(closeButton).toBeVisible();
            await closeButton.click();
            await this.page.waitForTimeout(500);
        }


        await this.testSteps.LogInfo('Verifying Original Images 1 - 5 have been removed through editing Process');
        let i = 1;
        for (const img of galleryImageDetails)
        {
            const { alt, title, caption } = img;

            await this.testSteps.LogInfo(`Verifying image ${i} is NOT visible`);

            await this.testSteps.LogInfo(`Verifying image ${i} Alt text "${alt}" is NOT visible`);
            await expect(this.page.locator(`//img[@alt="${alt}"]`)).toBeHidden();

            await this.testSteps.LogInfo(`Verifying image ${i} Title text "${title}" is NOT visible`);
            await expect(this.page.locator(`//img[@title="${title}"]`)).toBeHidden();

            await this.testSteps.LogInfo(`Verifying image ${i} caption text "${caption}" is NOT visible`);
            await expect(this.page.locator(`//figcaption[normalize-space(.)="${caption}"]`)).toBeHidden();

            i++;
        }
    }

    //verify gallery method as anon user
    async verifyEditedGalleryAnon()
    {
        await this.testSteps.LogInfo('Navigating to created News that Gallery has been linked too');
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        await this.page.goto(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`);
        await expect(this.page).toHaveURL(
            new RegExp(this.testSetUpData.urlForTest.url + `/news/${escapeRegex(this.testData.News.title)}`)
        );

        // verify title
        await this.testSteps.LogInfo(`Verifying News title "${this.testData.News.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.News.title);

        await this.testSteps.LogInfo(`Verifying Gallery link text is visible after being added through CK Editor "${this.testData.Gallery.title}"`);
        await expect(this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`)).toBeVisible();
        await this.testSteps.LogInfo(`Clicking Gallery link text that was added through CK Editor "${this.testData.Gallery.title}"`);
        await this.page.locator(`//a[text()="${this.testData.Gallery.title}"]`).click();

        if (this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            await this.verifyEditedGallery({
                preview: false,
                topics: this.topicsHelper.getTopics()
            });
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying unpublished Gallery "${this.testData.Gallery.title}" displays a 404 error `);
            //expect Page not found error
            await expect(this.page.locator('//h1[normalize-space(.)="Page not found (404)"]')).toBeVisible();
        }
    }
}