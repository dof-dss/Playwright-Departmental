import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class EventFacetPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators 
    private readonly eventFacetSearchField: Locator;
    private readonly eventFacetSearchButton: Locator;
    private readonly facetFilterEventTopic: Locator;
    private readonly facetFilterEventDate: Locator;
    private readonly facetFilterEventLocation: Locator;
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
        this.eventFacetSearchField = page.locator('#edit-search--2');
        this.eventFacetSearchButton = page.locator('#edit-submit-events--2');
        this.facetFilterEventTopic = this.page.getByRole('button', { name: 'Topics' });
        this.facetFilterEventDate = this.page.getByRole('button', { name: 'Date' });
        this.facetFilterEventLocation = this.page.getByRole('button', { name: 'Location' });

    }

    // url check using isolated test data for current site being tested
    async EventPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/events"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/events`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" into the Title field`);
        await expect(this.eventFacetSearchField).toBeEnabled();
        await this.eventFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickEventFacetSearchButton()
    {
        await this.testSteps.LogInfo('Clicking events facet search button');
        await this.eventFacetSearchButton.click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicSpan()
    {
        await this.testSteps.LogInfo('Opening the Topics facet filter');
        await this.facetFilterEventTopic.click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicFilter()
    {
        await this.testSteps.LogInfo(`Filtering events by topic "${this.testData.SiteTopics.topic1}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic1}")]`).click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering events by edited topic "${this.testData.SiteTopics.topic2}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic2}")]`).click();
    }

    // click Event facet filter publication date span
    async clickFacetFilterEventDateSpan()
    {
        await this.testSteps.LogInfo('Opening the Date facet filter');
        await this.facetFilterEventDate.click();
    }

    // click Event facet filter publication date span
    async clickFacetFilterEventDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await this.testSteps.LogInfo(`Filtering events by date "${month} ${year}"`);
        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click Event facet filter publication date span
    async clickFacetFilterEventDateEditedFilter()
    {
        await this.testSteps.LogInfo('Filtering events by date "December 2025"');
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }

     // click Event facet filter publication date span
    async clickFacetFilterEventLocationSpan()
    {
        await this.testSteps.LogInfo('Opening the Location facet filter');
        await this.facetFilterEventLocation.click();
    }

     // click Event facet filter topic span
    async clickFacetFilterEventLocation()
    {
        await this.testSteps.LogInfo(`Filtering events by location "${this.testData.Event.region}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Event.region}")]`).click();
    }

    // click Event facet filter topic span
    async clickFacetFilterEventLocationEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering events by edited location "${this.testData.Event.regionEdited}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Event.regionEdited}")]`).click();
    }


}