import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';

export class ProtectedAreaComparePage
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

  async verifyCompareProtectedArea()
  {
    await this.testSteps.LogInfo('Verifying "New" text has been removed from title');
    await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "Edited" text has been added to title');
    await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

    //-------------------- TOPICS --------------------
    if (this.testData.SiteTopics.topic1)
    {
      await this.testSteps.LogInfo(`Verifying "${this.testData.SiteTopics.topic1}" text has been removed from the topics`);
      await expect(this.page.locator(`//div[text()="Topics"]/following-sibling::div//del/a[text()="${this.testData.SiteTopics.topic1}"]`)).toBeVisible();
    }

    if (this.testData.SiteTopics.topic2)
    {
      await this.testSteps.LogInfo(`Verifying "${this.testData.SiteTopics.topic2}" text has been added to the topics`);
      await expect(this.page.locator(`//div[text()="Topics"]/following-sibling::div//ins/a[text()="${this.testData.SiteTopics.topic2}"]`)).toBeVisible();
    }


    //-------------------- COUNTY --------------------
    await this.testSteps.LogInfo(`Verifying old county "${this.testData.ProtectedArea.county}" is shown as removed`);
    await expect(this.page.locator(`//del[contains(normalize-space(), "${this.testData.ProtectedArea.county}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying new county "${this.testData.ProtectedArea.countyEdited}" is shown as added`);
    await expect(this.page.locator(`//ins[contains(normalize-space(), "${this.testData.ProtectedArea.countyEdited}")]`)).toBeVisible();

    //-------------------- COUNCIL --------------------
    await this.testSteps.LogInfo(`Verifying old council "${this.testData.ProtectedArea.council}" is shown as removed`);
    await expect(this.page.locator(`//del[contains(normalize-space(), "${this.testData.ProtectedArea.council}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying new council "${this.testData.ProtectedArea.councilEdited}" is shown as added`);
    await expect(this.page.locator(`//ins[contains(normalize-space(), "${this.testData.ProtectedArea.councilEdited}")]`)).toBeVisible();


    //-------------------- FEATURE TYPE --------------------

    await this.testSteps.LogInfo(`Verifying old feature "${this.testData.ProtectedArea.feature}" is shown as removed`);
    await expect(this.page.locator(`//del[contains(normalize-space(), "${this.testData.ProtectedArea.feature}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying new feature "${this.testData.ProtectedArea.featureEdited}" is shown as added`);
    await expect(this.page.locator(`//ins[contains(normalize-space(), "${this.testData.ProtectedArea.featureEdited}")]`)).toBeVisible();


    //-------------------- PROTECTED AREA TYPE --------------------

    
    await this.testSteps.LogInfo(`Verifying old protected area type "${this.testData.ProtectedArea.type}" is shown as removed`);
    await expect(this.page.locator(`//del[contains(normalize-space(), "${this.testData.ProtectedArea.type}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying new protected area type "${this.testData.ProtectedArea.typeEdited}" is shown as added`);
    await expect(this.page.locator(`//ins[contains(normalize-space(), "${this.testData.ProtectedArea.typeEdited}")]`)).toBeVisible();


    //-------------------- DOCUMENT --------------------
    await this.testSteps.LogInfo(`Verifying old document "${this.testData.ProtectedArea.document}" is shown as removed`);
    await expect(this.page.locator(`//del[contains(normalize-space(), "${this.testData.ProtectedArea.document}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying new document "${this.testData.ProtectedArea.documentEdited}" is shown as added`);
    await expect(this.page.locator(`//ins[contains(normalize-space(), "${this.testData.ProtectedArea.documentEdited}")]`)).toBeVisible();

    //-------------------- BODY --------------------
    await this.testSteps.LogInfo('Verifying "New" text has been removed from the body field');
    await expect(this.page.locator('//del[contains(normalize-space(), "new")]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "Edited" text has been added to body field');
    await expect(this.page.locator('//ins[contains(normalize-space(), "edited")]')).toBeVisible();






  }
}
