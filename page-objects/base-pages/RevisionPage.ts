import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';

export class RevisionPage
{
    // logging
    private readonly testSteps: TestSteps;

    // locators
    private readonly compareRevisionsButton: Locator;
    private readonly revertDropDown: Locator;
    private readonly revertRevisionButton: Locator;
    private readonly deleteRevisionButton: Locator;
    private readonly viewContent: Locator;

    // constructor
    constructor(private readonly page: Page)
    {
        // logging isolated instance
        this.testSteps = new TestSteps();

        this.compareRevisionsButton = page.getByRole('button', { name: 'Compare selected revisions' });
        this.revertDropDown = page.locator('//li/button/span[text()="List additional actions"]');
        this.revertRevisionButton = page.locator('//li/button/span[text()="Revert"]');
        this.deleteRevisionButton = page.locator('//a[text()="Revert as Draft"]//parent::li//following-sibling::li/a[text()="Delete"]');
        this.viewContent = page.getByRole('link', { name: 'View' });
    }

    // url check for Revision page
    async revisionPageURLCheck()
    {
        await this.testSteps.LogInfo('Verifying URL contains "/node/.+/revisions"');
        await expect(this.page).toHaveURL(new RegExp('/node/.+/revisions'));
    }

    // Clicking Compare selected revisions button
    async clickCompareRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking Compare revisions button');
        await this.compareRevisionsButton.click();
    }

    // Clicking Delete revisions button
    async clickDeleteRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking revisions table dropdown button');
        await this.revertDropDown.click();
        await this.testSteps.LogInfo('Clicking Delete revisions button');
        await this.deleteRevisionButton.click();
    }

    // Clicking Revert revisions button
    async clickRevertRevisionsButton()
    {
        await this.testSteps.LogInfo('Clicking first Revert revisions button');
        await this.page.getByRole('link', { name: 'Revert', exact: true }).first().click();
    }

    // Clicking Compare selected revisions button
    async clickViewButton()
    {
        await this.testSteps.LogInfo('Clicking View revisions link');
        await this.viewContent.click();
    }

    // Get the count of revisions in the revision table
    async getRevisionCount(): Promise<number>
    {
        await this.testSteps.LogInfo('Getting revision count from revisions table');
        const revisionRows = this.page.locator('table[data-drupal-selector="edit-node-revisions-table"] tbody tr');
        await expect(revisionRows.first()).toBeVisible();
        return revisionRows.count();
    }

    // Go back to the previous page
    async goBack()
    {
        await this.testSteps.LogInfo('Going back to previous page');
        await this.page.goBack();
    }

}