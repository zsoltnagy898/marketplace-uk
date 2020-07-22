const { verifyElementIsVisible, retrieveText, verifyProductLabel } = require('../../testsUtils/setup/utils')
const bundleSelectors = {
    bundleName: 'div.card__content h1',
    bundleDesc: 'div.card__content div.summary--caption',
    buyButton: 'div.card__actions a.button',
    bundleProducts: 'div[class="card__content"] h4',
    firstProduct: {
        container: '(//div[@class="card__content"])[2]',
        name: '(//div[@class="card__content"]//h4)[1]'
    },
    pricingTitle: 'h5.container_header--item',
    pricingContainer: 'div.container_content',
    productName: 'div.card__content h1',
    viewProduct: index => `(//div[@class="feature-actions center"]//a)[${index}]`
}

/**
 * Verify Bundle Header is visible
 * @param expectedBundleName the expected name for the bundle
 * @param expectedBundleDesc the expected desc for the bundle
 */
async function verifyBundleHeader(expectedBundleName, expectedBundleDesc) {
    await verifyElementIsVisible(bundleSelectors.bundleName);
    await verifyElementIsVisible(bundleSelectors.bundleDesc);
    await verifyElementIsVisible(bundleSelectors.buyButton);
    let actualBundleName = await retrieveText(bundleSelectors.bundleName)
    expect(actualBundleName).toBe(expectedBundleName)
    let actualBundleDesc = await retrieveText(bundleSelectors.bundleDesc)
    expect(actualBundleDesc).toBe(expectedBundleDesc)
}

/**
 * Verify products in the bundle
 * @param takes array with product names as parameter
 */
async function verifyBundleProducts(expectedBundleProducts) {
    await verifyElementIsVisible(bundleSelectors.firstProduct.container, true)
    var bundleProducts = await getAllBundleProducts()
    for (let i = 1; expectedBundleProducts.length >= i; i++) {
        expect(
            bundleProducts.has(expectedBundleProducts[i-1])
        ).toBeTruthy()
    }
}

/**
 * Verify Pricing container for bundle is displaying and the expected price is shown
 * @param bundlePrice expected bundle cost
 */
async function verifyBundlePricing(bundlePrice) {
    await verifyElementIsVisible(bundleSelectors.pricingContainer)
    let productPrice = await retrieveText('div.stats:nth-child(1) span.price--value')
    expect(productPrice).toBe(bundlePrice)
}

/**
 * Verify 'View Product' button navigates to corresponding product profile page 
 * @param index determines which view product button to select
 */
async function verifyViewProductButton(index) {
    let productVal = await retrieveText(bundleSelectors.firstProduct.name, true)
    await (await page.$x(bundleSelectors.viewProduct(index)))[0].click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await verifyProductLabel(productVal, bundleSelectors.productName)
}

/**
 * Get all bundle products and returns an array with product names
 */
async function getAllBundleProducts() {
    let bundleProductSize = await page.evaluate(() => document.querySelectorAll('div[class="card__content"] h4').length)
    var productsInBundle = new Set()
    for (let i = 1; bundleProductSize >= i; i++) {
        let productVal = await retrieveText(`(//div[@class="card__content"]//h4)[${i}]`, true)
        productsInBundle.add(productVal);
    }
    return productsInBundle
}

module.exports = {
    verifyBundleHeader,
    verifyBundleProducts,
    verifyBundlePricing,
    verifyViewProductButton
}
