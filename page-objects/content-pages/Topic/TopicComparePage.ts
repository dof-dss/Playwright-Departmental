import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class TopicComparePage
{
    private readonly testSteps: TestSteps;

    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        this.testSteps = new TestSteps();
    }

    async verifyCompareTopic()
    {
        await this.testSteps.LogInfo('Verifying the Topic title revision diff');
        await expect(this.page.locator('main h1 del')).toHaveText('New');
        await expect(this.page.locator('main h1 ins')).toHaveText('Edited');

        await this.testSteps.LogInfo('Verifying the Topic summary revision diff');
        const topicSummary = this.page.locator('//main//h1/following-sibling::div[1]');
        await expect(topicSummary.locator('del').filter({ hasText: /^a$/ })).toHaveText('a');
        await expect(topicSummary.locator('ins').filter({ hasText: /^an edited$/ })).toHaveText('an edited');

        await this.testSteps.LogInfo('Verifying the Topic body revision diff');
        await expect(topicSummary.locator('p ins')).toHaveText('edited');
    }

    async verifyTopicChildContentNotShownOnComparePage()
    {
        await this.testSteps.LogInfo('Verifying that topic child content is not shown on the compare page');

        // Verify that no child content sections are visible on the compare page
        const childContentSections = this.page.locator('main').locator('text=/Application|Article|Subtopic|Consultation|News|Publication/');
        await expect(childContentSections).toHaveCount(0);

        await this.testSteps.LogInfo('Confirmed that no topic child content is displayed on the revision compare page');
    }
}
