import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { EventNodePage } from './EventNodePage';

export interface EventSaveData
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

export class EventCreatePage
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

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly globalTopicsFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;
  private readonly eventDatesFieldIsRequired: Locator;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();

    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.topics = new Topics(page, this.testSetUpData, this.testData);
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


    this.titleFieldIsRequired = page.getByText('Title field is required.');
    this.globalTopicsFieldIsRequired = page.getByText('Global topics field is required.');
    this.summaryFieldIsRequired = page.getByText('Summary field is required.');
    this.eventDatesFieldIsRequired = page.locator('#edit-field-event-datetime-0-value--error, #edit-field-event-datetime-0-value-date--error');
  }

  async createEventPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/event"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/event`);
  }

  async returnFromPreviewEventPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/event\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/event\\?uuid`));
  }

  async enterEventTitle(eventTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventTitle}" into the Title field`);
    await this.eventTitleField.fill(eventTitle);
  }

  async enterEventStartDate(eventStartDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventStartDate}" into the Start date field`);
    await this.eventStartDateField.first().fill(eventStartDate);
  }

  async enterEventStartTime(eventStartTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventStartTime}" into the Start time field`);
    await this.eventStartTimeField.fill(eventStartTime);
  }

  async enterEventEndDate(eventEndDate: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventEndDate}" into the End date field`);
    await this.eventEndDateField.fill(eventEndDate);
  }

  async enterEventEndTime(eventEndTime: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventEndTime}" into the End time field`);
    await this.eventEndTimeField.fill(eventEndTime);
  }

  async selectEventRegion(eventRegion: string)
  {
    await this.testSteps.LogInfo(`Selecting "${eventRegion}" from Region dropdown field`);
    await this.eventRegionField.selectOption(eventRegion);
  }

  async enterEventSummary(eventSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventSummary}" into the Summary field`);
    await this.eventSummaryField.fill(eventSummary);
  }

  async enterEventDescription(eventDescription: string)
  {
    await this.ckeditor.enterCKEditorEventDescription(eventDescription);
  }

  async enterEventHostedBy(eventHostedBy: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventHostedBy}" into the Hosted by field`);
    await this.eventHostedByField.fill(eventHostedBy);
  }

  async enterEventVenue(eventVenue: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventVenue}" into the Venue field`);
    await this.eventVenueField.fill(eventVenue);
  }

  async enterEventRegistrationLink(eventRegistrationLink: string)
  {
    await this.page.waitForTimeout(500);
    await this.testSteps.LogInfo(`Entering "${eventRegistrationLink}" into Document and selecting matching item`);
    //await this.documentField.click();
    await this.eventRegistrationLinkField.pressSequentially(eventRegistrationLink);
    //await this.page.locator('ul.ui-autocomplete').getByText(eventRegistrationLink, { exact: false }).click();
    await this.page.getByText(eventRegistrationLink, { exact: false }).first().click();
  
  }

  async enterEventLinkText(eventLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${eventLinkText}" into the Link text field`);
    await this.eventLinkTextField.fill(eventLinkText);
  }

  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.createPages.clickSaveButton();
    await expect(this.titleFieldIsRequired).toBeVisible();
    await expect(this.globalTopicsFieldIsRequired).toBeVisible();
    await expect(this.summaryFieldIsRequired).toBeVisible();
    await expect(this.eventDatesFieldIsRequired.first()).toBeVisible();
  }

  async fillEventForm(data: EventSaveData)
  {
    await this.createEventPageURLCheck();
    await this.enterEventTitle(data.eventTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterEventStartDate(data.eventStartDate);
    await this.enterEventStartTime(data.eventStartTime);
    await this.enterEventEndDate(data.eventEndDate);
    await this.enterEventEndTime(data.eventEndTime);
    await this.topics.selectSiteTopics(
      data.topics[0] ?? null,
      data.topics[1] ?? null,
      data.topics[2] ?? null,
      data.topics[3] ?? null,
    );
    await this.selectEventRegion(data.eventRegion);
    await this.enterEventSummary(data.eventSummary);
    await this.enterEventDescription(data.eventDescription);
    await this.enterEventHostedBy(data.eventHostedBy);
    await this.enterEventVenue(data.eventVenue);
    await this.enterEventRegistrationLink(data.eventRegistrationLink);
    await this.enterEventLinkText(data.eventLinkText);
  }
}
