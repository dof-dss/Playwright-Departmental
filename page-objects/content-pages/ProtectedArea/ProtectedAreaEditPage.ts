import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { CKEditor } from '@poms/base-pages/CKEditor';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { Topics } from '@poms/base-pages/Topics';

export interface ProtectedAreaEditData
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

export class ProtectedAreaEditPage
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
  }

  async editProtectedAreaPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  async returnFromPreviewProtectedAreaPageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  async editProtectedAreaTitle(protectedAreaTitle: string)
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
    await this.documentField.click();
    await this.documentField.clear();
    await this.documentField.pressSequentially(document);
    await this.page.getByText(document, { exact: false }).first().click();
  }

  async editProtectedAreaForm(data: ProtectedAreaEditData)
  {
    await this.editProtectedAreaPageURLCheck();
    await this.editProtectedAreaTitle(data.protectedAreaTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);
    await this.topics.selectSiteTopics(
      data.topics[0] ?? null,
      data.topics[1] ?? null,
      data.topics[2] ?? null,
      data.topics[3] ?? null,
      true,
    );
    await this.selectProtectedAreaType(data.protectedAreaType);
    await this.selectFeatureType(data.featureType);
    await this.selectCounty(data.county);
    await this.selectCouncil(data.council);
    await this.selectDocument(data.document);
    await this.ckeditor.enterCKEditorBody(data.body);
  }
}
