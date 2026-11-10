import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { TopicVisibilityHelper } from '@helpers/general/TopicVisibilityHelper';
import { RevisionHelper } from '@helpers/general/RevisionHelper';
import { AnonymousHelper } from '@helpers/general/AnonymousHelper';

test.describe('Empty Topic Tests', { tag: ['@topics', '@regression', '@topic_supervisor'] }, () =>
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

    test('Empty-Topic-TC01 - Create - Create empty Topic and moderate through all stages (preview and mandatory field check)', { tag: "@create" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: true,
                mandatoryFieldCheck: false
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });

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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Topic-TC02 - Edit - Edit  published empty Topic (preview edit)', { tag: "@edit" },
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.titleEdited, shouldBeVisible: true, edited: true });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.titleEdited, shouldBeVisible: true, edited: true });
        });

    test('Empty-Topic-TC03 - Delete - Ensure Topic Supervisor can delete empty Topic', { tag: "@delete" },
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });

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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Topic-TC04 - Compare revisions - Edit empty Topic content and ensure user is able to Compare revisions', { tag: "@revision" },
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

    test('Empty-Topic-TC05 - Delete revision - Edit Topic content and ensure user is able to Delete Revisions', { tag: "@revision" },
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

    test('Empty-Topic-TC06 - Revert revision - Edit Topic content and ensure user is able to Revert Revisions', { tag: "@revision" },
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

    test('Empty-Topic-TC07- Workbench -  Create Topic content as a "Topic Supervisor", and use Workbench to complete all moderation states', { tag: "@workbench" },
        async ({ topicHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
        {
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

    test('Empty-Topic-TC08 - Archived Topic should not be displayed in topics tree', { tag: "@@Topics_tree_visibility" },
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

    test('Empty-Topic-TC09 - Emsure that Hide Listing functionality prevents Topic being listed on parent topic pages and home page', {},
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
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });
});

test.describe('Full Topic Tests', { tag: ['@topics', '@regression', '@topic_supervisor'] }, () =>
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

    test('Full-Topic-TC01 - Create - Create full Topic using topics tree and moderate child content through all states)', { tag: "@create" },
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
                consultation: true,
                news: true,
                publication: true
            });

            // verify that Application, Article, Subtopic created Draft children are visible to the logged-in Topic Supervisor and Consultation, News, Publication are NOT visible if created
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
                consultation: false,
                news: false,
                publication: false
            });


            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Draft children are not
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false
            });

            // verify published topic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false
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
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false
            });

            // verify that Application, Article, Subtopic needs review children are visible to the logged-in Topic Supervisor and Consultation, News, Publication are not visible if created
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
                consultation: false,
                news: false,
                publication: false,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but Needs Review children are not
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published topic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
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
                consultation: true,
                news: true,
                publication: true,
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
                consultation: true,
                news: true,
                publication: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are too 
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify published topic is visible on /topics page but published children are too
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
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
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            // verify that all newly archived children are NOT visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are not as archived 
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published topic is visible on /topics page but published children are not as archived
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });
        });

    test('Full-Topic-TC02 - Create - Create full Topic using quickly add and moderate child content through all states)', { tag: "@create" },
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify published topic is visible on /topics page but published children are too
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
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

            // verify that all newly archived children are NOT visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage but published  children are not as archived 
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });

            // verify published topic is visible on /topics page but published children are not as archived
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
            });
        });

    test('Full-Topic-TC03 - Edit - Edit Topic by removing some child content using the topics tree)', { tag: "@edit" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: true,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: true,
            });
        });

    test('Full-Topic-TC04 - Edit - Edit Topic by removing Consultation, News and Publication using the topics tree)', { tag: "@edit" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: false,
                article: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: false,
                article: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage and published children are visible  
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
            });

            // log back in and naviagte to content 
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // remove child content 
            await topicHelper.removeChildContentByTopicTree({
                application: false,
                article: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
                replacementTopic: 'Finance',
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published topic is visible on homepage and published children are visible  
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published topic is visible on the topics page and published children are visible  
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: true, edited: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: false,
                article: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });
        });

    test('Full-Topic-TC05 - Edit - Edit Topic by using drag and drop on edit node page to rearrange topic child content)', { tag: "@edit" },
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

            // use drag and drop on edit node page to edit the topic
            await topicHelper.editTopicUsingDragAndDrop();

        });

    test('Full-Topic-TC06 - Edit - Edit Topic by using arrange content button moderation sidebar to reorder topic child content)', { tag: "@edit" },
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

            // reorder Topic Content using the Arrange Content modal
            await topicHelper.arrangeTopicContentUsingDragAndDrop();

        });

    test('Full-Topic-TC07 - Edit - Edit child content nodes and verify child content edits displayed correctly)', { tag: "@edit" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // edit child content nodes 
            await topicHelper.editTopicChildContentNodes({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify child content edits displayed correctly
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                edited: true,
            });

        });

    test('Full-Topic-TC08 - Delete - Ensure cannot delete Topic with Application, Article, Subtopic child content by moderation sidebar but can when child content archived)', { tag: "@delete" },
        async ({ topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // verify deletion is blocked while child content is in draft
            await topicHelper.verifyTopicDeletionIsBlocked();

            for (const moderationState of ['Needs Review', 'Published'])
            {
                await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                    application: true,
                    article: true,
                    subtopic: true,
                    QuickPublish: false,
                    NeedsReview: moderationState === 'Needs Review',
                    Published: moderationState === 'Published',
                    Archive: false
                });

                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.verifyTopicDeletionIsBlocked();
            }

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
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });

        });

    for (const [index, { moderationState, saveAsOption }] of ([
        { moderationState: 'Draft', saveAsOption: 'draft' },
        { moderationState: 'Needs Review', saveAsOption: 'needsreview' },
        { moderationState: 'Published', saveAsOption: 'published' },
        { moderationState: 'Archived', saveAsOption: 'archived' },
    ] as const).entries())
    {
        test(`Full-Topic-TC09.${index + 1} - Delete - Ensure Topic can be deleted with Consultation, News and Publication in ${moderationState}`, { tag: "@delete" },
            async ({ topicHelper, navigateToCreatedContentHelper, anonymousHelper, topicVisibilityHelper, testData }) =>
            {
                await topicHelper.createTopic({
                    preview: false,
                    mandatoryFieldCheck: false
                });

                await topicHelper.createTopicChildContentTopicTree({
                    application: false,
                    article: false,
                    subtopic: false,
                    consultation: true,
                    news: true,
                    publication: true,
                }, saveAsOption);

                // navigate to the created content before verifying delete warning message about child content
                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.deleteTopic({ delete: false, cancel: false, deleteAltChildContentWarning: true });

                // navigating back to the created content before performing the actual delete
                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.deleteTopic({ delete: true, cancel: false });
                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: false, deleted: true });

                await anonymousHelper.searchAsAnon({ edited: false });
                await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
                await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            });
    }

    test('Full-Topic-TC10 - Archive - Ensure cannot archive Topic with Application, Article, Subtopic child content by moderation sidebar but can when child content archived', { tag: "@archive" },
        async ({ topicHelper, contentModerationHelper, navigateToCreatedContentHelper, anonymousHelper, topicVisibilityHelper, testData }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: true,
                subtopic: true,
            });
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicArchivingIsBlocked();

            for (const moderationState of ['Needs Review', 'Published'])
            {
                await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                    application: true,
                    article: true,
                    subtopic: true,
                    QuickPublish: false,
                    NeedsReview: moderationState === 'Needs Review',
                    Published: moderationState === 'Published',
                    Archive: false
                });

                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.verifyTopicArchivingIsBlocked();
            }

            await contentModerationHelper.topicSupervisorModerateAllChildrenContent({
                application: true,
                article: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true
            });

            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicIsArchived();

            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
        });

    for (const [index, { moderationState, saveAsOption }] of ([
        { moderationState: 'Draft', saveAsOption: 'draft' },
        { moderationState: 'Needs Review', saveAsOption: 'needsreview' },
        { moderationState: 'Published', saveAsOption: 'published' },
        { moderationState: 'Archived', saveAsOption: 'archived' },
    ] as const).entries())
    {
        test(`Full-Topic-TC11.${index + 1} - Archive - Ensure Topic can be archived with Consultation, News and Publication in ${moderationState}`, { tag: "@archive" },
            async ({ topicHelper, contentModerationHelper, navigateToCreatedContentHelper, anonymousHelper, topicVisibilityHelper, testData }) =>
            {
                await topicHelper.createTopic({
                    preview: false,
                    mandatoryFieldCheck: false
                });

                await topicHelper.createTopicChildContentTopicTree({
                    application: false,
                    article: false,
                    subtopic: false,
                    consultation: true,
                    news: true,
                    publication: true,
                }, saveAsOption);

                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await contentModerationHelper.topicSupervisorModerateContent({
                    QuickPublish: false,
                    NeedsReview: false,
                    Published: false,
                    Archive: true
                });

                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.verifyTopicIsArchived();

                await anonymousHelper.searchAsAnon({ edited: false });
                await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
                await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            });
    }

    test('Full-Topic-TC12 - Archive - Ensure cannot Archive Topic with child content by reverting to a previous Archived revision)', { tag: "@archive" },
        async ({ topicHelper, anonymousHelper, topicVisibilityHelper, revisionHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
        {

            // set save as option to archived to create first revision as archived 
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.archived;
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            // moderate parent topic to publsihed state 
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: true,
                subtopic: true,
            });

            // navigate back to parent topic 
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // verify cannot archive the parent topic which has child content in non archived state by reverting to a previous Archived revision of parent topic
            await topicHelper.verifyCannotRevertToPreviousArchivedRevision();

            // now moderate the child content to needs review state
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

            // verify cannot archive the parent topic which has child content in non archived state by reverting to a previous Archived revision of parent topic
            await topicHelper.verifyCannotRevertToPreviousArchivedRevision();

            // now moderate the child content to Published state
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

            // verify cannot archive the parent topic which has child content in non archived state by reverting to a previous Archived revision of parent topic
            await topicHelper.verifyCannotRevertToPreviousArchivedRevision();

            // now moderate the child content to Archived state
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

            // verify can archive the parent topic which has child content in an archived state by reverting to a previous Archived revision of parent topic
            await revisionHelper.revertRevisions({
                revert: false,
                cancel: false,
                topicArchivedRevert: true
            });

            // navigate back to parent topic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.verifyTopicIsArchived();

            // search as anon to verify the parent topic is archived and not visible
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });


        });

    for (const [index, { moderationState, saveAsOption }] of ([
        { moderationState: 'Draft', saveAsOption: 'draft' },
        { moderationState: 'Needs Review', saveAsOption: 'needsreview' },
        { moderationState: 'Published', saveAsOption: 'published' },
        { moderationState: 'Archived', saveAsOption: 'archived' },
    ] as const).entries())
    {
        test(`Full-Topic-TC13.${index + 1} - Archive - Ensure can Archive Topic with Consultation, News and Publication in ${moderationState} by reverting to a previous Archived revision`, { tag: "@archive" },
            async ({ topicHelper, anonymousHelper, topicVisibilityHelper, revisionHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
            {
                // set save as option to archived to create first revision as archived 
                testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.archived;
                await topicHelper.createTopic({
                    preview: false,
                    mandatoryFieldCheck: false
                });

                // moderate parent topic to publsihed state 
                await contentModerationHelper.topicSupervisorModerateContent({
                    QuickPublish: false,
                    NeedsReview: false,
                    Published: true,
                    Archive: false
                });

                await topicHelper.createTopicChildContentTopicTree({
                    application: false,
                    article: false,
                    subtopic: false,
                    consultation: true,
                    news: true,
                    publication: true,
                }, saveAsOption);

                // navigate back to parent topic 
                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

                // verify can archive the parent topic which has child content in specified moderation state by reverting to a previous Archived revision of parent topic
                await revisionHelper.revertRevisions({
                    revert: false,
                    cancel: false,
                    topicArchivedRevert: true
                });

                // navigate back to parent topic
                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await topicHelper.verifyTopicIsArchived();

                await anonymousHelper.searchAsAnon({ edited: false });
                await topicVisibilityHelper.verifyTopicOnHomepage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
                await topicVisibilityHelper.verifyTopicOnTopicsPage({ title: testData.Topic.title, shouldBeVisible: false, edited: false });
            });
    }

    test('Full-Topic-TC14 - Revision - Create a topic and add child content one by one, verifying no new revisions are created', { tag: "@revision" },
        async ({ topicHelper, navigateToCreatedContentHelper, revisionHelper }) =>
        {
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            const initialRevisionCount = 1;
            await revisionHelper.verifyRevisionCount(initialRevisionCount);
            const childContentTypes = ['application', 'article', 'subtopic', 'consultation', 'news', 'publication'] as const;

            for (const childContentType of childContentTypes)
            {
                await test.step(`Create ${childContentType} and verify no new topic revision`, async () =>
                {
                    await revisionHelper.revisionPage.goBack();
                    await topicHelper.createTopicChildContentTopicTree({
                        application: false,
                        article: false,
                        subtopic: false,
                        consultation: false,
                        news: false,
                        publication: false,
                        [childContentType]: true
                    });

                    await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                    await revisionHelper.verifyRevisionCount(initialRevisionCount);
                });
            }
        });

    test('Full-Topic-TC15 - Revision - Create a full topic with Application, remove it, then add an edit Topic and add an Article and verify child content does not show on revision compare', { tag: "@revision" },
        async ({ topicHelper, revisionHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
        {
            // set save as option to draft to create first revision as draft 
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

            // Create initial topic with only Application child content - First Revision
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: false,
                subtopic: false,
            });

            // Navigate back to parent topic and remove Application child content via topics tree
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            await topicHelper.removeChildContentByTopicTree({
                application: true,
                article: false,
                subtopic: false,
                replacementTopic: 'Finance',
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // edit the topic to create a new revision
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.editTopic({ preview: false });

            // Now add new child content (Article, Subtopic, Consultation, News, Publication) - Second Revision
            // useEditedTitle=true because the topic was just edited
            await topicHelper.createTopicChildContentTopicTree({
                application: false,
                article: true,
                subtopic: false
            }, 'draft', { useEditedTitle: true });

            // Navigate to revisions and compare the two revisions
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // Restore edited title for navigation (was restored to original by createTopicChildContentTopicTree)
            testData.Topic.title = testData.Topic.titleEdited;
            testSetUpData.contentTitleforTest.contentTitle = testData.Topic.titleEdited;

            // Compare the revisions and verify that topic child content is not shown on compare page
            await revisionHelper.compareRevisions();

            // Verify that no topic child content appears on the compare page
            await revisionHelper.topicComparePage.verifyTopicChildContentNotShownOnComparePage();
        });

    test('Full-Topic-TC16 - Revision - Create a topic with Application, keep it, then edit Topic and add an Article and delete a revision to verify both child content items are displayed', { tag: "@revision" },
        async ({ topicHelper, revisionHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
        {
            // set save as option to draft to create first revision as draft 
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

            // Create initial topic with only Application child content - First Revision
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: false,
                subtopic: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // edit the topic to create a new revision without removing Application
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.editTopic({ preview: false });

            // Now add new child content (Article) - Second Revision
            // useEditedTitle=true because the topic was just edited
            await topicHelper.createTopicChildContentTopicTree({
                application: false,
                article: true,
                subtopic: false
            }, 'draft', { useEditedTitle: true });

            // Navigate to revisions and delete a revision
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // Delete a revision
            await revisionHelper.deleteRevisions({
                delete: true,
                cancel: false
            });

            // Restore edited title for navigation (was restored to original by createTopicChildContentTopicTree)
            testData.Topic.title = testData.Topic.titleEdited;
            testSetUpData.contentTitleforTest.contentTitle = testData.Topic.titleEdited;

            // Navigate back to verify both child content items are displayed
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // Verify that both Application and Article child content appear
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: false
            });
        });

    test('Full-Topic-TC17 - Revision - Create a topic with Application, keep it, then edit Topic and add an Article and revert a revision to verify both child content items are displayed', { tag: "@revision" },
        async ({ topicHelper, revisionHelper, navigateToCreatedContentHelper, testSetUpData, testData }) =>
        {
            // set save as option to draft to create first revision as draft 
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;

            // Create initial topic with only Application child content - First Revision
            await topicHelper.createTopic({
                preview: false,
                mandatoryFieldCheck: false
            });

            await topicHelper.createTopicChildContentTopicTree({
                application: true,
                article: false,
                subtopic: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // edit the topic to create a new revision without removing Application
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await topicHelper.editTopic({ preview: false });

            // Now add new child content (Article) - Second Revision
            // useEditedTitle=true because the topic was just edited, will be restored by the method automatically
            await topicHelper.createTopicChildContentTopicTree({
                application: false,
                article: true,
                subtopic: false
            }, 'draft', { useEditedTitle: true });

            // Navigate to revisions and revert a revision
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // Revert a revision
            await revisionHelper.revertRevisions({
                revert: true,
                cancel: false
            });

            // testData.Topic.title is already back to original from createTopicChildContentTopicTree's finally block
            testSetUpData.contentTitleforTest.contentTitle = testData.Topic.title;

            // Navigate back to verify both child content items are displayed
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // Verify that both Application and Article child content appear
            await topicHelper.verifyTopicChildContentVisibility({
                application: true,
                article: true,
                subtopic: false
            });
        });





});
