import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { GalleryCreatePage } from '@poms/content-pages/Gallery/GalleryCreatePage';
import { GalleryEditPage } from '@poms/content-pages/Gallery/GalleryEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData, galleryImageDetails } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { GalleryImageMediaData, GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
import { DeletePage } from '@poms/base-pages/DeletePage';

export type SaveOptions = {
    preview: boolean;
    mandatoryFieldCheck: boolean;
    // when set, selects this already uploaded Media Library image instead of uploading new gallery images
    existingImageName?: string;
    unavailableImageNames?: string[];
};

export type EditSaveOptions = {
    preview: boolean;
};

export type DeleteOptions = {
    delete: boolean;
    cancel: boolean;
};

export class GalleryHelper
{
    // pages
    private userPage: UserPage;
    private basePage: BasePage;
    private contentPage: ContentPage;
    private addContentPage: AddContentPage;
    private galleryCreatePage: GalleryCreatePage;
    private galleryEditPage: GalleryEditPage;
    private moderationSideBar: ModerationSideBar;
    private topicsHelper: TopicsTreeHelper;
    private previewPage: PreviewPage;
    private createPage: CreatePages;
    private galleryNodePage: GalleryNodePage;
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
        this.galleryCreatePage = new GalleryCreatePage(page, testSetUpData, testData, galleryImageDetails);
        this.galleryEditPage = new GalleryEditPage(page, testSetUpData, testData, galleryImageDetails);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.galleryNodePage = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
        this.deletePage = new DeletePage(page);
    }

    private getExistingImageValues(existingImageName: string): GalleryImageMediaData
    {
        if (existingImageName === this.testData.MediaLibrary.imageNameEdited)
        {
            return {
                altText: this.testData.Media.galleryImage2AltText,
                title: this.testData.Media.galleryImage2Title,
                caption: this.testData.Media.galleryImage2Caption,
            };
        }

        return {
            altText: this.testData.Media.galleryImageAltText,
            title: this.testData.Media.galleryImageTitle,
            caption: this.testData.Media.galleryImageCaption,
        };
    }

    // navigation method
    async navigateTocreateGallery()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Gallery method
    async createGallery(options: SaveOptions)
    {
        // navigate to create gallery
        await this.navigateTocreateGallery();

        // set topics for test using selec topics for site before filling gallery form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.galleryCreatePage.mandatoryFieldCheck();
        }

        // complete gallery form using isolated test data 
        await this.galleryCreatePage.fillGalleryForm({
            galleryTitle: this.testData.Gallery.title,
            revisionLogMessage: this.testData.Gallery.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            gallerySummary: this.testData.Gallery.summary,
            galleryBodyField: this.testData.Gallery.body,
            existingImageName: options.existingImageName,
            unavailableImageNames: options.unavailableImageNames,
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview gallery method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.galleryNodePage.verifyGallery({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.galleryCreatePage.returnFromPreviewGalleryPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.galleryNodePage.galleryNodeURLCheck();

        // full image verification expects the standard 5-image gallery upload, skip when reusing an existing image
        if (!options.existingImageName)
        {
            await this.galleryNodePage.verifyGallery({
                preview: false,
                topics: this.topicsHelper.getTopics()
            });
        } else
        {
            await this.galleryNodePage.verifyGallery({
                preview: false,
                topics: this.topicsHelper.getTopics(),
                existingImageName: options.existingImageName,
                existingImageValues: this.getExistingImageValues(options.existingImageName),
            });
        }
    }

    // edit Gallery method
    async editGallery(options: EditSaveOptions)
    {
        // should be on node page already
        await this.galleryNodePage.galleryNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using selec topics for site before filling gallery form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete gallery form using edit isolated test data 
        await this.galleryEditPage.editGalleryForm({
            galleryTitle: this.testData.Gallery.titleEdited,
            revisionLogMessage: this.testData.Gallery.revisionlogEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            gallerySummary: this.testData.Gallery.summaryEdited,
            galleryBodyField: this.testData.Gallery.bodyEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Gallery.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview gallery method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.galleryNodePage.verifyEditedGallery({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.galleryEditPage.returnFromPreviewGalleryPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.galleryNodePage.galleryNodeURLCheck();
        await this.galleryNodePage.verifyEditedGallery({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    async deleteGallery(options: DeleteOptions)
    {
        // should be on node page already
        await this.galleryNodePage.galleryNodeURLCheck();
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
            await this.galleryNodePage.galleryNodeURLCheck();
        }
    }

}




