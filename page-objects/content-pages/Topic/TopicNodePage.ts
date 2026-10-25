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

    // verify original or edited child titles and confirm visible links open the expected content
    async verifyTopicChildContentVisibility(options: {
        application: boolean;
        article: boolean;
        subtopic: boolean;
        consultation?: boolean;
        news?: boolean;
        publication?: boolean;
        edited?: boolean;
    })
    {
        const topicURL = this.page.url();
        const childItems = [
            { title: options.edited ? this.testData.Application.titleEdited : this.testData.Application.title, shouldBeVisible: options.application },
            { title: options.edited ? this.testData.Article.titleEdited : this.testData.Article.title, shouldBeVisible: options.article },
            { title: options.edited ? this.testData.Subtopic.titleEdited : this.testData.Subtopic.title, shouldBeVisible: options.subtopic },
            {
                title: options.edited ? this.testData.Consultation.titleEdited : this.testData.Consultation.title,
                shouldBeVisible: options.consultation ?? false,
                isConsultation: true
            },
            { title: options.edited ? this.testData.News.titleEdited : this.testData.News.title, shouldBeVisible: options.news ?? false },
            { title: options.edited ? this.testData.Publication.titleEdited : this.testData.Publication.title, shouldBeVisible: options.publication ?? false },
        ];

        for (const child of childItems)
        {
            const childLink = this.page.getByRole('link', { name: child.title, exact: true })
                .or(this.page.getByRole('link').filter({
                    has: this.page.getByRole('heading', { name: child.title, exact: true })
                }));
            await this.testSteps.LogInfo(`Verifying child content "${child.title}" is ${child.shouldBeVisible ? 'visible' : 'hidden'} on the Topic page`);

            if (child.shouldBeVisible)
            {
                await expect(childLink).toBeVisible();

                await this.testSteps.LogInfo(`Clicking on child content "${child.title}"`);
                await childLink.click();

                await this.testSteps.LogInfo(`Verifying child content heading "${child.title}" is visible`);
                if (child.isConsultation)
                {
                    await expect(this.page.locator(`//h1[text()[normalize-space(.)="${child.title}"]]`)).toBeVisible();
                }
                else
                {
                    const childHeading = this.page.getByRole('heading', { level: 1 });
                    await expect(childHeading).toHaveText(child.title);
                    await expect(childHeading).toBeVisible();
                }

                await this.testSteps.LogInfo(`Clicking Topic label "${this.testData.Topic.title}" to return to the Topic page`);
                const topicLink = this.page.getByRole('link', { name: `${this.testData.Topic.title} topic`, exact: true })
                    .or(this.page.getByRole('link', { name: this.testData.Topic.title, exact: true }));
                await expect(topicLink).toBeVisible();
                await topicLink.click();
                await this.testSteps.LogInfo(`Verifying URL is the Topic page URL`);
                await expect(this.page).toHaveURL(topicURL);
            }
            else
            {
                await expect(childLink).toBeHidden();
            }
        }
    }

    async verifyRearrangedTopic()
    {
        await this.testSteps.LogInfo(`Verifying Subtopic "${this.testData.Subtopic.title}" is first in Topic Content`);
        const contentsHeading = this.page.getByRole('heading', { name: 'contents', exact: true });
        const topicArticle = this.page.locator('main article').filter({ has: contentsHeading });
        const firstChild = topicArticle.locator('article a').first();
        await expect(firstChild).toHaveText(this.testData.Subtopic.title);
    }
}
