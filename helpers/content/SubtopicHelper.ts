import { Page, expect } from '@playwright/test';
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
import { DeletePage } from '@poms/base-pages/DeletePage';
import { TopicHelper } from '@helpers/content/TopicHelper';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    customTopicNeeded: boolean;
    topics?: (string | null)[];
    hideListing?: boolean;
};

export interface EditSaveOptions
{
    preview: boolean;
    topics?: (string | null)[];
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
        this.subtopicCreatePage = new SubtopicCreatePage(page, testSetUpData, testData);
        this.subtopicEditPage = new SubtopicEditPage(page, testSetUpData, testData);
        this.subtopicNodePage = new SubtopicNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
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
        if (options.customTopicNeeded)
        {
            const contentType = this.testSetUpData.contentTypeforTest.contentType;
            const contentTitle = this.testSetUpData.contentTitleforTest.contentTitle;
            const saveAsOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
            const moderationState = this.testSetUpData.moderationStateForTest.moderationState;

            try
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
                this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.published;
                await new TopicHelper(this.page, this.testSetUpData, this.testData).createTopic({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
                this.testData.SiteTopics.topic1 = this.testData.Topic.title;
            }
            finally
            {
                this.testSetUpData.contentTypeforTest.contentType = contentType;
                this.testSetUpData.contentTitleforTest.contentTitle = contentTitle;
                this.testSetUpData.saveAsOptionForTest.saveAsOption = saveAsOption;
                this.testSetUpData.moderationStateForTest.moderationState = moderationState;
            }
        }

        // navigate to create subtopic
        await this.navigateToCreateSubtopic();

        // If doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            // TODO: mandatoryFieldCheck() not yet implemented on SubtopicCreatePage
        }

        // set topics for test using select topics for site before filling subtopic form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // complete subtopic form using isolated test data
        await this.subtopicCreatePage.fillSubtopicForm({
            subtopicTitle: this.testData.Subtopic.title,
            revisionLogMessage: this.testData.Subtopic.revisionlog,
            topics: options.topics ?? this.topicsHelper.getTopics(),
            subtopicSummary: this.testData.Subtopic.summary,
            subtopicLongDescription: this.testData.Subtopic.longDescription,
            hideListing: options.hideListing,
        });

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview subtopic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.subtopicNodePage.verifySubtopic();

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicCreatePage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifySubtopic();
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
        if (!options.topics)
        {
            await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });
        }

        // complete subtopic form using edit isolated test data
        await this.subtopicEditPage.editSubtopicForm({
            subtopicTitle: this.testData.Subtopic.titleEdited,
            revisionLogMessage: this.testData.Subtopic.revisionlogEdited,
            topics: options.topics ?? this.topicsHelper.getTopics(),
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
            await this.subtopicNodePage.verifyEditedSubtopic();

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicEditPage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifyEditedSubtopic();
    }

    async verifyOnParentTopic(options: { parentTopicUrl: string; title: string; shouldBeVisible: boolean; })
    {
        await this.page.goto(options.parentTopicUrl);
        const subtopicLink = this.page.getByRole('main').getByRole('link', { name: options.title, exact: true });

        if (options.shouldBeVisible)
        {
            await expect(subtopicLink).toBeVisible();
        }
        else
        {
            await expect(subtopicLink).toBeHidden();
        }
    }

    async deleteSubtopic(options: { delete: boolean; cancel: boolean; })
    {
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickDeleteButton();
        await this.deletePage.deleteNodePageURLCheck();

        if (options.delete)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel)
        {
            await this.deletePage.clickCancel();
            await this.subtopicNodePage.subtopicNodeURLCheck();
        }
    }
}
