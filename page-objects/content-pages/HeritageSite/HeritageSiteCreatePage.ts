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

export interface HeritageSiteSaveData
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
  addressTown: string;
  addressPostcode: string;
  // Map fields
  mapName: string;
  mapLatitude: string;
  mapLongitude: string;
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

export class HeritageSiteCreatePage
{
  // logging
  private readonly testSteps: TestSteps;

  // pages
  readonly topics: Topics;
  readonly ckeditor: CKEditor;
  readonly userPage: UserPage;
  readonly createPages: CreatePages;
  readonly previewPage: PreviewPage;
  readonly heritageSiteNodePage: HeritageSiteNodePage;
  readonly uploadMediaHelper: UploadMediaHelper;

  // locators
  private readonly heritageSiteTitleField: Locator;
  private readonly addressCountryField: Locator;
  private readonly addressStreetLine1Field: Locator;
  private readonly addressStreetLine2Field: Locator;
  private readonly addressStreetLine3Field: Locator;
  private readonly addressTownField: Locator;
  private readonly addressPostcodeField: Locator;
  private readonly mapNameField: Locator;
  private readonly mapLatitudeField: Locator;
  private readonly mapLongitudeField: Locator;

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

  // error messages
  private readonly titleFieldIsRequired: Locator;
  private readonly topicsFieldIsRequired: Locator;

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
    this.addressTownField = page.locator("//*[contains(@id, 'edit-field-address-0-address-locality')]");
    this.addressPostcodeField = page.locator("//*[contains(@id, 'edit-field-address-0-address-postal-code')]");

    // Map field locators
    this.mapNameField = page.locator("//*[contains(@id, 'edit-field-map-location-0-name')]");
    this.mapLatitudeField = page.locator("//*[contains(@id, 'edit-field-map-location-0-lat')]");
    this.mapLongitudeField = page.locator("//*[contains(@id, 'edit-field-map-location-0-lon')]");

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

