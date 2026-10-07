import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { HomePage } from '@poms/anon-pages/HomePage';
import { TopicsPage } from '@poms/anon-pages/TopicsPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { TestSteps } from '@poms/base-pages/TestSteps';

export interface TopicVisibilityOptions
{
    title: string;
    shouldBeVisible: boolean;
    edited: boolean;
}

export class TopicVisibilityHelper
{
    // pages
    private readonly basePage: BasePage;
    private readonly homePage: HomePage;
    private readonly topicsPage: TopicsPage;
    private readonly testSteps: TestSteps;

    // constructor
    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.basePage = new BasePage(page, testSetUpData);
        this.homePage = new HomePage(page, testData, testSetUpData);
        this.topicsPage = new TopicsPage(page, testSetUpData, testData);
        this.testSteps = new TestSteps();
    }

    // verify a top-level topic is (or is not) listed under "Our responsibilities" on the home page (must already be logged out if using as anon)
    async verifyOnHomepage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the home page to verify topic "${title}" visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}`);
        await this.homePage.homePageURLCheck();
        await this.homePage.verifyTopicListedUnderResponsibilities(title, shouldBeVisible, edited);
    }

    // verify a top-level topic is (or is not) listed on the /topics page (must already be logged out if using as anon)
    async verifyOnTopicsPage({ title, shouldBeVisible, edited }: TopicVisibilityOptions)
    {
        await this.testSteps.LogInfo(`Navigating to the /topics page to verify topic "${title}" visibility`);
        await this.page.goto(`${this.testSetUpData.urlForTest.url}/topics`);
        await this.topicsPage.topicsPageURLCheck();
        await this.topicsPage.verifyTopicListed(title, shouldBeVisible, edited);
    }

}
