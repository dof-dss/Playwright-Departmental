import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { BasePage } from '@poms/base-pages/BasePage';

test.describe('Secure Publication Stats Author Tests', { tag: ['@securePublication', '@regression', '@statsAuthor'] }, () =>
{
  // Pass the fixture for Secure Publication stats Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
    testSetUpData.contentTitleforTest.contentTitle = testData.SecurePublication.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('Secure-Publication-Auth-TC01 - Create - Create secure Publication content as an "Stats Author", perform mandatory field check and preview content', { tag: '@create' },
    async ({ loginHelper, publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // searching as anon to ensure content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // moderating to needs review 
      await contentModerationHelper.statsAuthorModerateContent({
        NeedsReview: true,
      });

      // searching as anon to ensure content is not viewable as needs review 
      await anonymousHelper.searchAsAnon({ edited: false });

    });

  test('Secure-Publication-Auth-TC02 - Create - Create secure Publication content as an "Stats Author", ensure stats author alt cannot view secure publication content created by other user', { tag: '@create' },
    async ({ loginHelper, publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, basePage, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // log out to check stats author alt cannot view secure publication content while logged in and in unpubllished state
      await basePage.logOut();

      // over ride test data to login as alt author 
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_alt_username;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: false,
        securePublicationSecure: true
      });

      // log out 
      await basePage.logOut();

      // over ride test data to login as Stats author 
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // navigatre back to content
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false,
        securePublicationSecure: false
      });

      // moderating to needs review 
      await contentModerationHelper.statsAuthorModerateContent({
        NeedsReview: true,
      });

      // log out to check stats author alt cannot view secure publication content while logged in and in unpubllished state
      await basePage.logOut();

      // over ride test data to login as alt author 
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_alt_username;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: false,
        securePublicationSecure: true
      });

    });

  test('Secure-Publication-Auth-TC03 - Create - Create Publication content as an "Stats Author", Publish as Stats Supervisor, search as anon and verify stats author alt can access', { tag: '@create' },
    async ({ loginHelper, publicationHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, basePage, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      await basePage.logOut();

      // over ride test data to login as alt author 
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false,
        securePublicationSecure: false
      });

      // moderating to published
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        Draft: false,
        NeedsReview: false,
        Published: true,
        Archive: false,
      });

      // searching as anon to ensure content is not viewable as needs review 
      await anonymousHelper.searchAsAnon({ edited: false });

      // over ride test data to login as alt author 
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_alt_username;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // navigatre back to content
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false,
        securePublicationSecure: false
      });

    });

  test('Secure-Publication-Auth-TC04 - Edit - Edit Publication as an "Stats Author" and ensure it is not published', { tag: '@edit' },
    async ({ publicationHelper, anonymousHelper, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: true
      });

      // searching as anon to ensure edited content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: true });

    });

  test('Secure-Publication-Auth-TC05 - Delete - Delete Secure Publication as an "Stats Author"', { tag: '@delete' },
    async ({ publicationHelper, navigateToCreatedContentHelper, anonymousHelper, loginHelper, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // Cancel delete publication
      await publicationHelper.deleteSecurePublication({
        delete: false,
        cancel: true
      });

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete publication
      await publicationHelper.deleteSecurePublication({
        delete: true,
        cancel: false
      });

      // confirm content deleted
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });

    });

  test('Secure-Publication-Auth-TC06 - Delete - Cannot delete Secure Publication created by "Stats Supervisor" as an "Stats Author"', { tag: '@delete' },
    async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
    {
      const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

      // Logging out as Before each will log in as an Author.  
      await basePage.logOut();

      // Overriding user for test data with supervisor credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;
      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // Creating Publication as a Supervisor
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // moderating to Published
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // searching as anon to ensure content is viewable when published
      await anonymousHelper.searchAsAnon({ edited: false });

      // Overriding user for test data with Author credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // Navigating to Supervisors created content 
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      await permissionCheck.openModerationSideBar();
      await permissionCheck.deleteButtonNotVisible();

      // searching as anon to ensure content is viewable as Author has not been able to delete 
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('Secure-Publication-Auth-TC07 - Compare Revision - Edit secure Publication content and ensure user is able to compare Revisions ', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // comparing and verifying Revisions
      await revisionHelper.compareRevisions();
    });

  test('Secure-Publication-Auth-TC08 - Delete Revision - Edit Secure Publication content and ensure user is able to Delete Revisions', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // Cancel Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: false,
        cancel: true
      });

      // Comfirm Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: true,
        cancel: false
      });
    });

  test('Secure-Publication-Auth-TC09 - Revert Revision - Edit Secure Publication content and ensure user is able to Revert Revisions', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content 
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // Cancel Reverting of Revision and verify edited version is still visible
      await revisionHelper.revertRevisions({
        revert: false,
        cancel: true
      });

      // Comfirm reverting of Revision and verify inital version is now visible 
      await revisionHelper.revertRevisions({
        revert: true,
        cancel: false
      });
    });

  test('Secure-Publication-Auth-TC10 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' }, async ({ publicationHelper, topicsTreeHelper, testSetUpData }) =>
  {
    //Overriding to trigger alert - trying to add 4 but maximum is 3
    await topicsTreeHelper.selectTopicForSite({
      edit: false,
      triggeralert: true,
    });

    // creating content
    await publicationHelper.createSecurePublication({
      preview: false,
      mandatoryFieldCheck: false,
    });
  });

  test('Secure-Publication-Auth-TC11 - Workbench -  Create Secure Publication content as an "Stats Author", and use Workbench to complete all moderation states available', { tag: '@workbench' }, async ({ publicationHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
  {
    await publicationHelper.createSecurePublication({
      preview: false,
      mandatoryFieldCheck: false
    });

    // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

    await workBenchHelper.statsAuthorWorkBench({
      draft: true,
      needsReview: false,
      archived: false
    });

    // moderating to needs review 
    await contentModerationHelper.statsAuthorModerateContent({
      NeedsReview: true,
    });

    await workBenchHelper.statsAuthorWorkBench({
      draft: false,
      needsReview: true,
      archived: false
    });

    //Logging in as a supervisor to Archive Content as authors can view archive content but are unable to archive themseleves
    await basePage.logOut();

    // Overriding user for test data with supervisor credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Navigating to authors created content 
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to Archived
    await contentModerationHelper.statsSupervisorModerateContent({
      QuickPublish: false,
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    // Logging out to complete author workbench.  
    await basePage.logOut();

    // Overriding user for test data with author credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    await workBenchHelper.statsAuthorWorkBench({
      draft: false,
      needsReview: false,
      archived: true
    });
  });

});

