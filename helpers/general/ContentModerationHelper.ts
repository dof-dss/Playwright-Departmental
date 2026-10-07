import { Page } from '@playwright/test';
import { TestSetUpData, TestData } from '../../test-data/TestDataObject';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { NavigateToCreatedContentHelper } from '@helpers/general/NavigateToCreatedContentHelper';

export interface AuthorModerationStates
{
    Draft?: boolean;
    NeedsReview: boolean;
};

export type StatsAuthorModerationStates = AuthorModerationStates;

export interface SupervisorModerationStates
{
    Draft?: boolean;
    NeedsReview: boolean;
    Published: boolean;
    Archive: boolean;
};
export interface StatsSupervisorModerationStates
{
    QuickPublish: boolean;
    Draft?: boolean;
    NeedsReview: boolean;
    Published: boolean;
    Archive: boolean;
};

export type TopicSupervisorModerationStates = StatsSupervisorModerationStates;

export interface TopicChildModerationStates extends TopicSupervisorModerationStates
{
    application: boolean;
    article: boolean;
    subtopic: boolean;
    consultation?: boolean;
    news?: boolean;
    publication?: boolean;
}

type ModerationState = 'Draft' | 'Needs Review' | 'Published' | 'Archived';

export class ContentModerationHelper
{
    // pages
    private readonly moderationSideBar: ModerationSideBar;
    private readonly navigateToCreatedContentHelper: NavigateToCreatedContentHelper;

    constructor(
        private page: Page,
        // isolated instances of test data via constructor
        private testSetUpData: typeof TestSetUpData,
        private testdata: typeof TestData
    ) 
    {
        // imported pages
        this.moderationSideBar = new ModerationSideBar(page, this.testSetUpData, this.testdata);
        this.navigateToCreatedContentHelper = new NavigateToCreatedContentHelper(page, this.testSetUpData, this.testdata);
    }

    private async openAndGetCurrentState(): Promise<ModerationState>
    {
        await this.moderationSideBar.nodeURLCheck(this.testSetUpData.contentTypeforTest.contentType);
        await this.moderationSideBar.openModerationSideBar();
        return await this.moderationSideBar.getCurrentState() as ModerationState;
    }

    // ----------------- Main user moderation flows -----------------

    async authorModerateContent(wantedState: AuthorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            // Verify only the expected buttons are visible 
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
            await this.moderationSideBar.outlineIsNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
            await this.moderationSideBar.outlineIsNotVisible();
        }

        await this.moderationSideBar.arrangeContentIsNotVisible();
        await this.moderationSideBar.applicationIsNotVisible();
        await this.moderationSideBar.articleIsNotVisible();
        await this.moderationSideBar.subtopicIsNotVisible();

        if (wantedState.Draft)
        {
            await this.moderationSideBar.clickRejectButton();
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
        }

