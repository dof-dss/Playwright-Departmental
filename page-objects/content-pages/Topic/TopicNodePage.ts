import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
};

export class TopicNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
    }

    // check url after saving/publishing a topic
    async topicNodeURLCheck()
    {
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        const titleToCheck = escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle);

        await this.testSteps.LogInfo(`Verifying URL path is /topics/${titleToCheck} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/topics/${titleToCheck}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // verify the topic's own title/summary/long description render on its node page
    async verifyTopic()
    {
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Topic.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Topic.title);

        await this.testSteps.LogInfo(`Verifying summary "${this.testData.Topic.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Topic.summary)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${this.testData.Topic.longDescription}" is visible`);
        await expect(this.page.getByText(this.testData.Topic.longDescription)).toBeVisible();

    }

    // verify the edited topic's own title/summary/long description render on its node page
    async verifyEditedTopic()
    {
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Topic.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Topic.titleEdited);

        await this.testSteps.LogInfo(`Verifying summary "${this.testData.Topic.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Topic.summaryEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${this.testData.Topic.longDescriptionEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Topic.longDescriptionEdited)).toBeVisible();

    }

    async verifyTopicChildContentVisibility(options: {
        application: boolean;
        article: boolean;
        subtopic: boolean;
        consultation?: boolean;
        news?: boolean;
        publication?: boolean;
    })
    {
        const childItems = [
            { title: this.testData.Application.title, shouldBeVisible: options.application },
            { title: this.testData.Article.title, shouldBeVisible: options.article },
            { title: this.testData.Subtopic.title, shouldBeVisible: options.subtopic },
            { title: this.testData.Consultation.title, shouldBeVisible: options.consultation ?? false },
            { title: this.testData.News.title, shouldBeVisible: options.news ?? false },
            { title: this.testData.Publication.title, shouldBeVisible: options.publication ?? false },
        ];

        for (const child of childItems)
        {
            const childLink = this.page.getByRole('link', { name: child.title, exact: true });
            await this.testSteps.LogInfo(`Verifying child content "${child.title}" is ${child.shouldBeVisible ? 'visible' : 'hidden'} on the Topic page`);

            if (child.shouldBeVisible)
            {
                await expect(childLink).toBeVisible();
            }
            else
            {
                await expect(childLink).toBeHidden();
            }
        }
    }

    // verify child content (subtopics / topic content items) renders in the expected order
    // TODO: only usable once "full" topics (with Topic content items assigned) are supported by TopicHelper/TopicCreatePage
    async verifyTopicChildContentOrder(expectedOrder: string[])
    {
        await this.testSteps.LogInfo(`Verifying child content is displayed in order: ${expectedOrder.join(', ')}`);

        // TODO: replace with the real child-content list locator once full topics are supported
        const childItems = this.page.locator('//TODO-child-content-list//a');
        await expect(childItems).toHaveText(expectedOrder);
    }
}
