import { Page, Locator, expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';


export class DeletePage
{
  // logging
  private readonly testSteps: TestSteps;

  // locators
  private readonly deleteButton: Locator;
  private readonly cancelButton: Locator;
  private readonly childContentWarningMessage: Locator;
  private readonly viewContentReferencingContentButton: Locator;

  // constructor
  constructor(
    private readonly page: Page,
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // locators
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
    this.childContentWarningMessage = page.locator('p.messages--warning[data-drupal-selector="edit-description"]').filter({
      hasText: /3 content items use this (?:sub[- ]?)?topic in their Site topics field\. Deleting this (?:sub[- ]?)?topic will remove it from those content items\./i
    });
    this.viewContentReferencingContentButton = page.getByRole('link', { name: /View content referencing this (?:sub[- ]?)?topic\./i });
  }

  // ------------------------ asserts ------------------------

  // check url on delete application page
  async deleteNodePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "node/.+/delete"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/delete'));
  }

  // check for verification of delete message
  async deleteNodeCofirmationCheck()
  {
    await this.testSteps.LogInfo('Verifying delete confirmation messages is visible');
    await expect(this.page.locator('.messages__item')).toContainText('has been deleted.');
  }


  // Click delete button on Delete Page
  async clickDelete()
  {
    await this.testSteps.LogInfo('Clicking on "Delete" Button');
    await expect(this.deleteButton).toBeVisible();
    // timeout added to ensure the delete button is clicked even if it takes longer to appear (mainly due to topics and subtopic delete action when child content is present)
    await this.deleteButton.click({ timeout: 15000 });
  }
  // Click cancel on Delete Page
  async clickCancel()
  {
    await this.testSteps.LogInfo('Clicking on "Cancel" Button');
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }

  async verifyDeleteContentWarning()
  {
    await this.testSteps.LogInfo('Verifying "Child Content warning" message on Delete page');
    await expect(this.childContentWarningMessage).toBeVisible();
  }

  async clickDeleteContentWarning()
  {
    await this.testSteps.LogInfo('Opening content referencing the deleted content');
    await expect(this.viewContentReferencingContentButton).toBeVisible();
    await this.viewContentReferencingContentButton.click();
  }

}