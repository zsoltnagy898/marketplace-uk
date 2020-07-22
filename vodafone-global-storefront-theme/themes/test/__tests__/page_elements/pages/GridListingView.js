const { useSearchBar } = require('../../testsUtils/setup/utils');
const view = {
    GRID: 'grid',
    LIST: 'list'
};

/**
 * Ensure all grid tiles are displayed
 */
async function verifyGridApps() {
    // This selector is only visible if we are on grid view
    expect(
        await page.waitForSelector('div[class="listing-items-grid"]', { visible: true }))
        .toBeTruthy()
    const totalGridTiles = await page.evaluate(() => document.querySelector('div[class="listing-items-grid"]').children.length);
    for (let i = 1; i <= totalGridTiles; i++) {
        expect(
            await page.waitForXPath(`(//a[@class="id id__logo id__sq_small id__linked"])[${i}]`, { visible: true }))
            .toBeTruthy()
    }
}

/**
 * Ensure list view is displayed
 */
async function verifyListingApps() {
    // This selector is only visible if we are on list view
    expect(
        await page.waitForSelector('div[class="listing-items-row"]', { visible: true }))
        .toBeTruthy()
    const totalListTiles = await page.evaluate(() => document.querySelector('div[class="listing-items-row"]').children.length);
    for (let i = 1; i <= totalListTiles; i++) {
        expect(
            await page.waitForXPath(`(//div[@class="listing-row-image"])[${i}]`, { visible: true }))
            .toBeTruthy()
    }
}

/**
 * @param view Decides which view to activate 
 */
async function toggleSearchView(selectedView) {
    if (selectedView === view.GRID || view.LIST) {
        await page.waitForSelector(`button[aria-label="${selectedView}"]`)
        await page.click(`button[aria-label="${selectedView}"]`)
    } else {
        throw "Invalid parameter for toggleSearchView function"
    }

}

async function verifyProductBadge(searchProduct) {
    await useSearchBar(searchProduct)
    expect(
        await page.waitForSelector(
            'span.listing-row-badges', { visible: true }))
        .toBeTruthy()
}

async function navigateAllApps() {
    await page.waitForSelector('a[class="secondary_nav--link "]')
    await page.click('a[class="secondary_nav--link "]')
}

module.exports = {
    verifyGridApps,
    verifyListingApps,
    toggleSearchView,
    verifyProductBadge,
    navigateAllApps,
    view
}
