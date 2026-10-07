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
        await expect(topicSummary.locator('del').first()).toHaveText('a');
        await expect(topicSummary.locator('ins').first()).toHaveText('an edited');

        await this.testSteps.LogInfo('Verifying the Topic body revision diff');
        await expect(topicSummary.locator('p ins')).toHaveText('edited');
    }
}
