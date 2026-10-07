import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { TopicCreatePage } from '@poms/content-pages/Topic/TopicCreatePage';
import { TopicEditPage } from '@poms/content-pages/Topic/TopicEditPage';
import { TopicNodePage } from '@poms/content-pages/Topic/TopicNodePage';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { UserPage } from '@poms/base-pages/UserPage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { ApplicationHelper } from '@helpers/content/ApplicationHelper';
import { ArticleHelper } from '@helpers/content/ArticleHelper';
import { SubtopicHelper } from '@helpers/content/SubtopicHelper';
import { ConsultationHelper } from '@helpers/content/ConsultationHelper';
import { NewsHelper } from '@helpers/content/NewsHelper';
import { PublicationHelper } from '@helpers/content/PublicationHelper';
import { ApplicationCreatePage } from '@poms/content-pages/Application/ApplicationCreatePage';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleCreatePage } from '@poms/content-pages/Article/ArticleCreatePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { SubtopicCreatePage } from '@poms/content-pages/Subtopic/SubtopicCreatePage';
import { SubtopicNodePage } from '@poms/content-pages/Subtopic/SubtopicNodePage';
import { Topics } from '@poms/base-pages/Topics';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';

export interface SaveOptions
{
    preview: boolean;
    mandatoryFieldCheck: boolean;
    hideListing?: boolean;
};

export interface EditSaveOptions
{
    preview: boolean;
};

export interface DeleteOptions
{
    delete: boolean;
    cancel: boolean;
};

export interface CreateTopicChildContentOptions
{
    application: boolean;
    article: boolean;
    subtopic: boolean;
    consultation?: boolean;
    news?: boolean;
    publication?: boolean;
}

export interface RemoveTopicChildContentOptions extends CreateTopicChildContentOptions
{
    replacementTopic: string;
}

