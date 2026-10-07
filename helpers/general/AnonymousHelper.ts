import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { HomePage } from '@poms/anon-pages/HomePage';
import { TestSetUpData, TestData, galleryImageDetails } from '../../test-data/TestDataObject';
import { NewsFacetPage } from '@poms/anon-pages/NewsFacetPage';
import { ConsultationFacetPage } from '@poms/anon-pages/ConsultationFacetPage';
import { PublicationFacetPage } from '@poms/anon-pages/PublicationFacetPage';
import { EventFacetPage } from '@poms/anon-pages/EventFacetPage';
import { SearchPage } from '@poms/anon-pages/SearchPage';
import { VerificationHelper } from './VerificationHelper';

export interface ContentEdited
{
    edited: boolean;
};

export class AnonymousHelper
{
    // logging
    private readonly testSteps: TestSteps;

    //pages
    private readonly basePage: BasePage;
    private readonly homePage: HomePage;
    private readonly consultationFacetPage: ConsultationFacetPage;
    private readonly newsFacetPage: NewsFacetPage;
    private readonly publicationFacetPage: PublicationFacetPage;
    private readonly eventFacetPage: EventFacetPage;
    private readonly searchPage: SearchPage;
    private readonly verificationHelper: VerificationHelper;

    constructor(
        private page: Page,
        // isolated test data
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    ) 
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // pages
        this.basePage = new BasePage(this.page, this.testSetUpData);
        this.homePage = new HomePage(this.page, this.testData, this.testSetUpData);
        this.consultationFacetPage = new ConsultationFacetPage(this.page, this.testSetUpData, this.testData);
        this.newsFacetPage = new NewsFacetPage(this.page, this.testSetUpData, this.testData);
        this.publicationFacetPage = new PublicationFacetPage(this.page, this.testSetUpData, this.testData);
        this.eventFacetPage = new EventFacetPage(this.page, this.testSetUpData, this.testData);
        this.searchPage = new SearchPage(this.page, this.testSetUpData);
        this.verificationHelper = new VerificationHelper(this.page, this.testSetUpData, this.testData);
    }

    //  dynamic search resltu locator 
    private getSearchResults(title: string): Locator
    {
        return this.page.getByRole('heading', { name: title, level: 3 });
    }

    // setting correct node page to use for verification of published content used by searchAsAnon and searchFacetsAsAnon methods 
    async verifyNodePageForSearch(editedStatus: boolean)
    {
        const searchResults = this.getSearchResults(this.testSetUpData.contentTitleforTest.contentTitle);

        await expect(searchResults).toBeVisible();
        await this.testSteps.LogInfo('Clicking search result to verify content - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
        await searchResults.click();


        await this.verificationHelper.verifyChosenContent({
            edited: editedStatus
        });

    }

    async searchAsAnon({ edited }: ContentEdited)
    {
        await this.basePage.logOut();
        await this.homePage.homePageURLCheck();
        await this.homePage.enterContentTitleInSearch(this.testSetUpData.contentTitleforTest.contentTitle);
        await this.homePage.clickSearchButton();

        // url check on search page
        await this.searchPage.searchPageURLCheck();

        // wait 5 seconds and refresh page
        await this.page.waitForTimeout(2000);
        await this.page.reload();

        // count exact results for created content
        const searchResults = this.getSearchResults(this.testSetUpData.contentTitleforTest.contentTitle);
        const searchCount = await searchResults.count();

        if (searchCount > 0 && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            // Content is found in search and is in a published state so verify content 
            await this.verifyNodePageForSearch(edited);
        }

        if (searchCount === 0 && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
        {
            // content is not found in search results as it is not in a published state
            await this.testSteps.LogInfo('Unpublished content does NOT appear is search results as expected - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
        }

        if (searchCount > 0 && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
        {
            // content is found in search results and it shouldnt be as it is published
            await this.testSteps.LogInfo('Unpublished content DOES appear is search results when it should NOT - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
        }

        if (searchCount === 0 && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            // content is not found in search results but it should be as it is published solr search may need refreshed 
            // try to remove last char from title and search again to refresh cache if still not found catch fail 
            await this.testSteps.LogInfo('Published content has NOT appeared in search results when it SHOULD - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
            try
            {
                // wait 5 seconds and refresh page
                await this.testSteps.LogInfo('Wating 5 seconds');
                await this.page.waitForTimeout(5000);
                await this.testSteps.LogInfo('Reloading page');
                await this.page.reload();

                // remove last char from title
                const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                // seatch again with new title
                await this.testSteps.LogInfo('Performing second search having removed final character from title to refresh solar cache - "' + updatedTitle + '"');
                await this.searchPage.enterContentTitleInSearch(updatedTitle);
                await this.testSteps.LogInfo('Clicking search Button');
                await this.searchPage.clickSearchButton();

                // Content is found in search and is in a published state so verify content 
                await this.testSteps.LogInfo('Attempting to verify content');
                await this.verifyNodePageForSearch(edited);
            }
            catch
            {
                await this.testSteps.LogInfo(`Search failed could NOT find - "${this.testSetUpData.contentTitleforTest.contentTitle}"`);
                throw new Error(`${this.testSetUpData.contentTitleforTest.contentTitle} - Test has failed - content IS NOT displayed in search results and should be (content is published)`);
            }
        }

        // facet search
        await this.searchFacetsAsAnon(edited);
    }

    async searchFacetsAsAnon(edited: boolean)
    {
        // switch statement for content types 
        switch (this.testSetUpData.contentTypeforTest.contentType)
        {
            case this.testSetUpData.validContentTypeList.consultation: {
                // nav back to homepage
                await this.page.getByRole('link', { name: 'Home', exact: true }).click();
                await this.homePage.homePageURLCheck();
                // clicking more news link on the homepage
                await this.homePage.clickConsultationNavLink();
                await this.consultationFacetPage.consultationPageURLCheck();

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {

                    await this.consultationFacetPage.enterContentTitleInSearch(this.testData.Consultation.title);
                    await this.consultationFacetPage.clickConsultationFacetSearchButton();

                    try
                    {
                        await this.testSteps.LogInfo('Published content has appeared in search results when it SHOULD - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
                        //await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.title}")]`)).toBeVisible();

                        await expect(this.page.getByText(this.testData.Consultation.title)).toBeVisible();
                    }
                    catch
                    {
                        await this.testSteps.LogInfo('Published content has NOT appeared in search results when it SHOULD - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
                        // wait 5 seconds and refresh page
                        await this.testSteps.LogInfo('Wating 5 seconds');
                        await this.page.waitForTimeout(5000);
                        await this.testSteps.LogInfo('Reloading page');
                        await this.page.reload();

                        // remove last char from title
                        const updatedTitle = this.testData.Consultation.title.slice(0, -1);
                        // seatch again with new title
                        await this.testSteps.LogInfo('Performing second search having removed final character from title to refresh solar cache - "' + updatedTitle + '"');
                        await this.consultationFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.consultationFacetPage.clickConsultationFacetSearchButton();
                    }

                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Consultation.title)).toBeVisible();
                    // add filters
                    await this.consultationFacetPage.clickFacetFilterTopicSpan();
                    await this.consultationFacetPage.clickFacetFilterTopicFilter();
                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Consultation.title)).toBeVisible();
                    // add filters
                    await this.consultationFacetPage.clickFacetFilterPubDateSpan();
                    await this.consultationFacetPage.clickFacetFilterPubDateFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Consultation.title)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.consultationFacetPage.enterContentTitleInSearch(this.testData.Consultation.title);
                    await this.consultationFacetPage.clickConsultationFacetSearchButton();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.title}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.Consultation.title)).toBeHidden();
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.consultationFacetPage.enterContentTitleInSearch(this.testData.Consultation.titleEdited);
                    await this.consultationFacetPage.clickConsultationFacetSearchButton();
                    // add filters
                    await this.consultationFacetPage.clickFacetFilterTopicSpan();
                    await this.consultationFacetPage.clickFacetFilterTopicEditedFilter();
                    // add filters
                    await this.consultationFacetPage.clickFacetFilterPubDateSpan();
                    await this.consultationFacetPage.clickFacetFilterPubDateEditedFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.titleEdited}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Consultation.titleEdited)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.consultationFacetPage.enterContentTitleInSearch(this.testData.Consultation.titleEdited);
                    await this.consultationFacetPage.clickConsultationFacetSearchButton();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Consultation.titleEdited}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.Consultation.titleEdited)).toBeHidden();
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.news: {
                // nav back to homepage
                await this.page.getByRole('link', { name: 'Home', exact: true }).click();
                await this.homePage.homePageURLCheck();
                // clicking more news link on the homepage
                await this.homePage.clickMoreNewsLink();
                await this.newsFacetPage.newsPageURLCheck();

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.newsFacetPage.enterContentTitleInSearch(this.testData.News.title);
                    await this.newsFacetPage.clickNewsFacetSearchButton();

                    try
                    {
                        await this.testSteps.LogInfo('Published content has appeared in search results when it SHOULD - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
                        await expect(this.page.getByText(this.testData.News.title)).toBeVisible();
                    }
                    catch
                    {
                        await this.testSteps.LogInfo('Published content has NOT appeared in search results when it SHOULD - "' + this.testSetUpData.contentTitleforTest.contentTitle + '"');
                        // wait 5 seconds and refresh page
                        await this.testSteps.LogInfo('Wating 5 seconds');
                        await this.page.waitForTimeout(5000);
                        await this.testSteps.LogInfo('Reloading page');
                        await this.page.reload();

                        // remove last char from title
                        const updatedTitle = this.testData.News.title.slice(0, -1);
                        // seatch again with new title
                        await this.testSteps.LogInfo('Performing second search having removed final character from title to refresh solar cache - "' + updatedTitle + '"');
                        await this.newsFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.newsFacetPage.clickNewsFacetSearchButton();
                    }

                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.News.title)).toBeVisible();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterTopicSpan();
                    await this.page.getByRole('link', { name: 'Show more', exact: true }).click();
                    await this.newsFacetPage.clickFacetFilterTopicFilter();
                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.News.title)).toBeVisible();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterPubDateSpan();
                    await this.newsFacetPage.clickFacetFilterPubDateFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.title}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.News.title)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.newsFacetPage.enterContentTitleInSearch(this.testData.News.title);
                    await this.newsFacetPage.clickNewsFacetSearchButton();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.title}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.News.title)).toBeHidden();
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.newsFacetPage.enterContentTitleInSearch(this.testData.News.titleEdited);
                    await this.newsFacetPage.clickNewsFacetSearchButton();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterTopicSpan();
                    await this.page.getByRole('link', { name: 'Show more', exact: true }).click();
                    await this.newsFacetPage.clickFacetFilterTopicEditedFilter();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterPubDateSpan();
                    await this.newsFacetPage.clickFacetFilterPubDateEditedFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.titleEdited}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.News.titleEdited)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.newsFacetPage.enterContentTitleInSearch(this.testData.News.titleEdited);
                    await this.newsFacetPage.clickNewsFacetSearchButton();
                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.titleEdited}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.News.titleEdited)).toBeHidden();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterTopicSpan();
                    await this.page.getByRole('link', { name: 'Show more', exact: true }).click();
                    await this.newsFacetPage.clickFacetFilterTopicEditedFilter();
                    // verify
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.titleEdited}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.News.titleEdited)).toBeHidden();
                    // add filters
                    await this.newsFacetPage.clickFacetFilterPubDateSpan();
                    await this.newsFacetPage.clickFacetFilterPubDateEditedFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.News.titleEdited}")]`)).toBeHidden();
                    await expect(this.page.getByText(this.testData.News.titleEdited)).toBeHidden();
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.publication: {
                // nav back to homepage
                await this.page.getByRole('link', { name: 'Home', exact: true }).click();
                await this.homePage.homePageURLCheck();
                // clicking more news link on the homepage
                await this.homePage.clickPublicationNavLink();
                await this.publicationFacetPage.publicationPageURLCheck();

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.publicationFacetPage.enterContentTitleInSearch(this.testData.Publication.title);
                    await this.publicationFacetPage.clickPublicationFacetSearchButton();

                    try
                    {
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.title}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Publication.title)).toBeVisible();
                        
                    }
                    catch
                    {
                        // wait 2 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.publicationFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.publicationFacetPage.clickPublicationFacetSearchButton();
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Publication.title + '")]')).toBeVisible();
                        await expect(this.page.getByText(this.testData.Publication.title)).toBeVisible();
                    }

                    // add filters
                    await this.publicationFacetPage.clickFacetFilterTypeSpan();
                    await this.publicationFacetPage.clickFacetFilterTypeFilter();
                    // add filters
                    await this.publicationFacetPage.clickFacetFilterTopicSpan();
                    await this.publicationFacetPage.clickFacetFilterTopicFilter();
                    // verify
                    // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Publication.title + '")]')).toBeVisible();
                    await expect(this.page.getByText(this.testData.Publication.title)).toBeVisible();
                    // add filters
                    await this.publicationFacetPage.clickFacetFilterPubDateSpan();
                    await this.publicationFacetPage.clickFacetFilterPubDateFilter();
                    // verify            
                    // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Publication.title + '")]')).toBeVisible();
                    await expect(this.page.getByText(this.testData.Publication.title)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.publicationFacetPage.enterContentTitleInSearch(this.testData.Publication.title);
                    await this.publicationFacetPage.clickPublicationFacetSearchButton();
                    try
                    {
                        // verify
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Publication.title + '")]')).toBeHidden();
                        await expect(this.page.getByText(this.testData.Publication.title)).toBeHidden();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.publicationFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.publicationFacetPage.clickPublicationFacetSearchButton();
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Publication.title + '")]')).toBeHidden();
                        await expect(this.page.getByText(this.testData.Publication.title)).toBeHidden();
                    }
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.publicationFacetPage.enterContentTitleInSearch(this.testData.Publication.titleEdited);
                    await this.publicationFacetPage.clickPublicationFacetSearchButton();

                    try
                    {
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.title}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Publication.title)).toBeVisible();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.publicationFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.publicationFacetPage.clickPublicationFacetSearchButton();
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.titleEdited}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Publication.titleEdited)).toBeVisible();
                    }

                    // add filters
                    await this.publicationFacetPage.clickFacetFilterTypeSpan();
                    await this.publicationFacetPage.clickFacetFilterTypeEditedFilter();
                    // add filters
                    await this.publicationFacetPage.clickFacetFilterTopicSpan();
                    await this.publicationFacetPage.clickFacetFilterTopicEditedFilter();
                    // add filters
                    await this.publicationFacetPage.clickFacetFilterPubDateSpan();
                    await this.publicationFacetPage.clickFacetFilterPubDateEditedFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.titleEdited}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Publication.titleEdited)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }

                if (edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.publicationFacetPage.enterContentTitleInSearch(this.testData.Publication.titleEdited);
                    await this.publicationFacetPage.clickPublicationFacetSearchButton();
                    try
                    {
                        // verify
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.titleEdited}")]`)).toBeHidden();
                        await expect(this.page.getByText(this.testData.Publication.titleEdited)).toBeHidden();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.publicationFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.publicationFacetPage.clickPublicationFacetSearchButton();
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Publication.titleEdited}")]`)).toBeHidden();
                        await expect(this.page.getByText(this.testData.Publication.titleEdited)).toBeHidden();
                    }
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.event: {
                // nav back to homepage
                await this.page.getByRole('link', { name: 'Home', exact: true }).click();
                await this.homePage.homePageURLCheck();
                // Navigating Directly to Event Facet page as clicking more Job fairs and 
                // events calendar on the homepage takes you to live site and not the test environment
                await this.page.goto(this.testSetUpData.urlForTest.url + '/events');
                await this.eventFacetPage.EventPageURLCheck();

                // Only run non-edited checks when the event end date/time is not in the past.
                const eventEndDateTime = new Date(this.testData.Event.endDate + 'T' + this.testData.Event.endTime);
                const canRunEventChecks = !Number.isNaN(eventEndDateTime.getTime()) && eventEndDateTime.getTime() >= Date.now();

                if (canRunEventChecks && !edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.eventFacetPage.enterContentTitleInSearch(this.testData.Event.title);
                    await this.eventFacetPage.clickEventFacetSearchButton();

                    try
                    {
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.title}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Event.title)).toBeVisible();
                        
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.eventFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.eventFacetPage.clickEventFacetSearchButton();
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeVisible();
                        await expect(this.page.getByText(this.testData.Event.title)).toBeVisible();
                    }

                    // add filters
                    await this.eventFacetPage.clickFacetFilterTopicSpan();
                    await this.eventFacetPage.clickFacetFilterTopicFilter();
                    // verify
                    // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeVisible();
                    await expect(this.page.getByText(this.testData.Event.title)).toBeVisible();
                    // add filters
                    await this.eventFacetPage.clickFacetFilterEventDateSpan();
                    await this.eventFacetPage.clickFacetFilterEventDateFilter();
                    // verify            
                    // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeVisible();
                    await expect(this.page.getByText(this.testData.Event.title)).toBeVisible();
                    // add filters
                    await this.eventFacetPage.clickFacetFilterEventLocationSpan();
                    await this.eventFacetPage.clickFacetFilterEventLocation();
                    // verify            
                    // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeVisible();
                    await expect(this.page.getByText(this.testData.Event.title)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }
    

                if (!edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.eventFacetPage.enterContentTitleInSearch(this.testData.Event.title);
                    await this.eventFacetPage.clickEventFacetSearchButton();
                    try
                    {
                        // verify
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeHidden();
                        await expect(this.page.getByText(this.testData.Event.title)).toBeHidden();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.eventFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.eventFacetPage.clickEventFacetSearchButton();
                        // await expect(this.page.locator('//a/h3[contains(text(), "' + this.testData.Event.title + '")]')).toBeHidden();
                        await expect(this.page.getByText(this.testData.Event.title)).toBeHidden();
                    }
                }


                // Only run edited checks when the edited event end date/time is not in the past.
                const editedEventEndDateTime = new Date(this.testData.Event.endDateEdited + 'T' + this.testData.Event.endTimeEdited);
                const canRunEditedEventChecks = !Number.isNaN(editedEventEndDateTime.getTime()) && editedEventEndDateTime.getTime() >= Date.now();

                if (canRunEditedEventChecks && edited && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
                {
                    await this.eventFacetPage.enterContentTitleInSearch(this.testData.Event.titleEdited);
                    await this.eventFacetPage.clickEventFacetSearchButton();

                    try
                    {
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.titleEdited}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Event.titleEdited)).toBeVisible();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.eventFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.eventFacetPage.clickEventFacetSearchButton();
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.titleEdited}")]`)).toBeVisible();
                        await expect(this.page.getByText(this.testData.Event.titleEdited)).toBeVisible();
                    }

                    // add filters
                    await this.eventFacetPage.clickFacetFilterTopicSpan();
                    await this.eventFacetPage.clickFacetFilterTopicEditedFilter();
                    // add filters
                    await this.eventFacetPage.clickFacetFilterEventDateSpan();
                    await this.eventFacetPage.clickFacetFilterEventDateEditedFilter();
                    // add filters
                    await this.eventFacetPage.clickFacetFilterEventLocationSpan();
                    await this.eventFacetPage.clickFacetFilterEventLocationEditedFilter();
                    // verify            
                    // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.titleEdited}")]`)).toBeVisible();
                    await expect(this.page.getByText(this.testData.Event.titleEdited)).toBeVisible();
                    // full verification of content edited param is passed along through methods steming from test itself
                    await this.verifyContent(edited);
                }


                if (canRunEditedEventChecks && edited && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
                {
                    await this.eventFacetPage.enterContentTitleInSearch(this.testData.Event.titleEdited);
                    await this.eventFacetPage.clickEventFacetSearchButton();
                    try
                    {
                        // verify
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.titleEdited}")]`)).toBeHidden();
                        await expect(this.page.getByText(this.testData.Event.titleEdited)).toBeHidden();
                    }
                    catch
                    {
                        // wait 5 seconds and refresh page
                        await this.page.waitForTimeout(2000);
                        // remove last char from title
                        const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                        // seatch again with new title
                        await this.eventFacetPage.enterContentTitleInSearch(updatedTitle);
                        await this.eventFacetPage.clickEventFacetSearchButton();
                        // await expect(this.page.locator(`//a/h3[contains(text(), "${this.testData.Event.titleEdited}")]`)).toBeHidden();
                        await expect(this.page.getByText(this.testData.Event.titleEdited)).toBeHidden();
                    }
                } 
                
                break;
            }
        }

    }

    // this method is used for the searchFacetsAsAnon method above as it is reused multiple times is accepts the edited param to determine what content to seek
    async verifyContent(edited: boolean)
    {
        // count exact results for created content
        const searchResults = this.getSearchResults(this.testSetUpData.contentTitleforTest.contentTitle);
        const searchCount = await searchResults.count();

        if (searchCount > 0 && this.testSetUpData.moderationStateForTest.moderationState === this.testSetUpData.validModerationStates.published)
        {
            // Content is found in search and is in a published state so verify content 
            await this.verifyNodePageForSearch(edited);
        }

        if (searchCount === 0 && this.testSetUpData.moderationStateForTest.moderationState != this.testSetUpData.validModerationStates.published)
        {
            // content is not found in search results as it is not in a published state
            await this.testSteps.LogInfo(`${this.testSetUpData.contentTitleforTest.contentTitle} - Test has passed successfully - Unpublished content does NOT appear is search results as expected`);
        }

        if (searchCount > 0 && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
        {
            // content is found in search results and it shouldnt be as it is published
            throw new Error(`${this.testSetUpData.contentTitleforTest.contentTitle} - Test has failed - content IS displayed in search results and should not be (content not published)`);
        }

        if (searchCount === 0 && this.testSetUpData.moderationStateForTest.moderationState !== this.testSetUpData.validModerationStates.published)
        {
            // content is not found in search results but it should be as it is published solr search may need refreshed 
            // try to remove last char from title and search again to refresh cache if still not found catch fail 
            try
            {
                // wait 5 seconds and refresh page
                await this.page.waitForTimeout(5000);
                await this.page.reload();

                // remove last char from title
                const updatedTitle = this.testSetUpData.contentTitleforTest.contentTitle.slice(0, -1);
                // seatch again with new title
                await this.searchPage.enterContentTitleInSearch(updatedTitle);
                await this.searchPage.clickSearchButton();

                // Content is found in search and is in a published state so verify content 
                await this.verifyNodePageForSearch(edited);
            }
            catch
            {
                throw new Error(`${this.testSetUpData.contentTitleforTest.contentTitle} - Test has failed - content IS NOT displayed in search results and should be (content is published)`);
            }
        }
    }


    async verifyContentwithLink({ edited }: ContentEdited)
    {

        await this.basePage.logOut();
        await this.homePage.homePageURLCheck();

        await this.homePage.verifyLink({ edited });


        // const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();
        // // navigate directly to the application node page that contains the created link
        // const nodeURL = `${this.testSetUpData.urlForTest.url}/services/${escapeRegex(this.testData.Application.title)}`;
        // await this.testSteps.LogInfo(`Navigating directly to "${nodeURL}"`);
        // await this.page.goto(nodeURL);
        // await this.verificationHelper.verifyChosenContent({ edited });
    }


}