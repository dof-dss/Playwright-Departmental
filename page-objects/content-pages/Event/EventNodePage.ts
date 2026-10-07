import { Page, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
  preview: boolean;
  topics: (string | null)[];
}

export class EventNodePage
{
  private readonly testSteps: TestSteps;

  private readonly topicLinkXPath = (topicName: string) => `//a[text()="${topicName}"]`;

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

    await this.testSteps.LogInfo(`Verifying URL path is /events/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
    await expect(this.page).toHaveURL(
      new RegExp(`(?:${this.testSetUpData.urlForTest.url}/events/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
    );
  }

  async verifyEvent({ preview, topics }: VerifyOptions)
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.Event.title}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Event.title);

    await this.testSteps.LogInfo(`Verifying Region "${this.testData.Event.region}" is visible`);
    await expect(this.page.getByText(this.testData.Event.region, { exact: true })).toBeVisible();

    // if (topics[0])
    // {
    //   await this.testSteps.LogInfo(`Verifying Site topic "${topics[0]}" is visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[0]!))).toBeVisible();
    // }
    // if (topics[1] !== null)
    // {
    //   await this.testSteps.LogInfo(`Verifying Site topic "${topics[1]}" is visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[1]))).toBeVisible();
    // }
    // if (topics[2] !== null)
    // {
    //   await this.testSteps.LogInfo(`Verifying Site topic "${topics[2]}" is visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[2]))).toBeVisible();
    // }
    // if (topics[3] !== null)
    // {
    //   await this.testSteps.LogInfo(`Verifying Site topic "${topics[3]}" is NOT visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[3]!))).toBeHidden();
    // }

    // await this.testSteps.LogInfo(`Verifying Event start date and time "${this.testData.Event.verifyStartDateAndTime} - ${this.testData.Event.verifyEndDateAndTime}" is visible`);
    // await expect(this.page.locator(`//p[text()[normalize-space(.)="${this.testData.Event.verifyStartDateAndTime} — ${this.testData.Event.verifyEndDateAndTime}"]]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Venue "${this.testData.Event.venue}" is visible`);
    await expect(this.page.getByText(this.testData.Event.venue)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Event.summary}" is visible`);
    await expect(this.page.getByText(this.testData.Event.summary)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Description "${this.testData.Event.description}" is visible`);
    await expect(this.page.getByText(this.testData.Event.description)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Hosted by "${this.testData.Event.hostedBy}" is visible`);
    await expect(this.page.locator(`//h2[normalize-space(.)="Hosted by"]/parent::*[contains(normalize-space(.), "${this.testData.Event.hostedBy}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Registration Link text "${this.testData.Event.linkText}" is visible`);
    await expect(this.page.getByRole('link', { name: this.testData.Event.linkText })).toBeVisible();

    if (!preview)
    {
      const pagePromise = this.page.context().waitForEvent('page');
      await this.page.getByRole('link', { name: this.testData.Event.linkText }).click();

      // Wait for the new page object to be ready
      const newTab = await pagePromise;

      // verify link by checking url of new page 
      await this.testSteps.LogInfo(`Verifying title of content on new tab "${this.testData.Event.registrationLink}" is visible`);
      await expect(newTab.locator(`//h1[normalize-space(.)="${this.testData.Event.registrationLink}"]`)).toBeVisible();

      // close new tab
      await this.testSteps.LogInfo('Navigating back to previous page');
      await newTab.close();
    }
  }

  async verifyEditedEvent({ preview, topics }: VerifyOptions)
  {
    await this.testSteps.LogInfo(`Verifying title "${this.testData.Event.titleEdited}" is visible`);
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.Event.titleEdited);

    // if (topics[1])
    // {
    //   await this.testSteps.LogInfo(`Verifying Edited Site topic "${topics[1]}" is visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[1]))).toBeVisible();
    // }
    // if (topics[0])
    // {
    //   await this.testSteps.LogInfo(`Verifying Edited Site topic "${topics[0]}" is NOT visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[0]))).toBeHidden();
    // }
    // if (topics[2])
    // {
    //   await this.testSteps.LogInfo(`Verifying Edited Site topic "${topics[2]}" is NOT visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[2]))).toBeHidden();
    // }
    // if (topics[3])
    // {
    //   await this.testSteps.LogInfo(`Verifying Edited Site topic "${topics[3]}" is NOT visible`);
    //   await expect(this.page.locator(this.topicLinkXPath(topics[3]))).toBeHidden();
    // }

    await this.testSteps.LogInfo(`Verifying Region "${this.testData.Event.regionEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Event.regionEdited, { exact: true })).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Venue "${this.testData.Event.venueEdited}" is hidden as event has passed`);
    await expect(this.page.getByText(this.testData.Event.venueEdited)).toBeHidden();
    await this.testSteps.LogInfo(`Verifying message "This event has now passed." is visible`);
    await expect(this.page.getByText("This event has now passed.")).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Summary "${this.testData.Event.summaryEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Event.summaryEdited)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Description "${this.testData.Event.descriptionEdited}" is visible`);
    await expect(this.page.getByText(this.testData.Event.descriptionEdited)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Hosted by "${this.testData.Event.hostedByEdited}" is visible`);
    await expect(this.page.locator(`//h2[normalize-space(.)="Hosted by"]/parent::*[contains(normalize-space(.), "${this.testData.Event.hostedByEdited}")]`)).toBeVisible();

    await this.testSteps.LogInfo(`Verifying Registration Link text "${this.testData.Event.linkTextEdited}" is visible`);
    await expect(this.page.getByRole('link', { name: this.testData.Event.linkTextEdited })).toBeVisible();

    if (!preview)
    {
      const pagePromise = this.page.context().waitForEvent('page');
      await this.page.getByRole('link', { name: this.testData.Event.linkTextEdited }).click();
      const newTab = await pagePromise;
      await this.testSteps.LogInfo(`Verifying registration URL "${this.testData.Event.registrationLinkEdited}"`);
      await expect(newTab).toHaveURL(this.testData.Event.registrationLinkEdited);
      await newTab.close();
    }
  }
}