    // error messages
    this.titleFieldIsRequired = page.getByText("Title field is required.");
    this.topicsFieldIsRequired = page.locator("//*[contains(@id, 'edit-field-site-topics--errormessage')]");
  }

  // ------------------------ asserts ------------------------

  // check url on create heritage site page
  async createHeritageSitePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/heritage_site"`);
    await expect(this.page).toHaveURL(`${this.testSetUpData.urlForTest.url}/node/add/heritage_site`);
  }

  // check url on return to create heritage site page after doing a preview 
  async returnFromPreviewHeritageSitePageURLCheck()
  {
    await this.testSteps.LogInfo(`Verifying URL is "${this.testSetUpData.urlForTest.url}/node/add/heritage_site\\?uuid"`);
    await expect(this.page).toHaveURL(new RegExp(`${this.testSetUpData.urlForTest.url}/node/add/heritage_site\\?uuid`));
  }

  // ------------------------ filling heritage site form ------------------------

  // enter heritage site title 
  async enterHeritageSiteTitle(heritageSiteTitle: string)
  {
    await this.testSteps.LogInfo(`Entering "${heritageSiteTitle}" into the Title field`);
    await this.heritageSiteTitleField.fill(heritageSiteTitle);
  }

  // enter address country
  async enterAddressCountry(country: string)
  {
    await this.testSteps.LogInfo(`Selecting "${country}" from the Country dropdown`);
    await this.addressCountryField.selectOption({ label: country });
    // Wait for Drupal AJAX to re-render the address fields after country selection
    await this.addressStreetLine1Field.waitFor({ state: 'visible' });
  }

  // enter address street line 1
  async enterAddressStreetLine1(streetLine1: string)
  {
    await this.page.waitForTimeout(1000);
    await this.testSteps.LogInfo(`Entering "${streetLine1}" into the Street address line 1 field`);
    await this.addressStreetLine1Field.fill(streetLine1);
  }

  // enter address street line 2
  async enterAddressStreetLine2(streetLine2: string)
  {
    await this.testSteps.LogInfo(`Entering "${streetLine2}" into the Street address line 2 field`);
    await this.addressStreetLine2Field.fill(streetLine2);
  }

  // enter address street line 3
  async enterAddressStreetLine3(streetLine3: string)
  {
    await this.testSteps.LogInfo(`Entering "${streetLine3}" into the Street address line 3 field`);
    await this.addressStreetLine3Field.fill(streetLine3);
  }

  // enter address town
  async enterAddressTown(town: string)
  {
    await this.testSteps.LogInfo(`Entering "${town}" into the Town/City field`);
    await this.addressTownField.fill(town);
  }

  // enter address postcode
  async enterAddressPostcode(postcode: string)
  {
    await this.testSteps.LogInfo(`Entering "${postcode}" into the Postcode field`);
    await this.addressPostcodeField.fill(postcode);
  }

  // enter map name
  async enterMapName(mapName: string)
  {
    await this.testSteps.LogInfo(`Entering "${mapName}" into the Map Name field`);
    await this.mapNameField.fill(mapName);
  }

  // enter map latitude
  async enterMapLatitude(mapLatitude: string)
  {
    await this.testSteps.LogInfo(`Entering "${mapLatitude}" into the Map Latitude field`);
    await this.mapLatitudeField.fill(mapLatitude);
  }

  // enter map longitude
  async enterMapLongitude(mapLongitude: string)
  {
    await this.testSteps.LogInfo(`Entering "${mapLongitude}" into the Map Longitude field`);
    await this.mapLongitudeField.fill(mapLongitude);
  }

  // expand contact section
  async expandContactSection()
  {
    await this.testSteps.LogInfo('Expanding Contact section');
    await this.contactSectionToggle.click();
  }

  // expand additional information section
  async expandAdditionalInformationSection()
  {
    await this.testSteps.LogInfo('Expanding Additional information section');
    await this.additionalInformationSectionToggle.click();
  }

  // enter contact phone
  async enterContactPhone(phone: string)
  {
    await expect(this.contactPhoneField).toBeVisible();
    await this.testSteps.LogInfo(`Entering "${phone}" into the Telephone field`);
    await this.contactPhoneField.fill(phone);
  }

  // enter contact email
  async enterContactEmail(email: string)
  {
    await this.testSteps.LogInfo(`Entering "${email}" into the Email address field`);
    await this.contactEmailField.fill(email);
  }

  // enter website URL
  async enterWebsiteURL(url: string)
  {
    await this.testSteps.LogInfo(`Entering "${url}" into the Website URL field`);
    await this.websiteURLField.fill(url);
  }

  // enter website link text
  async enterWebsiteLinkText(linkText: string)
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

  // enter grid reference
  async enterGridReference(gridReference: string)
  {
    await this.testSteps.LogInfo(`Entering "${gridReference}" into the Grid Reference field`);
    await this.gridReferenceField.fill(gridReference);
  }

  // enter historic map viewer link
  async enterHistoricMapViewer(link: string)
  {
    await this.testSteps.LogInfo(`Entering "${link}" into the Historic Map Viewer Link field`);
    await this.historicMapViewerField.fill(link);
  }

  // enter SM number
  async enterSmNumber(smNumber: string)
  {
    await this.testSteps.LogInfo(`Entering "${smNumber}" into the SM Number field`);
    await this.smNumberField.fill(smNumber);
  }

  // enter NISMR link
  async enterNismrLink(nismrLink: string)
  {
    await this.testSteps.LogInfo(`Entering "${nismrLink}" into the NISMR Link field`);
    await this.nismrLinkField.fill(nismrLink);
  }

  // ------------------------ actions related to create heritage site  ------------------------

  // Mandatory Field Check heritage site
  async mandatoryFieldCheck()
  {
    await this.testSteps.LogInfo('Performing mandatory field check');
    await this.testSteps.LogInfo('Clicking save button');
    await this.createPages.clickSaveButton();
    await this.testSteps.LogInfo('Verifying Title field error message appears');
    await expect(this.titleFieldIsRequired).toBeVisible();
    await this.testSteps.LogInfo('Verifying Topics field error message appears');
    await expect(this.topicsFieldIsRequired).toBeVisible();
  }

  // fill in heritage site form elements
  async fillHeritageSiteForm(data: HeritageSiteSaveData)
  {
    await this.createHeritageSitePageURLCheck();
    await this.enterHeritageSiteTitle(data.heritageSiteTitle);
    await this.createPages.enterRevisionLogMessage(data.revisionLogMessage);

    //Topic is preset so not removing it to ensure it is pre populated

    // Fill address fields
    await this.enterAddressCountry(data.addressCountry);
    await this.enterAddressStreetLine1(data.addressStreetLine1);
    await this.enterAddressStreetLine2(data.addressStreetLine2);
    await this.enterAddressStreetLine3(data.addressStreetLine3);
    await this.enterAddressTown(data.addressTown);
    await this.enterAddressPostcode(data.addressPostcode);

    // Fill map fields
    if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
    {
      await this.enterMapName(data.mapName);
      await this.enterMapLatitude(data.mapLatitude);
      await this.enterMapLongitude(data.mapLongitude);
    }

    // Fill contact fields
    await this.expandContactSection();
    await this.enterContactPhone(data.contactPhone);
    await this.enterContactEmail(data.contactEmail);

    // Fill website fields
    await this.enterWebsiteURL(data.websiteURL);
    await this.enterWebsiteLinkText(data.websiteLinkText);

    // Fill additional information fields
    await this.expandAdditionalInformationSection();
    await this.selectOpenToThePublic(data.openToThePublic);
    await this.enterGridReference(data.gridReference);
    await this.enterHistoricMapViewer(data.historicMapViewer);
    await this.enterSmNumber(data.smNumber);
    await this.enterNismrLink(data.nismrLink);

    // Add image
    await this.uploadMediaHelper.uploadImageWorkflow({
      original: true,
      edited: false,
    });

    // Fill body field
    await this.ckeditor.enterCKEditorBody(data.heritageSiteBodyField);
  }
}
