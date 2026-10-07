import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';

export interface VerifyOptions
{
  preview: boolean;
}

export class ProtectedAreaNodePage
{
  private readonly testSteps: TestSteps;

  constructor(
    private readonly page: Page,
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
  }

  async protectedAreaNodeURLCheck()
  {
    const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

    await this.testSteps.LogInfo(`Verifying URL path is /protected-areas/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional suffix, or is /node/.+/latest`);
    await expect(this.page).toHaveURL(
      new RegExp(`(?:${this.testSetUpData.urlForTest.url}/protected-areas/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
    );
  }

  async verifyProtectedArea({ preview }: VerifyOptions)
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.ProtectedArea.title}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.ProtectedArea.title);

    await this.testSteps.LogInfo(`Verifying Protected area type "${this.testData.ProtectedArea.type}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.type, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Feature type "${this.testData.ProtectedArea.feature}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.feature, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying County "${this.testData.ProtectedArea.county}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.county, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Council "${this.testData.ProtectedArea.council}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.council, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Document "${this.testData.ProtectedArea.document}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.document)).toBeVisible();

    if (!preview)
    {
      // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
      // click application link text
      await this.testSteps.LogInfo(`Clicking Link text "${this.testData.ProtectedArea.document}"`);
      await this.page.getByRole('link', { name: this.testData.ProtectedArea.document }).click();
      // verify link by checking title (link url is page title for internal link edit test will be external)
      await this.testSteps.LogInfo(`Verifying title of content on new page "${this.testData.ProtectedArea.document}" is visible`);
      await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.ProtectedArea.document);
      // navigate back to previous page 
      await this.testSteps.LogInfo('Navigating back to previous page');
      await this.page.goBack();
    }
    await this.testSteps.LogInfo(`Verifying Body "${this.testData.ProtectedArea.body}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.body)).toBeVisible();
  }

  async verifyEditedProtectedArea({ preview }: VerifyOptions)
  {
    await this.testSteps.LogInfo(`Verifying edited title "${this.testData.ProtectedArea.titleEdited}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.ProtectedArea.titleEdited);

    await this.testSteps.LogInfo(`Verifying edited Protected area type "${this.testData.ProtectedArea.typeEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.typeEdited, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying edited Feature type "${this.testData.ProtectedArea.featureEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.featureEdited, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying edited County "${this.testData.ProtectedArea.countyEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.countyEdited, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying edited Council "${this.testData.ProtectedArea.councilEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.councilEdited, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying edited Document "${this.testData.ProtectedArea.documentEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.documentEdited)).toBeVisible();

 if (!preview)
    {
      // Only clicking on Link when content has been saved as unable to click to naviagte to it when in preview
      // click application link text
      await this.testSteps.LogInfo(`Clicking Link text "${this.testData.ProtectedArea.documentEdited}"`);
      await this.page.getByRole('link', { name: this.testData.ProtectedArea.documentEdited }).click();
      // verify link by checking title (link url is page title for internal link edit test will be external)
      await this.testSteps.LogInfo(`Verifying title of content on new page "${this.testData.ProtectedArea.documentEdited}" is visible`);
      await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.ProtectedArea.documentEdited);
      // navigate back to previous page 
      await this.testSteps.LogInfo('Navigating back to previous page');
      await this.page.goBack();
    }

    await this.testSteps.LogInfo(`Verifying edited Body "${this.testData.ProtectedArea.bodyEdited}" is visible`);
    await expect(this.page.getByText(this.testData.ProtectedArea.bodyEdited)).toBeVisible();


  }
}
