const { retrieveText } = require('../../testsUtils/setup/utils');
const selectFilters = {
    RELEVANCE: 'Relevance',
    RATING: 'Rating',
    POPUARITY: 'Popularity',
    NEWEST: 'Newest',
    ALPHABETICAL: 'Alphabetical'
}

/**
 * Select one of the labels in the sidebar
 * @param xpath selector for respective navigation label
 * @param expectedLabel for the expected label given the xpath param
 */
async function selectFromSideBar(xpath,expectedLabel) {
    await page.waitForXPath(xpath);
    await (
        await page.$x(
            xpath
        ))[0].click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    let categoryString =
        await retrieveText(
            "//div[@data-component='ListingContentHeader']//h3"
            , true);
    expect(
        categoryString.includes(expectedLabel)
    ).toBeTruthy();
}

/**
 * Verify that the filter has been changed
 * @param selectValue name of the 'value' tag in html
 * @param includesValue Value included in the URL
 */
async function verifySelectedFilter({ selectValue, includesValue = selectValue }) {
    await page.select(
        'select[aria-label]', selectValue
    );
    let pageURL = await page.url()
    expect(
        pageURL.includes(includesValue)
    ).toBeTruthy();
}

/**
 * Select one of the dropdown filters
 * @param filter name of the filter to be chosen
 */
async function selectDropdownFilter(filter) {
    await page.waitFor(500); // Select dropdown needs delay, can not be interacted with right away
    await page.waitForSelector('select[aria-label]');
    const items = {
        Relevance: {
            selectValue: 'RELEVANCE'
        },
        Popularity: {
            selectValue: 'POPULARITY'
        },
        Newest: {
            selectValue: 'NEWEST_FIRST',
            includesValue: 'NEWEST'
        },
        Alphabetical: {
            selectValue: 'ALPHABETICAL'
        },
        Rating: {
            selectValue: 'RATING'
        }
    };
    await verifySelectedFilter(items[filter]);
}

/**
 * Select an application in the categories grid
 */
async function selectGridApplication() {
    const productSelector =
        `//a[@data-truncate="line"]`
    const productTitleSelector =
        `//h1[@class="profile_header--title"]`
    await page.waitForXPath(
        productSelector
    );
    let productTitle =
        await retrieveText(
            productSelector
            , true)
    await (await page.$x(
        productSelector
    ))[0].click()
    await page.waitForXPath(
        productTitleSelector
    );
    let expectedTitle =
        await retrieveText(
            productTitleSelector
            , true)
    expect(
        productTitle
    ).toBe(
        expectedTitle
    )
}

/**
 * Check for Categories Tag
 */
async function verifyCategoriesTag() {
    await page.waitForXPath(
        `//div[@class="badges"]//a`
    );
    expect(
        await page.$x(
            '(//div[@class="badges"]//a)[1]'
        ) !== null).toBeTruthy();
}

module.exports = {
    selectFromSideBar,
    selectDropdownFilter,
    selectGridApplication,
    verifyCategoriesTag,
    selectFilters
} 
