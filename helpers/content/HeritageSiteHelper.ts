import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { HeritageSiteCreatePage } from '@poms/content-pages/HeritageSite/HeritageSiteCreatePage';
import { HeritageSiteEditPage } from '@poms/content-pages/HeritageSite/HeritageSiteEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { HeritageSiteNodePage } from '@poms/content-pages/HeritageSite/HeritageSiteNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
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

export class HeritageSiteHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private heritageSiteCreatePage: HeritageSiteCreatePage;
    private heritageSiteEditPage: HeritageSiteEditPage;
    private moderationSideBar: ModerationSideBar;
    private topicsHelper: TopicsTreeHelper;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private heritageSiteNodePage: HeritageSiteNodePage;
    private deletePage: DeletePage;

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
        this.heritageSiteCreatePage = new HeritageSiteCreatePage(page, testSetUpData, testData);
        this.heritageSiteEditPage = new HeritageSiteEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.heritageSiteNodePage = new HeritageSiteNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateHeritageSite()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Heritage Site method
    async createHeritageSite(options: SaveOptions)
    {
        // navigate to create heritage site
        await this.navigateTocreateHeritageSite();

        // set topics for test using select topics for site before filling heritage site form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.heritageSiteCreatePage.mandatoryFieldCheck();
        }

        // complete heritage site form using isolated test data 
        await this.heritageSiteCreatePage.fillHeritageSiteForm({
            heritageSiteTitle: this.testData.HeritageSite.title,
            revisionLogMessage: this.testData.HeritageSite.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            addressCountry: this.testData.HeritageSite.addressCountry,
            addressStreetLine1: this.testData.HeritageSite.addressStreetLine1,
            addressStreetLine2: this.testData.HeritageSite.addressStreetLine2,
            addressStreetLine3: this.testData.HeritageSite.addressStreetLine3,
            addressTown: this.testData.HeritageSite.addressTown,
            addressPostcode: this.testData.HeritageSite.addressPostcode,
            mapName: this.testData.HeritageSite.mapName,
            mapLatitude: this.testData.HeritageSite.mapLatitude,
            mapLongitude: this.testData.HeritageSite.mapLongitude,
            contactPhone: this.testData.HeritageSite.contactPhone,
            contactEmail: this.testData.HeritageSite.contactEmail,
            websiteURL: this.testData.HeritageSite.websiteURL,
            websiteLinkText: this.testData.HeritageSite.websiteLinkText,
            openToThePublic: this.testData.HeritageSite.openToThePublic,
            gridReference: this.testData.HeritageSite.gridreference,
            historicMapViewer: this.testData.HeritageSite.HistoricMapViewer,
            smNumber: this.testData.HeritageSite.smNumber,
            nismrLink: this.testData.HeritageSite.nismrLink,
            heritageSiteBodyField: this.testData.HeritageSite.body,
        });

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview heritage site method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.heritageSiteNodePage.verifyHeritageSite({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.heritageSiteCreatePage.returnFromPreviewHeritageSitePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.heritageSiteNodePage.heritageSiteNodeURLCheck();
        await this.heritageSiteNodePage.verifyHeritageSite({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    // edit Heritage Site method
    async editHeritageSite(options: EditSaveOptions)
    {
        // should be on node page already
        await this.heritageSiteNodePage.heritageSiteNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using select topics for site before filling heritage site form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete heritage site form using edit isolated test data 
        await this.heritageSiteEditPage.editHeritageSiteForm({
            heritageSiteTitle: this.testData.HeritageSite.titleEdited,
            revisionLogMessage: this.testData.HeritageSite.revisionlogEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            addressCountry: this.testData.HeritageSite.addressCountryEdited,
            addressStreetLine1: this.testData.HeritageSite.addressStreetLine1Edited,
            addressStreetLine2: this.testData.HeritageSite.addressStreetLine2Edited,
            addressStreetLine3: this.testData.HeritageSite.addressStreetLine3Edited,
            addressTownLand: this.testData.HeritageSite.addressTownLandEdited,
            addressCity: this.testData.HeritageSite.addressCityEdited,
            addressCounty: this.testData.HeritageSite.addressCountyEdited,
            addressEircode: this.testData.HeritageSite.addressEIRCodeEdited,
            mapName: this.testData.HeritageSite.mapNameEdited,
            mapLocationModalName: this.testData.HeritageSite.mapLocationModalName,
            contactPhone: this.testData.HeritageSite.contactPhoneEdited,
            contactEmail: this.testData.HeritageSite.contactEmailEdited,
            websiteURL: this.testData.HeritageSite.websiteURLEdited,
            websiteLinkText: this.testData.HeritageSite.websiteLinkTextEdited,
            openToThePublic: this.testData.HeritageSite.openToThePublicEdited,
            gridReference: this.testData.HeritageSite.gridreferenceEdited,
            historicMapViewer: this.testData.HeritageSite.HistoricMapViewerEdited,
            smNumber: this.testData.HeritageSite.smNumberEdited,
            nismrLink: this.testData.HeritageSite.nismrLinkEdited,
            heritageSiteBodyField: this.testData.HeritageSite.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.HeritageSite.titleEdited;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview heritage site method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.heritageSiteNodePage.verifyEditedHeritageSite({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.heritageSiteEditPage.returnFromPreviewHeritageSitePageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.heritageSiteNodePage.heritageSiteNodeURLCheck();
        await this.heritageSiteNodePage.verifyEditedHeritageSite({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    // delete Heritage Site method
    async deleteHeritageSite(options: DeleteOptions)
    {
        // should be on node page already
        await this.heritageSiteNodePage.heritageSiteNodeURLCheck();
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

        if (options.cancel === true)
        {
            await this.deletePage.clickCancel();
        }
    }
}
