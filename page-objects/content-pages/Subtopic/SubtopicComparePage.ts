import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class SubtopicComparePage
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

    async verifyCompareSubtopic()
    {
        await this.testSteps.LogInfo('Verifying the Subtopic title revision diff');
        await expect(this.page.locator('main h1 del')).toHaveText('New');
        await expect(this.page.locator('main h1 ins')).toHaveText('Edited');

        await this.testSteps.LogInfo('Verifying the Subtopic summary revision diff');
        const subtopicSummary = this.page.locator('//main//h1/following-sibling::div[1]');
        await expect(subtopicSummary.locator('ins').first()).toHaveText('edited');

        await this.testSteps.LogInfo('Verifying the Subtopic body revision diff');
        await expect(subtopicSummary.locator('p ins')).toHaveText('edited');
    }
}