import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

test.describe('Heritage Site Author Tests', { tag: ['@heritageSite', '@regression', '@author'] }, () =>
{
  // Pass the fixture for Heritage Site Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);
    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.communities_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.heritagesite;
    testSetUpData.contentTitleforTest.contentTitle = testData.HeritageSite.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('HS-Auth-TC01 - Create - Create Heritage Site content as an "Author", perform mandatory field check and preview content', { tag: '@create' },
    async ({ loginHelper, heritageSiteHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
    {
      await heritageSiteHelper.createHeritageSite({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // searching as anon to ensure content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and navigate to content
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

  test('HS-Auth-TC02 - Edit - Edit Heritage Site as an "Author" and ensure it is not published', { tag: '@edit' },
    async ({ heritageSiteHelper, anonymousHelper }) =>
    {
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: true
      });

      // searching as anon to ensure edited content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: true });
    });

  test('HS-Auth-TC03 - Delete - Delete Heritage Site as an "Author"', { tag: '@delete' },
    async ({ heritageSiteHelper, navigateToCreatedContentHelper }) =>
    {
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // Cancel delete heritage site
      await heritageSiteHelper.deleteHeritageSite({
        delete: false,
        cancel: true
      });

      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete heritage site
      await heritageSiteHelper.deleteHeritageSite({
        delete: true,
        cancel: false
      });

      // confirm content deleted
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });
    });

  test('HS-Auth-TC04 - Delete - Cannot delete Heritage Site created by "Supervisor" as an "Author"', { tag: '@delete' },
    async ({ heritageSiteHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, page, testSetUpData, testData }) =>
    {
      const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

      // Logging out as Before each will log in as an Author.
      await basePage.logOut();

      // Overriding user for test data with supervisor credentials
      testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
      await loginHelper.loginWithValidUser();

      // Creating Heritage Site as a Supervisor
      await heritageSiteHelper.createHeritageSite({
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
      await loginHelper.loginWithValidUser();

      // Navigating to Supervisor-created content
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      await permissionCheck.openModerationSideBar();
      await permissionCheck.deleteButtonNotVisible();

      // searching as anon to ensure content is still viewable
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('HS-Auth-TC05 - Compare Revision - Edit Heritage Site content and ensure user is able to compare revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // comparing and verifying revisions
      await revisionHelper.compareRevisions();
    });

  test('HS-Auth-TC06 - Delete Revision - Edit Heritage Site content and ensure user is able to delete revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // Cancel deletion of revision
      await revisionHelper.deleteRevisions({
        delete: false,
        cancel: true
      });

      // Confirm deletion of revision
      await revisionHelper.deleteRevisions({
        delete: true,
        cancel: false
      });
    });

  test('HS-Auth-TC07 - Revert Revision - Edit Heritage Site content and ensure user is able to revert revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // Cancel reverting of Revision and verify edited version is still visible
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


  test('HS-Auth-TC08 - Workbench - Create Heritage Site content as an "Author", and use Workbench to complete all moderation states available', { tag: '@workbench' },
    async ({ heritageSiteHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
    {
      // creating heritage site as a draft and performing mandatory field check
      console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

      await heritageSiteHelper.createHeritageSite({
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

test.describe('Heritage Site Supervisor Tests', { tag: ['@heritageSite', '@regression', '@supervisor'] }, () =>
{
  // Pass the fixture for Heritage Site Supervisors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.communities_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.heritagesite;
    testSetUpData.contentTitleforTest.contentTitle = testData.HeritageSite.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('HS-Super-TC01 - Create - Create Heritage Site content as an "Supervisor", perform mandatory field check and preview content', { tag: '@create' },
    async ({ heritageSiteHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
    {
      // creating heritage site as a draft
      console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

      await heritageSiteHelper.createHeritageSite({
        preview: true,
        mandatoryFieldCheck: false,
      });

      // searching as anon to ensure content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and navigate to content
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

      // log back in and navigate to content
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

      // log back in and navigate to content
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

      // searching as anon to ensure archived content is not viewable
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('HS-Super-TC02 - Edit - Edit Published Heritage Site content and ensure edit is published as a "Supervisor"', { tag: '@edit' },
    async ({ heritageSiteHelper, anonymousHelper, contentModerationHelper }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // moderating to published
      await contentModerationHelper.supervisorModerateContent({
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: true
      });

      // moderating edited content to published
      await contentModerationHelper.supervisorModerateContent({
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // ensure edit is published
      await anonymousHelper.searchAsAnon({ edited: true });
    });

  test('HS-Super-TC03 - Delete - Delete Published Heritage Site as "Supervisor" and confirm it is not viewable as an anon user', { tag: '@delete' },
    async ({ heritageSiteHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // moderating to published
      await contentModerationHelper.supervisorModerateContent({
        NeedsReview: false,
        Published: true,
        Archive: false
      });

      // cancel delete heritage site
      await heritageSiteHelper.deleteHeritageSite({
        delete: false,
        cancel: true
      });

      // ensure cancel has not deleted content and it is viewable to anon users
      await anonymousHelper.searchAsAnon({ edited: false });

      // log back in and navigate to content
      await loginHelper.loginWithValidUser();
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete heritage site
      await heritageSiteHelper.deleteHeritageSite({
        delete: true,
        cancel: false
      });

      // confirm content deleted logged in on content page
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });

      // ensure heritage site is deleted and not viewable to anon users
      await anonymousHelper.searchAsAnon({ edited: false });
    });

  test('HS-Super-TC04 - Delete - Can delete Heritage Site created by "Author" as a "Supervisor"', { tag: '@delete' },
    async ({ heritageSiteHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
    {
      // Logging out as beforeEach logs in as a Supervisor.
      await basePage.logOut();

      // Overriding user for test data with Author credentials
      testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
      await loginHelper.loginWithValidUser();

      // Creating Heritage Site as an Author
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // moderating to needs review
      await contentModerationHelper.authorModerateContent({
        NeedsReview: false
      });

      // searching as anon to ensure content is not viewable when in needs review state
      await anonymousHelper.searchAsAnon({ edited: false });

      // Overriding user for test data with Supervisor credentials
      testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
      testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
      await loginHelper.loginWithValidUser();

      // Navigating to Author-created content
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: true,
        deleted: false
      });

      // delete author's heritage site
      await heritageSiteHelper.deleteHeritageSite({
        delete: true,
        cancel: false
      });

      // confirm content deleted logged in on content page
      await navigateToCreatedContentHelper.navigateToCreatedContent({
        active: false,
        deleted: true
      });
    });

  test('HS-Super-TC05 - Compare Revision - Edit Heritage Site content and ensure user is able to compare revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // comparing and verifying revisions
      await revisionHelper.compareRevisions();
    });

  test('HS-Super-TC06 - Delete Revision - Edit Heritage Site content and ensure user is able to delete revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // Cancel deletion of revision
      await revisionHelper.deleteRevisions({
        delete: false,
        cancel: true
      });

      // Confirm deletion of revision
      await revisionHelper.deleteRevisions({
        delete: true,
        cancel: false
      });
    });

  test('HS-Super-TC07 - Revert Revision - Edit Heritage Site content and ensure user is able to revert revisions', { tag: '@revision' },
    async ({ heritageSiteHelper, revisionHelper, testSetUpData }) =>
    {
      // creating content
      await heritageSiteHelper.createHeritageSite({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // overriding test data so that Edit test saves as Needs Review
      testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

      // edit heritage site
      await heritageSiteHelper.editHeritageSite({
        preview: false
      });

      // Cancel reverting of revision and verify edited version is still visible
      await revisionHelper.revertRevisions({
        revert: false,
        cancel: true
      });

      // Confirm reverting of revision and verify initial version is now visible
      await revisionHelper.revertRevisions({
        revert: true,
        cancel: false
      });
    });

  test('HS-Super-TC08 - Workbench -  Create Heritage Site content as an "Supervisor", and use Workbench to complete all moderation states', { tag: '@workbench' }, async ({ heritageSiteHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
  {
    // creating heritage site as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await heritageSiteHelper.createHeritageSite({
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