export class TopicHelper
{
    // pages
    private readonly userPage: UserPage;
    private readonly basePage: BasePage;
    private readonly contentPage: ContentPage;
    private readonly addContentPage: AddContentPage;
    private readonly topicCreatePage: TopicCreatePage;
    private readonly topicEditPage: TopicEditPage;
    private readonly topicNodePage: TopicNodePage;
    private readonly moderationSideBar: ModerationSideBar;
    private readonly previewPage: PreviewPage;
    private readonly createPage: CreatePages;
    private readonly deletePage: DeletePage;
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
        this.topicCreatePage = new TopicCreatePage(page, testSetUpData, testData);
        this.topicEditPage = new TopicEditPage(page, testSetUpData, testData);
        this.topicNodePage = new TopicNodePage(page, testSetUpData, testData);
        this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
        this.previewPage = new PreviewPage(page);
        this.createPage = new CreatePages(page, testSetUpData, testData);
        this.deletePage = new DeletePage(page);
        this.siteTopics = new Topics(page, testSetUpData, testData);
        this.navigateToCreatedContentHelper = new NavigateToCreatedContentHelper(page, testSetUpData, testData);
    }

    // navigation method
    async navigateToCreateTopic()
    {
        await this.basePage.clickContentLink();
        await this.contentPage.contentPageURLCheck();
        await this.contentPage.clickAddContentButton();
        await this.addContentPage.addContentPageURLCheck();
        await this.addContentPage.selectContent();
    }

    // create Topic method
    async createTopic(options: SaveOptions)
    {
        // navigate to create topic
        await this.navigateToCreateTopic();

        // If we're doing mandatory field check, do not fill form
        if (options?.mandatoryFieldCheck)
        {
            // TODO: mandatoryFieldCheck() not yet implemented on TopicCreatePage due to existing issues with validation
        }

        // complete topic form using isolated test data
        await this.topicCreatePage.fillTopicForm({
            topicTitle: this.testData.Topic.title,
            revisionLogMessage: this.testData.Topic.revisionlog,
            topicSummary: this.testData.Topic.summary,
            topicLongDescription: this.testData.Topic.longDescription,
            hideListing: options.hideListing,
        });

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview topic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.topicNodePage.verifyTopic();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.topicCreatePage.returnFromPreviewTopicPageURLCheck();
        }
        // Save
        await this.createPage.clickSaveButton();
        await this.topicNodePage.topicNodeURLCheck();
        await this.topicNodePage.verifyTopic();
    }

    // edit Topic method
    async editTopic(options: EditSaveOptions)
    {
        // should be on node page already
        await this.topicNodePage.topicNodeURLCheck();

        // open moderation sidebar
        await this.moderationSideBar.openModerationSideBar();
        // click edit content
        await this.moderationSideBar.clickEditContentButton();

        // complete topic form using edit isolated test data
        await this.topicEditPage.editTopicForm({
            topicTitle: this.testData.Topic.titleEdited,
            revisionLogMessage: this.testData.Topic.revisionlogEdited,
            topicSummary: this.testData.Topic.summaryEdited,
            topicLongDescription: this.testData.Topic.longDescriptionEdited,
            bannerImageEdit: true,
        });

        // setting test set up data to new title
        this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.titleEdited;

        // Selecting the save as type
        await this.createPage.chooseSaveAsType();

        // if options.preview is set to true, perform preview topic method actions
        if (options.preview)
        {
            await this.createPage.clickPreviewButton();
            await this.previewPage.performURLCheck();
            await this.topicNodePage.verifyEditedTopic();
            await this.previewPage.clickBackToContentEdittingButton();
            await this.topicEditPage.returnFromPreviewTopicPageURLCheck();
        }

        // Save and verify
        await this.createPage.clickSaveButton();
        await this.topicNodePage.topicNodeURLCheck();
        await this.topicNodePage.verifyEditedTopic();
    }

    // delete Topic method
    async deleteTopic(options: DeleteOptions)
    {
        // should be on node page already
        await this.topicNodePage.topicNodeURLCheck();

        // open moderation sidebar and select Delete
        await this.moderationSideBar.openModerationSideBar();
        await this.moderationSideBar.clickDeleteButton();

        if (options.delete === true)
        {
            await this.deletePage.deleteNodePageURLCheck();
            await this.deletePage.clickDelete();
            await this.deletePage.deleteNodeCofirmationCheck();
            await this.contentPage.confirmContentDoesNotExist(this.testSetUpData.contentTitleforTest.contentTitle);
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.deleted;
        }
        else if (options.cancel === true)
        {
            await this.deletePage.deleteNodePageURLCheck();
            await this.deletePage.clickCancel();
            await this.topicNodePage.topicNodeURLCheck();
        }
    }

    async verifyTopicChildContentVisibility(options: CreateTopicChildContentOptions)
    {
        await this.topicNodePage.verifyTopicChildContentVisibility(options);
    }

    async createTopicChildContentTopicTree(options: CreateTopicChildContentOptions): Promise<void>
    {
        this.testData.SiteTopics.topic1 = this.testData.Topic.title;
        this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.draft;

        try
        {
            if (options.application)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Application.title;
                this.testData.Application.LinkURL = 'EPN 02-2020 - Latest Information on the McCloud Judgement';
                this.testData.Application.LinkText = 'EPN 02-2020 - Latest Information on the McCloud Judgement';
                await new ApplicationHelper(this.page, this.testSetUpData, this.testData).createApplication({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }

            if (options.article)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Article.title;
                await new ArticleHelper(this.page, this.testSetUpData, this.testData).createArticle({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }

            if (options.subtopic)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Subtopic.title;
                await new SubtopicHelper(this.page, this.testSetUpData, this.testData).createSubtopic({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }

            if (options.consultation)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.consultation;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Consultation.title;
                await new ConsultationHelper(this.page, this.testSetUpData, this.testData).createConsultation({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }

            if (options.news)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.news;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.News.title;
                await new NewsHelper(this.page, this.testSetUpData, this.testData).createNews({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }

            if (options.publication)
            {
                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.publication;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Publication.title;
                await new PublicationHelper(this.page, this.testSetUpData, this.testData).createPublication({
                    preview: false,
                    mandatoryFieldCheck: false,
                });
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
        }
    }

    async createTopicChildContentQuicklyAdd(options: CreateTopicChildContentOptions): Promise<void>
    {
        await this.topicNodePage.topicNodeURLCheck();
        this.testData.SiteTopics.topic1 = this.testData.Topic.title;
        const topics = [
            this.testData.SiteTopics.topic1,
            this.testData.SiteTopics.topic2,
            this.testData.SiteTopics.topic3,
            this.testData.SiteTopics.topic4,
        ];
        this.testSetUpData.saveAsOptionForTest.saveAsOption = this.testSetUpData.validSaveAsOptionList.draft;
        const returnToParentTopic = async () =>
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
            await this.page.locator(`//a[text()="${this.testData.Topic.title}"]`).first().click();
            await this.topicNodePage.topicNodeURLCheck();
        };

        try
        {
            if (options.application)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddApplication();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.application;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Application.title;
                this.testData.Application.LinkURL = 'EPN 02-2020 - Latest Information on the McCloud Judgement';
                this.testData.Application.LinkText = 'EPN 02-2020 - Latest Information on the McCloud Judgement';
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
                this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const applicationNodePage = new ApplicationNodePage(this.page, this.testSetUpData, this.testData);
                await applicationNodePage.applicationNodeURLCheck();
                await applicationNodePage.verifyApplication({ preview: true, topics });
                await returnToParentTopic();
            }

            if (options.article)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddArticle();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.article;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Article.title;
                const articleCreatePage = new ArticleCreatePage(this.page, this.testSetUpData, this.testData);
                await articleCreatePage.fillArticleForm({
                    articleTitle: this.testData.Article.title,
                    revisionLogMessage: this.testData.Article.revisionlog,
                    globalTopicChoice: this.testData.GlobalTopics.employment,
                    topics,
                    articleSummary: this.testData.Article.summary,
                    articleBodyField: this.testData.Article.body,
                }, 'standard', true);
                this.testSetUpData.globalTopicForTest.globalTopic = this.testData.GlobalTopics.employment;
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const articleNodePage = new ArticleNodePage(this.page, this.testSetUpData, this.testData);
                await articleNodePage.articleNodeURLCheck();
                await articleNodePage.verifyArticle({ topics, expectedTitle: this.testData.Article.title });
                await returnToParentTopic();
            }

            if (options.subtopic)
            {
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickAddSubtopic();

                this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.subtopic;
                this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Subtopic.title;
                const subtopicCreatePage = new SubtopicCreatePage(this.page, this.testSetUpData, this.testData);
                await subtopicCreatePage.fillSubtopicForm({
                    subtopicTitle: this.testData.Subtopic.title,
                    revisionLogMessage: this.testData.Subtopic.revisionlog,
                    topics,
                    subtopicSummary: this.testData.Subtopic.summary,
                    subtopicLongDescription: this.testData.Subtopic.longDescription,
                }, true);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();
                const subtopicNodePage = new SubtopicNodePage(this.page, this.testSetUpData, this.testData);
                await subtopicNodePage.subtopicNodeURLCheck();
                await subtopicNodePage.verifySubtopic({ preview: false });
                await returnToParentTopic();
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
        }
    }

    async removeChildContentByTopicTree(options: RemoveTopicChildContentOptions): Promise<void>
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
                selected: options.subtopic,
                contentType: this.testSetUpData.validContentTypeList.subtopic,
                title: this.testData.Subtopic.title,
                revisionLog: this.testData.Subtopic.revisionlog,
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
                await this.siteTopics.replaceSiteTopic(this.testData.Topic.title, options.replacementTopic);
                await this.createPage.enterRevisionLogMessage(child.revisionLog);
                await this.createPage.chooseSaveAsType();
                await this.createPage.clickSaveButton();

                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickQuickPublishButton();
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testData.Topic.title;
            this.testSetUpData.saveAsOptionForTest.saveAsOption = previousSaveAsOption;
        }

        await this.navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
    }





}
