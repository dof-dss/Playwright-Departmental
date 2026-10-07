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

export interface ApplicationEditSaveData
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

export class ApplicationEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly topics: Topics;
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly applicationNodePage: ApplicationNodePage;

  // locators
  private readonly applicationTitleField: Locator;
  private readonly applicationSummaryField: Locator;
  private readonly applicationLinkURLField: Locator;
  private readonly applicationLinkTextField: Locator;

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
  }

  // ------------------------ asserts ------------------------

  // check url on edit application page
  async editApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to create application page after doing a preview 
  async returnFromPreviewApplicationPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling application form ------------------------

  // edit application title 
  async editApplicationTitle(applicationTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationTitle}" into the Title field`);
    await this.applicationTitleField.fill(applicationTitle);
  }

  // edit application summary 
  async editApplicationSummary(applicationSummary: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationSummary}" into the Summary field`);
    await this.applicationSummaryField.fill(applicationSummary);
  }

  // edit application link url (edit will test external link)
  async editApplicationLinkURL(applicationLinkURL: string)
  {
    await this.testSteps.LogInfo(`Entering sequentially "${applicationLinkURL}" into the Link URL field`);
    // search for nearly full link
    await this.applicationLinkURLField.fill(applicationLinkURL);
  }

  // edit application link text 
  async editApplicationLinkText(applicationLinkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${applicationLinkText}" into the Link text field`);
    await this.applicationLinkTextField.fill(applicationLinkText);
  }

  // ------------------------ actions related to edit application  ------------------------

  // fill in application form elements - title summary topics etc
  async editApplicationForm(data: ApplicationEditSaveData)
  {
    await this.editApplicationPageURLCheck();
    await this.editApplicationTitle(data.applicationTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.topics.selectSiteTopics(
      data.topics[0] ?? null,
      data.topics[1] ?? null,
      data.topics[2] ?? null,
      data.topics[3] ?? null,
      true,
    );
    await this.page.locator(`//span[text()="${this.testSetUpData.globalTopicForTest.globalTopic}"]/following-sibling::button`).click();
    await this.topics.selectGlobalTopics(data.globalTopicChoice);
    await this.editApplicationSummary(data.applicationSummary);
    await this.ckeditor.enterCKEditorBeforeYouStart(data.beforeyoustart);
    await this.editApplicationLinkURL(data.applicationLinkURL);
    await this.editApplicationLinkText(data.applicationLinkText);
    await this.ckeditor.enterCKEditorAdditionalInfo(data.additionalinfo);
  }
}