import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { TopicNodePage } from '@poms/content-pages/Topic/TopicNodePage';

export class TopicsPage
{
    // logging
    private readonly testSteps: TestSteps;
    private readonly topicNodePage: TopicNodePage;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();
        this.topicNodePage = new TopicNodePage(page, testSetUpData, testData);

    }

    // check url on the /topics listing page
    async topicsPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/topics"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/topics`);
    }

    // verify a top-level topic is (or is not) listed on the /topics page
    async verifyTopicListed(title: string, shouldBeVisible: boolean, edited: boolean)
    {
        await this.testSteps.LogInfo(`Verifying Topic "${title}" is ${shouldBeVisible ? 'visible' : 'hidden'} on the /topics page`);
        const topicHeading = this.page.getByRole('heading', { name: title, level: 2 });

        if (shouldBeVisible)
        {
            await expect(topicHeading).toBeVisible();
            await this.testSteps.LogInfo(`clicking on Topic "${title}" on the /topics page to verify`);
            await this.page.getByRole('heading', { name: title, level: 2 }).click();
            if (edited)
            {
                await this.topicNodePage.verifyEditedTopic();
            }
            else 
            {
                await this.topicNodePage.verifyTopic();
            }
        }
        else
        {
            await expect(topicHeading).toBeHidden();
        }
    }
}
