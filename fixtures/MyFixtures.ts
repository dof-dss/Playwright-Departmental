import { test as base } from '@playwright/test';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { LoginHelper } from '@helpers/general/LoginHelper';
import { ApplicationHelper } from '@helpers/content/ApplicationHelper';
import { ArticleHelper } from '@helpers/content/ArticleHelper';
import { ConsultationHelper } from '@helpers/content/ConsultationHelper';
import { NewsHelper } from '@helpers/content/NewsHelper';
import { PublicationHelper } from '@helpers/content/PublicationHelper';
import { GalleryHelper } from '@helpers/content/GalleryHelper';
import { ProfileHelper } from '@helpers/content/ProfileHelper';
import { ContentModerationHelper } from '@helpers/general/ContentModerationHelper';
import { AnonymousHelper } from '@helpers/general/AnonymousHelper';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';
import { RevisionHelper } from '@helpers/general/RevisionHelper';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { WorkBenchHelper } from '@helpers/general/WorkBenchHelper';
import { BasePage } from '@poms/base-pages/BasePage';
import { ContentNodePageRouter } from '@helpers/general/ContentNodePageRouter';
import { ContactHelper } from '@helpers/content/ContactHelper';
import { UALHelper } from '@helpers/content/UALHelper';
import { EventHelper } from '@helpers/content/EventHelper';
import { LinkHelper } from '@helpers/content/LinkHelper';
import { HeritageSiteHelper } from '@helpers/content/HeritageSiteHelper';
import { ProtectedAreaHelper } from '@helpers/content/ProtectedAreaHelper';
import { HomePage } from '@poms/anon-pages/HomePage';
import { MediaHelper } from '@helpers/general/MediaHelper';
import { TopicHelper } from '@helpers/content/TopicHelper';
import { SubtopicHelper } from '@helpers/content/SubtopicHelper';
import { TopicVisibilityHelper } from '@helpers/general/TopicVisibilityHelper';

// setting my fixtures
type MyFixtures = {
    testSetUpData: typeof TestSetUpData;
    testData: typeof TestData;
    loginHelper: LoginHelper;
    applicationHelper: ApplicationHelper;
    homePage: HomePage;
    articleHelper: ArticleHelper;
    consultationHelper: ConsultationHelper;
    contactHelper: ContactHelper;
    eventHelper: EventHelper;
    galleryHelper: GalleryHelper;
    heritageSiteHelper: HeritageSiteHelper;
    protectedAreaHelper: ProtectedAreaHelper;
    linkHelper: LinkHelper;
    newsHelper: NewsHelper;
    publicationHelper: PublicationHelper;
    profileHelper: ProfileHelper;
    ualHelper: UALHelper;
    topicHelper: TopicHelper;
    subtopicHelper: SubtopicHelper;
    topicVisibilityHelper: TopicVisibilityHelper;
    contentModerationHelper: ContentModerationHelper;
    anonymousHelper: AnonymousHelper;
    mediaHelper: MediaHelper;
    navigateToCreatedContentHelper: NavigateToCreatedContentHelper;
    revisionHelper: RevisionHelper;
    topicsTreeHelper: TopicsTreeHelper;
    workBenchHelper: WorkBenchHelper;
    basePage: BasePage;
    contentNodePageRouter: ContentNodePageRouter;
};

