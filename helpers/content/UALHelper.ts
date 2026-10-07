import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { UALCreatePage } from '@poms/content-pages/UAL/UALCreatePage';
import { UALEditPage } from '@poms/content-pages/UAL/UALEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { UALNodePage } from '@poms/content-pages/UAL/UALNodePage';
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

export class UALHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly ualCreatePage: UALCreatePage;
    private readonly ualEditPage: UALEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly topicsHelper: TopicsTreeHelper;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly ualNodePage: UALNodePage;
    private readonly deletePage: DeletePage;

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
        this.ualCreatePage = new UALCreatePage(page, testSetUpData, testData);
        this.ualEditPage = new UALEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.ualNodePage = new UALNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateUAL()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create UAL method
    async createUAL(options: SaveOptions)
    {
        // navigate to create UAL
        await this.navigateTocreateUAL();

        // set topics for test using select topics for site before filling UAL form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.ualCreatePage.mandatoryFieldCheck();
        }

        // complete UAL form using isolated test data
        await this.ualCreatePage.fillUALForm({
            ualTitle: this.testData.Unlawfully.title,
            revisionLogMessage: this.testData.Unlawfully.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            uALFrom: this.testData.Unlawfully.uALFrom,
            age: this.testData.Unlawfully.age,
            prison: this.testData.Unlawfully.prison,
            offence: this.testData.Unlawfully.offence,
            description: this.testData.Unlawfully.description,
            eyeColour: this.testData.Unlawfully.eyeColour,
            hairColour: this.testData.Unlawfully.hairColour,
            distinguishingMarks: this.testData.Unlawfully.distinguishingMarks,
            releaseType: this.testData.Unlawfully.releaseType,
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview UAL method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.ualNodePage.verifyUAL({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.ualCreatePage.returnFromPreviewUALPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.ualNodePage.ualNodeURLCheck();
        await this.ualNodePage.verifyUAL({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    // edit UAL method
    async editUAL(options: EditSaveOptions)
    {
        // should be on node page already
        await this.ualNodePage.ualNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using select topics for site before filling UAL form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete UAL form using edit isolated test data
        await this.ualEditPage.editUALForm({
            ualTitle: this.testData.Unlawfully.titleEdited,
            revisionLogMessage: this.testData.Unlawfully.revisionlogEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            uALFrom: this.testData.Unlawfully.uALFromEdited,
            age: this.testData.Unlawfully.ageEdited,
            prison: this.testData.Unlawfully.prisonEdited,
            offence: this.testData.Unlawfully.offenceEdited,
            description: this.testData.Unlawfully.descriptionEdited,
            eyeColour: this.testData.Unlawfully.eyeColourEdited,
            hairColour: this.testData.Unlawfully.hairColourEdited,
            distinguishingMarks: this.testData.Unlawfully.distinguishingMarksEdited,
            releaseType: this.testData.Unlawfully.releaseTypeEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Unlawfully.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview UAL method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.ualNodePage.verifyEditedUAL({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.ualEditPage.returnFromPreviewUALPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.ualNodePage.ualNodeURLCheck();
        await this.ualNodePage.verifyEditedUAL({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    async deleteUAL(options: DeleteOptions)
    {
        // should be on node page already
        await this.ualNodePage.ualNodeURLCheck();
        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click delete content
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
            await this.ualNodePage.ualNodeURLCheck();
        }
    }
}