        if (wantedState.NeedsReview)
        {
            await this.moderationSideBar.clickSubmitForReviewButton();
            this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
        }
    }

    async supervisorModerateContent(wantedState: SupervisorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();

            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publicationExternalLink
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }

            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.publishButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publicationExternalLink
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Published')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publicationExternalLink
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Archived')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.restoreToDraftButtonIsVisible();
            await this.moderationSideBar.restoreButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publicationExternalLink
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
        }

        if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.topic && this.testSetUpData.userForTest.username === this.testSetUpData.validUserList.topicsupervisor_username)
        {
            await this.moderationSideBar.arrangeContentIsVisible();
            await this.moderationSideBar.quicklyAddApplicationIsVisible();
            await this.moderationSideBar.quicklyAddArticleIsVisible();
            await this.moderationSideBar.quicklyAddSubtopicIsVisible();
        }


        if (wantedState.Draft)
        {
            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickRejectButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }
        }

        if (wantedState.NeedsReview)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Published')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }


        }

        if (wantedState.Published)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickRestoreButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Archive)
        {
            if (currentState !== 'Archived')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
            }
        }
    }

    async statsAuthorModerateContent(wantedState: StatsAuthorModerationStates)
    {
        await this.authorModerateContent(wantedState);
    }

    async statsSupervisorModerateContent(wantedState: StatsSupervisorModerationStates)
    {
        const currentState = await this.openAndGetCurrentState();

        if (currentState === 'Draft')
        {
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.submitForReviewButtonIsVisible();
            await this.moderationSideBar.quickPublishButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Needs Review')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible();
            await this.moderationSideBar.rejectButtonIsVisible();
            await this.moderationSideBar.publishButtonIsVisible();
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication

            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Published')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.archiveButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();


            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
            await this.moderationSideBar.restoreButtonNotVisible();
            await this.moderationSideBar.restoreToDraftButtonNotVisible();
        }

        if (currentState === 'Archived')
        {
            // Verify only the expected buttons are visible
            await this.moderationSideBar.editContentIsVisible(); // ALWAYS VISIBLE
            await this.moderationSideBar.restoreToDraftButtonIsVisible();
            await this.moderationSideBar.restoreButtonIsVisible();
            await this.moderationSideBar.deleteButtonIsVisible();
            await this.moderationSideBar.revisionsIsVisible();
            if (this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.article
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.publication
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.articleCKEditorFull
                || this.testSetUpData.contentTypeforTest.contentType === this.testSetUpData.validContentTypeList.securePublication
            )
            {
                await this.moderationSideBar.outlineIsVisible();
            }
            else
            {
                await this.moderationSideBar.outlineIsNotVisible();
            }
            await this.moderationSideBar.scheduledTransitionsIsVisible();
            await this.moderationSideBar.whatLinksHereIsVisible();

            await this.moderationSideBar.submitForReviewButtonNotVisible();
            await this.moderationSideBar.rejectButtonNotVisible();
            await this.moderationSideBar.publishButtonNotVisible();
            await this.moderationSideBar.archiveButtonNotVisible();
            await this.moderationSideBar.quickPublishButtonNotVisible();
        }

        if (wantedState.QuickPublish)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Draft)
        {
            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickRejectButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
            }
        }

        if (wantedState.NeedsReview)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Published')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.clickRestoreToDraftButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.draft;
                await this.moderationSideBar.openModerationSideBar();
                await this.moderationSideBar.clickSubmitForReviewButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.needsreview;
            }


        }

        if (wantedState.Published)
        {
            if (currentState === 'Draft')
            {
                await this.moderationSideBar.clickQuickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Needs Review')
            {
                await this.moderationSideBar.clickPublishButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }

            if (currentState === 'Archived')
            {
                await this.moderationSideBar.publishButtonNotVisible();
                await this.moderationSideBar.clickRestoreButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.published;
            }
        }

        if (wantedState.Archive)
        {
            if (currentState !== 'Archived')
            {
                await this.moderationSideBar.clickArchiveButton();
                this.testSetUpData.moderationStateForTest.moderationState = this.testSetUpData.validModerationStates.archived;
            }
        }
    }

    async topicSupervisorModerateContent(wantedState: TopicSupervisorModerationStates)
    {
        await this.statsSupervisorModerateContent(wantedState);
    }

    async topicSupervisorModerateAllChildrenContent(options: TopicChildModerationStates)
    {
        const { application, article, subtopic, consultation, news, publication, ...wantedState } = options;
        const selectedChildren = [
            {
                selected: application,
                contentType: this.testSetUpData.validContentTypeList.application,
                title: this.testdata.Application.title,
            },
            {
                selected: article,
                contentType: this.testSetUpData.validContentTypeList.article,
                title: this.testdata.Article.title,
            },
            {
                selected: subtopic,
                contentType: this.testSetUpData.validContentTypeList.subtopic,
                title: this.testdata.Subtopic.title,
            },
            {
                selected: consultation,
                contentType: this.testSetUpData.validContentTypeList.consultation,
                title: this.testdata.Consultation.title,
            },
            {
                selected: news,
                contentType: this.testSetUpData.validContentTypeList.news,
                title: this.testdata.News.title,
            },
            {
                selected: publication,
                contentType: this.testSetUpData.validContentTypeList.publication,
                title: this.testdata.Publication.title,
            },
        ].filter(child => child.selected);

        try
        {
            for (const child of selectedChildren)
            {
                this.testSetUpData.contentTypeforTest.contentType = child.contentType;
                this.testSetUpData.contentTitleforTest.contentTitle = child.title;
                await this.navigateToCreatedContentHelper.navigateToCreatedContent({ active: true, deleted: false });
                await this.topicSupervisorModerateContent(wantedState);
            }
        }
        finally
        {
            this.testSetUpData.contentTypeforTest.contentType = this.testSetUpData.validContentTypeList.topic;
            this.testSetUpData.contentTitleforTest.contentTitle = this.testdata.Topic.title;
        }
    }

    async homepageSupervisorModerateContent(wantedState: TopicSupervisorModerationStates)
    {
        await this.statsSupervisorModerateContent(wantedState);
    }
}
