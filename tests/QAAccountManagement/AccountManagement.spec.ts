import { expect } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { LoginPage } from '@poms/base-pages/LoginPage';
import { test } from '@fixtures/MyFixtures';

test.describe('QA Account Management Configuration', () =>
{
    // Pass the fixture for Publication Authors into the beforeEach hook
    test.beforeEach(async ({ }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Configuration starting');
        await testSteps.LogInfo(testInfo.title);
    });

    test('Enable QA Accounts', { tag: "@EnableQAAccounts" },
        async ({ page, testSetUpData }) =>
        {
            const testSteps = new TestSteps();
            const loginPage = new LoginPage(page, testSetUpData);
            const username = testSetUpData.validUserList.supervisor_username;
            const password = testSetUpData.validUserList.supervisor_password;

            // Navigate using isolated test data URL
            await testSteps.LogInfo(`Enabling QA Accounts`);
            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await testSteps.LogInfo(`Waiting for 5 seconds`);
            await page.waitForTimeout(5000);

            await testSteps.LogInfo(`Performing URL check to ensure user is on ${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/{TOKEN}`);
            await expect(page).toHaveURL(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/enable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);
        });

    test('Disable QA Accounts', { tag: "@DisableQAAccounts" },
        async ({ page, testSetUpData }) =>
        {
            const testSteps = new TestSteps();
            const loginPage = new LoginPage(page, testSetUpData);
            const username = testSetUpData.validUserList.supervisor_username;
            const password = testSetUpData.validUserList.supervisor_password;

            // Navigate using isolated test data URL
            await testSteps.LogInfo(`Disabling QA Accounts`);
            await page.goto(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);

            await testSteps.LogInfo(`Waiting for 5 seconds`);
            await page.waitForTimeout(5000);

            await testSteps.LogInfo(`Performing URL check to ensure user is on ${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/{TOKEN}`);
            await expect(page).toHaveURL(`${testSetUpData.qaAccounts.finance_url_ddev}/origins-qa/api/users/disable/${testSetUpData.qaAccounts.qaAccountManagementToken}`);
        });
});