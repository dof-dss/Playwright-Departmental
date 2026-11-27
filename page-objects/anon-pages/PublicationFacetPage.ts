import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class PublicationFacetPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators 
    private readonly publicationFacetSearchField: Locator;
    private readonly publicationFacetSearchButton: Locator;
    private readonly facetFilterType: Locator;
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
        this.publicationFacetSearchField = page.getByTestId('publications-search--keywords');
        this.publicationFacetSearchButton = page.getByTestId('publications-search--search');
        this.facetFilterType = this.page.getByRole('button', { name: 'Publication type' });
        this.facetFilterTopic = this.page.getByRole('button', { name: 'Publication topics' });
        this.facetFilterPublicationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async publicationPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/publications"`);
        await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/publications`);
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" into the Title field`);
        await expect(this.publicationFacetSearchField).toBeEnabled();
        await this.publicationFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickPublicationFacetSearchButton()
    {
        await this.testSteps.LogInfo('Clicking publications facet search button');
        await this.publicationFacetSearchButton.click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeSpan()
    {
        await this.testSteps.LogInfo('Opening the Publication type facet filter');
        await this.facetFilterType.click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeFilter()
    {
        await this.testSteps.LogInfo(`Filtering publications by type "${this.testData.Publication.publicationType}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Publication.publicationType}")]`).click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTypeEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering publications by edited type "${this.testData.Publication.publicationTypeEdited}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.Publication.publicationTypeEdited}")]`).click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTopicSpan()
    {
        await this.testSteps.LogInfo('Opening the Publication topics facet filter');
        await this.page.waitForTimeout(10000);
        await expect(this.facetFilterTopic).toBeVisible();
        await this.facetFilterTopic.click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTopicFilter()
    {
        await this.testSteps.LogInfo(`Filtering publications by topic "${this.testData.SiteTopics.topic1}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic1}")]`).click();
    }

    // click publication facet filter topic span
    async clickFacetFilterTopicEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering publications by edited topic "${this.testData.SiteTopics.topic2}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic2}")]`).click();
    }

    // click publication facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.testSteps.LogInfo('Opening the Publication date facet filter');
        await this.facetFilterPublicationDate.click();
    }

    // click publication facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await this.testSteps.LogInfo(`Filtering publications by date "${month} ${year}"`);
        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click publication facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.testSteps.LogInfo('Filtering publications by date "December 2025"');
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December 2025")]').click();
    }
}