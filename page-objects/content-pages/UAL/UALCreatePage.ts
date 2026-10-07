import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { UALNodePage } from './UALNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';


export interface UALSaveData
{
  ualTitle: string;
  revisionLogMessage: string;
  globalTopicChoice: string;
  topics: (string | null)[];
  uALFrom: string;
  age: string;
  prison: string;
  offence: string;
  description: string;
  eyeColour: string;
  hairColour: string;
  distinguishingMarks: string;
  releaseType: string;
}

export class UALCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly topics: Topics;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly ualNodePage: UALNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;


  // locators
  private readonly ualTitleField: Locator;
  private readonly ualFromField: Locator;
  private readonly ualAgeField: Locator;
  private readonly ualPrisonField: Locator;
  private readonly ualOffenceField: Locator;
  private readonly ualDescriptionField: Locator;
  private readonly ualEyeColourField: Locator;
  private readonly ualHairColourField: Locator;
  private readonly ualDistinguishingMarksField: Locator;
  private readonly ualReleaseTypeField: Locator;

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly globalTopicsFieldIsRequired: Locator;
  private readonly topicsFieldIsRequired: Locator;

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
    this.previewPage = new PreviewPage(page);
    this.ualNodePage = new UALNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);


    // locators
    this.ualTitleField = page.locator('#edit-title-0-value');
    this.ualFromField = page.locator('#edit-field-ual-from-0-value-date');
    this.ualAgeField = page.locator('#edit-field-age-0-value');
    this.ualPrisonField = page.locator('#edit-field-prison');
    this.ualOffenceField = page.locator('#edit-field-offence-0-value');
    this.ualDescriptionField = page.locator('#edit-field-description-0-value');
    this.ualEyeColourField = page.locator('#edit-field-eye-colour-0-value');
    this.ualHairColourField = page.locator('#edit-field-hair-colour-0-value');
    this.ualDistinguishingMarksField = page.locator('#edit-field-distinguishing-marks-0-value');
    this.ualReleaseTypeField = page.locator('#edit-field-release-type-0-value');

    // Error messages
    this.titleFieldIsRequired = page.getByText('Title field is required.');
    this.globalTopicsFieldIsRequired = page.getByText('Global topics field is required.');
    this.topicsFieldIsRequired = page.locator('#edit-field-site-topics--errormessage');
  }

  // ------------------------ asserts ------------------------

  // check url on create UAL page
  async createUALPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/ual"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/ual`);
  }

  // check url on return to create UAL page after doing a preview
  async returnFromPreviewUALPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/ual\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/ual\\?uuid`));
  }

  // ------------------------ filling UAL form ------------------------

  // enter UAL title
  async enterUALTitle(ualTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${ualTitle}" into the Title field`);
    await this.ualTitleField.fill(ualTitle);
  }

  // enter UAL from date
  async enterUALFrom(uALFrom: string)
  {
    await this.testSteps.LogInfo(`Entering "${uALFrom}" into the UAL From field`);
    await this.ualFromField.fill(uALFrom);
  }

  // enter UAL age
  async enterUALAge(age: string)
  {
    await this.testSteps.LogInfo(`Entering "${age}" into the Age field`);
    await this.ualAgeField.fill(age);
  }

  // select UAL prison
  async selectUALPrison(prison: string)
  {
    await this.testSteps.LogInfo(`Selecting "${prison}" from the Prison field`);
    await this.ualPrisonField.selectOption(prison);
  }

  // enter UAL offence
  async enterUALOffence(offence: string)
  {
    await this.testSteps.LogInfo(`Entering "${offence}" into the Offence field`);
    await this.ualOffenceField.fill(offence);
  }

  // enter UAL description
  async enterUALDescription(description: string)
  {
    await this.testSteps.LogInfo(`Entering "${description}" into the Description field`);
    await this.ualDescriptionField.fill(description);
  }

  // select UAL eye colour
  async selectUALEyeColour(eyeColour: string)
  {
    await this.testSteps.LogInfo(`Selecting "${eyeColour}" from the Eye Colour field`);
    await this.ualEyeColourField.fill(eyeColour);
  }

  // select UAL hair colour
  async selectUALHairColour(hairColour: string)
  {
    await this.testSteps.LogInfo(`Selecting "${hairColour}" from the Hair Colour field`);
    await this.ualHairColourField.fill(hairColour);
  }

  // enter UAL distinguishing marks
  async enterUALDistinguishingMarks(distinguishingMarks: string)
  {
    await this.testSteps.LogInfo(`Entering "${distinguishingMarks}" into the Distinguishing Marks field`);
    await this.ualDistinguishingMarksField.fill(distinguishingMarks);
  }

  // select UAL release type
  async selectUALReleaseType(releaseType: string)
  {
    await this.testSteps.LogInfo(`Selecting "${releaseType}" from the Release Type field`);
    await this.ualReleaseTypeField.fill(releaseType);
  }

  // ------------------------ actions related to create UAL ------------------------

  // Mandatory Field Check UAL
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
  }

  // fill in UAL form elements
  async fillUALForm(data: UALSaveData)
  {
    await this.createUALPageURLCheck();
    await this.enterUALTitle(data.ualTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.enterUALFrom(data.uALFrom);
    await this.enterUALAge(data.age);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: true,
      edited: false
    });
    await this.selectUALPrison(data.prison);
    await this.enterUALOffence(data.offence);
    await this.enterUALDescription(data.description);
    await this.selectUALEyeColour(data.eyeColour);
    await this.selectUALHairColour(data.hairColour);
    await this.enterUALDistinguishingMarks(data.distinguishingMarks);
    await this.selectUALReleaseType(data.releaseType);
  }
}
