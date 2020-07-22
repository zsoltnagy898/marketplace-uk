const {
  selectFromSideBar,
  selectDropdownFilter,
  selectGridApplication,
  verifyCategoriesTag,
  selectFilters } = require('../page_elements/pages/ProductCategories');
const {
  baseUrl,
  homePageTitle } = require('../testsUtils/setup/constants');
const { navigateToPage } = require('../testsUtils/setup/utils');
const sidebarXPath = '(//div[@data-component="multiple-header-vertical-navigation"]//li)[1]';
const { expectedLabelStrings } = require('../page_elements/pages/ProductProfile');

describe("Listing page", () => {
  test(
    "Product Categories Filter",
    async () => {
      // 1. Navigate to Marketplace homepage
      await navigateToPage(baseUrl + "/en-US/home", homePageTitle)
      // 2. Click on "Sales" link under "Categories"
      await selectFromSideBar(sidebarXPath,expectedLabelStrings.BADGE)
      // 3. Select "Rating" from the "Sort By" dropdown menu
      await selectDropdownFilter(selectFilters.RATING)
      // 4. Select "Popularity" from the "Sort By" dropdown menu
      await selectDropdownFilter(selectFilters.POPUARITY)
      // 5. Select "Newest" from the "Sort By" dropdown menu
      await selectDropdownFilter(selectFilters.NEWEST)
      // 6. Select "Alphabetical" from the "Sort By" dropdown menu
      await selectDropdownFilter(selectFilters.ALPHABETICAL)
      // 7. Click on one of the app in grid
      await selectGridApplication()
      // 8. Verify Category tag is visible on the App Profile Page
      await verifyCategoriesTag()
    }, 60000
  )
})
