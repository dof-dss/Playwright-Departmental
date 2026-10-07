import { Page, Locator } from '@playwright/test';
import { TestSteps } from '@poms/base-pages/TestSteps';
import { expect } from '@playwright/test';
import { CreatePages } from '../../base-pages/CreatePages';
import { TestSetUpData, TestData } from '../../../test-data/TestDataObject';

export interface VerifyOptions
{
    preview: boolean;
    topics: (string | null)[];
};

export class HeritageSiteNodePage
{
    // logging
    private readonly testSteps: TestSteps;

    // XPath Selectors
    private readonly topicLinkXPath = (topicName: string) => `//a[text()="${topicName}"]`;

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
    }

    // -------------------- URL CHECK --------------------

    // check url after saving create heritage site
    async heritageSiteNodeURLCheck()
    {
        // escapeRegex removes all white space and replaces with '-', where '-' already exists and surrounded by 
        // white space it will just remove surrounding white space and converts all characters to lower case.
        const escapeRegex = (value: string) => value.trim().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-').toLowerCase();

        await this.testSteps.LogInfo(`Verifying URL path is /heritage-sites/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)} with optional -suffix and optional trailing path, or is /node/.+/latest`);
        await expect(this.page).toHaveURL(
            new RegExp(`(?:${this.testSetUpData.urlForTest.url}/heritage-sites/${escapeRegex(this.testSetUpData.contentTitleforTest.contentTitle)}(?:-[^/]+)?(?:/.*)?$)|(?:/node/.+/latest)`)
        );
    }

    // -------------------- Verify Heritage Site methods --------------------

    // verify heritage site method
    async verifyHeritageSite({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.HeritageSite.title}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.testData.HeritageSite.title);

        // Verify topics (all visible except topic4 which should be hidden)
        if (topics[0])
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[0]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[0]!))).toBeVisible();
        }

        if (topics[1] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[1]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[1]))).toBeVisible();
        }
        if (topics[2] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[2]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[2]))).toBeVisible();
        }
        // Topic 4 should be hidden if present
        if (topics[3] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[3]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[3]!))).toBeHidden();
        }

        await this.testSteps.LogInfo("Verifying Heritage Site Address information is visible");
        await this.testSteps.LogInfo(`Verifying Address Line 1 "${this.testData.HeritageSite.addressStreetLine1}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine1)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Address Line 2 "${this.testData.HeritageSite.addressStreetLine2}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine2)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Address Line 3 "${this.testData.HeritageSite.addressStreetLine3}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine3)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Town "${this.testData.HeritageSite.addressTown}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressTown)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Postal Code "${this.testData.HeritageSite.addressPostcode}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressPostcode)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Country "${this.testData.HeritageSite.addressCountry}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressCountry, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo("Verifying Heritage Site Contact information is visible");
        await this.testSteps.LogInfo(`Verifying Phone Number "${this.testData.HeritageSite.contactPhone}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.contactPhone)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Email "${this.testData.HeritageSite.contactEmail}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.contactEmail)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Website "${this.testData.HeritageSite.websiteLinkText}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.websiteLinkText)).toBeVisible();

        // verify image is uploaded and displayed (does not verify if it is correct image just that it is on page)
        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//div[@class="media-image"]/img')).toBeVisible();

        await this.testSteps.LogInfo("Verifying Heritage Site Additional information is visible");
        await this.testSteps.LogInfo(`Verifying Open to the public Number "${this.testData.HeritageSite.openToThePublic}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.openToThePublic)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Grid reference "${this.testData.HeritageSite.gridreference}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.gridreference)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying SM number "${this.testData.HeritageSite.smNumber}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.smNumber)).toBeVisible();


        // verify 
        if (!preview)
        {
            // Check Hisotirc Map Viewer
            const pagePromise = this.page.context().waitForEvent('page');
            await this.page.getByText('View on the Historic Environment Map Viewer').click();
            const newTab = await pagePromise;
            await this.testSteps.LogInfo(`Verifying registration URL "${this.testData.HeritageSite.HistoricMapViewer}"`);
            await expect(newTab).toHaveURL(this.testData.HeritageSite.HistoricMapViewer);
            await newTab.close();

            // Check view details on NI Sites
            const pagePromiseNI = this.page.context().waitForEvent('page');
            await this.page.getByText('View details on the NI Sites & Monuments Record (NISMR)').click();
            const newTabNI = await pagePromiseNI;
            await this.testSteps.LogInfo(`Verifying registration URL "${this.testData.HeritageSite.nismrLink}"`);
            await expect(newTabNI).toHaveURL(this.testData.HeritageSite.nismrLink);
            await newTabNI.close();
        }


        await this.testSteps.LogInfo(`Verifying Heritage Site About "${this.testData.HeritageSite.title}" is visible`);
        await expect(this.page.getByText("About " + this.testData.HeritageSite.title)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Heritage Site Body Field content "${this.testData.HeritageSite.body}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.body)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Heritage Site Map is visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }

    // verify edited heritage site method
    async verifyEditedHeritageSite({ preview, topics }: VerifyOptions)
    {
        // verify title
        await this.testSteps.LogInfo(`Verifying title "${this.testData.HeritageSite.titleEdited}" is visible`);
        await expect(this.page.getByRole('heading', { level: 1, exact: true })).toHaveText(this.testData.HeritageSite.titleEdited);

        // Verify topics (all visible except topic4 which should be hidden)
        if (topics[0])
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[0]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[0]!))).toBeVisible();
        }

        if (topics[1] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[1]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[1]))).toBeHidden();
        }
        if (topics[2] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[2]}" is visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[2]))).toBeHidden();
        }
        // Topic 4 should be hidden if present
        if (topics[3] !== null)
        {
            await this.testSteps.LogInfo(`Verifying Site topic "${topics[3]}" is NOT visible`);
            await expect(this.page.locator(this.topicLinkXPath(topics[3]!))).toBeHidden();
        }

        await this.testSteps.LogInfo("Verifying Heritage Site Address information is visible");
        await this.testSteps.LogInfo(`Verifying Edited Address Line 1 "${this.testData.HeritageSite.addressStreetLine1Edited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine1Edited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Address Line 2 "${this.testData.HeritageSite.addressStreetLine2Edited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine2Edited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Address Line 3 "${this.testData.HeritageSite.addressStreetLine3Edited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressStreetLine3Edited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Townland "${this.testData.HeritageSite.addressTownLandEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressTownLandEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited City "${this.testData.HeritageSite.addressCityEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressCityEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited County "${this.testData.HeritageSite.addressCountyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressCountyEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Eircode "${this.testData.HeritageSite.addressEIRCodeEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressEIRCodeEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Country "${this.testData.HeritageSite.addressCountryEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.addressCountryEdited, { exact: true })).toBeVisible();

        await this.testSteps.LogInfo("Verifying Heritage Site Contact information is visible");
        await this.testSteps.LogInfo(`Verifying Edited Phone Number "${this.testData.HeritageSite.contactPhoneEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.contactPhoneEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Email "${this.testData.HeritageSite.contactEmailEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.contactEmailEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Website "${this.testData.HeritageSite.websiteLinkTextEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.websiteLinkTextEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Website URL "${this.testData.HeritageSite.websiteURLEdited}" is linked correctly`);
        await expect(this.page.getByRole('link', { name: this.testData.HeritageSite.websiteLinkTextEdited })).toHaveAttribute('href', this.testData.HeritageSite.websiteURLEdited);

        // verify image is uploaded and displayed (does not verify if it is correct image just that it is on page)
        await this.testSteps.LogInfo('Verifying image is visible');
        await expect(this.page.locator('//div[@class="media-image"]/img')).toBeVisible();

        await this.testSteps.LogInfo("Verifying Heritage Site Additional information is visible");
        await this.testSteps.LogInfo(`Verifying Edited Open to the public Number "${this.testData.HeritageSite.openToThePublicEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.openToThePublicEdited, { exact: true })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Grid reference "${this.testData.HeritageSite.gridreferenceEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.gridreferenceEdited, { exact: true })).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited SM number "${this.testData.HeritageSite.smNumberEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.smNumberEdited, { exact: true })).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Edited Map name "${this.testData.HeritageSite.mapNameEdited}" is visible`);
            await expect(this.page.getByText(this.testData.HeritageSite.mapNameEdited, { exact: true })).toBeVisible();
        }


        // verify 
        if (!preview)
        {
            // Check Hisotirc Map Viewer
            const pagePromise = this.page.context().waitForEvent('page');
            await this.page.getByText('View on the Historic Environment Map Viewer').click();
            const newTab = await pagePromise;
            await this.testSteps.LogInfo(`Verifying registration URL "${this.testData.HeritageSite.HistoricMapViewerEdited}"`);
            await expect(newTab).toHaveURL(this.testData.HeritageSite.HistoricMapViewerEdited);
            await newTab.close();

            // Check view details on NI Sites
            const pagePromiseNI = this.page.context().waitForEvent('page');
            await this.page.getByText('View details on the NI Sites & Monuments Record (NISMR)').click();
            const newTabNI = await pagePromiseNI;
            await this.testSteps.LogInfo(`Verifying registration URL "${this.testData.HeritageSite.nismrLinkEdited}"`);
            await expect(newTabNI).toHaveURL(this.testData.HeritageSite.nismrLinkEdited);
            await newTabNI.close();
        }


        await this.testSteps.LogInfo(`Verifying Edited Heritage Site About "${this.testData.HeritageSite.titleEdited}" is visible`);
        await expect(this.page.getByText("About " + this.testData.HeritageSite.titleEdited)).toBeVisible();
        await this.testSteps.LogInfo(`Verifying Edited Heritage Site Body Field content "${this.testData.HeritageSite.bodyEdited}" is visible`);
        await expect(this.page.getByText(this.testData.HeritageSite.bodyEdited)).toBeVisible();

        if (TestSetUpData.userForTest.username === TestSetUpData.validUserList.supervisor_username)
        {
            await this.testSteps.LogInfo(`Verifying Edited Heritage Site Map is visible`);
            await expect(this.page.getByRole('menuitemradio', { name: 'Show street map' })).toBeVisible();
        }
    }
}
