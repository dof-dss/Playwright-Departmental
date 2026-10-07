import { Page } from '@playwright/test';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';

export class TopicsTreeHelper
{
    private readonly testSteps: TestSteps;

    constructor(
        private page: Page,
        // isolated instances of test data 
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        this.testSteps = new TestSteps();
    }

    // select topics for site this will set the test data depending on what site is being tested 
    async selectTopicForSite(options: { edit: boolean, triggeralert: boolean; })
    {
        // getting current site being tested from test setup data to use in switch
        const site = this.testSetUpData.urlForTest.url;

        // switch to determine topics based on site using valid test url list for cases
        switch (site)
        {
            case this.testSetUpData.validTestURLList.finance_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Finance";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Procurement' : options.edit ? 'Land registration' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Statistics and research' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Civil law reform' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.communities_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Historic environment";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Law and legislation' : options.edit ? 'Sport' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Housing' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Languages' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.daera_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Actions to Protect our Environment";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Forestry' : options.edit ? 'Animal Health, Welfare and Trade' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Statistics' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Pollution' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.economy_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Energy";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Tourism' : options.edit ? 'Tourism' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Consumer affairs' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Employment rights' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.education_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Teaching staff";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Children and Young People Issues' : options.edit ? 'Children and Young People Issues' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Good Relations and Social Change' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Support and development' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.executive_office_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Promoting Northern Ireland";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Statistics and Research' : options.edit ? 'Statistics and Research' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Social Change' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Sponsorship' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.health_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Dentistry";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Pharmacy' : options.edit ? 'Pharmacy' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Neurology Recall' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Social Care Reform' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.dfi_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "Ports";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Roads' : options.edit ? 'Roads' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Public transport' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Planning' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.justice_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "NICTS";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'Matrimonial' : options.edit ? 'Matrimonial' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'justice and the law' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Legal aid' : this.testData.SiteTopics.topic4;
                break;
            }
            case this.testSetUpData.validTestURLList.nigov_url: {
                // topic 1 is always needed so always assign a value
                this.testData.SiteTopics.topic1 ||= "History and tour";

                // if an edit test set topic 2 (as it is normally null giving it a value will enable edit to work correctly)
                // if trigger the alert that 4 topics cannot be assigned give topics 2/3/4 a value (they are also normally null)
                this.testData.SiteTopics.topic2 = options.triggeralert ? 'The work of the Executive' : options.edit ? 'The work of the Executive' : this.testData.SiteTopics.topic2;
                this.testData.SiteTopics.topic3 = options.triggeralert ? 'Help' : this.testData.SiteTopics.topic3;
                this.testData.SiteTopics.topic4 = options.triggeralert ? 'Your Executive' : this.testData.SiteTopics.topic4;
                break;
            }
        }
    }

    // This sets the Topics that will be used the creation and edit methods to verify that the correct topics are selected, 
    // this is needed as the topics selected for the site are dynamic based on the site being tested and the topics for the site are set in the 
    // selectTopicForSite method
    getTopics(): (string | null)[]
    {
        return [
            this.testData.SiteTopics.topic1,
            this.testData.SiteTopics.topic2,
            this.testData.SiteTopics.topic3,
            this.testData.SiteTopics.topic4,
        ];
    }

    // verify a Topic is not available in the Site Topics tree on a content form
    async verifyTopicNotVisibleInSiteTopicsTree(topicTitle: string)
    {
        const siteTopicsTreeButton = this.page.getByTestId('site-topics-tree-open-button');

        await this.testSteps.LogInfo(`Verifying archived Topic "${topicTitle}" is not visible in the Site Topics tree`);
        await expect(siteTopicsTreeButton).toBeEnabled();
        await siteTopicsTreeButton.click();

        const siteTopicsDialog = this.page.getByRole('dialog', { name: 'Select Topics' });
        await expect(siteTopicsDialog).toBeVisible();
        await expect(siteTopicsDialog.getByRole('treeitem', { name: topicTitle, exact: true })).toHaveCount(0);
        await siteTopicsDialog.getByRole('button', { name: 'Close', exact: true }).click();
    }


}
