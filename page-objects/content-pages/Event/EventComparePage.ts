import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export class EventComparePage
{
  private readonly testSteps: TestSteps;

  constructor(
    private readonly page: Page,
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    this.testSteps = new TestSteps();
  }

  async eventNodeURLCheck()
  {
    const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/events/${this.testSetUpData.contentTitleforTest.contentTitle}"`);
    await expect(this.page).toHaveURL(
      new RegExp(this.testSetUpData.urlForTest.url + `/events/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}$`)
    );
  }

  async verifyCompareEvent()
  {
    //-------------------- TITLE --------------------
    await this.testSteps.LogInfo('Verifying "New" text has been removed from the title');
    await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/del[text()="New"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "Edited" text has been added to the title');
    await expect(this.page.locator('//a[contains(text(),"Automated Test - ")]/ins[text()="Edited"]')).toBeVisible();

    //-------------------- SUMMARY --------------------
    await this.testSteps.LogInfo('Verifying "new" text has been removed from Summary');
    await expect(this.page.locator('//div[@class="page-summary"]/del[text()="new"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying "edited" text has been added to Summary');
    await expect(this.page.locator('//div[@class="page-summary"]/ins[text()="edited"]')).toBeVisible();

    // //-------------------- HOSTED BY --------------------
    // await this.testSteps.LogInfo('Verifying old hosted by value has been removed from Hosted By field');
    // await expect(this.page.locator('//div[normalize-space()="Hosted by"]/following-sibling::div//del[text()="Department of Justice"]')).toBeVisible();

    // await this.testSteps.LogInfo('Verifying edited hosted by value has been added to Hosted By field');
    // await expect(this.page.locator('//div[normalize-space()="Hosted by"]/following-sibling::div//ins[text()="NICS Events Team"]')).toBeVisible();

    // //-------------------- VENUE --------------------
    // await this.testSteps.LogInfo('Verifying old venue value has been removed from Venue field');
    // await expect(this.page.locator('//div[normalize-space()="Venue"]/following-sibling::div//del[text()="Belfast City Hall"]')).toBeVisible();

    // await this.testSteps.LogInfo('Verifying edited venue value has been added to Venue field');
    // await expect(this.page.locator('//div[normalize-space()="Venue"]/following-sibling::div//ins[text()="Online"]')).toBeVisible();

    //-------------------- REGION --------------------
    await this.testSteps.LogInfo('Verifying old region value has been removed from Region field');
    await expect(this.page.locator('//div[normalize-space()="Region"]/following-sibling::div//del[text()="Belfast"]')).toBeVisible();

    await this.testSteps.LogInfo('Verifying edited region value has been added to Region field');
    await expect(this.page.locator('//div[normalize-space()="Region"]/following-sibling::div//ins[text()="Virtual"]')).toBeVisible();

  //   //-------------------- REGISTRATION LINK --------------------
  //   await this.testSteps.LogInfo('Verifying initial registration link text is in del');
  //   await expect(this.page.locator(`//del/a[text()="${this.testData.Event.linkText}"]`)).toBeVisible();
    
  //   await this.testSteps.LogInfo('Verifying edited registration link text is in ins');
  //   await expect(this.page.locator(`//ins/a[text()="${this.testData.Event.linkTextEdited}"]`)).toBeVisible();
  }
}
