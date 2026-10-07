import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { Topics } from '../../base-pages/Topics';
import { CKEditor } from '../../base-pages/CKEditor';
import { expect } from '@playwright/test';
import { UserPage } from '../../base-pages/UserPage';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';
import { PreviewPage } from '@poms/base-pages/PreviewPage';
import { HeritageSiteNodePage } from './HeritageSiteNodePage';
import { UploadMediaHelper } from '@helpers/general/UploadMediaHelper';

export interface HeritageSiteEditSaveData
{
  heritageSiteTitle: string;
  revisionLogMessage: string;
  globalTopicChoice: string;
  topics: (string | null)[];
  // Address fields
  addressCountry: string;
  addressStreetLine1: string;
  addressStreetLine2: string;
  addressStreetLine3: string;
  addressTownLand: string;
  addressCity: string;
  addressCounty: string;
  addressEircode: string;
  // Map fields
  mapName: string;
  mapLocationModalName: string;
  // Contact fields
  contactPhone: string;
  contactEmail: string;
  // Website fields
  websiteURL: string;
  websiteLinkText: string;
  // Additional information fields
  openToThePublic: string;
  gridReference: string;
  historicMapViewer: string;
  smNumber: string;
  nismrLink: string;
  // Body field
  heritageSiteBodyField: string;
}

