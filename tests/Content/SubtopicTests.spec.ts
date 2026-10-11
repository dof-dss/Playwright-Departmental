import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { TopicVisibilityHelper } from '@helpers/general/TopicVisibilityHelper';

test.describe('Empty Subtopic Tests', { tag: ['@subtopic', '@regression', '@topicsupervisor'] }, () =>
{
    // Pass the fixture for Topic Supervisor into the beforeEach hook and setup the initial topic and subtopic data
    test.beforeEach(async ({ loginHelper, topicHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.finance_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.topicsupervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.topicsupervisor_password;
        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.topic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Topic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.published;

        await loginHelper.loginWithValidUser();
        await topicHelper.createTopic({
            preview: false,
            mandatoryFieldCheck: false,
        });

        testData.SiteTopics.topic1 = testData.Topic.title;

        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.subtopic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Subtopic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;
        testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
    });

    test('Empty-Subtopic-TC01 - Create - Create empty Subtopic and moderate through all stages (preview and mandatory field check) including initial topic creation', { tag: "@create" },
        async ({ subtopicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: true,
                mandatoryFieldCheck: false
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });

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
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });

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
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });

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
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Subtopic-TC02 - Edit - Edit  published empty Subtopic (preview edit)', { tag: "@regression" },
        async ({ subtopicHelper, anonymousHelper, contentModerationHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
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
            await subtopicHelper.editSubtopic({ preview: true });

            // moderating to published  
            await contentModerationHelper.topicSupervisorModerateContent({
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false
            });

            // ensure the edited topic is published and viewable to anon users
            await anonymousHelper.searchAsAnon({ edited: true });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.titleEdited, shouldBeVisible: true, edited: true });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.titleEdited, shouldBeVisible: true, edited: true });
        });

    test('Empty-Subtopic-TC03 - Delete - Ensure Topic Supervisor can delete empty Subtopic', { tag: "@regression" },
        async ({ subtopicHelper, navigateToCreatedContentHelper, contentModerationHelper, anonymousHelper, loginHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
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
            await subtopicHelper.deleteSubtopic({ delete: false, cancel: true });

            // searching as anon to ensure content is viewable as it is published 
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });

            // log back in and navigate to content to confirm cancel did not delete the Topic
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // confirm delete
            await subtopicHelper.deleteSubtopic({ delete: true, cancel: false });

            // confirm content deleted
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: false,
                deleted: true
            });

            // ensure the deleted Topic is not viewable to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
        });

    test('Empty-Subtopic-TC04 - Compare revisions- Edit empty Subtopic content and ensure user is able to Compare revisions', { tag: "@regression" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision to compare against the original Topic
            await subtopicHelper.editSubtopic({ preview: false });

            await revisionHelper.compareRevisions();
        });

    test('Empty-Subtopic-TC05 - Delete revision - Edit Subtopic content and ensure user is able to Delete Revisions', { tag: "@regression" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision before deleting it
            await subtopicHelper.editSubtopic({ preview: false });

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

    test('Empty-Subtopic-TC06 - Revert revision - Edit Subtopic content and ensure user is able to Revert Revisions', { tag: "@regression" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision before reverting it
            await subtopicHelper.editSubtopic({ preview: false });

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

    test('Empty-Subtopic-TC07- Workbench -  Create Subtopic content as a "Topic Supervisor", and use Workbench to complete all moderation states', { tag: "@regression" },
        async ({ subtopicHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
        {
            console.log(testSetUpData.contentTitleforTest.contentTitle + ' - creating content with this title');

            // creating topic as a draft
            await subtopicHelper.createSubtopic({
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

    test('Empty-Subtopic-TC08 - Archived Subtopic should not be displayed in topics tree', { tag: "@regression" },
        async ({ subtopicHelper, applicationHelper, topicsTreeHelper, contentModerationHelper, anonymousHelper, topicVisibilityHelper, testData, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
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

    test('Empty-Subtopic-TC09 - Emsure that Hide Listing functionality prevents Subtopic being listed on parent topic pages and home page', { tag: "@regression" },
        async ({ subtopicHelper, contentModerationHelper, anonymousHelper, topicVisibilityHelper, testData }) =>
        {
            await subtopicHelper.createSubtopic({
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
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
        });
});


