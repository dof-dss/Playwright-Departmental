import { Page, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { HomePage } from '@poms/anon-pages/HomePage';
import { TopicsPage } from '@poms/anon-pages/TopicsPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { SubtopicNodePage } from '@poms/content-pages/Subtopic/SubtopicNodePage';

export interface TopicVisibilityOptions
{
    title: string;
    shouldBeVisible: boolean;
    edited: boolean;
}

export class TopicVisibilityHelper
{
    private readonly basePage: BasePage;
    private readonly homePage: HomePage;
    private readonly topicsPage: TopicsPage;
    private readonly subtopicNodePage: SubtopicNodePage;
    private readonly testSteps: TestSteps;

    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        this.basePage = new BasePage(page, testSetUpData);
        this.homePage = new HomePage(page, testData, testSetUpData);
        this.topicsPage = new TopicsPage(page, testSetUpData, testData);
        this.subtopicNodePage = new SubtopicNodePage(page, testSetUpData, testData);
        this.testSteps = new TestSteps();
    }

    async verifyTopicOnHomepage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the home page to verify topic "${title}" visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}`);
        await this.homePage.homePageURLCheck();
        await this.homePage.verifyTopicListedUnderResponsibilities(title, shouldBeVisible, edited);
    }

    async verifyTopicOnTopicsPage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the /topics page to verify topic "${title}" visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}/topics`);
        await this.topicsPage.topicsPageURLCheck();
        await this.topicsPage.verifyTopicListed(title, shouldBeVisible, edited);
    }

    async verifySubtopicViaHomepage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the home page to verify subtopic "${title}" parent topic visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}`);
        await this.homePage.homePageURLCheck();

        await this.testSteps.LogInfo(`Clicking on the parent topic "${TestData.Topic.title}" to verify subtopic "${title}"`);
        await this.page.click(`//a/h2[normalize-space()="${TestData.Topic.title}"]`);

        const subtopicLink = this.page.locator(`//h2[normalize-space()="${title}"]`);
        if (shouldBeVisible)
        {
            await expect(subtopicLink).toBeVisible();
            await this.page.click(`//a/h2[normalize-space()="${title}"]`);
            if (edited)
            {
                await this.subtopicNodePage.verifyEditedSubtopic();
            }
            else
            {
                await this.subtopicNodePage.verifySubtopic();
            }
        }
        else
        {
            await expect(subtopicLink).toBeHidden();
        }
    }

    async verifySubtopicViaTopicsPage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the /topics page to verify subtopic "${title}" parent topic visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}/topics`);
        await this.topicsPage.topicsPageURLCheck();

        await this.page.click(`//a/h2[normalize-space()="${TestData.Topic.title}"]`);
        const subtopicLink = this.page.locator(`//h2[normalize-space()="${title}"]`);

        if (shouldBeVisible)
        {
            await expect(subtopicLink).toBeVisible();
            await this.page.click(`//a/h2[normalize-space()="${title}"]`);
            if (edited)
            {
                await this.subtopicNodePage.verifyEditedSubtopic();
            }
            else
            {
                await this.subtopicNodePage.verifySubtopic();
            }
        }
        else
        {
            await expect(subtopicLink).toBeHidden();
        }
    }
}
