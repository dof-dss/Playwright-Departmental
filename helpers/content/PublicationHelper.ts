import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { PublicationCreatePage } from '@poms/content-pages/Publication/PublicationCreatePage';
import { PublicationEditPage } from '@poms/content-pages/Publication/PublicationEditPage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { SecurePublicationCreatePage } from '@poms/content-pages/SecurePublication/SecurePublicationCreatePage';
import { SecurePublicationNodePage } from '@poms/content-pages/SecurePublication/SecurePublicationNodePage';
import { SecurePublicationEditPage } from '@poms/content-pages/SecurePublication/SecurePublicationEditPage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    existingDocumentName?: string;
    existingSecureFileName?: string;
};

export interface EditSaveOptions
{
    preview: boolean;
};

export interface DeleteOptions
{
    delete: boolean;
    cancel: boolean;
};

export class PublicationHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private publicationCreatePage: PublicationCreatePage;
    private publicationEditPage: PublicationEditPage;
    private publicationNodePage: PublicationNodePage;
    private moderationSideBar: ModerationSideBar;
    private topicsHelper: TopicsTreeHelper;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private deletePage: DeletePage;
    private securePublicationCreatePage: SecurePublicationCreatePage;
    private securePublicationEditPage: SecurePublicationEditPage;
    private securePublicationNodePage: SecurePublicationNodePage;

    // constructor
    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.userPage = new UserPage(page, testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.publicationCreatePage = new PublicationCreatePage(page, testSetUpData, testData);
        this.publicationEditPage = new PublicationEditPage(page, testSetUpData, testData);
        this.publicationNodePage = new PublicationNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
        this.securePublicationCreatePage = new SecurePublicationCreatePage(page, testSetUpData, testData);
        this.securePublicationEditPage = new SecurePublicationEditPage(page, testSetUpData, testData);
        this.securePublicationNodePage = new SecurePublicationNodePage(page, testSetUpData, testData);
    }

    // navigation method
    async navigateTocreatePublication()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Publication method
    async createPublication(options: SaveOptions)
    {
        // navigate to create publication
        await this.navigateTocreatePublication();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            //await this.publicationCreatePage.mandatoryFieldCheck();
        }

        // complete publication form using isolated test data 
        await this.publicationCreatePage.fillPublicationForm({
            publicationTitle: this.testData.Publication.title,
            revisionLogMessage: this.testData.Publication.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            pubType: this.testData.Publication.publicationType,
            publicationSummary: this.testData.Publication.summary,
            publicationBodyField: this.testData.Publication.body,
            existingDocumentName: options.existingDocumentName,
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.publicationNodePage.verifyPublication({
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.publicationCreatePage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyPublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    // edit Publication method
    async editPublication(options: EditSaveOptions)
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete publication form using edit isolated test data 
        await this.publicationEditPage.editPublicationForm({
            publicationTitle: this.testData.Publication.titleEdited,
            publicationPublishedDate: this.testData.Publication.datePublished,
            revisionLogMessage: this.testData.Publication.revisionlogEdited,
            publicationLastUpdatedDate: this.testData.Publication.lastUpdatedDateEdited,
            publicationLastUpdatedTime: this.testData.Publication.lastUpdatedTimeEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            pubType: this.testData.Publication.publicationTypeEdited,
            publicationSummary: this.testData.Publication.summaryEdited,
            publicationBodyField: this.testData.Publication.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.publicationNodePage.verifyEditedPublication({
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.publicationEditPage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyEditedPublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    async deletePublication(options: DeleteOptions)
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();
        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete === true)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deletePage.clickCancel();
            await this.publicationNodePage.publicationNodeURLCheck();
        }
    }

    // create Publication method
    async createExternalLinkPublication()
    {
        // navigate to create publication
        await this.navigateTocreatePublication();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // complete publication form using isolated test data 
        await this.publicationCreatePage.fillExternalLinkPublicationForm({
            publicationTitle: this.testData.Publication.title,
            revisionLogMessage: this.testData.Publication.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            pubType: this.testData.Publication.publicationType,
            publicationSummary: this.testData.Publication.summary,
            publicationBodyField: this.testData.Publication.body,
            publicationExteralLink: this.testData.Publication.externalPublication,
            publicationLinkText: this.testData.Publication.linkTextPubllication
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyExternalLinkPublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    // create Publication method
    async editExternalLinkPublication()
    {
        // should be on node page already
        await this.publicationNodePage.publicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete publication form using isolated test data 
        await this.publicationEditPage.editExternalLinkPublicationForm({
            publicationTitle: this.testData.Publication.titleEdited,
            revisionLogMessage: this.testData.Publication.revisionlog,
            publicationLastUpdatedDate: this.testData.Publication.lastUpdatedDateEdited,
            publicationLastUpdatedTime: this.testData.Publication.lastUpdatedTimeEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            pubType: this.testData.Publication.publicationTypeEdited,
            publicationSummary: this.testData.Publication.summaryEdited,
            publicationBodyField: this.testData.Publication.bodyEdited,
            publicationExteralLink: this.testData.Publication.externalPublicationEdited,
            publicationLinkText: this.testData.Publication.linkTextPubllicationEdited
        });

        // updating global topic set and title 
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.publicationNodePage.publicationNodeURLCheck();
        await this.publicationNodePage.verifyEditedExternalLinkPublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    ////////////////////////////////////////////////////////////////////
    // >>>>>>>>>>>>>>>>> SECURE PUBLICATION METHODS <<<<<<<<<<<<<<<<<<<<
    ////////////////////////////////////////////////////////////////////

    async createSecurePublication(options: SaveOptions)
    {
        // navigate to create publication
        await this.navigateTocreatePublication();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            //await this.publicationCreatePage.mandatoryFieldCheck();
        }

        // complete publication form using isolated test data 
        await this.securePublicationCreatePage.fillSecurePublicationForm({
            securePublicationTitle: this.testData.SecurePublication.title,
            revisionLogMessage: this.testData.SecurePublication.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            securePublicationType: this.testData.SecurePublication.publicationType,
            securePublicationSummary: this.testData.SecurePublication.summary,
            securePublicationBodyField: this.testData.SecurePublication.body,
            existingSecureFileName: options.existingSecureFileName,
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.securePublicationNodePage.verifySecurePublication({
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.securePublicationCreatePage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.securePublicationNodePage.securePublicationNodeURLCheck();
        await this.securePublicationNodePage.verifySecurePublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    async editSecurePublication(options: EditSaveOptions)
    {
        // should be on node page already
        await this.securePublicationNodePage.securePublicationNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using selec topics for site before filling publication form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete publication form using edit isolated test data 
        await this.securePublicationEditPage.editSecurePublicationForm({
            securePublicationTitle: this.testData.SecurePublication.titleEdited,
            securePublicationPublishedDate: this.testData.SecurePublication.datePublished,
            revisionLogMessage: this.testData.Publication.revisionlogEdited,
            securePublicationLastUpdatedDate: this.testData.SecurePublication.lastUpdatedDateEdited,
            securePublicationLastUpdatedTime: this.testData.SecurePublication.lastUpdatedTimeEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            securePublicationType: this.testData.SecurePublication.publicationTypeEdited,
            securePublicationSummary: this.testData.SecurePublication.summaryEdited,
            securePublicationBodyField: this.testData.SecurePublication.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.SecurePublication.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview publication method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.securePublicationNodePage.verifyEditedSecurePublication({
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.securePublicationEditPage.returnFromPreviewPublicationPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.securePublicationNodePage.securePublicationNodeURLCheck();
        await this.securePublicationNodePage.verifyEditedSecurePublication({
            topics: this.topicsHelper.getTopics()
        });
    }

    async deleteSecurePublication(options: DeleteOptions)
    {
        // should be on node page already
        await this.securePublicationNodePage.securePublicationNodeURLCheck();
        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete === true)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            // test moderation state updated to deleted 
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deletePage.clickCancel();
            await this.securePublicationNodePage.securePublicationNodeURLCheck();
        }
    }



}




