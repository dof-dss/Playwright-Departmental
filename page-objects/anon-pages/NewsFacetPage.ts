import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class NewsFacetPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators 
    private readonly newsFacetSearchField: Locator;
    private readonly newsFacetSearchButton: Locator;
    private readonly facetFilterTopic: Locator;
    private readonly facetFilterPublicationDate: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private readonly testSetUpData: typeof TestSetUpData,
        private readonly testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // locators 
        this.newsFacetSearchField = page.getByTestId('news-search--keywords');
        this.newsFacetSearchButton = page.getByTestId('news-search--search');
        this.facetFilterTopic = this.page.getByRole('button', { name: 'Topic' });
        this.facetFilterPublicationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async newsPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/news"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/news`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" into the Title field`);
        await expect(this.newsFacetSearchField).toBeEnabled();
        await this.newsFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickNewsFacetSearchButton()
    {
        await this.testSteps.LogInfo('Clicking news facet search button');
        await this.newsFacetSearchButton.click();
    }

    // click news facet filter topic span
    async clickFacetFilterTopicSpan()
    {
        await this.testSteps.LogInfo('Opening the Topic facet filter');
        await this.facetFilterTopic.click();
    }

    // click news facet filter topic span
    async clickFacetFilterTopicFilter()
    {
        await this.testSteps.LogInfo(`Filtering news by topic "${this.testData.SiteTopics.topic1}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic1}")]`).click();
    }

    // click news facet filter topic span
    async clickFacetFilterTopicEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering news by edited topic "${this.testData.SiteTopics.topic2}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic2}")]`).click();
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.testSteps.LogInfo('Opening the Publication date facet filter');
        await this.facetFilterPublicationDate.click();
    }

    // click news facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await this.testSteps.LogInfo(`Filtering news by publication date "${month} ${year}"`);
        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click news facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.testSteps.LogInfo('Filtering news by publication date "December 2025"');
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }
}