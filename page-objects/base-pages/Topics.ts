import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData } from '../../test-data/TestDataObject';
import { expect } from '@playwright/test';

export class Topics
{
    // logging
    private readonly testSteps: TestSteps;

    // global topics 
    private readonly clickGlobalTopicsField: Locator;
    private readonly enterGlobalTopic: Locator;
    private readonly clickGlobalTopicChoice: Locator;
    // site topics 
    private readonly clickSiteTopicsButton: Locator;
    private readonly clickSiteTopicsSaveButton: Locator;

    // constructor
    constructor(
        private readonly page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        // global topics 
        this.clickGlobalTopicsField = page.locator('//div[@id="edit_field_global_topics_chosen"]/ul[@class="chosen-choices"]');
        this.enterGlobalTopic = page.locator('//div[@id="edit_field_global_topics_chosen"]//input[@class="chosen-search-input default"]');
        this.clickGlobalTopicChoice = page.locator('//div[contains(@id,"edit_field_global_topics_chosen")]//li/em');
        // site topics
        this.clickSiteTopicsButton = page.getByTestId('site-topics-tree-open-button');
        this.clickSiteTopicsSaveButton = page.locator('//button[contains(@class, "form-submit")]');
    }

    // select global topic
    async selectGlobalTopics(globalTopicChoice: string)
    {
        await this.testSteps.LogInfo('Clicking the Global topics field');
        await this.clickGlobalTopicsField.click();
        await this.testSteps.LogInfo(`Entering sequentially "${globalTopicChoice}" into Global topics field`);
        await this.enterGlobalTopic.pressSequentially(globalTopicChoice);
        await this.testSteps.LogInfo('Clicking Global topics chosen item');
        await expect(this.clickGlobalTopicChoice).toBeVisible();
        await this.clickGlobalTopicChoice.click();
    }

    // select global topic
    async selectSiteTopics(topic1: string | null, topic2: string | null, topic3: string | null, topic4: string | null, edittest: boolean = false)
    {
        await this.testSteps.LogInfo('Clicking the Site topics button');
        await expect(this.clickSiteTopicsButton).toBeEnabled();
        await this.clickSiteTopicsButton.click();

        // perform if normal topic is being selected
        //await this.page.waitForTimeout(5000);
        await this.testSteps.LogInfo(`Verifying the Site topic "${topic1}" is visible`);
        await this.page.locator(`//*[text()="${topic1}"]//*[@class="jstree-icon jstree-checkbox"]`).waitFor({ state: 'visible', timeout: 5000 });

        await this.testSteps.LogInfo(`Clicking the Site topic "${topic1}" to assign it`);
        await expect(this.page.locator(`//*[text()="${topic1}"]//*[@class="jstree-icon jstree-checkbox"]`)).toBeEnabled();
        await this.page.locator(`//*[text()="${topic1}"]//*[@class="jstree-icon jstree-checkbox"]`).click();

        if (edittest === true)
        {
            // perform if normal topic is being selected
            //await this.page.waitForTimeout(5000);
            await this.testSteps.LogInfo(`Verifying the Site topic "${topic2}" is visible`);
            await this.page.locator(`//*[text()="${topic2}"]//*[@class="jstree-icon jstree-checkbox"]`).waitFor({ state: 'visible', timeout: 5000 });

            await this.testSteps.LogInfo(`Clicking the Site topic "${topic2}" to assign it`);
            await expect(this.page.locator(`//*[text()="${topic2}"]//*[@class="jstree-icon jstree-checkbox"]`)).toBeEnabled();
            await this.page.locator(`//*[text()="${topic2}"]//*[@class="jstree-icon jstree-checkbox"]`).click();
        }
        else 
        {
            // add logic for adding multiple topics and trigger alert etc
            if (topic2 !== null)
            {
                // perform if normal topic is being selected 
                await this.testSteps.LogInfo(`Clicking the Site topic "${topic2}" to assign it`);
                await this.page.locator(`//*[text()="${topic2}"]//*[@class="jstree-icon jstree-checkbox"]`).click();
            }

            if (topic3 !== null)
            {
                // perform if normal topic is being selected
                await this.testSteps.LogInfo(`Clicking the Site topic "${topic3}" to assign it`);
                await this.page.locator(`//*[text()="${topic3}"]//*[@class="jstree-icon jstree-checkbox"]`).click();
            }

            if (topic4 !== null)
            {
                // listen for alert will be accepted after below click is performed
                this.page.once('dialog', async dialog =>
                {
                    expect(dialog.type()).toBe('alert');
                    await dialog.accept();
                    await this.testSteps.LogInfo('Alert appears and is accepted fourth topic cannot be applied as expected');
                });

                // perform if normal topic is being selected
                await this.testSteps.LogInfo(`Clicking the Site topic "${topic4}" to assign it`);
                await this.page.locator(`//*[text()="${topic4}"]//*[@class="jstree-icon jstree-checkbox"]`).click();

            }
        }

        // clicking save topics button
        await this.testSteps.LogInfo('Clicking site topics save button');
        await expect(this.clickSiteTopicsSaveButton).toBeEnabled();
        await this.clickSiteTopicsSaveButton.click();
    }

    async verifySiteTopicsSelected(parentTopic: string)
    {
        await this.testSteps.LogInfo(`Verifying pre selected Site topic "${parentTopic}" from quickly add is visible`);
        const topicsField = this.page.getByRole('group', { name: 'Topics *' });
        await expect(topicsField.getByText(parentTopic, { exact: true })).toBeVisible();
    }

    async replaceSiteTopic(currentTopic: string, replacementTopic: string)
    {
        await this.testSteps.LogInfo(`Replacing Site topic "${currentTopic}" with "${replacementTopic}" in the Topics tree`);
        await expect(this.clickSiteTopicsButton).toBeEnabled();
        await this.clickSiteTopicsButton.click();

        const currentTopicCheckbox = this.page.locator(`//*[text()="${currentTopic}"]//*[@class="jstree-icon jstree-checkbox"]`).first();
        const replacementTopicCheckbox = this.page.locator(`//*[text()="${replacementTopic}"]//*[@class="jstree-icon jstree-checkbox"]`).first();
        await expect(currentTopicCheckbox).toBeVisible();
        await expect(currentTopicCheckbox).toBeEnabled();
        await currentTopicCheckbox.click();

        await expect(replacementTopicCheckbox).toBeVisible();
        await expect(replacementTopicCheckbox).toBeEnabled();
        await replacementTopicCheckbox.click();

        await expect(this.clickSiteTopicsSaveButton).toBeEnabled();
        await this.clickSiteTopicsSaveButton.click();
    }

}