import { Page, expect } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { SubtopicCreatePage } from '@poms/content-pages/Subtopic/SubtopicCreatePage';
import { SubtopicEditPage } from '@poms/content-pages/Subtopic/SubtopicEditPage';
import { SubtopicNodePage } from '@poms/content-pages/Subtopic/SubtopicNodePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TopicHelper } from '@helpers/content/TopicHelper';
import { Topics } from '@poms/base-pages/Topics';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';
import { ApplicationHelper } from '@helpers/content/ApplicationHelper';
import { ArticleHelper } from '@helpers/content/ArticleHelper';
import { ConsultationHelper } from '@helpers/content/ConsultationHelper';
import { NewsHelper } from '@helpers/content/NewsHelper';
import { PublicationHelper } from '@helpers/content/PublicationHelper';
import { ProtectedAreaHelper } from '@helpers/content/ProtectedAreaHelper';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { ProtectedAreaNodePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaNodePage';
import { ApplicationCreatePage } from '@poms/content-pages/Application/ApplicationCreatePage';
import { ArticleCreatePage } from '@poms/content-pages/Article/ArticleCreatePage';
import { ProtectedAreaCreatePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaCreatePage';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    customTopicNeeded: boolean;
    topics?: (string | null)[];
    hideListing?: boolean;
    subtopicParent?: string;
    subtopicData?: typeof TestData.Subtopic;
};

export interface EditSaveOptions
{
    preview: boolean;
    topics?: (string | null)[];
    preserveSiteTopics?: boolean;
};

export interface CreateSubtopicChildContentOptions
{
    application: boolean;
    article: boolean;
    protectedarea: boolean;
    subtopic: boolean;
    consultation?: boolean;
    news?: boolean;
    publication?: boolean;
};

export interface RemoveSubtopicChildContentOptions extends CreateSubtopicChildContentOptions
{
    replacementTopic: string;
}

export class SubtopicHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly subtopicCreatePage: SubtopicCreatePage;
    private readonly subtopicEditPage: SubtopicEditPage;
    private readonly subtopicNodePage: SubtopicNodePage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly topicsHelper: TopicsTreeHelper;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly deletePage: DeletePage;
    private readonly testSteps: TestSteps;
    private readonly siteTopics: Topics;
    private readonly navigateToCreatedContentHelper: NavigateToCreatedContentHelper;

    // constructor
    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        // imported pages
        this.userPage = new UserPage(page, testSetUpData);
        this.basePage = new BasePage(page, testSetUpData);
        this.contentPage = new ContentPage(page, testSetUpData);
        this.addContentPage = new AddContentPage(page, testSetUpData);
        this.subtopicCreatePage = new SubtopicCreatePage(page, testSetUpData, testData);
        this.subtopicEditPage = new SubtopicEditPage(page, testSetUpData, testData);
        this.subtopicNodePage = new SubtopicNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
        this.testSteps = new TestSteps();
        this.siteTopics = new Topics(page, testSetUpData, testData);
        this.navigateToCreatedContentHelper = new NavigateToCreatedContentHelper(page, testSetUpData, testData);
    }

    // navigation method
    async navigateToCreateSubtopic()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Subtopic method
    async createSubtopic(options: SaveOptions)
    {
        const subtopicData = options.subtopicData ?? this.testData.Subtopic;

        if (options.customTopicNeeded)
        {
            const contentType = this.testSetUpData.contentTypeforTest.contentType;
            const contentTitle = this.testSetUpData.contentTitleforTest.contentTitle;
            const saveAsOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
            const moderationState = this.testSetUpData.moderationStateForTest.moderationState;

            try
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
                this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.published;
                await new TopicHelper(this.page, this.testSetUpData, this.testData).createTopic({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
                this.testData.SiteTopics.topic1 = this.testData.Topic.title;
            }
            finally
            {
                this.testSetUpData.contentTypeforTest.contentType = contentType;
                this.testSetUpData.contentTitleforTest.contentTitle = contentTitle;
                this.testSetUpData.saveAsOptionForTest.saveAsOption = saveAsOption;
                this.testSetUpData.moderationStateForTest.moderationState = moderationState;
            }
        }

        // navigate to create subtopic
        await this.navigateToCreateSubtopic();

        // If doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            // TODO: mandatoryFieldCheck() not yet implemented on SubtopicCreatePage
        }

        // set topics for test using select topics for site before filling subtopic form
        await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

        // complete subtopic form using isolated test data
        await this.subtopicCreatePage.fillSubtopicForm({
            subtopicTitle: subtopicData.title,
            revisionLogMessage: subtopicData.revisionlog,
            topics: options.topics ?? this.topicsHelper.getTopics(),
            subtopicParent: options.subtopicParent,
            subtopicSummary: subtopicData.summary,
            subtopicLongDescription: subtopicData.longDescription,
            hideListing: options.hideListing,
        });

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview subtopic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.subtopicNodePage.verifySubtopic(subtopicData);

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicCreatePage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifySubtopic(subtopicData);
    }

    async createSubtopicChildContentTopicTree(
        options: CreateSubtopicChildContentOptions,
        saveAsOption: keyof typeof TestSetUpData.validSaveAsOptionList = 'draft',
        childContentOptions?: { useEditedTitle?: boolean; verifyUnpublishedTopicWarning?: boolean; }
    ): Promise<void>
    {
        const previousSaveAsOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
        const previousConsultationRespondOnline = this.testData.Consultation.respondeOnline;
        const previousParentSubtopicTitle = this.testData.Subtopic.title;
        const previousSiteTopic = this.testData.SiteTopics.topic1;

        if (childContentOptions?.useEditedTitle)
        {
            this.testData.Subtopic.title = this.testData.Subtopic.titleEdited;
        }

        const parentSubtopicTitle = this.testData.Subtopic.title;
        this.testData.SiteTopics.topic1 = parentSubtopicTitle;
        this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList[saveAsOption];

        try
        {
            if (options.application)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Application.title;
                this.testData.Application.LinkURL = 'External whistleblowing procedures on how to make a disclosure';
                this.testData.Application.LinkText = 'External whistleblowing procedures on how to make a disclosure';
                await new ApplicationHelper(this.page, this.testSetUpData, this.testData).createApplication({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
                if (childContentOptions?.verifyUnpublishedTopicWarning)
                {
                    const applicationNodePage = new ApplicationNodePage(this.page, this.testSetUpData, this.testData);
                    await applicationNodePage.verifyUnpublishedTopicWarning();
                }
            }

            if (options.article)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Article.title;
                await new ArticleHelper(this.page, this.testSetUpData, this.testData).createArticle({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
                if (childContentOptions?.verifyUnpublishedTopicWarning)
                {
                    const articleNodePage = new ArticleNodePage(this.page, this.testSetUpData, this.testData);
                    await articleNodePage.verifyUnpublishedTopicWarning();
                }
            }

            if (options.protectedarea)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.protectedarea;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.ProtectedArea.title;
                await new ProtectedAreaHelper(this.page, this.testSetUpData, this.testData).createProtectedArea({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
                if (childContentOptions?.verifyUnpublishedTopicWarning)
                {
                    const protectedAreaNodePage = new ProtectedAreaNodePage(this.page, this.testSetUpData, this.testData);
                    await protectedAreaNodePage.verifyUnpublishedTopicWarning();
                }
            }

            if (options.subtopic)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.SubtopicChild.title;
                await this.createSubtopic({
                    preview: false,
                    mandatoryFieldCheck: false,
                    customTopicNeeded: false,
                    topics: [parentSubtopicTitle],
                    subtopicParent: this.testData.Topic.title,
                    subtopicData: this.testData.SubtopicChild,
                });

                if (childContentOptions?.verifyUnpublishedTopicWarning)
                {
                    const subtopicNodePage = new SubtopicNodePage(this.page, this.testSetUpData, this.testData);
                    await subtopicNodePage.verifyUnpublishedTopicWarning();
                }
            }

            if (options.consultation)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.consultation;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Consultation.title;
                this.testData.Consultation.respondeOnline = 'External whistleblowing procedures on how to make a disclosure';
                await new ConsultationHelper(this.page, this.testSetUpData, this.testData).createConsultation({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
            }

            if (options.news)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.news;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.News.title;
                await new NewsHelper(this.page, this.testSetUpData, this.testData).createNews({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
            }

            if (options.publication)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.publication;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.title;
                await new PublicationHelper(this.page, this.testSetUpData, this.testData).createPublication({
                    preview: false,
                    mandatoryFieldCheck: false,
                    subtopicParent: this.testData.Topic.title,
                });
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
            this.testSetUpData.contentTitleforTest.contentTitle = parentSubtopicTitle;
            this.testData.Consultation.respondeOnline = previousConsultationRespondOnline;
            this.testSetUpData.saveAsOptionForTest.saveAsOption = previousSaveAsOption;
            this.testData.Subtopic.title = previousParentSubtopicTitle;
            this.testData.SiteTopics.topic1 = previousSiteTopic;
        }
    }

    async verifySubtopicChildContentVisibility(options: CreateSubtopicChildContentOptions & { edited?: boolean; })
    {
        await this.subtopicNodePage.verifySubtopicChildContentVisibility(options);
    }

    async removeChildContentByTopicTree(options: RemoveSubtopicChildContentOptions): Promise<void>
    {
        const previousSaveAsOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
        const selectedChildren = [
            {
                selected: options.application,
                contentType: this.testSetUpData.validContentTypeList.application,
                title: this.testData.Application.title,
                revisionLog: this.testData.Application.revisionlog,
            },
            {
                selected: options.article,
                contentType: this.testSetUpData.validContentTypeList.article,
                title: this.testData.Article.title,
                revisionLog: this.testData.Article.revisionlog,
            },
            {
                selected: options.protectedarea,
                contentType: this.testSetUpData.validContentTypeList.protectedarea,
                title: this.testData.ProtectedArea.title,
                revisionLog: this.testData.ProtectedArea.revisionlog,
            },
            {
                selected: options.subtopic,
                contentType: this.testSetUpData.validContentTypeList.subtopic,
                title: this.testData.SubtopicChild.title,
                revisionLog: this.testData.SubtopicChild.revisionlog,
            },
            {
                selected: options.consultation,
                contentType: this.testSetUpData.validContentTypeList.consultation,
                title: this.testData.Consultation.title,
                revisionLog: this.testData.Consultation.revisionlog,
            },
            {
                selected: options.news,
                contentType: this.testSetUpData.validContentTypeList.news,
                title: this.testData.News.title,
                revisionLog: this.testData.News.revisionlog,
            },
            {
                selected: options.publication,
                contentType: this.testSetUpData.validContentTypeList.publication,
                title: this.testData.Publication.title,
                revisionLog: this.testData.Publication.revisionlog,
            },
        ].filter(child => child.selected);

        this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.draft;

        try
        {
            for (const child of selectedChildren)
            {
                this.testSetUpData.contentTypeforTest.contentType = child.contentType;
                this.testSetUpData.contentTitleforTest.contentTitle = child.title;
                await this.navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickEditContentButton();
                await this.siteTopics.replaceSiteTopic(
                    this.testData.Subtopic.title,
                    options.replacementTopic,
                    this.testData.Topic.title,
                );
                await this.createPage.enterRevisionLogMessage(child.revisionLog);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();

                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickQuickPublishButton();
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Subtopic.title;
            this.testSetUpData.saveAsOptionForTest.saveAsOption = previousSaveAsOption;
        }

        await this.navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
    }

    async createSubtopicChildContentQuicklyAdd(options: CreateSubtopicChildContentOptions): Promise<void>
    {
        await this.subtopicNodePage.subtopicNodeURLCheck();
        const parentSubtopicTitle = this.testData.Subtopic.title;
        const previousContentType = this.testSetUpData.contentTypeforTest.contentType;
        const previousContentTitle = this.testSetUpData.contentTitleforTest.contentTitle;
        const previousSaveAsOption = this.testSetUpData.saveAsOptionForTest.saveAsOption;
        const previousGlobalTopic = this.testSetUpData.globalTopicForTest.globalTopic;
        const previousSiteTopic = this.testData.SiteTopics.topic1;
        const topics = [parentSubtopicTitle, null, null, null];

        this.testData.SiteTopics.topic1 = parentSubtopicTitle;
        this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.draft;

        const returnToParentSubtopic = async () =>
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
            this.testSetUpData.contentTitleforTest.contentTitle = parentSubtopicTitle;
            await this.testSteps.LogInfo(`Clicking the "${parentSubtopicTitle}" link to return to the parent Subtopic`);
            await this.page.locator(`//a[text()="${parentSubtopicTitle}"]`).first().click();
            await this.subtopicNodePage.subtopicNodeURLCheck();
        };

        try
        {
            if (options.application)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddApplication();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Application.title;
                this.testData.Application.LinkURL = 'External whistleblowing procedures on how to make a disclosure';
                this.testData.Application.LinkText = this.testData.Application.LinkURL;
                this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;
                const applicationCreatePage = new ApplicationCreatePage(this.page, this.testSetUpData, this.testData);
                await applicationCreatePage.fillApplicationForm({
                    applicationTitle: this.testData.Application.title,
                    revisionLogMessage: this.testData.Application.revisionlog,
                    globalTopicChoice: this.testData.GlobalTopics.employment,
                    topics,
                    applicationSummary: this.testData.Application.summary,
                    beforeyoustart: this.testData.Application.beforeyoustart,
                    applicationLinkURL: this.testData.Application.LinkURL,
                    applicationLinkText: this.testData.Application.LinkText,
                    additionalinfo: this.testData.Application.additionalinfo,
                }, true);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const applicationNodePage = new ApplicationNodePage(this.page, this.testSetUpData, this.testData);
                await applicationNodePage.applicationNodeURLCheck();
                await applicationNodePage.verifyApplication({ preview: true, topics });
                await returnToParentSubtopic();
            }

            if (options.article)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddArticle();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Article.title;
                this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;
                const articleCreatePage = new ArticleCreatePage(this.page, this.testSetUpData, this.testData);
                await articleCreatePage.fillArticleForm({
                    articleTitle: this.testData.Article.title,
                    revisionLogMessage: this.testData.Article.revisionlog,
                    globalTopicChoice: this.testData.GlobalTopics.employment,
                    topics,
                    articleSummary: this.testData.Article.summary,
                    articleBodyField: this.testData.Article.body,
                }, 'standard', true);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const articleNodePage = new ArticleNodePage(this.page, this.testSetUpData, this.testData);
                await articleNodePage.articleNodeURLCheck();
                await articleNodePage.verifyArticle({ topics, expectedTitle: this.testData.Article.title });
                await returnToParentSubtopic();
            }

            if (options.protectedarea)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddProtectedArea();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.protectedarea;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.ProtectedArea.title;
                const protectedAreaCreatePage = new ProtectedAreaCreatePage(this.page, this.testSetUpData, this.testData);
                await protectedAreaCreatePage.fillProtectedAreaForm({
                    protectedAreaTitle: this.testData.ProtectedArea.title,
                    revisionLogMessage: this.testData.ProtectedArea.revisionlog,
                    topics,
                    protectedAreaType: this.testData.ProtectedArea.type,
                    featureType: this.testData.ProtectedArea.feature,
                    county: this.testData.ProtectedArea.county,
                    council: this.testData.ProtectedArea.council,
                    document: this.testData.ProtectedArea.document,
                    body: this.testData.ProtectedArea.body,
                }, true);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const protectedAreaNodePage = new ProtectedAreaNodePage(this.page, this.testSetUpData, this.testData);
                await protectedAreaNodePage.protectedAreaNodeURLCheck();
                await protectedAreaNodePage.verifyProtectedArea({ preview: false });
                await returnToParentSubtopic();
            }

            if (options.subtopic)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddSubtopic();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.SubtopicChild.title;
                const subtopicCreatePage = new SubtopicCreatePage(this.page, this.testSetUpData, this.testData);
                await subtopicCreatePage.fillSubtopicForm({
                    subtopicTitle: this.testData.SubtopicChild.title,
                    revisionLogMessage: this.testData.SubtopicChild.revisionlog,
                    topics,
                    subtopicSummary: this.testData.SubtopicChild.summary,
                    subtopicLongDescription: this.testData.SubtopicChild.longDescription,
                }, true);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const subtopicNodePage = new SubtopicNodePage(this.page, this.testSetUpData, this.testData);
                await subtopicNodePage.subtopicNodeURLCheck();
                await subtopicNodePage.verifySubtopic(this.testData.SubtopicChild);
                await returnToParentSubtopic();
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = previousContentType;
            this.testSetUpData.contentTitleforTest.contentTitle = previousContentTitle;
            this.testSetUpData.saveAsOptionForTest.saveAsOption = previousSaveAsOption;
            this.testSetUpData.globalTopicForTest.globalTopic = previousGlobalTopic;
            this.testData.SiteTopics.topic1 = previousSiteTopic;
        }
    }

    // edit Subtopic method
    async editSubtopic(options: EditSaveOptions)
    {
        // should be on node page already
        await this.subtopicNodePage.subtopicNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // set topics for test using select topics for site before filling subtopic edit form
        if (!options.preserveSiteTopics && !options.topics)
        {
            await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });
        }

        // complete subtopic form using edit isolated test data
        await this.subtopicEditPage.editSubtopicForm({
            subtopicTitle: this.testData.Subtopic.titleEdited,
            revisionLogMessage: this.testData.Subtopic.revisionlogEdited,
            topics: options.topics ?? this.topicsHelper.getTopics(),
            subtopicSummary: this.testData.Subtopic.summaryEdited,
            subtopicLongDescription: this.testData.Subtopic.longDescriptionEdited,
        }, !options.preserveSiteTopics);

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Subtopic.titleEdited;

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview subtopic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.subtopicNodePage.verifyEditedSubtopic();

            await this.previewPage.clickBackToContentEdittingButton();
            await this.subtopicEditPage.returnFromPreviewSubtopicPageURLCheck();
        }

        // Save
        await this.createPage.clickSaveButton();
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.subtopicNodePage.verifyEditedSubtopic();
    }

    async verifyOnParentTopic(options: { parentTopicUrl: string; title: string; shouldBeVisible: boolean; })
    {
        await this.testSteps.LogInfo(`Navigating to parent Topic URL "${options.parentTopicUrl}" to verify Subtopic "${options.title}" visibility`);
        await this.page.goto(options.parentTopicUrl);
        const subtopicLink = this.page.getByRole('main').getByRole('link', { name: options.title, exact: true });

        await this.testSteps.LogInfo(`Verifying Subtopic "${options.title}" is ${options.shouldBeVisible ? 'visible' : 'hidden'} on the parent Topic page`);
        if (options.shouldBeVisible)
        {
            await expect(subtopicLink).toBeVisible();
        }
        else
        {
            await expect(subtopicLink).toBeHidden();
        }
    }

    async deleteSubtopic(options: { delete: boolean; cancel: boolean; })
    {
        await this.subtopicNodePage.subtopicNodeURLCheck();
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickDeleteButton();
        await this.deletePage.deleteNodePageURLCheck();

        if (options.delete)
        {
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel)
        {
            await this.deletePage.clickCancel();
            await this.subtopicNodePage.subtopicNodeURLCheck();
        }
    }
}
