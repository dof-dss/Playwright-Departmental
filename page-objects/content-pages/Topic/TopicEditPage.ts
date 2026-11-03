import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '../../base-pages/CKEditor';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface TopicEditSaveData
{
    topicTitle: string;
    revisionLogMessage: string;
    topicSummary: string;
    topicLongDescription: string;
    hideListing?: boolean;
    bannerImage?: boolean;
    bannerImageEdit?: boolean;
    bannerImageOverlay?: boolean;
    bannerImageThin?: boolean;
}

export class TopicEditPage
{
    // logging
    private readonly testSteps: TestSteps;

    // pages
    private readonly ckeditor: CKEditor;
    private readonly userPage: UserPage;
    private readonly createPages: CreatePages;
    private readonly previewPage: PreviewPage;
    private readonly uploadMediaHelper: UploadMediaHelper;

    // locators
    private readonly topicTitleField: Locator;
    private readonly hideListingCheckbox: Locator;
    private readonly topicSummaryField: Locator;

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
        this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

        // locators
        this.topicTitleField = page.locator('#edit-title-0-value');
        this.hideListingCheckbox = page.locator('#edit-hide-listing');
        this.topicSummaryField = page.locator('#edit-field-summary-0-value');
    }

    // ------------------------ asserts ------------------------

    // check url on edit topic page
    async editTopicPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "edit"');
        await expect(this.page).toHaveURL(/\/edit/);
    }

    // check url on return to edit topic page after doing a preview
    async returnFromPreviewTopicPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
        await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
    }

    // ------------------------ filling topic form ------------------------

    // edit topic title
    async editTopicTitle(topicTitle: string)
    {
        await this.testSteps.LogInfo(`Entering "${topicTitle}" into the Title field`);
        await this.topicTitleField.fill(topicTitle);
    }

    // edit topic summary
    async editTopicSummary(topicSummary: string)
    {
        await this.testSteps.LogInfo(`Entering "${topicSummary}" into the Summary field`);
        await this.topicSummaryField.fill(topicSummary);
    }

    // toggle Hide listing checkbox
    async toggleHideListing()
    {
        await this.testSteps.LogInfo('Toggling the Hide listing checkbox');
        await this.hideListingCheckbox.click();
    }

    // ------------------------ actions related to edit topic ------------------------

    // fill in topic form elements - title summary long description etc
    async editTopicForm(data: TopicEditSaveData)
    {
        await this.editTopicPageURLCheck();
        await this.editTopicTitle(data.topicTitle);
        if (data.hideListing)
        {
            await this.toggleHideListing();
        }
        await this.uploadMediaHelper.uploadBannerImagesWorkflow({
            bannerImage: data.bannerImage,
            bannerImageEdit: data.bannerImageEdit,
            bannerImageOverlay: data.bannerImageOverlay,
            bannerImageThin: data.bannerImageThin,
        });
        await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
        await this.editTopicSummary(data.topicSummary);
        await this.ckeditor.enterCKEditorBody(data.topicLongDescription);
        await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
        await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
        await this.page.waitForTimeout(1000);
        await this.uploadMediaHelper.uploadImageWorkflow({
            original: false,
            edited: true
        });
    }

    async editTopicUsingDragAndDrop()
    {
        // perform drag and drop to reorder topic content items
        await this.testSteps.LogInfo('Performing drag and drop edit actions on the topic');
        const childRows = this.page.locator('.field--name-field-topic-content tr.draggable');
        const subtopicRow = childRows.filter({ hasText: this.testData.Subtopic.title }).first();
        const sourceHandle = subtopicRow.locator('.tabledrag-handle');
        const firstRow = childRows.first();
        const targetHandle = firstRow.locator('.tabledrag-handle');

        await expect(childRows).toHaveCount(3);
        await expect(sourceHandle).toBeVisible();
        await expect(targetHandle).toBeVisible();

        // attempt drag and drop using the built-in dragTo method
        let dragSucceeded = false;
        try
        {
            await sourceHandle.dragTo(targetHandle);
            await expect(firstRow).toContainText(this.testData.Subtopic.title, { timeout: 2000 });
            dragSucceeded = true;
        }
        catch
        {
            dragSucceeded = false;
        }

        // fallback drag and drop using mouse events if the initial dragTo attempt fails
        if (!dragSucceeded)
        {
            const sourceBox = await sourceHandle.boundingBox();
            const targetBox = await targetHandle.boundingBox();

            if (!sourceBox || !targetBox)
            {
                throw new Error('Unable to calculate drag coordinates for Topic Content reorder');
            }

            await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 4, { steps: 20 });
            await this.page.mouse.up();
        }

        // verify that the subtopic is now the first row after the drag and drop operation
        await expect(firstRow).toContainText(this.testData.Subtopic.title);
    }
}
