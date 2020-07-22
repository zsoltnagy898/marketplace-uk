const { navigateToPage } = require('../testsUtils/setup/utils');
const { baseUrl, homePageTitle } = require('../testsUtils/setup/constants');
const { verifyGridApps, verifyListingApps, toggleSearchView, verifyProductBadge, navigateAllApps, view } = require('../page_elements/pages/GridListingView');
const searchProduct = 'Office 365'; // This product has a badge

describe("Grid and Listing Views",
  () => {
    test("Grid tests", async () => {
      await page.setViewport({ width: 1281, height: 720 }); // Viewport needs to be larger to enable grid and listing options (responsive element)
      // Navigate to marketplace homepage
      await navigateToPage(baseUrl + "/en-US/home", homePageTitle)
      // Verify All Applications tab
      await navigateAllApps()
      // Click on grid icon
      await toggleSearchView(view.GRID)
      // Verify all applications are displayed in grid
      await verifyGridApps()
      // Click on listing icon
      await toggleSearchView(view.LIST)
      // Verify that applications are displayed in list
      await verifyListingApps()
      // Search for application with a badge
      await verifyProductBadge(searchProduct)
    }, 80000
    )
  })
