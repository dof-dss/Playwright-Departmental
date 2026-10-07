import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { ApplicationNodePage } from './ApplicationNodePage';

export interface ApplicationSaveData
{
  applicationTitle: string;
  revisionLogMessage: string;
  globalTopicChoice: string;
  topics: (string | null)[];
  applicationSummary: string;
  beforeyoustart: string;
  applicationLinkURL: string;
  applicationLinkText: string;
  additionalinfo: string;
}

export class ApplicationCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly topics: Topics;
  private readonly ckeditor: CKEditor;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly applicationNodePage: ApplicationNodePage;

  // locators
  private readonly applicationTitleField: Locator;
  private readonly applicationSummaryField: Locator;
  private readonly applicationLinkURLField: Locator;
  private readonly applicationLinkTextField: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly globalTopicsFieldIsRequired: Locator;
  private readonly topicsFieldIsRequired: Locator;
  private readonly summaryFieldIsRequired: Locator;

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
    this.applicationNodePage = new ApplicationNodePage(page, this.testSetUpData, this.testData);

    // locators
    this.applicationTitleField = page.locator('#edit-title-0-value');
    this.applicationSummaryField = page.locator('#edit-field-summary-0-value');
    this.applicationLinkURLField = page.locator('#edit-field-link-0-uri');
    this.applicationLinkTextField = page.locator('#edit-field-link-0-title');

    // Error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.globalTopicsFieldIsRequired = page.getByText("Global topics field is required.");
    this.topicsFieldIsRequired = page.locator("#edit-field-site-topics--errormessage");
    this.summaryFieldIsRequired = page.getByText("Summary field is required.");
  }

  // ------------------------ asserts ------------------------

  // check url on create application page
  async createApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL contains "${this.testSetUpData.urlForTest.url}/node/add/application"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/application(?:\\?.*)?$`));
  }

  // check url on return to create application page after doing a preview 
  async returnFromPreviewApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/application\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/application\\?uuid`));
  }


  // ------------------------ filling application form ------------------------

  // enter application title 
  async enterApplicationTitle(applicationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationTitle}" into the Title field`);
    await this.applicationTitleField.fill(applicationTitle);
  }

  // enter application summary 
  async enterApplicationSummary(applicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationSummary}" into the Summary field`);
    await this.applicationSummaryField.fill(applicationSummary);
  }

  // enter application link url (internal link - edit will test external link)
  async enterApplicationLinkURL(applicationLinkURL: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationLinkURL}" into the URL field and selecting matching item`);
    await this.applicationLinkURLField.pressSequentially(applicationLinkURL);
    await this.page.locator('ul.ui-autocomplete').getByText(applicationLinkURL, { exact: false }).click();
  }

  // enter application link text 
  async enterApplicationLinkText(applicationLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationLinkText}" into the Link text field`);
    await this.applicationLinkTextField.fill(applicationLinkText);
  }

  // ------------------------ actions related to create application  ------------------------

  // Mandatory Field Check application
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Topics field error message appears');
    await expect(this.globalTopicsFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Global topics field error message appears');
    await expect(this.topicsFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Summary field error message appears');
    await expect(this.summaryFieldIsRequired).toBeVisible();
  }

  // fill in application form elements - title summary topics etc
  async fillApplicationForm(data: ApplicationSaveData, topicsAlreadySelected = false)
  {
    await this.createApplicationPageURLCheck();
    await this.enterApplicationTitle(data.applicationTitle);
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
    await this.topics.selectGlobalTopics(data.globalTopicChoice);
    await this.enterApplicationSummary(data.applicationSummary);
    await this.ckeditor.enterCKEditorBeforeYouStart(data.beforeyoustart);
    await this.enterApplicationLinkURL(data.applicationLinkURL);
    await this.enterApplicationLinkText(data.applicationLinkText);
    await this.ckeditor.enterCKEditorAdditionalInfo(data.additionalinfo);
  }
}