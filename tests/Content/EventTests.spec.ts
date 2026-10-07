import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';

test.describe('Event Author Tests', { tag: ['@event', '@regression', '@author'] }, () =>
{
  // Pass the fixture for Event Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.communities_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.event;
    testSetUpData.contentTitleforTest.contentTitle = testData.Event.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('EVENT-Auth-TC01 - Create - Create Event content as an "Author", perform mandatory field check and preview content', { tag: '@create' },
    async ({ loginHelper, eventHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
    {
      await eventHelper.createEvent({
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

  test('EVENT-Auth-TC02 - Edit - Edit Event as an "Author" and ensure it is not published', { tag: '@edit' },
    async ({ eventHelper, anonymousHelper }) =>
    {
      await eventHelper.createEvent({
        preview: false,
        mandatoryFieldCheck: false,
      });

      // edit event
      await eventHelper.editEvent({
        preview: true
      });

      // searching as anon to ensure edited content is not viewable as draft
      await anonymousHelper.searchAsAnon({ edited: true });

    });

  test('EVENT-Auth-TC03 - Delete - Delete Event as an "Author"', { tag: '@delete' }, async ({ eventHelper, navigateToCreatedContentHelper }) =>
  {
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // Cancel delete event
    await eventHelper.deleteEvent({
      delete: false,
      cancel: true
    });

    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: true,
      deleted: false
    });

    // delete event
    await eventHelper.deleteEvent({
      delete: true,
      cancel: false
    });

    // confirm content deleted
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });

  });

  test('EVENT-Auth-TC04 - Delete - Cannot delete Event created by "Supervisor" as an "Author"', { tag: '@delete' }, async ({ page, testSetUpData, testData, eventHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper }) =>
  {
    const permissionCheck = new ModerationSideBar(page, testSetUpData, testData);

    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();

    // Overriding user for test data with supervisor credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Creating Event as a Supervisor
    await eventHelper.createEvent({
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

  test('EVENT-Auth-TC05 - Compare Revision - Edit Event content and ensure user is able to compare Revisions ', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
      preview: false
    });

    // comparing and verifying Revisions
    await revisionHelper.compareRevisions();
  });

  test('EVENT-Auth-TC06 - Delete Revision - Edit Event content and ensure user is able to Delete Revisions', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
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

  test('EVENT-Auth-TC07 - Revert Revision - Edit Event content and ensure user is able to Revert Revisions', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
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

  test('EVENT-Auth-TC08 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' }, async ({ eventHelper, topicsTreeHelper }) =>
  {
    //Overriding to trigger alert - trying to add 4 but maximum is 3
    await topicsTreeHelper.selectTopicForSite({
      edit: false,
      triggeralert: true,
    });

    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });
  });

  test('EVENT-Auth-TC09 - Workbench -  Create Event content as an "Author", and use Workbench to complete all moderation states available', { tag: '@workbench' }, async ({ eventHelper, contentModerationHelper, workBenchHelper, navigateToCreatedContentHelper, basePage, loginHelper, testSetUpData }) =>
  {
    // creating event as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await eventHelper.createEvent({
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

test.describe('Event Supervisor Tests', { tag: ['@event', '@regression', '@supervisor'] }, () =>
{
  // Pass the fixture for Event Authors into the beforeEach hook
  test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
  {
    const testSteps = new TestSteps();
    await testSteps.LogInfo('Test starting');
    await testSteps.LogInfo(testInfo.title);

    // setting the isolated data for THIS specific test run
    testSetUpData.urlForTest.url = testSetUpData.validTestURLList.communities_url;
    testSetUpData.userForTest.username = testSetUpData.validUserList.supervisor_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.supervisor_password;
    testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.event;
    testSetUpData.contentTitleforTest.contentTitle = testData.Event.title;
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

    // automatically logins based on above test data for each test
    await loginHelper.loginWithValidUser();
  });

  test('EVENT-Super-TC01 - Create - Create Event content as an "Supervisor", perform mandatory field check and preview content', { tag: '@create' }, async ({ eventHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData }) =>
  {
    // creating event as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await eventHelper.createEvent({
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

  test('EVENT-Super-TC02 - Edit - Edit Published Event content and ensure edit is published as a "Supervisor" ', { tag: '@edit' }, async ({ eventHelper, anonymousHelper, contentModerationHelper }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // edit event
    await eventHelper.editEvent({
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

  test('EVENT-Super-TC03 - Delete - Delete Published Event as "Supervisor" and confirm it isnt viewable as an anon user', { tag: '@delete' }, async ({ eventHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // moderating to published  
    await contentModerationHelper.supervisorModerateContent({
      NeedsReview: false,
      Published: true,
      Archive: false
    });

    // cancel delete event
    await eventHelper.deleteEvent({
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

    // delete event
    await eventHelper.deleteEvent({
      delete: true,
      cancel: false
    });

    // confirm content deleted logged in on content page
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });

    // ensure event is deleted and not viewable to anon users 
    await anonymousHelper.searchAsAnon({ edited: false });
  });

  test('EVENT-Super-TC04 - Delete - Can delete Event created by "Author" as an "Supervisor"', { tag: '@delete' }, async ({ eventHelper, navigateToCreatedContentHelper, basePage, loginHelper, contentModerationHelper, anonymousHelper, testSetUpData }) =>
  {
    // Logging out as Before each will log in as an Author.  
    await basePage.logOut();

    // Overriding user for test data with Author credentials  
    testSetUpData.userForTest.username = testSetUpData.validUserList.author_username;
    testSetUpData.userForTest.password = testSetUpData.validUserList.author_password;
    // log back in and naviagte to content 
    await loginHelper.loginWithValidUser();

    // Creating Event as a Author
    await eventHelper.createEvent({
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

    // delete authors event
    await eventHelper.deleteEvent({
      delete: true,
      cancel: false
    });

    // confirm content deleted logged in on content page
    await navigateToCreatedContentHelper.navigateToCreatedContent({
      active: false,
      deleted: true
    });
  });

  test('EVENT-Super-TC05 - Compare Revision - Edit Event content and ensure user is able to compare Revisions ', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
      preview: false
    });

    // comparing and verifying Revisions
    await revisionHelper.compareRevisions();

  });

  test('EVENT-Super-TC06 - Delete Revision - Edit Event content and ensure user is able to Delete Revisions', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
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

  test('EVENT-Super-TC07 - Revert Revision - Edit Event content and ensure user is able to Revert Revisions', { tag: '@revision' }, async ({ eventHelper, revisionHelper, testSetUpData }) =>
  {
    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });

    // overriding test data so that Edit test saves as Needs Review
    testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

    // edit event
    await eventHelper.editEvent({
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

  test('EVENT-Super-TC08 - Topics - Ensure only 3 Topics can be added', { tag: '@topicsAlert' }, async ({ eventHelper, topicsTreeHelper }) =>
  {
    //Overriding to trigger alert - trying to add 4 but maximum is 3
    await topicsTreeHelper.selectTopicForSite({
      edit: false,
      triggeralert: true,
    });

    // creating content
    await eventHelper.createEvent({
      preview: false,
      mandatoryFieldCheck: false,
    });
  });

  test('EVENT-Super-TC09 - Workbench -  Create Event content as an "Supervisor", and use Workbench to complete all moderation states', { tag: '@workbench' }, async ({ eventHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
  {
    // creating event as a draft and performing mandatory field check
    console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

    await eventHelper.createEvent({
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