// Extend the base test with isolated clones and helper instances
export const test = base.extend<MyFixtures>({

    // Fixture for TestSetUpData
    testSetUpData: async ({ }, use) =>
    {
        // Validation: If this is undefined, the import path is likely wrong
        if (!TestSetUpData)
        {
            throw new Error("testSetUpData is undefined. Check import path in baseTest.ts");
        }

        // structuredClone is the standard deep-clone method
        const freshData = structuredClone(TestSetUpData);
        await use(freshData);
    },

    // Fixture for TestData
    testData: async ({ }, use, testInfo) =>
    {
        if (!TestData)
        {
            throw new Error("testData is undefined. Check import path in baseTest.ts");
        }

        // structuredClone is the standard deep-clone method
        const freshDataForContent = structuredClone(TestData);

        // creating unique identifier because tests running in parrellel were breaking on duplicate titles
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(8, 14); // MMDDHH format
        const uniqueId = `W${testInfo.parallelIndex}-${timestamp}-${Math.floor(Math.random() * 1000)}`;

        // inject the unique ID into the title
        freshDataForContent.Application.title = freshDataForContent.Application.title + ' - ' + uniqueId;
        freshDataForContent.Application.titleEdited = freshDataForContent.Application.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Article.title = freshDataForContent.Article.title + ' - ' + uniqueId;
        freshDataForContent.Article.titleEdited = freshDataForContent.Article.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Consultation.title = freshDataForContent.Consultation.title + ' - ' + uniqueId;
        freshDataForContent.Consultation.titleEdited = freshDataForContent.Consultation.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Contact.title = freshDataForContent.Contact.title + ' - ' + uniqueId;
        freshDataForContent.Contact.titleEdited = freshDataForContent.Contact.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Event.title = freshDataForContent.Event.title + ' - ' + uniqueId;
        freshDataForContent.Event.titleEdited = freshDataForContent.Event.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Gallery.title = freshDataForContent.Gallery.title + ' - ' + uniqueId;
        freshDataForContent.Gallery.titleEdited = freshDataForContent.Gallery.titleEdited + ' - ' + uniqueId;
        freshDataForContent.HeritageSite.title = freshDataForContent.HeritageSite.title + ' - ' + uniqueId;
        freshDataForContent.HeritageSite.titleEdited = freshDataForContent.HeritageSite.titleEdited + ' - ' + uniqueId;
        freshDataForContent.ProtectedArea.title = freshDataForContent.ProtectedArea.title + ' - ' + uniqueId;
        freshDataForContent.ProtectedArea.titleEdited = freshDataForContent.ProtectedArea.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Link.title = freshDataForContent.Link.title + ' - ' + uniqueId;
        freshDataForContent.Link.titleEdited = freshDataForContent.Link.titleEdited + ' - ' + uniqueId;
        freshDataForContent.News.title = freshDataForContent.News.title + ' - ' + uniqueId;
        freshDataForContent.News.titleEdited = freshDataForContent.News.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Profile.title = freshDataForContent.Profile.title + ' - ' + uniqueId;
        freshDataForContent.Profile.titleEdited = freshDataForContent.Profile.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Publication.title = freshDataForContent.Publication.title + ' - ' + uniqueId;
        freshDataForContent.Publication.titleEdited = freshDataForContent.Publication.titleEdited + ' - ' + uniqueId;
        freshDataForContent.SecurePublication.title = freshDataForContent.SecurePublication.title + ' - ' + uniqueId;
        freshDataForContent.SecurePublication.titleEdited = freshDataForContent.SecurePublication.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Subtopic.title = freshDataForContent.Subtopic.title + ' - ' + uniqueId;
        freshDataForContent.Subtopic.titleEdited = freshDataForContent.Subtopic.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Topic.title = freshDataForContent.Topic.title + ' - ' + uniqueId;
        freshDataForContent.Topic.titleEdited = freshDataForContent.Topic.titleEdited + ' - ' + uniqueId;
        freshDataForContent.Unlawfully.title = freshDataForContent.Unlawfully.title + ' - ' + uniqueId;
        freshDataForContent.Unlawfully.titleEdited = freshDataForContent.Unlawfully.titleEdited + ' - ' + uniqueId;


        await use(freshDataForContent);
    },

    // Fixture for LoginHelper (Injects isolated testSetUpData)
    loginHelper: async ({ page, testSetUpData }, use) =>
    {
        await use(new LoginHelper(page, testSetUpData));
    },

    // Fixture for HomePage (Injects isolated testSetUpData and testData)
    homePage: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new HomePage(page, testData, testSetUpData));
    },

    // Fixtures for content helpers (Injects isolated testSetUpData and testData)
    applicationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ApplicationHelper(page, testSetUpData, testData));
    },
    articleHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ArticleHelper(page, testSetUpData, testData));
    },
    consultationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ConsultationHelper(page, testSetUpData, testData));
    },
    contactHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ContactHelper(page, testSetUpData, testData));
    },
    eventHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new EventHelper(page, testSetUpData, testData));
    },
    galleryHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new GalleryHelper(page, testSetUpData, testData));
    },
    heritageSiteHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new HeritageSiteHelper(page, testSetUpData, testData));
    },
    protectedAreaHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ProtectedAreaHelper(page, testSetUpData, testData));
    },
    linkHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new LinkHelper(page, testSetUpData, testData));
    },
    newsHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new NewsHelper(page, testSetUpData, testData));
    },
    publicationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new PublicationHelper(page, testSetUpData, testData));
    },
    profileHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ProfileHelper(page, testSetUpData, testData));
    },
    ualHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new UALHelper(page, testSetUpData, testData));
    },
    topicHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new TopicHelper(page, testSetUpData, testData));
    },
    subtopicHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new SubtopicHelper(page, testSetUpData, testData));
    },
    topicVisibilityHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new TopicVisibilityHelper(page, testSetUpData, testData));
    },

    // Fixture for AnonymousHelper (Injects isolated testSetUpData and testData)
    anonymousHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new AnonymousHelper(page, testSetUpData, testData));
    },
    // Fixture for MediaHelper (Injects isolated testSetUpData and testData)
    mediaHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new MediaHelper(page, testSetUpData, testData));
    },
    // Reusing basePage fixture for content pages as well, since it contains common methods like clickContentLink and logOut (Injects isolated testSetUpData)
    basePage: async ({ page, testSetUpData }, use) =>
    {
        await use(new BasePage(page, testSetUpData));
    },
    // Fixture for ContentModerationHelper (Injects isolated testSetUpData and testData)
    contentModerationHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ContentModerationHelper(page, testSetUpData, testData));
    },
    // Fixture for ContentNodePageRouter (Injects isolated testSetUpData and testData)
    contentNodePageRouter: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new ContentNodePageRouter(page, testSetUpData, testData));
    },
    // Fixture for NavigateToCreatedContentHelper (Injects isolated testSetUpData and testData)
    navigateToCreatedContentHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new NavigateToCreatedContentHelper(page, testSetUpData, testData));
    },
    // Fixture for RevisionHelper (Injects isolated testSetUpData and testData)
    revisionHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new RevisionHelper(page, testSetUpData, testData));
    },
    // Fixture for TopicsTreeHelper (Injects isolated testSetUpData and testData)
    topicsTreeHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new TopicsTreeHelper(page, testSetUpData, testData));
    },
    // Fixture for WorkBenchHelper (Injects isolated testSetUpData and testData)
    workBenchHelper: async ({ page, testSetUpData, testData }, use) =>
    {
        await use(new WorkBenchHelper(page, testSetUpData, testData));
    },
});

/* Re-export expect - to create a single, unified entry point for the test script.
// Without the re-export, every test file will require two separate import lines from different locations:
*/
export { expect } from '@playwright/test';