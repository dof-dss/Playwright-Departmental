import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class SubtopicNodePage
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

    // check url after saving/publishing a subtopic
    // TODO: confirm the real URL alias pattern for subtopics (assumed to sit under /topics/ like a Topic)
    async subtopicNodeURLCheck()
    {
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        const titleToCheck = escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle);

        await this.testSteps.LogInfo(`Verifying URL path is /topics/${titleToCheck} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/topics/${titleToCheck}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // Accept alternate data so this can verify child subtopics too.
    // verify the subtopic's own title/summary/long description render on its node page
    async verifySubtopic(subtopicData: typeof TestData.Subtopic = this.testData.Subtopic)
    {
        await this.testSteps.LogInfo(`Verifying title "${subtopicData.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(subtopicData.title);

        await this.testSteps.LogInfo(`Verifying summary "${subtopicData.summary}" is visible`);
        await expect(this.page.getByText(subtopicData.summary)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${subtopicData.longDescription}" is visible`);
        await expect(this.page.getByText(subtopicData.longDescription)).toBeVisible();

    }

    // Accept alternate data so this can verify edited child subtopics too.
    async verifyEditedSubtopic(subtopicData: typeof TestData.Subtopic = this.testData.Subtopic)
    {
        await this.testSteps.LogInfo(`Verifying title "${subtopicData.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(subtopicData.titleEdited);

        await this.testSteps.LogInfo(`Verifying summary "${subtopicData.summaryEdited}" is visible`);
        await expect(this.page.getByText(subtopicData.summaryEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${subtopicData.longDescriptionEdited}" is visible`);
        await expect(this.page.getByText(subtopicData.longDescriptionEdited)).toBeVisible();

    }

    async verifySubtopicChildContentVisibility(options: {
        application: boolean;
        article: boolean;
        protectedarea: boolean;
        subtopic: boolean;
        consultation?: boolean;
        news?: boolean;
        publication?: boolean;
        edited?: boolean;
    })
    {
        const subtopicURL = this.page.url();
        const childItems = [
            { title: options.edited ? this.testData.Application.titleEdited : this.testData.Application.title, shouldBeVisible: options.application },
            { title: options.edited ? this.testData.Article.titleEdited : this.testData.Article.title, shouldBeVisible: options.article },
            { title: options.edited ? this.testData.ProtectedArea.titleEdited : this.testData.ProtectedArea.title, shouldBeVisible: options.protectedarea },
            { title: options.edited ? this.testData.SubtopicChild.titleEdited : this.testData.SubtopicChild.title, shouldBeVisible: options.subtopic },
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
            await this.testSteps.LogInfo(`Verifying child content "${child.title}" is ${child.shouldBeVisible ? 'visible' : 'hidden'} on the Subtopic page`);

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

                await this.testSteps.LogInfo(`Clicking Subtopic label "${this.testData.Subtopic.title}" to return to the Subtopic page`);
                const subtopicLink = this.page.getByRole('link', { name: `${this.testData.Subtopic.title} subtopic`, exact: true })
                    .or(this.page.getByRole('link', { name: `${this.testData.Subtopic.title} topic`, exact: true }))
                    .or(this.page.getByRole('link', { name: this.testData.Subtopic.title, exact: true }));
                await expect(subtopicLink).toBeVisible();
                await subtopicLink.click();
                await this.testSteps.LogInfo('Verifying URL is the Subtopic page URL');
                await expect(this.page).toHaveURL(subtopicURL);
            }
            else
            {
                await expect(childLink).toBeHidden();
            }
        }
    }

    async verifySubtopicChildContentOrder(expectedOrder: string[])
    {
        await this.testSteps.LogInfo(`Verifying child content is displayed in order: ${expectedOrder.join(', ')}`);
        const contentsHeading = this.page.getByRole('main').getByRole('heading', { name: 'More in this topic', exact: true });
        const childItems = contentsHeading.locator('..').getByRole('list').getByRole('link');
        await expect(childItems).toHaveText(expectedOrder);
        await this.testSteps.LogInfo(`Verified child content order: ${expectedOrder.map((title, index) => `${index + 1}. ${title}`).join(' | ')}`);
    }

    // verify warning message when associated topic is unpublished
    async verifyUnpublishedTopicWarning()
    {
        await this.testSteps.LogInfo(`Verifying unpublished topic warning message is visible for topic "${this.testData.Topic.title}"`);
        const warningMessage = this.page.locator(
            '//h2[@class="visually-hidden"][text()="Warning message"]/following-sibling::div[@class="messages__item"]'
        );
        await expect(warningMessage).toContainText(
            `This content is associated with an unpublished topic (${this.testData.Topic.title}), so visitors have no way to reach it through that topic on the site.`
        );
    }
}
