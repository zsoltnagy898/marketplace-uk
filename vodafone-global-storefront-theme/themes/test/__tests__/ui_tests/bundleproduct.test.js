const { navigateToPage, useSearchBar } = require('../testsUtils/setup/utils');
const { homePageTitle, baseUrl, firstSearchResult } = require('../testsUtils/setup/constants');
const { verifyBundleHeader, verifyBundleProducts, verifyBundlePricing, verifyViewProductButton } = require('../page_elements/pages/BundleUI')
const bundleToSearch = "Devil Fruits [Free]" // Name of Bundle to search
const bundlePrice = "$10.00"
const bundleDesc = "this contains two devil fruits"
const expectedBundleProducts = ["Gum Gum Fruit", "Flare Flare Fruit"]

describe("Bundle Product UI",
    () => {
        test("Bundle UI tests", async () => {
            await navigateToPage(baseUrl + "/en-US/home", homePageTitle)
            await useSearchBar(bundleToSearch)
            await page.click(firstSearchResult)
            await verifyBundleHeader(bundleToSearch, bundleDesc)
            await verifyBundleProducts(expectedBundleProducts)
            await verifyBundlePricing(bundlePrice)
            await verifyViewProductButton(1)
        },
            70000)
    })
