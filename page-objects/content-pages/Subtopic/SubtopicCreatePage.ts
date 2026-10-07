import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface SubtopicSaveData
{
    subtopicTitle: string;
    revisionLogMessage: string;
    topics: (string | null)[];
    subtopicSummary: string;
    subtopicLongDescription: string;
    bannerImage?: boolean;
    bannerImageOverlay?: boolean;
    bannerImageThin?: boolean;
}

export class SubtopicCreatePage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    readonly topics: Topics;
    private readonly ckeditor: CKEditor;
    private readonly userPage: UserPage;
    private readonly createPages: CreatePages;
    private readonly previewPage: PreviewPage;
    private readonly uploadMediaHelper: UploadMediaHelper;

    // locators
    private readonly subtopicTitleField: Locator;
    private readonly subtopicSummaryField: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        // isolated instances of test data
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // imported pages
        this.userPage = new UserPage(page, this.testSetUpData);
        this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
        this.topics = new Topics(page, this.testSetUpData, testData);
        this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

        // locators
        this.subtopicTitleField = page.locator('#edit-title-0-value');
        this.subtopicSummaryField = page.locator('#edit-field-summary-0-value');
    }

    // ------------------------ asserts ------------------------

    // check url on create subtopic page
    async createSubtopicPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL contains "${this.testSetUpData.urlForTest.url}/node/add/subtopic"`);
        await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/subtopic(?:\\?.*)?$`));
    }

    // check url on return to create subtopic page after doing a preview
    async returnFromPreviewSubtopicPageURLCheck()
    {
        await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/subtopic\\?uuid"`);
        await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/subtopic\\?uuid`));
    }

    // ------------------------ filling subtopic form ------------------------

    // enter subtopic title
    async enterSubtopicTitle(subtopicTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${subtopicTitle}" into the Title field`);
        await this.subtopicTitleField.fill(subtopicTitle);
    }

    // enter subtopic summary
    async enterSubtopicSummary(subtopicSummary: string)
    {
        await this.testSteps.LogInfo(`Entering "${subtopicSummary}" into the Summary field`);
        await this.subtopicSummaryField.fill(subtopicSummary);
    }

    // ------------------------ actions related to create subtopic ------------------------

    // fill in subtopic form elements - title summary topics long description etc
    async fillSubtopicForm(data: SubtopicSaveData, topicsAlreadySelected = false)
    {
        await this.createSubtopicPageURLCheck();
        await this.enterSubtopicTitle(data.subtopicTitle);
        await this.uploadMediaHelper.uploadBannerImagesWorkflow({
            bannerImage: true,
            bannerImageOverlay: false,
            bannerImageThin: false,
        });
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        if (!topicsAlreadySelected)
        {
            await this.topics.selectSiteTopics(
                data.topics[0] ?? null,
                data.topics[1] ?? null,
                data.topics[2] ?? null,
                data.topics[3] ?? null,
            );
        }
        else
        {
            await this.topics.verifySiteTopicsSelected(data.topics[0]!);
        }
        await this.enterSubtopicSummary(data.subtopicSummary);
        await this.ckeditor.enterCKEditorBody(data.subtopicLongDescription);

    }
}
