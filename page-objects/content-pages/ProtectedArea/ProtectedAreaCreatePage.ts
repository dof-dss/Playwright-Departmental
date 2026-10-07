import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '@poms/base-pages/CKEditor';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { Topics } from '@poms/base-pages/Topics';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';

export interface ProtectedAreaSaveData
{
  protectedAreaTitle: string;
  revisionLogMessage: string;
  topics: (string | null)[];
  protectedAreaType: string;
  featureType: string;
  county: string;
  council: string;
  document: string;
  body: string;
}

export class ProtectedAreaCreatePage
{
  private readonly testSteps: TestSteps;
  private readonly ckeditor: CKEditor;
  private readonly createPages: CreatePages;
  private readonly topics: Topics;

  private readonly protectedAreaTitleField: Locator;
  private readonly protectedAreaTypeSelect: Locator;
  private readonly featureTypeSelect: Locator;
  private readonly countySelect: Locator;
  private readonly councilSelect: Locator;
  private readonly documentField: Locator;

  private readonly titleFieldIsRequired: Locator;

  constructor(
    private readonly page: Page,
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
    this.topics = new Topics(page, this.testSetUpData, this.testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, this.testData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);

    // Prefer ARIA labels from recorded flow in test-2.spec.ts.
    this.protectedAreaTitleField = page.getByRole('textbox', { name: 'Title *' });
    this.protectedAreaTypeSelect = page.getByLabel('Protected area type');
    this.featureTypeSelect = page.getByLabel('Feature type');
    this.countySelect = page.getByLabel('County', { exact: true });
    this.councilSelect = page.getByLabel('Council');
    this.documentField = page.getByRole('textbox', { name: 'Document' });

    this.titleFieldIsRequired = page.getByText('Title field is required.');
  }

  async createProtectedAreaPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/protected_area"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/protected_area`);
  }

  async returnFromPreviewProtectedAreaPageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/protected_area\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/protected_area\\?uuid`));
  }

  async enterProtectedAreaTitle(protectedAreaTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${protectedAreaTitle}" into the Title field`);
    await this.protectedAreaTitleField.fill(protectedAreaTitle);
  }

  async selectProtectedAreaType(protectedAreaType: string)
  {
    await this.testSteps.LogInfo(`Selecting "${protectedAreaType}" from Protected area type`);
    await this.protectedAreaTypeSelect.selectOption({ label: protectedAreaType });
  }

  async selectFeatureType(featureType: string)
  {
    await this.testSteps.LogInfo(`Selecting "${featureType}" from Feature type`);
    await this.featureTypeSelect.selectOption({ label: featureType });
  }

  async selectCounty(county: string)
  {
    await this.testSteps.LogInfo(`Selecting "${county}" from County`);
    await this.countySelect.selectOption({ label: county });
  }

  async selectCouncil(council: string)
  {
    await this.testSteps.LogInfo(`Selecting "${council}" from Council`);
    await this.councilSelect.selectOption({ label: council });
  }

  async selectDocument(document: string)
  {
    await this.page.waitForTimeout(500);
    await this.testSteps.LogInfo(`Entering "${document}" into Document and selecting matching item`);
    await this.page.waitForTimeout(500);
    await this.documentField.pressSequentially(document);
    await (expect(this.page.getByText(document, { exact: false })).toBeVisible());
    await this.page.getByText(document, { exact: false }).first().click();
  }

  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.createPages.clickSaveButton();
    await expect(this.titleFieldIsRequired).toBeVisible();
  }

  async fillProtectedAreaForm(data: ProtectedAreaSaveData)
  {
    await this.createProtectedAreaPageURLCheck();
    await this.enterProtectedAreaTitle(data.protectedAreaTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.topics.selectSiteTopics(
      data.topics[0] ?? null,
      data.topics[1] ?? null,
      data.topics[2] ?? null,
      data.topics[3] ?? null,
    );
    await this.selectProtectedAreaType(data.protectedAreaType);
    await this.selectFeatureType(data.featureType);
    await this.selectCounty(data.county);
    await this.selectCouncil(data.council);
    await this.selectDocument(data.document);
    await this.ckeditor.enterCKEditorBody(data.body);
  }
}
