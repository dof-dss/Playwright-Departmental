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

    async replaceGlobalTopic(globalTopicChoice: string)
    {
        await this.testSteps.LogInfo(`Clicking the button for existing Global topic "${this.testSetUpData.globalTopicForTest.globalTopic}"`);
        await this.page.locator(`//span[text()="${this.testSetUpData.globalTopicForTest.globalTopic}"]/following-sibling::button`).click();
        await this.selectGlobalTopics(globalTopicChoice);
    }

    // select global topic
    async selectSiteTopics(topic1: string | null, topic2: string | null, topic3: string | null, topic4: string | null, edittest: boolean = false, parentTopic?: string)
    {
        await this.testSteps.LogInfo('Clicking the Site topics button');
        await expect(this.clickSiteTopicsButton).toBeEnabled();
        await this.clickSiteTopicsButton.click();

        if (parentTopic !== undefined)
        {
            if (!topic1)
            {
                throw new Error('A subtopic title is required when selecting a subtopic under a parent topic');
            }
            const subtopicCheckbox = await this.getSubtopicCheckbox(parentTopic, topic1);
            await this.testSteps.LogInfo(`Clicking the Site subtopic "${topic1}" to assign it`);
            await expect(subtopicCheckbox).toBeVisible();
            await expect(subtopicCheckbox).toBeEnabled();
            await subtopicCheckbox.click();
        }
        else
        {
            await this.testSteps.LogInfo(`Verifying the Site topic "${topic1}" is visible`);
            const topicCheckbox = this.page.locator(`//*[text()="${topic1}"]//*[@class="jstree-icon jstree-checkbox"]`);
            await topicCheckbox.waitFor({ state: 'visible', timeout: 5000 });
            await this.testSteps.LogInfo(`Clicking the Site topic "${topic1}" to assign it`);
            await expect(topicCheckbox).toBeEnabled();
            await topicCheckbox.click();
        }

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

    async verifySecondParentTopicSelectionIsBlocked(firstParentTopic: string, secondParentTopic: string)
    {
        const dialog = this.page.getByRole('dialog', { name: 'Select Topics' });
        const getTopicCheckbox = (topicTitle: string) => dialog.getByText(topicTitle, { exact: true })
            .locator('xpath=ancestor-or-self::a[contains(concat(" ", normalize-space(@class), " "), " jstree-anchor ")]')
            .locator('i.jstree-checkbox');
        const firstParentCheckbox = getTopicCheckbox(firstParentTopic);
        const secondParentCheckbox = getTopicCheckbox(secondParentTopic);

        await this.testSteps.LogInfo('Opening the Site Topics selector');
        await expect(this.clickSiteTopicsButton).toBeEnabled();
        await this.clickSiteTopicsButton.click();
        await expect(dialog).toBeVisible();

        await this.testSteps.LogInfo(`Selecting the first parent topic "${firstParentTopic}"`);
        await expect(firstParentCheckbox).toBeVisible();
        await firstParentCheckbox.click();

        await this.testSteps.LogInfo(`Attempting to select a second parent topic "${secondParentTopic}"`);
        let selectionLimitAlertDisplayed = false;
        this.page.once('dialog', async dialog =>
        {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('Topic selection limit reached.');
            await dialog.accept();
            selectionLimitAlertDisplayed = true;
            await this.testSteps.LogInfo('Topic selection limit alert appears and is accepted');
        });
        await secondParentCheckbox.click();
        expect(selectionLimitAlertDisplayed).toBe(true);

        await this.testSteps.LogInfo('Verifying only one parent topic remains selected');
        await expect(dialog.getByText('Selected: 1 of 1 topics', { exact: true })).toBeVisible();
    }

    private async getSubtopicCheckbox(parentTopic: string, subtopic: string): Promise<Locator>
    {
        const dialog = this.page.getByRole('dialog', { name: 'Select Topics' });
        const parentItem = dialog.getByText(parentTopic, { exact: true })
            .locator('xpath=ancestor-or-self::a[contains(concat(" ", normalize-space(@class), " "), " jstree-anchor ")]/parent::li');
        await this.testSteps.LogInfo(`Expanding parent Site topic "${parentTopic}"`);
        await expect(parentItem).toHaveClass(/jstree-(closed|open)/);
        if ((await parentItem.getAttribute('class'))?.includes('jstree-closed'))
        {
            await parentItem.locator(':scope > i.jstree-ocl').click();
        }

        return parentItem.locator(':scope > ul > li').getByText(subtopic, { exact: true })
            .locator('xpath=ancestor-or-self::a[contains(concat(" ", normalize-space(@class), " "), " jstree-anchor ")]')
            .locator('i.jstree-checkbox');
    }

    async replaceSiteTopic(currentTopic: string, replacementTopic: string, parentTopic?: string)
    {
        await this.testSteps.LogInfo(`Replacing Site topic "${currentTopic}" with "${replacementTopic}" in the Topics tree`);
        await expect(this.clickSiteTopicsButton).toBeEnabled();
        await this.clickSiteTopicsButton.click();

        const currentTopicCheckbox = parentTopic === undefined
            ? this.page.locator(`//*[text()="${currentTopic}"]//*[@class="jstree-icon jstree-checkbox"]`).first()
            : await this.getSubtopicCheckbox(parentTopic, currentTopic);
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