import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
};

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

    // verify the subtopic's own title/summary/long description render on its node page
    async verifySubtopic({ preview }: VerifyOptions)
    {
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Subtopic.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Subtopic.title);

        await this.testSteps.LogInfo(`Verifying summary "${this.testData.Subtopic.summary}" is visible`);
        await expect(this.page.getByText(this.testData.Subtopic.summary)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${this.testData.Subtopic.longDescription}" is visible`);
        await expect(this.page.getByText(this.testData.Subtopic.longDescription)).toBeVisible();

        if (!preview)
        {
            // TODO: once child content links are supported, verify/click them here - not possible while in preview
        }
    }

    // verify the edited subtopic's own title/summary/long description render on its node page
    async verifyEditedSubtopic({ preview }: VerifyOptions)
    {
        await this.testSteps.LogInfo(`Verifying title "${this.testData.Subtopic.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.Subtopic.titleEdited);

        await this.testSteps.LogInfo(`Verifying summary "${this.testData.Subtopic.summaryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Subtopic.summaryEdited)).toBeVisible();

        await this.testSteps.LogInfo(`Verifying long description "${this.testData.Subtopic.longDescriptionEdited}" is visible`);
        await expect(this.page.getByText(this.testData.Subtopic.longDescriptionEdited)).toBeVisible();

        if (!preview)
        {
            // TODO: once child content links are supported, verify/click them here - not possible while in preview
        }
    }

    // verify child content (subtopic content items) renders in the expected order
    // TODO: only usable once "full" subtopics (with Subtopic content items assigned) are supported by SubtopicHelper/SubtopicCreatePage
    async verifySubtopicChildContentOrder(expectedOrder: string[])
    {
        await this.testSteps.LogInfo(`Verifying child content is displayed in order: ${expectedOrder.join(', ')}`);

        // TODO: replace with the real child-content list locator once full subtopics are supported
        const childItems = this.page.locator('//TODO-child-content-list//a');
        await expect(childItems).toHaveText(expectedOrder);
    }
}
