import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { TopicVisibilityHelper } from '@helpers/general/TopicVisibilityHelper';

test.describe('Empty Topic Tests', () =>
{
    // Pass the fixture for Topic Supervisor into the beforeEach hook
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        // setting the isolated data for THIS specific test run
        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.topicsupervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.topicsupervisor_password;
        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.topic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Topic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

        // automatically logins based on above test data for each test
        await loginHelper.loginWithValidUser();
    });

    test('Empty-Topic-TC01 - Create - Create empty Topic and moderate through all stages (preview and mandatory field check)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: true,
                mandatoryFieldCheck: false
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderating to needs review 
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            // searching as anon to ensure content is not viewable as needs review 
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // searching as anon to ensure content is viewable as it is published 
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderating to archived  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // searching as anon to ensure content is not viewable as it is archived 
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Topic-TC02 - Edit - Edit  published empty Topic (preview edit)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, contentModerationHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // edit the published topic and verify the edited content in preview
            await topicHelper.editTopic({ preview: true });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // ensure the edited topic is published and viewable to anon users
            await anonymousHelper.searchAsAnon({ edited: true });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.titleEdited, shouldBeVisible: true, edited: true });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.titleEdited, shouldBeVisible: true, edited: true });
        });

    test('Empty-Topic-TC03 - Delete - Ensure Topic Supervisor can delete empty Topic', { tag: "@regression" },
        async ({ topicHelper, navigateToCreatedContentHelper, contentModerationHelper, anonymousHelper, loginHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // cancel delete and verify the Topic remains available
            await topicHelper.deleteTopic({ delete: false, cancel: true });

            // searching as anon to ensure content is viewable as it is published 
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });

            // log back in and navigate to content to confirm cancel did not delete the Topic
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // confirm delete
            await topicHelper.deleteTopic({ delete: true, cancel: false });

            // confirm content deleted
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: false,
                deleted: true
            });

            // ensure the deleted Topic is not viewable to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Topic-TC04 - Compare revisions- Edit empty Topic content and ensure user is able to Compare revisions', { tag: "@regression" },
        async ({ topicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision to compare against the original Topic
            await topicHelper.editTopic({ preview: false });

            await revisionHelper.compareRevisions();
        });

    test('Empty-Topic-TC05 - Delete revision - Edit Topic content and ensure user is able to Delete Revisions', { tag: "@regression" },
        async ({ topicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision before deleting it
            await topicHelper.editTopic({ preview: false });

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

    test('Empty-Topic-TC06 - Revert revision - Edit Topic content and ensure user is able to Revert Revisions', { tag: "@regression" },
        async ({ topicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision before reverting it
            await topicHelper.editTopic({ preview: false });

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

    test('Empty-Topic-TC07- Workbench -  Create Topic content as a "Topic Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" },
        async ({ topicHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
        {
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

            // creating topic as a draft
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            await workBenchHelper.topicSupervisorWorkBench({
                draft: true,
                needsReview: false,
                archived: false
            });

            // moderating to needs review 
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            await workBenchHelper.topicSupervisorWorkBench({
                draft: false,
                needsReview: true,
                archived: false
            });

            // moderating to archived  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            await workBenchHelper.topicSupervisorWorkBench({
                draft: false,
                needsReview: false,
                archived: true
            });
        });

    test('Empty-Topic-TC08 - Archived Topic should not be displayed in topics tree', { tag: "@regression" },
        async ({ topicHelper, applicationHelper, topicsTreeHelper, contentModerationHelper, anonymousHelper, topicVisibilityHelper, testData, testSetUpData }) =>
        {
            // creating content
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // moderating to archived  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // open a content form and verify the archived Topic is absent from the Site Topics tree
            testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.application;
            await applicationHelper.navigateTocreateApplication();
            await topicsTreeHelper.verifyTopicNotVisibleInSiteTopicsTree(testData.Topic.title);
        });

    test('Empty-Topic-TC09 - Emsure that Hide Listing functionality prevents Topic being listed on parent topic pages and home page', { tag: "@regression" },
        async ({ topicHelper, contentModerationHelper, anonymousHelper, topicVisibilityHelper, testData }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false,
                hideListing: true,
            });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // verify the hidden Topic is not listed publicly
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });
});

test.describe('Full Topic Tests', () =>
{
    // Pass the fixture for Topic Supervisor into the beforeEach hook
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        // setting the isolated data for THIS specific test run
        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.topicsupervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.topicsupervisor_password;
        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.topic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Topic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.published;

        // automatically logins based on above test data for each test
        await loginHelper.loginWithValidUser();
    });

    test('Full-Topic-TC01 - Create - Create full Topic using topics tree)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: true,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify that all created Draft children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Draft children are not
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            ////////////////////////////////
            //////// NEEDS REVIEW //////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderate all children content to needs review
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Needs Review children are not
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            ////////////////////////////////
            ////////// PUBLISHED ///////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are too 
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify published topic is visible on /topics page but published children are too
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            ////////////////////////////////
            ////////// ARCHIVED ////////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderate all children content to archived
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are not as archived 
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but published children are not as archived
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });
        });

    test('Full-Topic-TC02 - Create - Create full Topic using quickly add)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify that all created Draft children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Draft children are not
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            ////////////////////////////////
            //////// NEEDS REVIEW //////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderate all children content to needs review
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Needs Review children are not
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            ////////////////////////////////
            ////////// PUBLISHED ///////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are too 
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify published topic is visible on /topics page but published children are too
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            ////////////////////////////////
            ////////// ARCHIVED ////////////
            ////////////////////////////////

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            //  moderate all children content to archived
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are not as archived 
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but published children are not as archived
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });
        });

    test('Full-Topic-TC03 - Edit - Edit Topic by removing some child content)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage and published children are visible  
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // remove child content 
            await topicHelper.removeChildContentByTopicTree({
                application: true,
                article: true,
                subtopic: false,
                replacementTopic: 'Finance',
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage and published children are visible  
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: true,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: true,
            });
        });

    test('Full-Topic-TC04 - Edit - Edit Topic by using drag and drop on edit node page)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // RETURN TO WHEN TOPICS BRANCH BACK 
        });

    test('Full-Topic-TC05 - Edit - Edit Topic by using arrange content button moderation sidebar)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // RETURN TO WHEN TOPICS BRANCH BACK 
        });

    test('Full-Topic-TC06 - Edit - Edit child content nodes and verify changes)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // RETURN TO WHEN TOPICS BRANCH BACK 
        });

    test('Full-Topic-TC07 - Delete - Ensure cannot delete Topic with child content by moderation sidebar but can when child content archived)', { tag: "@regression" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentQuicklyAdd({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // try to delete the parent topic while it still has child content in draft state
            //await topicHelper.tryToDeleteParentTopicWithChildContent();

            /////// NEED REVIEW ///////

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // try to delete the parent topic while it still has child content in needs review state
            //await topicHelper.tryToDeleteParentTopicWithChildContent();

            /////// PUBLISHED ///////

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // try to delete the parent topic while it still has child content in needs review state
            //await topicHelper.tryToDeleteParentTopicWithChildContent();

            /////// ARCHIVED ///////

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // delete the parent topic while child content is archived
            await topicHelper.deleteTopic({ delete: true, cancel: false });

            // verify delete
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: false, deleted: true });

            // ensure the deleted Topic is not viewable to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

        });

});