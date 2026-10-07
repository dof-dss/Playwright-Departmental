import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface SubtopicEditSaveData
{
    subtopicTitle: string;
    revisionLogMessage: string;
    topics: (string | null)[];
    subtopicSummary: string;
    subtopicLongDescription?: string;
    bannerImage?: boolean;
    bannerImageOverlay?: boolean;
    bannerImageThin?: boolean;
}

export class SubtopicEditPage
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

    // check url on edit subtopic page
    async editSubtopicPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "edit"');
        await expect(this.page).toHaveURL(/\/edit/);
    }

    // check url on return to edit subtopic page after doing a preview
    async returnFromPreviewSubtopicPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
        await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
    }

    // ------------------------ filling subtopic form ------------------------

    // edit subtopic title
    async editSubtopicTitle(subtopicTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${subtopicTitle}" into the Title field`);
        await this.subtopicTitleField.fill(subtopicTitle);
    }

    // edit subtopic summary
    async editSubtopicSummary(subtopicSummary: string)
    {
        await this.testSteps.LogInfo(`Entering "${subtopicSummary}" into the Summary field`);
        await this.subtopicSummaryField.fill(subtopicSummary);
    }

    // ------------------------ actions related to edit subtopic ------------------------

    // fill in subtopic form elements - title summary topics long description etc
    async editSubtopicForm(data: SubtopicEditSaveData)
    {
        await this.editSubtopicPageURLCheck();
        await this.editSubtopicTitle(data.subtopicTitle);
        await this.uploadMediaHelper.uploadBannerImagesWorkflow({
            bannerImage: data.bannerImage,
            bannerImageOverlay: data.bannerImageOverlay,
            bannerImageThin: data.bannerImageThin,
        });
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        await this.topics.selectSiteTopics(
            data.topics[0] ?? null,
            data.topics[1] ?? null,
            data.topics[2] ?? null,
            data.topics[3] ?? null,
            true,
        );
        await this.editSubtopicSummary(data.subtopicSummary);

        if (data.subtopicLongDescription)
        {
            await this.ckeditor.enterCKEditorBody(data.subtopicLongDescription);
        }
    }
}