export class HeritageSiteEditPage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  private readonly topics: Topics;
  private readonly ckeditor: CKEditor;
  private readonly userPage: UserPage;
  private readonly createPages: CreatePages;
  private readonly previewPage: PreviewPage;
  private readonly heritageSiteNodePage: HeritageSiteNodePage;
  private readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly heritageSiteTitleField: Locator;
  private readonly addressCountryField: Locator;
  private readonly addressStreetLine1Field: Locator;
  private readonly addressStreetLine2Field: Locator;
  private readonly addressStreetLine3Field: Locator;
  private readonly addressTownLandField: Locator;
  private readonly addressCityField: Locator;
  private readonly addressCountyField: Locator;
  private readonly addressCountyFieldFilter: Locator;
  private readonly addressCountyFieldSelector: Locator;
  private readonly addressEircodeField: Locator;
  private readonly clearMapFieldsButton: Locator;
  private readonly setMapButton: Locator;
  private readonly mapModalNameField: Locator;
  private readonly findMapModalButton: Locator;
  private readonly insertMapModalButton: Locator;
  private readonly mapNameField: Locator;

  // section toggles
  private readonly contactSectionToggle: Locator;
  private readonly additionalInformationSectionToggle: Locator;

  private readonly contactPhoneField: Locator;
  private readonly contactEmailField: Locator;
  private readonly websiteURLField: Locator;
  private readonly websiteLinkTextField: Locator;
  private readonly openToThePublicField: Locator;
  private readonly gridReferenceField: Locator;
  private readonly historicMapViewerField: Locator;
  private readonly smNumberField: Locator;
  private readonly nismrLinkField: Locator;

  // constructor
  constructor(
    private readonly page: Page,
    // isolated instances of test data 
    private testSetUpData: typeof TestSetUpData,
    private testData: typeof TestData
  )
  {
    // logging isolated instance
    this.testSteps = new TestSteps();

    // imported pages
    this.userPage = new UserPage(page, this.testSetUpData);
    this.createPages = new CreatePages(page, this.testSetUpData, this.testData);
    this.topics = new Topics(page, this.testSetUpData, testData);
    this.ckeditor = new CKEditor(page, this.testSetUpData, testData);
    this.previewPage = new PreviewPage(page);
    this.heritageSiteNodePage = new HeritageSiteNodePage(page, this.testSetUpData, this.testData);
    this.uploadMediaHelper = new UploadMediaHelper(page, this.testSetUpData, this.testData);

    // locators for Heritage Site
    this.heritageSiteTitleField = page.locator("//*[contains(@id, 'edit-title-0-value')]");

    // Address field locators
    this.addressCountryField = page.getByRole('combobox', { name: 'Country' });
    this.addressStreetLine1Field = page.locator("//*[contains(@id, 'edit-field-address-0-address-address-line1')]");
    this.addressStreetLine2Field = page.locator("//*[contains(@id, 'edit-field-address-0-address-address-line2')]");
    this.addressStreetLine3Field = page.locator("//*[contains(@id, 'edit-field-address-0-address-address-line3')]");
    this.addressTownLandField = page.locator("//*[contains(@id, 'edit-field-address-0-address-dependent-locality')]");
    this.addressCityField = page.locator("//*[contains(@id, 'edit-field-address-0-address-locality')]");
    this.addressCountyField = page.locator('span').filter({ hasText: '- None -' });
    this.addressCountyFieldFilter = page.getByRole('combobox', { name: 'County' });
    this.addressCountyFieldSelector = page.getByRole('option');

    this.addressEircodeField = page.locator("//*[contains(@id, 'edit-field-address-0-address-postal-code')]");

    // Map field locators
    this.clearMapFieldsButton = page.getByRole('button', { name: 'Clear' });
    this.setMapButton = page.getByRole('button', { name: 'Set Map' });
    this.mapModalNameField = page.locator('#centre_map_on');
    this.findMapModalButton = page.getByRole('button', { name: 'Find' });
    this.insertMapModalButton = page.getByRole('button', { name: 'Insert map' });
    this.mapNameField = page.locator("//*[contains(@id, 'edit-field-map-location-0-name')]");

    // Contact field locators
    this.contactSectionToggle = page.locator('//summary[normalize-space(text())="Contact"]');
    this.additionalInformationSectionToggle = page.locator('//summary[normalize-space(text())="Additional Information"]');
    this.contactPhoneField = page.locator("//*[contains(@aria-describedby, 'edit-field-phone-0-value--description')]");
    this.contactEmailField = page.locator("//*[contains(@aria-describedby, 'edit-field-email-0-value')]");

    // Website field locators
    this.websiteURLField = page.locator("//*[contains(@aria-describedby, 'edit-field-website-0-uri')]");
    this.websiteLinkTextField = page.locator("//*[contains(@id, 'edit-field-website-0-title')]");

    // Additional information field locators
    this.openToThePublicField = page.getByRole('combobox', { name: 'Open to the public' });
    this.gridReferenceField = page.locator("//*[contains(@aria-describedby, 'edit-field-grid-reference-0-value')]");
    this.historicMapViewerField = page.locator("//*[contains(@aria-describedby, 'edit-field-historic-map-viewer-link-0-uri')]");
    this.smNumberField = page.locator("//*[contains(@aria-describedby, 'edit-field-sm-number-0-value')]");
    this.nismrLinkField = page.locator("//*[contains(@aria-describedby, 'edit-field-nismr-link-0-uri')]");
  }

  // ------------------------ asserts ------------------------

  // check url on edit heritage site page
  async editHeritageSitePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "edit"');
    await expect(this.page).toHaveURL(/\/edit/);
  }

  // check url on return to edit heritage site page after doing a preview
  async returnFromPreviewHeritageSitePageURLCheck()
  {
    await this.testSteps.LogInfo('Verifying URL contains "/node/.+/edit\\?uuid"');
    await expect(this.page).toHaveURL(new RegExp('/node/.+/edit\\?uuid'));
  }

  // ------------------------ filling heritage site form ------------------------

  // edit heritage site title 
  async editHeritageSiteTitle(heritageSiteTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${heritageSiteTitle}" into the Title field`);
    await this.heritageSiteTitleField.fill(heritageSiteTitle);
  }

  // edit address country
  async editAddressCountry(country: string)
  {
    await this.testSteps.LogInfo(`Selecting "${country}" from the Country dropdown`);
    await this.addressCountryField.selectOption({ label: country });
    // Wait for Drupal AJAX to re-render the address fields after country selection
    await this.addressStreetLine1Field.waitFor({ state: 'visible' });
  }

  // edit address street line 1
  async editAddressStreetLine1(streetLine1: string)
  {
    await this.page.waitForTimeout(1000);
    await this.testSteps.LogInfo(`Entering "${streetLine1}" into the Street address line 1 field`);
    await this.addressStreetLine1Field.fill(streetLine1);
  }

  // edit address street line 2
  async editAddressStreetLine2(streetLine2: string)
  {
    await this.testSteps.LogInfo(`Entering "${streetLine2}" into the Street address line 2 field`);
    await this.addressStreetLine2Field.fill(streetLine2);
  }

  // edit address street line 3
  async editAddressStreetLine3(streetLine3: string)
  {
    await this.testSteps.LogInfo(`Entering "${streetLine3}" into the Street address line 3 field`);
    await this.addressStreetLine3Field.fill(streetLine3);
  }

  // edit address townland
  async editAddressTownLand(townLand: string)
  {
    await this.testSteps.LogInfo(`Entering "${townLand}" into the Townland field`);
    await this.addressTownLandField.fill(townLand);
  }

  // edit address city
  async editAddressCity(city: string)
  {
    await this.testSteps.LogInfo(`Entering "${city}" into the City field`);
    await this.addressCityField.fill(city);
  }

  //edit address county
  async editAddressCounty(county: string)
  {
    await this.testSteps.LogInfo(`Selecting "${county}" from the County dropdown`);
    await this.addressCountyField.click();
    await this.addressCountyFieldFilter.fill(county);
    await this.addressCountyFieldSelector.filter({ hasText: county }).click();
    //await this.page.getByRole('option', { name: county }).click();
  }



  // edit address eircode
  async editAddressEircode(eircode: string)
  {
    await this.testSteps.LogInfo(`Entering "${eircode}" into the Eircode field`);
    await this.addressEircodeField.fill(eircode);
  }

  // clear map fields
  async clearMapFields()
  {
    await this.testSteps.LogInfo(`Clicking "Clear" button to clear map fields`);
    await this.clearMapFieldsButton.click();
  }

  // click set map button
  async clickSetMapButton()
  {
    await this.testSteps.LogInfo(`Clicking "Set Map" button`);
    await this.setMapButton.click();
  }

  // enter map Modal name
  async enterMapModalName(mapLocationModalName: string)
  {
    await this.testSteps.LogInfo(`Entering "${mapLocationModalName}" into the Map Location Modal Name field`);
    await this.mapModalNameField.fill(mapLocationModalName);
  }

  // Click find in map modal 
  async clickFindMapModalButton()
  {
    await this.testSteps.LogInfo(`Clicking "Find" button in the Map Location Modal`);
    await this.findMapModalButton.click();
  }

  // Click insert map button in map modal
  async clickInsertMapModalButton()
  {
    await this.testSteps.LogInfo(`Clicking "Insert" button in the Map Location Modal`);
    await this.page.waitForTimeout(3000);
    await this.insertMapModalButton.click();
  }

  // edit map name
  async editMapName(mapName: string)
  {
    await this.testSteps.LogInfo(`Entering "${mapName}" into the Map Name field`);
    await this.mapNameField.fill(mapName);
  }

  // expand contact section
  async expandContactSection()
  {
    await this.testSteps.LogInfo('Ensuring Contact section is expanded');
    const expanded = await this.contactSectionToggle.getAttribute('aria-expanded');
    if (expanded === 'false')
    {
      await this.contactSectionToggle.click();
    }
  }

  // expand additional information section
  async expandAdditionalInformationSection()
  {
    await this.testSteps.LogInfo('Ensuring Additional Information section is expanded');
    const expanded = await this.additionalInformationSectionToggle.getAttribute('aria-expanded');
    if (expanded === 'false')
    {
      await this.additionalInformationSectionToggle.click();
    }
  }

  // edit contact phone
  async editContactPhone(phone: string)
  {
    await this.testSteps.LogInfo(`Entering "${phone}" into the Telephone field`);
    await this.contactPhoneField.fill(phone);
  }

  // edit contact email
  async editContactEmail(email: string)
  {
    await this.testSteps.LogInfo(`Entering "${email}" into the Email address field`);
    await this.contactEmailField.fill(email);
  }

  // edit website URL
  async editWebsiteURL(url: string)
  {
    await this.testSteps.LogInfo(`Entering "${url}" into the Website URL field`);
    await this.websiteURLField.fill(url);
  }

  // edit website link text
  async editWebsiteLinkText(linkText: string)
  {
    await this.testSteps.LogInfo(`Entering "${linkText}" into the Website Link Text field`);
    await this.websiteLinkTextField.fill(linkText);
  }

  // select open to the public option
  async selectOpenToThePublic(option: string)
  {
    await this.testSteps.LogInfo(`Selecting "${option}" from the Open to the public dropdown`);
    await this.openToThePublicField.selectOption({ label: option });
  }

  // edit grid reference
  async editGridReference(gridReference: string)
  {
    await this.testSteps.LogInfo(`Entering "${gridReference}" into the Grid Reference field`);
    await this.gridReferenceField.fill(gridReference);
  }

  // edit historic map viewer link
  async editHistoricMapViewer(link: string)
  {
    await this.testSteps.LogInfo(`Entering "${link}" into the Historic Map Viewer Link field`);
    await this.historicMapViewerField.fill(link);
  }

  // edit SM number
  async editSmNumber(smNumber: string)
  {
    await this.testSteps.LogInfo(`Entering "${smNumber}" into the SM Number field`);
    await this.smNumberField.fill(smNumber);
  }

  // edit NISMR link
  async editNismrLink(nismrLink: string)
  {
    await this.testSteps.LogInfo(`Entering "${nismrLink}" into the NISMR Link field`);
    await this.nismrLinkField.fill(nismrLink);
  }

  // ------------------------ actions related to edit heritage site  ------------------------

  // fill in heritage site form elements for editing
  async editHeritageSiteForm(data: HeritageSiteEditSaveData)
  {
    await this.editHeritageSitePageURLCheck();
    await this.editHeritageSiteTitle(data.heritageSiteTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);

    // Edit address fields
    await this.editAddressCountry(data.addressCountry);
    await this.editAddressStreetLine1(data.addressStreetLine1);
    await this.editAddressStreetLine2(data.addressStreetLine2);
    await this.editAddressStreetLine3(data.addressStreetLine3);
    await this.editAddressTownLand(data.addressTownLand);
    await this.editAddressCity(data.addressCity);
    await this.editAddressCounty(data.addressCounty);
    await this.editAddressEircode(data.addressEircode);

    // Edit map fields
    if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
    {
      await this.clearMapFields();
      await this.clickSetMapButton();
      await this.enterMapModalName(data.mapLocationModalName);
      await this.clickFindMapModalButton();
      await this.clickInsertMapModalButton();
      await this.editMapName(data.mapName);
    }

    // Edit contact fields
    await this.expandContactSection();
    await this.editContactPhone(data.contactPhone);
    await this.editContactEmail(data.contactEmail);

    // Edit website fields
    await this.editWebsiteURL(data.websiteURL);
    await this.editWebsiteLinkText(data.websiteLinkText);

    // Edit additional information fields
    await this.expandAdditionalInformationSection();
    await this.selectOpenToThePublic(data.openToThePublic);
    await this.editGridReference(data.gridReference);
    await this.editHistoricMapViewer(data.historicMapViewer);
    await this.editSmNumber(data.smNumber);
    await this.editNismrLink(data.nismrLink);

    await expect(this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]')).toBeEnabled();
    await this.page.locator('//input[contains(@id,"edit-field-photo-selection-0-remove-button")]').click();

    // Add image
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: false,
      edited: true,
    });

    // Edit body field
    await this.ckeditor.enterCKEditorBody(data.heritageSiteBodyField);
  }
}
