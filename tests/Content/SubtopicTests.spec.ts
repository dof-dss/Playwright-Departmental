import { TestSteps } from '@poms/base-pages/TestSteps';
import { test } from '@fixtures/MyFixtures';
import { TopicVisibilityHelper } from '@helpers/general/TopicVisibilityHelper';

test.describe('Empty Subtopic Tests', { tag: ['@subtopics', '@regression', '@topic_supervisor'] }, () =>
{
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.topicsupervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.topicsupervisor_password;
        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.subtopic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Subtopic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.draft;
        testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.draft;
        await loginHelper.loginWithValidUser();
    });

    test('Empty-Subtopic-TC01 - Create - Create empty Subtopic and moderate through all stages (preview and mandatory field check) including initial topic creation', { tag: "@create" },
        async ({ subtopicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: true,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
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

    test('Empty-Subtopic-TC02 - Edit - Edit  published empty Subtopic (preview edit)', { tag: "@edit" },
        async ({ subtopicHelper, anonymousHelper, contentModerationHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
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
            // ensuring the edited topic is no longer visible to anon users on the orgininal parent topic after it has been edited
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.titleEdited, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.titleEdited, shouldBeVisible: false, edited: false });
        });

    test('Empty-Subtopic-TC03 - Delete - Ensure Topic Supervisor can delete empty Subtopic', { tag: "@delete" },
        async ({ subtopicHelper, navigateToCreatedContentHelper, contentModerationHelper, anonymousHelper, loginHelper, topicVisibilityHelper, testData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
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

    test('Empty-Subtopic-TC04 - Compare revisions- Edit empty Subtopic content and ensure user is able to Compare revisions', { tag: "@revision" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: false,
            });

            // overriding test data so that Edit test saves as Needs Review
            testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.needsreview;

            // create a second revision to compare against the original Topic
            await subtopicHelper.editSubtopic({ preview: false });

            await revisionHelper.compareRevisions();
        });

    test('Empty-Subtopic-TC05 - Delete revision - Edit Subtopic content and ensure user is able to Delete Revisions', { tag: "@revision" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: false,
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

    test('Empty-Subtopic-TC06 - Revert revision - Edit Subtopic content and ensure user is able to Revert Revisions', { tag: "@revision" },
        async ({ subtopicHelper, revisionHelper, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: false,
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

    test('Empty-Subtopic-TC07- Workbench -  Create Subtopic content as a "Topic Supervisor", and use Workbench to complete all moderation states', { tag: "@workbench" },
        async ({ subtopicHelper, contentModerationHelper, workBenchHelper, testSetUpData }) =>
        {
            // creating topic as a draft
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: false,
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

    test('Empty-Subtopic-TC08 - Archived Subtopic should not be displayed in topics tree', { tag: "@Topics_tree_visibility" },
        async ({ subtopicHelper, applicationHelper, topicsTreeHelper, contentModerationHelper, anonymousHelper, topicVisibilityHelper, testData, testSetUpData }) =>
        {
            // creating content
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
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

});

test.describe('Full Subtopic Tests', { tag: ['@subtopics', '@regression', '@topicsupervisor'] }, () =>
{
    test.beforeEach(async ({ loginHelper, testSetUpData, testData }, testInfo) =>
    {
        const testSteps = new TestSteps();
        await testSteps.LogInfo('Test starting');
        await testSteps.LogInfo(testInfo.title);

        testSetUpData.urlForTest.url = testSetUpData.validTestURLList.daera_url;
        testSetUpData.userForTest.username = testSetUpData.validUserList.topicsupervisor_username;
        testSetUpData.userForTest.password = testSetUpData.validUserList.topicsupervisor_password;
        testSetUpData.contentTypeforTest.contentType = testSetUpData.validContentTypeList.subtopic;
        testSetUpData.contentTitleforTest.contentTitle = testData.Subtopic.title;
        testSetUpData.saveAsOptionForTest.saveAsOption = testSetUpData.validSaveAsOptionList.published;
        testSetUpData.moderationStateForTest.moderationState = testSetUpData.validModerationStates.published;
        await loginHelper.loginWithValidUser();
    });


    test('Full-Subtopic-TC01 - Create - Create full Subtopic using topics tree and moderate child content through all states', { tag: '@create' },
        async ({ subtopicHelper, topicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testSetUpData, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: true,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentTopicTree({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: false,
                news: false,
                publication: false,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but Draft children are not
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published subtopic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
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
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false,
            });

            // verify core child content in needs review is visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: false,
                news: false,
                publication: false,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but Needs Review children are not
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published subtopic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
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
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false,
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but published  children are too 
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify published subtopic is visible on /topics page but published children are too
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
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
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true,
            });

            // verify that all newly archived children are NOT visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but published children are not as archived 
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify published subtopic is visible on /topics page but published children are not as archived
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });
        });

    test('Full-Subtopic-TC02 - Create - Create full Subtopic using quickly add and moderate child content through all states', { tag: '@create' },
        async ({ subtopicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentQuicklyAdd({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // verify that all created Draft children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but Draft children are not
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            // verify published subtopic is visible on the topics page but Draft children are not
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            ////////////////////////////////
            //////// NEEDS REVIEW //////////
            ////////////////////////////////

            // log back in and naviagte to content
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: true,
                Published: false,
                Archive: false,
            });

            // verify core child content in needs review is visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // searching as anon to ensure content is not viewable as draft
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but Needs Review children are not
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            // verify published subtopic is visible on /topics page but Needs Review children are not
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            ////////////////////////////////
            ////////// PUBLISHED ///////////
            ////////////////////////////////

            // log back in and naviagte to content
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false,
            });

            // verify that all needs review children are visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // searching as anon to ensure content is viewable as published
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage and published children are too
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // verify published subtopic is visible on /topics page and published children are too
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            ////////////////////////////////
            ////////// ARCHIVED ////////////
            ////////////////////////////////

            // log back in and naviagte to content
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true,
            });

            // verify that all newly archived children are NOT visible to the logged-in Topic Supervisor
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            // searching as anon to ensure content is not viewable as archived
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic is visible on homepage but archived children are not
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });

            // verify published subtopic is visible on /topics page but archived children are not
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
            });
        });

    test('Full-Subtopic-TC03 - Edit - Edit Subtopic by removing some child content using the topics tree', { tag: '@edit' },
        async ({ subtopicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentTopicTree({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false,
            });

            // verify all published children are visible to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic and children via the homepage
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // verify published subtopic and children via the topics page
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // log back in and navigate to content
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // remove child content using the topics tree
            await subtopicHelper.removeChildContentByTopicTree({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: false,
                replacementTopic: 'Food',
            });

            await anonymousHelper.searchAsAnon({ edited: false });

            // verify removed children are absent and the child subtopic remains via the homepage
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: true,
            });

            // verify the same child visibility via the topics page
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: true,
            });
        });

    test('Full-Subtopic-TC04 - Edit - Edit Subtopic by removing Consultation, News and Publication using the topics tree', { tag: '@edit' },
        async ({ subtopicHelper, anonymousHelper, loginHelper, contentModerationHelper, navigateToCreatedContentHelper, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentTopicTree({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false,
            });

            // verify all published children are visible to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });

            // verify published subtopic and children via the homepage
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify published subtopic and children via the topics page
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
            });

            // log back in and navigate to content
            await loginHelper.loginWithValidUser();
            await navigateToCreatedContentHelper.navigateToCreatedContent({
                active: true,
                deleted: false
            });

            // remove child content using the topics tree
            await subtopicHelper.removeChildContentByTopicTree({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: true,
                news: true,
                publication: true,
                replacementTopic: 'Food',
            });

            await anonymousHelper.searchAsAnon({ edited: false });

            // verify removed children are absent via the homepage
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });

            // verify the same child visibility via the topics page
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: true, edited: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: false,
                article: false,
                protectedarea: false,
                subtopic: false,
                consultation: false,
                news: false,
                publication: false,
            });
        });

    test('Full-Subtopic-TC05 - Edit - Rearrange Application, Article, Protected Area and Subtopic child content with drag and drop on the edit node page', { tag: '@edit' },
        async ({ subtopicHelper, navigateToCreatedContentHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentQuicklyAdd({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // use drag and drop on the edit node page to edit the subtopic
            await subtopicHelper.editSubtopicUsingDragAndDrop();
        });

    test('Full-Subtopic-TC06 - Edit - Reorder Application, Article, Protected Area and Subtopic child content using the moderation sidebar Arrange Content button', { tag: '@edit' },
        async ({ subtopicHelper, navigateToCreatedContentHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentQuicklyAdd({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // reorder Subtopic Content using the Arrange Content modal
            await subtopicHelper.arrangeSubtopicContentUsingDragAndDrop();
        });

    test('Full-Subtopic-TC07 - Edit - Edit child content nodes and verify child content edits displayed correctly', { tag: '@edit' },
        async ({ subtopicHelper, contentModerationHelper, navigateToCreatedContentHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentTopicTree({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // moderate all children content to published
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: true,
                Archive: false,
            });

            // edit child content nodes
            await subtopicHelper.editSubtopicChildContentNodes({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
            });

            // verify child content edits displayed correctly
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
            await subtopicHelper.verifySubtopicChildContentVisibility({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                consultation: true,
                news: true,
                publication: true,
                edited: true,
            });
        });

    test('Full-Subtopic-TC08 - Delete - Ensure cannot delete Subtopic with Application, Article, Protected Area and Subtopic child content by moderation sidebar but can when child content archived', { tag: '@delete' },
        async ({ subtopicHelper, anonymousHelper, contentModerationHelper, navigateToCreatedContentHelper, testData, topicVisibilityHelper }) =>
        {
            await subtopicHelper.createSubtopic({
                preview: false,
                mandatoryFieldCheck: false,
                customTopicNeeded: true,
            });

            await subtopicHelper.createSubtopicChildContentTopicTree({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // verify deletion is blocked while child content is in draft
            await subtopicHelper.verifySubtopicDeletionIsBlocked();

            for (const moderationState of ['Needs Review', 'Published'])
            {
                await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                    application: true,
                    article: true,
                    protectedarea: true,
                    subtopic: true,
                    QuickPublish: false,
                    NeedsReview: moderationState === 'Needs Review',
                    Published: moderationState === 'Published',
                    Archive: false,
                });

                await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await subtopicHelper.verifySubtopicDeletionIsBlocked();
            }

            /////// ARCHIVED ///////

            // moderate all children content to archived
            await contentModerationHelper.topicSupervisorModerateAllSubtopicChildrenContent({
                application: true,
                article: true,
                protectedarea: true,
                subtopic: true,
                QuickPublish: false,
                NeedsReview: false,
                Published: false,
                Archive: true,
            });

            // navigate back to parent subtopic
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });

            // delete the parent subtopic while child content is archived
            await subtopicHelper.deleteSubtopic({ delete: true, cancel: false });

            // verify delete
            await navigateToCreatedContentHelper.navigateToCreatedContent({ active: false, deleted: true });

            // ensure the deleted subtopic is not viewable to anonymous users
            await anonymousHelper.searchAsAnon({ edited: false });
            await topicVisibilityHelper.verifySubtopicViaHomepage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
            await topicVisibilityHelper.verifySubtopicViaTopicsPage({ title: testData.Subtopic.title, shouldBeVisible: false, edited: false });
        });
});







