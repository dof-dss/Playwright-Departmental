import { Page } from '@playwright/test';
import { TestSetUpData, TestData, galleryImageDetails } from '../../test-data/TestDataObject';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { ConsultationNodePage } from '@poms/content-pages/Consultation/ConsultationNodePage';
import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
import { NewsNodePage } from '@poms/content-pages/News/NewsNodePage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { SecurePublicationNodePage } from '@poms/content-pages/SecurePublication/SecurePublicationNodePage';
import { ProfileNodePage } from '@poms/content-pages/Profile/ProfileNodePage';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';
import { ContentNodePageRouter } from '@helpers/general/ContentNodePageRouter';
import { ContactNodePage } from '@poms/content-pages/Contact/ContactNodePage';
import { EventNodePage } from '@poms/content-pages/Event/EventNodePage';
import { LinkNodePage } from '@poms/content-pages/Link/LinkNodePage';
import { ProtectedAreaNodePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaNodePage';
import { SubtopicNodePage } from '@poms/content-pages/Subtopic/SubtopicNodePage';
import { TopicNodePage } from '@poms/content-pages/Topic/TopicNodePage';

export interface ContentEdited
{
    edited: boolean;
};

export class VerificationHelper
{
    // pages 
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly articleNodePage: ArticleNodePage;
    private readonly consultationNodePage: ConsultationNodePage;
    private readonly contactNodePage: ContactNodePage;
    private readonly eventNodePage: EventNodePage;
    private readonly galleryNodePage: GalleryNodePage;
    private readonly newsNodePage: NewsNodePage;
    private readonly publicationNodePage: PublicationNodePage;
    private readonly securePublicationNodePage: SecurePublicationNodePage;
    private readonly profileNodePage: ProfileNodePage;
    private readonly protectedAreaNodePage: ProtectedAreaNodePage;
    private readonly linkNodePage: LinkNodePage;
    private readonly topicNodePage: TopicNodePage;
    private readonly subtopicNodePage: SubtopicNodePage;
    private readonly topicsHelper: TopicsTreeHelper;
    private readonly contentRouter: ContentNodePageRouter;

    constructor(
        private page: Page,
        // isolated test data
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData,
    )
    {
        // new instance of pages with this.page and this.testSetUpData parameters set
        this.applicationNodePage = new ApplicationNodePage(this.page, this.testSetUpData, this.testData);
        this.articleNodePage = new ArticleNodePage(this.page, this.testSetUpData, this.testData);
        this.consultationNodePage = new ConsultationNodePage(this.page, this.testSetUpData, this.testData);
        this.galleryNodePage = new GalleryNodePage(this.page, this.testSetUpData, this.testData, galleryImageDetails);
        this.newsNodePage = new NewsNodePage(this.page, this.testSetUpData, this.testData);
        this.publicationNodePage = new PublicationNodePage(this.page, this.testSetUpData, this.testData);
        this.securePublicationNodePage = new SecurePublicationNodePage(this.page, this.testSetUpData, this.testData);
        this.profileNodePage = new ProfileNodePage(this.page, this.testSetUpData, this.testData);
        this.protectedAreaNodePage = new ProtectedAreaNodePage(this.page, this.testSetUpData, this.testData);
        this.subtopicNodePage = new SubtopicNodePage(this.page, this.testSetUpData, this.testData);
        this.topicNodePage = new TopicNodePage(this.page, this.testSetUpData, this.testData);
        this.contactNodePage = new ContactNodePage(this.page, this.testSetUpData, this.testData);
        this.eventNodePage = new EventNodePage(this.page, this.testSetUpData, this.testData);
        this.linkNodePage = new LinkNodePage(this.page, this.testSetUpData, this.testData);
        this.topicsHelper = new TopicsTreeHelper(this.page, this.testSetUpData, this.testData);
        this.contentRouter = new ContentNodePageRouter(this.page, this.testSetUpData, this.testData);

    }

    async verifyChosenContent({ edited }: ContentEdited)
    {
        // Verify node URL using router (centralized routing logic)
        await this.contentRouter.verifyNodeURL(this.testSetUpData.contentTypeforTest.contentType);

        // verification switch to verify correct content type being tested
        switch (this.testSetUpData.contentTypeforTest.contentType)
        {
            case this.testSetUpData.validContentTypeList.application: {
                if (edited === false)
                {
                    await this.applicationNodePage.verifyApplication({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.applicationNodePage.verifyEditedApplication({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.article: {
                if (edited === false)
                {
                    await this.articleNodePage.verifyArticle({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.articleNodePage.verifyEditedArticle({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.articleCKEditorFull: {
                // ckeditor full functionality verification
                await this.articleNodePage.verifyArticleCKEditorFullFunctionality();
                break;
            }
            case this.testSetUpData.validContentTypeList.articleCKEditorImportWord: {
                // ckeditor import word functionality verification
                await this.articleNodePage.verifyArticleCKEditorImportWord();
                break;
            }
            case this.testSetUpData.validContentTypeList.consultation: {
                if (edited === false)
                {
                    await this.consultationNodePage.verifyConsultation({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.consultationNodePage.verifyEditedConsultation({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.consultationFutureDate: {
                await this.consultationNodePage.verifyFutureConsultation({
                    preview: false,
                    topics: this.topicsHelper.getTopics()
                });
                break;
            }
            case this.testSetUpData.validContentTypeList.contact: {
                if (edited === false)
                {
                    await this.contactNodePage.verifyContact({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.contactNodePage.verifyEditedContact({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.event: {
                if (edited === false)
                {
                    await this.eventNodePage.verifyEvent({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.eventNodePage.verifyEditedEvent({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.gallery: {
                if (edited === false)
                {
                    await this.galleryNodePage.verifyGallery({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.galleryNodePage.verifyEditedGallery({
                        preview: false,
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.link: {
                if (edited === false)
                {
                    await this.linkNodePage.verifyLink({
                        preview: false,
                    });
                }
                else
                {
                    await this.linkNodePage.verifyEditedLink({
                        preview: false,
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.news: {
                // using news node page to verify published content is accurate
                await this.newsNodePage.newsNodeURLCheck();
                if (edited === false)
                {
                    await this.newsNodePage.verifyNews({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.newsNodePage.verifyEditedNews({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.profile: {
                await this.profileNodePage.profileNodeURLCheck();
                if (edited === false)
                {
                    await this.profileNodePage.verifyProfile();
                }
                else
                {
                    await this.profileNodePage.verifyEditedProfile();
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.protectedarea: {
                await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
                if (edited === false)
                {
                    await this.protectedAreaNodePage.verifyProtectedArea({
                        preview: false,
                    });
                }
                else
                {
                    await this.protectedAreaNodePage.verifyEditedProtectedArea({
                        preview: false,
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.publication: {
                // using publication node page to verify published content is accurate
                await this.publicationNodePage.publicationNodeURLCheck();
                if (edited === false)
                {
                    await this.publicationNodePage.verifyPublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.publicationNodePage.verifyEditedPublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.publicationExternalLink: {
                // using publication external link node page to verify published content is accurate
                await this.publicationNodePage.publicationNodeURLCheck();
                if (edited === false)
                {
                    await this.publicationNodePage.verifyExternalLinkPublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.publicationNodePage.verifyEditedExternalLinkPublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            case this.testSetUpData.validContentTypeList.securePublication: {
                await this.securePublicationNodePage.securePublicationNodeURLCheck();
                if (edited === false)
                {
                    await this.securePublicationNodePage.verifySecurePublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                else
                {
                    await this.securePublicationNodePage.verifyEditedSecurePublication({
                        topics: this.topicsHelper.getTopics()
                    });
                }
                break;
            }
            // case this.testSetUpData.validContentTypeList.subtopic: {
            //     await this.securePublicationNodePage.securePublicationNodeURLCheck();
            //     if (edited === false)
            //     {
            //         await this.subtopicNodePage.verifySubtopic({
            //             topics: this.topicsHelper.getTopics()
            //         });
            //     }
            //     else
            //     {
            //         await this.subtopicNodePage.verifyEditedSubtopic({
            //             topics: this.topicsHelper.getTopics()
            //         });
            //     }
            //     break;
            // }
            case this.testSetUpData.validContentTypeList.topic: {
                await this.topicNodePage.topicNodeURLCheck();
                if (edited === false)
                {
                    await this.topicNodePage.verifyTopic();
                }
                else
                {
                    await this.topicNodePage.verifyEditedTopic();
                }
                break;
            }
        }
    }
}