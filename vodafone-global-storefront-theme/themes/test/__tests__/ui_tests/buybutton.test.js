const { navigateToPage, useSearchBar } = require('../testsUtils/setup/utils');
const { homePageTitle, baseUrl, firstSearchResult } = require('../testsUtils/setup/constants');
const { verifyBuyButton } = require('../page_elements/pages/ProductProfile')
const Applications = {
    FREE: "InfoNeedle",
    TRIAL: "CloudPassage Halo",
    TRIALEDITIION: "Box",
    RECURRING: "Shrek Forever After"
}
const Expected = {
   BUYBUTTON: "Buy Now",
   TRIALBUTTON: "Start a Free Trial",
   TRIALEDITIONBUTTON: "Try the Free Edition" 
}

describe("CTA tests",
    () => {
        test("Buy button tests", async () => {
            await navigateToPage(baseUrl + "/en-US/home", homePageTitle);
            // Search Free App
            await useSearchBar(Applications.FREE);
            await page.click(firstSearchResult);
            await verifyBuyButton(Expected.BUYBUTTON);
            // Search Free Trial App
            await useSearchBar(Applications.TRIAL);
            await page.click(firstSearchResult);
            await verifyBuyButton(Expected.TRIALBUTTON);
            // Search Trial Edition App
            await useSearchBar(Applications.TRIALEDITIION);
            await page.click(firstSearchResult);
            await verifyBuyButton(Expected.TRIALEDITIONBUTTON);
            // Search Recurring Edition App    
            await useSearchBar(Applications.RECURRING);
            await page.click(firstSearchResult);
            await verifyBuyButton(Expected.BUYBUTTON);
        })
    }

)