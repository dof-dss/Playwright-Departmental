import { Page, Locator, expect } from '@playwright/test';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class EventFacetPage
{
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
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/events`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await expect(this.eventFacetSearchField).toBeEnabled();
        await this.eventFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickEventFacetSearchButton()
    {
        await this.eventFacetSearchButton.click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicSpan()
    {
        await this.facetFilterEventTopic.click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicFilter()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic1}")]`).click();
    }

    // click Event facet filter topic span
    async clickFacetFilterTopicEditedFilter()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic2}")]`).click();
    }

    // click Event facet filter publication date span
    async clickFacetFilterEventDateSpan()
    {
        await this.facetFilterEventDate.click();
    }

    // click Event facet filter publication date span
    async clickFacetFilterEventDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click Event facet filter publication date span
    async clickFacetFilterEventDateEditedFilter()
    {
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }

     // click Event facet filter publication date span
    async clickFacetFilterEventLocationSpan()
    {
        await this.facetFilterEventLocation.click();
    }

     // click Event facet filter topic span
    async clickFacetFilterEventLocation()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Event.region}")]`).click();
    }

    // click Event facet filter topic span
    async clickFacetFilterEventLocationEditedFilter()
    {
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Event.regionEdited}")]`).click();
    }


}