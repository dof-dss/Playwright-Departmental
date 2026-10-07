import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { EventCreatePage } from '@poms/content-pages/Event/EventCreatePage';
import { EventEditPage } from '@poms/content-pages/Event/EventEditPage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { EventNodePage } from '@poms/content-pages/Event/EventNodePage';
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

export class EventHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly eventCreatePage: EventCreatePage;
    private readonly eventEditPage: EventEditPage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly topicsHelper: TopicsTreeHelper;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly eventNodePage: EventNodePage;
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
        this.eventCreatePage = new EventCreatePage(page, testSetUpData, testData);
        this.eventEditPage = new EventEditPage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.eventNodePage = new EventNodePage(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
    }

    // navigation method
    async navigateTocreateEvent()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Event method
    async createEvent(options: SaveOptions)
    {
        // navigate to create event
        await this.navigateTocreateEvent();

        // set topics for test using selec topics for site before filling event form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            await this.eventCreatePage.mandatoryFieldCheck();
        }

        // complete event form using isolated test data 
        await this.eventCreatePage.fillEventForm({
            eventTitle: this.testData.Event.title,
            revisionLogMessage: this.testData.Event.revisionlog,
            globalTopicChoice: this.testData.GlobalTopics.employment,
            topics: this.topicsHelper.getTopics(),
            eventStartDate: this.testData.Event.startDate,
            eventStartTime: this.testData.Event.startTime,
            eventEndDate: this.testData.Event.endDate,
            eventEndTime: this.testData.Event.endTime,
            eventRegion: this.testData.Event.region,
            eventSummary: this.testData.Event.summary,
            eventDescription: this.testData.Event.description,
            eventHostedBy: this.testData.Event.hostedBy,
            eventVenue: this.testData.Event.venue,
            eventRegistrationLink: this.testData.Event.registrationLink,
            eventLinkText: this.testData.Event.linkText,
        });

        // updating global topic set
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview event method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.eventNodePage.verifyEvent({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.eventCreatePage.returnFromPreviewEventPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.eventNodePage.eventNodeURLCheck();
        await this.eventNodePage.verifyEvent({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    // edit Event method
    async editEvent(options: EditSaveOptions)
    {
        // should be on node page already
        await this.eventNodePage.eventNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using selec topics for site before filling event form
        await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

        // complete event form using edit isolated test data 
        await this.eventEditPage.editEventForm({
            eventTitle: this.testData.Event.titleEdited,
            revisionLogMessage: this.testData.Event.revisionlogEdited,
            globalTopicChoice: this.testData.GlobalTopics.energy,
            topics: this.topicsHelper.getTopics(),
            eventStartDate: this.testData.Event.startDateEdited,
            eventStartTime: this.testData.Event.startTimeEdited,
            eventEndDate: this.testData.Event.endDateEdited,
            eventEndTime: this.testData.Event.endTimeEdited,
            eventRegion: this.testData.Event.regionEdited,
            eventSummary: this.testData.Event.summaryEdited,
            eventDescription: this.testData.Event.descriptionEdited,
            eventHostedBy: this.testData.Event.hostedByEdited,
            eventVenue: this.testData.Event.venueEdited,
            eventRegistrationLink: this.testData.Event.registrationLinkEdited,
            eventLinkText: this.testData.Event.linkTextEdited,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Event.titleEdited;
        this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.energy;

        //Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview event method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.eventNodePage.verifyEditedEvent({
                preview: true,
                topics: this.topicsHelper.getTopics()
            });
            await this.previewPage.clickBackToContentEdittingButton();
            await this.eventEditPage.returnFromPreviewEventPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.eventNodePage.eventNodeURLCheck();
        await this.eventNodePage.verifyEditedEvent({
            preview: false,
            topics: this.topicsHelper.getTopics()
        });
    }

    async deleteEvent(options: DeleteOptions)
    {
        // should be on node page already
        await this.eventNodePage.eventNodeURLCheck();
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
            await this.eventNodePage.eventNodeURLCheck();
        }
    }

}





