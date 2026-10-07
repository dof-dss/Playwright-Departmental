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

export interface UALEditSaveData
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

export class UALEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly topics: Topics;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly ualNodePage: UALNodePage;
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
  }

  // ------------------------ asserts ------------------------

  // check url on edit UAL page
  async editUALPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to edit UAL page after doing a preview
  async returnFromPreviewUALPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling UAL form ------------------------

  // edit UAL title
  async editUALTitle(ualTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${ualTitle}" into the Title field`);
    await this.ualTitleField.fill(ualTitle);
  }

  // edit UAL from date
  async editUALFrom(uALFrom: string)
  {
    await this.testSteps.LogInfo(`Entering "${uALFrom}" into the UAL From field`);
    await this.ualFromField.fill(uALFrom);
  }

  // edit UAL age
  async editUALAge(age: string)
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

  // edit UAL offence
  async editUALOffence(offence: string)
  {
    await this.testSteps.LogInfo(`Entering "${offence}" into the Offence field`);
    await this.ualOffenceField.fill(offence);
  }

  // edit UAL description
  async editUALDescription(description: string)
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

  // edit UAL distinguishing marks
  async editUALDistinguishingMarks(distinguishingMarks: string)
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

  // ------------------------ actions related to edit UAL ------------------------

  // fill in UAL edit form elements
  async editUALForm(data: UALEditSaveData)
  {
    await this.editUALPageURLCheck();
    await this.editUALTitle(data.ualTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.editUALFrom(data.uALFrom);
    await this.editUALAge(data.age);
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();
    await this.page.waitForTimeout(1000);
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: false,
      edited: true
    });
    await this.selectUALPrison(data.prison);
    await this.editUALOffence(data.offence);
    await this.editUALDescription(data.description);
    await this.selectUALEyeColour(data.eyeColour);
    await this.selectUALHairColour(data.hairColour);
    await this.editUALDistinguishingMarks(data.distinguishingMarks);
    await this.selectUALReleaseType(data.releaseType);
  }
}
