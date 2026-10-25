import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';

export class ConsultationFacetPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators 
    private readonly consultationFacetSearchField: Locator;
    private readonly consultationFacetSearchButton: Locator;
    private readonly facetFilterTopic: Locator;
    private readonly facetFilterConsultationDate: Locator;

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
        this.consultationFacetSearchField = page.getByTestId('consultations-search--keywords');
        this.consultationFacetSearchButton = page.getByTestId('consultations-search--search');
        this.facetFilterTopic = this.page.getByRole('button', { name: 'Consultation topic' });
        this.facetFilterConsultationDate = this.page.getByRole('button', { name: 'Publication date' });
    }

    // url check using isolated test data for current site being tested
    async consultationPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/consultations"`);
        await expect(this.page).toHaveURL(this.testSetUpData.urlForTest.url + '/consultations');
    }

    // enter content title in site search field 
    async enterContentTitleInSearch(searchTerm: string)
    {
        await this.testSteps.LogInfo(`Entering "${searchTerm}" into the Title field`);
        await expect(this.consultationFacetSearchField).toBeEnabled();
        await this.consultationFacetSearchField.fill(searchTerm);
    }

    // click site search button 
    async clickConsultationFacetSearchButton()
    {
        await this.testSteps.LogInfo('Clicking consultations facet search button');
        await this.consultationFacetSearchButton.click();
    }

    // click consultation facet filter topic span
    async clickFacetFilterTopicSpan()
    {
        await this.testSteps.LogInfo('Opening the Consultation topic facet filter');
        await this.facetFilterTopic.click();
    }

    // click consultation facet filter topic span
    async clickFacetFilterTopicFilter()
    {
        await this.testSteps.LogInfo(`Filtering consultations by topic "${this.testData.SiteTopics.topic1}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic1}")]`).click();
    }

    // click consultation facet filter topic span
    async clickFacetFilterTopicEditedFilter()
    {
        await this.testSteps.LogInfo(`Filtering consultations by edited topic "${this.testData.SiteTopics.topic2}"`);
        await this.page.locator(`//a/span[contains(text(),"${this.testData.SiteTopics.topic2}")]`).click();
    }

    // click consultation facet filter publication date span
    async clickFacetFilterPubDateSpan()
    {
        await this.testSteps.LogInfo('Opening the Publication date facet filter');
        await this.facetFilterConsultationDate.click();
    }

    // click consultation facet filter publication date span
    async clickFacetFilterPubDateFilter()
    {
        const date = new Date();
        const month = date.toLocaleString('en-GB', { month: 'long' });
        const year = date.getFullYear();

        await this.testSteps.LogInfo(`Filtering consultations by date "${month} ${year}"`);
        await expect(this.page.locator(`//span[contains(text(),"${year}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${year}")]`).click();

        await expect(this.page.locator(`//span[contains(text(),"${month}")]`)).toBeEnabled();
        await this.page.locator(`//span[contains(text(),"${month}")]`).click();
    }


    // click consultation facet filter publication date span
    async clickFacetFilterPubDateEditedFilter()
    {
        await this.testSteps.LogInfo('Filtering consultations by date "December 2025"');
        await this.page.locator('//span[contains(text(),"2025")]').click();
        await this.page.locator('//span[contains(text(),"December")]').click();
    }
}