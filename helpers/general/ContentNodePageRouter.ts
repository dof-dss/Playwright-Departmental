import { Page } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { TestData, TestSetUpData, galleryImageDetails } from '../../test-data/TestDataObject';
import { expect } from '@playwright/test';
import { ApplicationNodePage } from '@poms/content-pages/Application/ApplicationNodePage';
import { ArticleNodePage } from '@poms/content-pages/Article/ArticleNodePage';
import { ConsultationNodePage } from '@poms/content-pages/Consultation/ConsultationNodePage';
import { GalleryNodePage } from '@poms/content-pages/Gallery/GalleryNodePage';
import { NewsNodePage } from '@poms/content-pages/News/NewsNodePage';
import { PublicationNodePage } from '@poms/content-pages/Publication/PublicationNodePage';
import { EventNodePage } from '@poms/content-pages/Event/EventNodePage';
import { ProfileNodePage } from '@poms/content-pages/Profile/ProfileNodePage';
import { ProtectedAreaNodePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaNodePage';
import { LinkNodePage } from '@poms/content-pages/Link/LinkNodePage';
import { ContactNodePage } from '@poms/content-pages/Contact/ContactNodePage';
import { HeritageSiteNodePage } from '@poms/content-pages/HeritageSite/HeritageSiteNodePage';
import { TopicNodePage } from '@poms/content-pages/Topic/TopicNodePage';
import { UALNodePage } from '@poms/content-pages/UAL/UALNodePage';

export class ContentNodePageRouter
{
    private readonly testSteps: TestSteps;
    private readonly applicationNodePage: ApplicationNodePage;
    private readonly articleNodePage: ArticleNodePage;
    private readonly consultationNodePage: ConsultationNodePage;
    private readonly eventNodePage: EventNodePage;
    private readonly contactNodePage: ContactNodePage;
    private readonly heritageSiteNodePage: HeritageSiteNodePage;
    private readonly linkNodePage: LinkNodePage;
    private readonly topicNodePage: TopicNodePage;
    private readonly ualNodePage: UALNodePage;
    private readonly galleryNodePage: GalleryNodePage;
    private readonly newsNodePage: NewsNodePage;
    private readonly publicationNodePage: PublicationNodePage;
    private readonly profileNodePage: ProfileNodePage;
    private readonly protectedAreaNodePage: ProtectedAreaNodePage;

    constructor(
        private page: Page,
        private testSetUpData: typeof TestSetUpData,
        private testData: typeof TestData
    )
    {
        this.testSteps = new TestSteps();
        this.applicationNodePage = new ApplicationNodePage(page, testSetUpData, testData);
        this.articleNodePage = new ArticleNodePage(page, testSetUpData, testData);
        this.consultationNodePage = new ConsultationNodePage(page, testSetUpData, testData);
        this.contactNodePage = new ContactNodePage(page, testSetUpData, testData);
        this.eventNodePage = new EventNodePage(page, testSetUpData, testData);
        this.galleryNodePage = new GalleryNodePage(page, testSetUpData, testData, galleryImageDetails);
        this.heritageSiteNodePage = new HeritageSiteNodePage(page, testSetUpData, testData);
        this.linkNodePage = new LinkNodePage(page, testSetUpData, testData);
        this.newsNodePage = new NewsNodePage(page, testSetUpData, testData);
        this.publicationNodePage = new PublicationNodePage(page, testSetUpData, testData);
        this.profileNodePage = new ProfileNodePage(page, testSetUpData, testData);
        this.protectedAreaNodePage = new ProtectedAreaNodePage(page, testSetUpData, testData);
        this.topicNodePage = new TopicNodePage(page, testSetUpData, testData);
        this.ualNodePage = new UALNodePage(page, testSetUpData, testData);
        this.linkNodePage = new LinkNodePage(page, testSetUpData, testData);
    }

    async verifyNodeURL(contentType: string): Promise<void>
    {
        // const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        switch (contentType)
        {
            case this.testSetUpData.validContentTypeList.application:
                {
                    await this.applicationNodePage.applicationNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.article:
                {
                    await this.articleNodePage.articleNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.consultation:
                {
                    await this.consultationNodePage.consultationNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.contact:
                {
                    await this.contactNodePage.contactNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.event:
                {
                    await this.eventNodePage.eventNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.gallery:
                {
                    await this.galleryNodePage.galleryNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.heritagesite:
                {
                    await this.heritageSiteNodePage.heritageSiteNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.link:
                {
                    await this.linkNodePage.linkNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.news:
                {
                    await this.newsNodePage.newsNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.profile:
                {
                    await this.profileNodePage.profileNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.protectedarea:
                {
                    await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.publication:
                {
                    await this.publicationNodePage.publicationNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.topic:
                {
                    await this.topicNodePage.topicNodeURLCheck();
                    break;
                }
            case this.testSetUpData.validContentTypeList.unlawfully:
                {
                    await this.ualNodePage.ualNodeURLCheck();
                    break;
                }
        }
    }
}