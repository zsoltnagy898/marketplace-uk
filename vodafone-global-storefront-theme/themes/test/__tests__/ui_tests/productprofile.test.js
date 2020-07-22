const {
  baseUrl,
  firstSearchResult,
  homePageTitle } = require('../testsUtils/setup/constants');
const {
  verifyProductProfileHeader,
  verifyProductTabs,
  verifyFooterIsVisible,
  verifyOverviewPage } = require('../page_elements/pages/ProductProfile');
const {
  navigateToPage,
  useSearchBar } = require('../testsUtils/setup/utils');
const productToSearch = 'InfoNeedle';

describe("Product Profile Page", () => {
  test(
    "Recurring Product UI",
    async () => {
      // Navigate to Marketplace Homepage
      await navigateToPage(baseUrl + '/en-US/home', homePageTitle)
      // Search for an application using the search bar
      await useSearchBar(productToSearch)
      await page.click(firstSearchResult)
      // Verify tabs are present in Product Header UI
      await verifyProductProfileHeader(productToSearch)
      // Verify Product Tabs
      await verifyProductTabs()
      // Verify elements on the overview page
      await verifyOverviewPage()
      // Verify similar Apps and paginators
      await verifyFooterIsVisible()
    },
    90000
  )
})