test.describe('Secure Publication Stats Supervisor Tests', { tag: ['@securePublication', '@regression', '@statsSupervisor'] }, () =>
{
  // Pass the fixture for secure Publication Stats Supervisors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.publication;
    testSetUpData.contentTitleforTest.contentTitle = testData.SecurePublication.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('Secure-Publication-Super-TC01 - Create - Create secure Publication content as an "Stats Supervisor", perform mandatory field check and preview content', { tag: '@create' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // searching as anon to ensure content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // moderating to needs review 
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: true,
        Published: false,
        Archive: false
      });

      // searching as anon to ensure content is not viewable as needs review 
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // moderating to published  
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // searching as anon to ensure content is viewable as it is published 
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // moderating to archived  
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: false,
        Archive: true
      });

      // searching as anon to ensure content is not viewable as it is archived 
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('Secure-Publication-Super-TC02 - Create - Create secure Publication content as an "Stats Supervisor", ensure Stats Supervisor alt can view unpublished', { tag: '@create' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, basePage }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      await basePage.logOut();

      // Overriding user for test data with stats supervisor alt credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_alt_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_alt_password;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

    });

  test('Secure-Publication-Super-TC03 - Create - Create secure Publication content as an "Stats Supervisor", ensure Stats author can view once published', { tag: '@create' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, basePage }) =>
    {
      // overriding test data so that content saves as Published
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.published;

      await publicationHelper.createSecurePublication({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      await basePage.logOut();

      // Overriding user for test data with stats author credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

    });

  test('Secure-Publication-Super-TC04 - Edit - Edit secure Published Publication content and ensure edit is published as a "stats Supervisor" ', { tag: '@edit' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // moderating to published  
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: true
      });

      // moderating edited content to published
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // ensure edit is publish published set to true
      await anonymousHelper.searchAsAnon({ edited: true });
    });

  test('Secure-Publication-Super-TC05 - Delete - Delete Published secure Publication as "stats Supervisor" and confirm it isnt viewable as an anon user', { tag: '@delete' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
    {

      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // moderating to published  
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // cancel delete publication
      await publicationHelper.deleteSecurePublication({
        delete: false,
        cancel: true
      });

      // ensure cancel has not deleted content and it is viewable to anon users
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete publication
      await publicationHelper.deleteSecurePublication({
        delete: true,
        cancel: false
      });

      // confirm content deleted logged in on content page
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });

      // ensure publication is deleted and not viewable to anon users 
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('Secure-Publication-Super-TC06 - Delete - Can delete secure Publication created by "Stats Author" as an "Stats Supervisor"', { tag: '@delete' },
    async ({ publicationHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
    {
      // Logging out as Before each will log in as an stats Author.  
      await basePage.logOut();

      // Overriding user for test data with stats Author credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_author_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_author_password;
      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // Creating Publication as a stats Author
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // searching as anon to ensure content is not viewable when is a Needs Review state
      await anonymousHelper.searchAsAnon({ edited: false });

      // Overriding user for test data with Supervisor credentials  
      testSetUpData.userForTest.username = testSetUpData.validUserList.stats_supervisor_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.stats_supervisor_password;

      // log back in and naviagte to content 
      await loginHelper.loginWithValidUser();

      // Navigating to Authors created content 
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete authors publication
      await publicationHelper.deleteSecurePublication({
        delete: true,
        cancel: false
      });

      // confirm content deleted logged in on content page
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });
    });

  test('Secure-Publication-Super-TC07 - Compare Revision - Edit secure Publication content and ensure user is able to compare Revisions ', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // comparing and verifying Revisions
      await revisionHelper.compareRevisions();

    });

  test('Secure-Publication-Super-TC08 - Delete Revision - Edit secure Publication content and ensure user is able to Delete Revisions', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // Cancel Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: false,
        cancel: true
      });

      // Comfirm Deletion of Revision
      await revisionHelper.deleteRevisions({
        delete: true,
        cancel: false
      });
    });

  test('Secure-Publication-Super-TC09 - Revert Revision - Edit Publication content and ensure user is able to Revert Revisions', { tag: '@revision' },
    async ({ publicationHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit publication
      await publicationHelper.editSecurePublication({
        preview: false
      });

      // Cancel Reverting of Revision and verify edited version is still visible
      await revisionHelper.revertRevisions({
        revert: false,
        cancel: true
      });

      // Comfirm reverting of Revision and verify inital version is now visible 
      await revisionHelper.revertRevisions({
        revert: true,
        cancel: false
      });
    });

  test('Secure-Publication-Super-TC10 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' },
    async ({ publicationHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, topicsTreeHelper, testSetUpData }) =>
    {

      //Overriding to trigger alert - trying to add 4 but maximum is 3
      await topicsTreeHelper.selectTopicForSite({
        edit: false,
        triggeralert: true,
      });

      // creating content
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

    });

  test('Secure-Publication-Super-TC11 - Workbench -  Create Publication content as an "Stats Supervisor", and use Workbench to complete all moderation states', { tag: '@workbench' },
    async ({ publicationHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
    {
      await publicationHelper.createSecurePublication({
        preview: false,
        mandatoryFieldCheck: false
      });

      // overriding content type for test to secure pub due to secure pub needing different verification DO NOT MOVE FROM THIS POSISTION 
      testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.securePublication;

      await workBenchHelper.statssupervisorWorkBench({
        draft: true,
        needsReview: false,
        archived: false
      });

      // moderating to needs review 
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: true,
        Published: false,
        Archive: false
      });

      await workBenchHelper.statssupervisorWorkBench({
        draft: false,
        needsReview: true,
        archived: false
      });

      // moderating to needs review 
      await contentModerationHelper.statsSupervisorModerateContent({
        QuickPublish: false,
        NeedsReview: false,
        Published: false,
        Archive: true
      });

      await workBenchHelper.statssupervisorWorkBench({
        draft: false,
        needsReview: false,
        archived: true
      });

    });


});