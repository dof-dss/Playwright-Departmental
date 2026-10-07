import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

test.describe('Protected Area Author Tests', { tag: ['@protectedArea', '@regression', '@author'] }, () =>
{
  // Pass the fixture for Protected Area Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.protectedarea;
    testSetUpData.contentTitleforTest.contentTitle = testData.ProtectedArea.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('PA-Auth-TC01 - Create - Create Protected Area content as an "Author", perform mandatory field check and preview content', { tag: '@create' },
    async ({ loginHelper, protectedAreaHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
    {
      await protectedAreaHelper.createProtectedArea({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // searching as anon to ensure content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and naviagte to content
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // moderating to needs review
      await contentModerationHelper.authorModerateContent({
        NeedsReview: true,
      });

      // searching as anon to ensure content is not viewable as needs review
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('PA-Auth-TC02 - Edit - Edit Protected Area as an "Author" and ensure it is not published', { tag: '@edit' },
    async ({ protectedAreaHelper, anonymousHelper }) =>
    {
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // edit protected area
      await protectedAreaHelper.editProtectedArea({
        preview: true
      });

      // searching as anon to ensure edited content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: true });
    });

  test('PA-Auth-TC03 - Delete - Delete Protected Area as an "Author"', { tag: '@delete' },
    async ({ protectedAreaHelper, navigateToCreatedContentHelper }) =>
    {
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // Cancel delete protected area
      await protectedAreaHelper.deleteProtectedArea({
        delete: false,
        cancel: true
      });

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete protected area
      await protectedAreaHelper.deleteProtectedArea({
        delete: true,
        cancel: false
      });

      // confirm content deleted
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });
    });

  test('PA-Auth-TC04 - Delete - Cannot delete Protected Area created by "Supervisor" as an "Author"', { tag: '@delete' },
    async ({ page, testSetUpData, testData, protectedAreaHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
    {
      const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

      // Logging out as Before each will log in as an Author.
      await basePage.logOut();

      // Overriding user for test data with supervisor credentials
      testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
      // log back in and naviagte to content
      await loginHelper.loginWithValidUser();

      // Creating Protected Area as a Supervisor
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // moderating to Published
      await contentModerationHelper.supervisorModerateContent({
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // searching as anon to ensure content is viewable when published
      await anonymousHelper.searchAsAnon({ edited: false });

      // Overriding user for test data with Author credentials
      testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;

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

  test('PA-Auth-TC05 - Compare Revision - Edit Protected Area content and ensure user is able to compare revisions', { tag: '@revision' },
    async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit protected area
      await protectedAreaHelper.editProtectedArea({
        preview: false
      });

      // comparing and verifying Revisions
      await revisionHelper.compareRevisions();
    });

  test('PA-Auth-TC06 - Delete Revision - Edit Protected Area content and ensure user is able to delete revisions', { tag: '@revision' },
    async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit protected area
      await protectedAreaHelper.editProtectedArea({
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

  test('PA-Auth-TC07 - Revert Revision - Edit Protected Area content and ensure user is able to revert revisions', { tag: '@revision' },
    async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await protectedAreaHelper.createProtectedArea({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit protected area
      await protectedAreaHelper.editProtectedArea({
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

  test('PA-Auth-TC08 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' }, async ({ protectedAreaHelper, topicsTreeHelper }) =>
  {
    //Overriding to trigger alert - trying to add 4 but maximum is 3
    await topicsTreeHelper.selectTopicForSite({
      edit: false,
      triggeralert: true,
    });

    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });
  });

  test('PA-Auth-TC09 - Workbench -  Create Protected Area content as an "Author", and use Workbench to complete all moderation states available', { tag: '@workbench' }, async ({ protectedAreaHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
  {
    // creating protected area as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false
    });

    await workBenchHelper.authorWorkBench({
      draft: true,
      needsReview: false,
      archived: false
    });

    // moderating to needs review
    await contentModerationHelper.authorModerateContent({
      NeedsReview: true,
    });

    await workBenchHelper.authorWorkBench({
      draft: false,
      needsReview: true,
      archived: false
    });

    //Logging in as a supervisor to Archive Content as authors can view archive content but are unable to archive themseleves
    await basePage.logOut();

    // Overriding user for test data with supervisor credentials
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    // log back in and naviagte to content
    await loginHelper.loginWithValidUser();

    // Navigating to authors created content
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to Archived
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    // Logging out to complete author workbench.
    await basePage.logOut();

    // Overriding user for test data with author credentials
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    // log back in and naviagte to content
    await loginHelper.loginWithValidUser();

    await workBenchHelper.authorWorkBench({
      draft: false,
      needsReview: false,
      archived: true
    });
  });
});

test.describe('Protected Area Supervisor Tests', { tag: ['@protectedArea', '@regression', '@supervisor'] }, () =>
{
  // Pass the fixture for Protected Area Supervisors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.protectedarea;
    testSetUpData.contentTitleforTest.contentTitle = testData.ProtectedArea.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('PA-Super-TC01 - Create - Create Protected Area content as an "Supervisor", perform mandatory field check and preview content', { tag: '@create' }, async ({ protectedAreaHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
  {
    // creating protected area as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await protectedAreaHelper.createProtectedArea({
      preview: true,
      mandatoryFieldCheck: false,
    });

    // searching as anon to ensure content is not viewable as draft
    await anonymousHelper.searchAsAnon({ edited: false });

    // log back in and naviagte to content
    await loginHelper.loginWithValidUser();
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // moderating to needs review
    await contentModerationHelper.supervisorModerateContent({
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
    await contentModerationHelper.supervisorModerateContent({
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
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    // searching as anon to ensure content is viewable as it is published
    await anonymousHelper.searchAsAnon({ edited: false });
  });

  test('PA-Super-TC02 - Edit - Edit Published Protected Area content and ensure edit is published as a "Supervisor" ', { tag: '@edit' }, async ({ protectedAreaHelper, anonymousHelper, contentModerationHelper }) =>
  {
    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // edit protected area
    await protectedAreaHelper.editProtectedArea({
      preview: true
    });

    // moderating edited content to published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // ensure edit does not publish published set to true
    await anonymousHelper.searchAsAnon({ edited: true });
  });

  test('PA-Super-TC03 - Delete - Delete Published Protected Area as "Supervisor" and confirm it isnt viewable as an anon user', { tag: '@delete' }, async ({ protectedAreaHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
  {
    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // cancel delete protected area
    await protectedAreaHelper.deleteProtectedArea({
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

    // delete protected area
    await protectedAreaHelper.deleteProtectedArea({
      delete: true,
      cancel: false
    });

    // confirm content deleted logged in on content page
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });

    // ensure protected area is deleted and not viewable to anon users
    await anonymousHelper.searchAsAnon({ edited: false });
  });

  test('PA-Super-TC04 - Delete - Can delete Protected Area created by "Author" as an "Supervisor"', { tag: '@delete' }, async ({ protectedAreaHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
  {
    // Logging out as Before each will log in as an Author.
    await basePage.logOut();

    // Overriding user for test data with Author credentials
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    // log back in and naviagte to content
    await loginHelper.loginWithValidUser();

    // Creating Protected Area as a Author
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to Published
    await contentModerationHelper.authorModerateContent({
      NeedsReview: false
    });

    // searching as anon to ensure content is not viewable when is a Needs Review state
    await anonymousHelper.searchAsAnon({ edited: false });

    // Overriding user for test data with Supervisor credentials
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;

    // log back in and naviagte to content
    await loginHelper.loginWithValidUser();

    // Navigating to Authors created content
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // delete authors protected area
    await protectedAreaHelper.deleteProtectedArea({
      delete: true,
      cancel: false
    });

    // confirm content deleted logged in on content page
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });
  });

  test('PA-Super-TC05 - Compare Revision - Edit Protected Area content and ensure user is able to compare Revisions ', { tag: '@revision' }, async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit protected area
    await protectedAreaHelper.editProtectedArea({
      preview: false
    });

    // comparing and verifying Revisions
    await revisionHelper.compareRevisions();
  });

  test('PA-Super-TC06 - Delete Revision - Edit Protected Area content and ensure user is able to Delete Revisions', { tag: '@revision' }, async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit protected area
    await protectedAreaHelper.editProtectedArea({
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

  test('PA-Super-TC07 - Revert Revision - Edit Protected Area content and ensure user is able to Revert Revisions', { tag: '@revision' }, async ({ protectedAreaHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit protected area
    await protectedAreaHelper.editProtectedArea({
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

  test('PA-Super-TC08 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' }, async ({ protectedAreaHelper, topicsTreeHelper }) =>
  {
    //Overriding to trigger alert - trying to add 4 but maximum is 3
    await topicsTreeHelper.selectTopicForSite({
      edit: false,
      triggeralert: true,
    });

    // creating content
    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false,
    });
  });

  test('PA-Super-TC09 - Workbench -  Create Protected Area content as an "Supervisor", and use Workbench to complete all moderation states', { tag: '@workbench' }, async ({ protectedAreaHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
  {
    // creating protected area as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await protectedAreaHelper.createProtectedArea({
      preview: false,
      mandatoryFieldCheck: false
    });

    await workBenchHelper.supervisorWorkBench({
      draft: true,
      needsReview: false,
      archived: false
    });

    // moderating to needs review
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: true,
      Published: false,
      Archive: false
    });

    await workBenchHelper.supervisorWorkBench({
      draft: false,
      needsReview: true,
      archived: false
    });

    // moderating to needs review
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: false,
      Archive: true
    });

    await workBenchHelper.supervisorWorkBench({
      draft: false,
      needsReview: false,
      archived: true
    });
  });
});
