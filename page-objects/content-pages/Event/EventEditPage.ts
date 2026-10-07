import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { EventNodePage } from './EventNodePage';

export interface EventEditSaveData
{
  eventTitle: string;
  revisionLogMessage: string;
  globalTopicChoice: string;
  topics: (string | null)[];
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  eventRegion: string;
  eventSummary: string;
  eventDescription: string;
  eventHostedBy: string;
  eventVenue: string;
  eventRegistrationLink: string;
  eventLinkText: string;
}

export class EventEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly topics: Topics;
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly eventNodePage: EventNodePage;

  // locators
  private readonly eventTitleField: Locator;
  private readonly eventStartDateField: Locator;
  private readonly eventStartTimeField: Locator;
  private readonly eventEndDateField: Locator;
  private readonly eventEndTimeField: Locator;
  private readonly eventRegionField: Locator;
  private readonly eventSummaryField: Locator;
  private readonly eventHostedByField: Locator;
  private readonly eventVenueField: Locator;
  private readonly eventRegistrationLinkField: Locator;
  private readonly eventLinkTextField: Locator;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();

    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.topics = new Topics(page, this.testSetUpData, testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, this.testData);
    this.previewPage = new PreviewPage(page);
    this.eventNodePage = new EventNodePage(page, this.testSetUpData, this.testData);

    this.eventTitleField = page.locator('#edit-title-0-value');
    this.eventStartDateField = page.locator('#edit-field-event-datetime-0-value-date');
    this.eventStartTimeField = page.locator('#edit-field-event-datetime-0-value-time');
    this.eventEndDateField = page.locator('#edit-field-event-datetime-0-end-value-date');
    this.eventEndTimeField = page.locator('#edit-field-event-datetime-0-end-value-time');
    this.eventRegionField = page.locator('#edit-field-council');
    this.eventSummaryField = page.locator('#edit-field-summary-0-value');
    this.eventHostedByField = page.locator('#edit-field-event-host-0-value');
    this.eventVenueField = page.locator('#edit-field-venue-0-value');
    this.eventRegistrationLinkField = page.locator('#edit-field-registration-link-0-uri');
    this.eventLinkTextField = page.locator('#edit-field-registration-link-0-title');
  }

  async editEventPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  async returnFromPreviewEventPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  async editEventTitle(eventTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventTitle}" into the Title field`);
    await this.eventTitleField.fill(eventTitle);
  }

  async editEventStartDate(eventStartDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventStartDate}" into the Start date field`);
    await this.eventStartDateField.first().fill(eventStartDate);
  }

  async editEventStartTime(eventStartTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventStartTime}" into the Start time field`);
    await this.eventStartTimeField.fill(eventStartTime);
  }

  async editEventEndDate(eventEndDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventEndDate}" into the End date field`);
    await this.eventEndDateField.fill(eventEndDate);
  }

  async editEventEndTime(eventEndTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventEndTime}" into the End time field`);
    await this.eventEndTimeField.fill(eventEndTime);
  }

  async selectEventRegion(eventRegion: string)
  {
    await this.testSteps.LogInfo(`Selecting "${eventRegion}" from Region dropdown field`);
    await this.eventRegionField.selectOption(eventRegion);
  }

  async editEventSummary(eventSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventSummary}" into the Summary field`);
    await this.eventSummaryField.fill(eventSummary);
  }

  async editEventDescription(eventDescription: string)
  {
    await this.ckeditor.enterCKEditorEventDescription(eventDescription);
  }

  async editEventHostedBy(eventHostedBy: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventHostedBy}" into the Hosted by field`);
    await this.eventHostedByField.fill(eventHostedBy);
  }

  async editEventVenue(eventVenue: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventVenue}" into the Venue field`);
    await this.eventVenueField.fill(eventVenue);
  }

  async editEventRegistrationLink(eventRegistrationLink: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventRegistrationLink}" into the Registration link field`);
    await this.eventRegistrationLinkField.fill(eventRegistrationLink);
  }

  async editEventLinkText(eventLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventLinkText}" into the Link text field`);
    await this.eventLinkTextField.fill(eventLinkText);
  }

  async editEventForm(data: EventEditSaveData)
  {
    await this.editEventPageURLCheck();
    await this.editEventTitle(data.eventTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.topics.selectSiteTopics(
      data.topics[0] ?? null,
      data.topics[1] ?? null,
      data.topics[2] ?? null,
      data.topics[3] ?? null,
    );
    await this.editEventStartDate(data.eventStartDate);
    await this.editEventStartTime(data.eventStartTime);
    await this.editEventEndDate(data.eventEndDate);
    await this.editEventEndTime(data.eventEndTime);
    await this.selectEventRegion(data.eventRegion);
    await this.editEventSummary(data.eventSummary);
    await this.editEventDescription(data.eventDescription);
    await this.editEventHostedBy(data.eventHostedBy);
    await this.editEventVenue(data.eventVenue);
    await this.editEventRegistrationLink(data.eventRegistrationLink);
    await this.editEventLinkText(data.eventLinkText);
  }
}
