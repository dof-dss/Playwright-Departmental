import { Page } from '@playwright/test';
import { BasePage } from '@poms/base-pages/BasePage';
import { ContentPage } from '@poms/base-pages/ContentPage';
import { AddContentPage } from '@poms/base-pages/AddContentPage';
import { TestSetUpData, TestData } from '@tdata/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { CreatePages } from '@poms/base-pages/CreatePages';
import { ModerationSideBar } from '@poms/base-pages/ModerationSideBar';
import { DeletePage } from '@poms/base-pages/DeletePage';
import { UserPage } from '@poms/base-pages/UserPage';
import { ProtectedAreaCreatePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaCreatePage';
import { ProtectedAreaEditPage } from '@poms/content-pages/ProtectedArea/ProtectedAreaEditPage';
import { ProtectedAreaNodePage } from '@poms/content-pages/ProtectedArea/ProtectedAreaNodePage';
import { TopicsTreeHelper } from '@helpers/general/TopicsTreeHelper';

export interface SaveOptions
{
  preview: boolean;
  mandatoryFieldCheck: boolean;
}

export interface EditSaveOptions
{
  preview: boolean;
}

export interface DeleteOptions
{
  delete: boolean;
  cancel: boolean;
}

export class ProtectedAreaHelper
{
  private readonly userPage: UserPage;
  private readonly basePage: BasePage;
  private readonly contentPage: ContentPage;
  private readonly addContentPage: AddContentPage;
  private readonly protectedAreaCreatePage: ProtectedAreaCreatePage;
  private readonly protectedAreaEditPage: ProtectedAreaEditPage;
  private readonly protectedAreaNodePage: ProtectedAreaNodePage;
  private readonly moderationSideBar: ModerationSideBar;
  private readonly topicsHelper: TopicsTreeHelper;
  private readonly previewPage: PreviewPage;
  private readonly createPage: CreatePages;
  private readonly deletePage: DeletePage;

  constructor(
    private readonly page: Page,
    private readonly testSetUpData: typeof TestSetUpData,
    private readonly testData: typeof TestData
  )
  {
    this.userPage = new UserPage(page, testSetUpData);
    this.basePage = new BasePage(page, testSetUpData);
    this.contentPage = new ContentPage(page, testSetUpData);
    this.addContentPage = new AddContentPage(page, testSetUpData);
    this.protectedAreaCreatePage = new ProtectedAreaCreatePage(page, testSetUpData, testData);
    this.protectedAreaEditPage = new ProtectedAreaEditPage(page, testSetUpData, testData);
    this.protectedAreaNodePage = new ProtectedAreaNodePage(page, testSetUpData, testData);
    this.moderationSideBar = new ModerationSideBar(page, testSetUpData, testData);
    this.topicsHelper = new TopicsTreeHelper(page, testSetUpData, testData);
    this.previewPage = new PreviewPage(page);
    this.createPage = new CreatePages(page, testSetUpData, testData);
    this.deletePage = new DeletePage(page);
  }

  async navigateToCreateProtectedArea()
  {
    await this.basePage.clickContentLink();
    await this.contentPage.contentPageURLCheck();
    await this.contentPage.clickAddContentButton();
    await this.addContentPage.addContentPageURLCheck();
    await this.addContentPage.selectContent();
  }

  async createProtectedArea(options: SaveOptions)
  {
    await this.navigateToCreateProtectedArea();

    await this.topicsHelper.selectTopicForSite({ edit: false, triggeralert: false });

    if (options?.mandatoryFieldCheck)
    {
      await this.protectedAreaCreatePage.mandatoryFieldCheck();
    }

    await this.protectedAreaCreatePage.fillProtectedAreaForm({
      protectedAreaTitle: this.testData.ProtectedArea.title,
      revisionLogMessage: this.testData.ProtectedArea.revisionlog,
      topics: this.topicsHelper.getTopics(),
      protectedAreaType: this.testData.ProtectedArea.type,
      featureType: this.testData.ProtectedArea.feature,
      county: this.testData.ProtectedArea.county,
      council: this.testData.ProtectedArea.council,
      document: this.testData.ProtectedArea.document,
      body: this.testData.ProtectedArea.body,
    });

    await this.createPage.chooseSaveAsType();

    if (options.preview)
    {
      await this.createPage.clickPreviewButton();
      await this.previewPage.performURLCheck();
      await this.protectedAreaNodePage.verifyProtectedArea({ preview: true });
      await this.previewPage.clickBackToContentEdittingButton();
      await this.protectedAreaCreatePage.returnFromPreviewProtectedAreaPageURLCheck();
    }

    await this.createPage.clickSaveButton();
    await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
    await this.protectedAreaNodePage.verifyProtectedArea({ preview: false });
  }

  async editProtectedArea(options: EditSaveOptions)
  {
    await this.protectedAreaNodePage.protectedAreaNodeURLCheck();

    await this.moderationSideBar.openModerationSideBar();
    await this.moderationSideBar.clickEditContentButton();

    await this.topicsHelper.selectTopicForSite({ edit: true, triggeralert: false });

    await this.protectedAreaEditPage.editProtectedAreaForm({
      protectedAreaTitle: this.testData.ProtectedArea.titleEdited,
      revisionLogMessage: this.testData.ProtectedArea.revisionlogEdited,
      topics: this.topicsHelper.getTopics(),
      protectedAreaType: this.testData.ProtectedArea.typeEdited,
      featureType: this.testData.ProtectedArea.featureEdited,
      county: this.testData.ProtectedArea.countyEdited,
      council: this.testData.ProtectedArea.councilEdited,
      document: this.testData.ProtectedArea.documentEdited,
      body: this.testData.ProtectedArea.bodyEdited,
    });

    this.testSetUpData.contentTitleforTest.contentTitle = this.testData.ProtectedArea.titleEdited;

    await this.createPage.chooseSaveAsType();

    if (options.preview)
    {
      await this.createPage.clickPreviewButton();
      await this.previewPage.performURLCheck();
      await this.protectedAreaNodePage.verifyEditedProtectedArea({ preview: true });
      await this.previewPage.clickBackToContentEdittingButton();
      await this.protectedAreaEditPage.returnFromPreviewProtectedAreaPageURLCheck();
    }

    await this.createPage.clickSaveButton();
    await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
    await this.protectedAreaNodePage.verifyEditedProtectedArea({ preview: false });
  }

  async deleteProtectedArea(options: DeleteOptions)
  {
    await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
    await this.moderationSideBar.openModerationSideBar();
    await this.moderationSideBar.clickDeleteButton();

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
      await this.protectedAreaNodePage.protectedAreaNodeURLCheck();
    }
  }
}
