import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { SubtopicCreatePage } from '@poms/content-pages/Subtopic/SubtopicCreatePage';
import { SubtopicEditPage } from '@poms/content-pages/Subtopic/SubtopicEditPage';
import { SubtopicNodePage } from '@poms/content-pages/Subtopic/SubtopicNodePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
};

export interface EditSaveOptions
{
    preview: boolean;
};

export class SubtopicHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly subtopicCreatePage: SubtopicCreatePage;
    private readonly subtopicEditPage: SubtopicEditPage;
    private readonly subtopicNodePage: SubtopicNodePage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly topicsHelper: TopicsTreeHelper;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;

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
        this.subtopicCreatePage = new SubtopicCreatePage(page, testSetUpData, testData);
        this.subtopicEditPage = new SubtopicEditPage(page, testSetUpData, testData);
        this.subtopicNodePage = new SubtopicNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
    }

    // navigation method
    async navigateToCreateSubtopic()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Subtopic method
    async createSubtopic(options: SaveOptions)
    {
        // navigate to create subtopic
        await this.navigateToCreateSubtopic();

        // set topics for test using select topics for site before filling subtopic form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            // TODO: mandatoryFieldCheck() not yet implemented on SubtopicCreatePage
        }

        // complete subtopic form using isolated test data
        await this.subtopicCreatePage.fillSubtopicForm({
            subtopicTitle: this.testData.Subtopic.title,
            revisionLogMessage: this.testData.Subtopic.revisionlog,
            topics: this.topicsHelper.getTopics(),
            subtopicSummary: this.testData.Subtopic.summary,
            subtopicLongDescription: this.testData.Subtopic.longDescription,
        });

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview subtopic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.subtopicNodePage.verifySubtopic({ preview: true });

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicCreatePage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifySubtopic({ preview: false });
    }

    // edit Subtopic method
    async editSubtopic(options: EditSaveOptions)
    {
        // should be on node page already
        await this.subtopicNodePage.subtopicNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using select topics for site before filling subtopic edit form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete subtopic form using edit isolated test data
        await this.subtopicEditPage.editSubtopicForm({
            subtopicTitle: this.testData.Subtopic.titleEdited,
            revisionLogMessage: this.testData.Subtopic.revisionlogEdited,
            topics: this.topicsHelper.getTopics(),
            subtopicSummary: this.testData.Subtopic.summaryEdited,
            subtopicLongDescription: this.testData.Subtopic.longDescriptionEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Subtopic.titleEdited;

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview subtopic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.subtopicNodePage.verifyEditedSubtopic({ preview: true });

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicEditPage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifyEditedSubtopic({ preview: false });
    }
}
