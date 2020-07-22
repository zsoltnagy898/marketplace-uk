const { mouseHoverXPATH, verifyElementIsVisible, verifyProductLabel } = require('../../testsUtils/setup/utils');
const expectedLabelStrings = {
  DESCRIPTION: "Virtual Event, Virtual Expos, Virtual Conferences, Event Communities, Training Centers",
  BADGE: 'Web Development',
  DETAILS: 'Details',
  PRICING: 'Pricing',
  COMMUNICATION: 'Communication',
  SUPPORTED: 'Supported Devices',
  DEVELOPER: 'Developer',
  WEBINAR: 'Webinar Venue'
}
const productSelectors = {
  TITLE: 'h1[class="profile_header--title"]',
  DESCRIPTION: 'div[class="summary--caption"]',
  BADGE: 'span[class^="badge"]',
  IMAGE: 'div.card__image div.id',
  BUYBUTTON: 'div.card__actions a',
  BUYBUTTONTEXT: 'div.card__actions span',
  SCREENSHOT: 'a[class$="js-screenshots-link"]',
  SIDEBAR: 'div[class="container-box"]',
  DETAILS: '//div[@class="container_header"]/h5[text()="Details"]',
  PRICING: '//div[@class="container_header"]/h5[text()="Pricing"]',
  SIMILARAPPS: 'div.feature-content',
  FOOTER: 'div.custom-footer',
  POLICIES: {
      email: '//dl[@class="description-list"]/dt[text()="Email:"]',
      knowledge: '//dl[@class="description-list"]/dt[text()="Knowledge Base:"]',
      phone: '//dl[@class="description-list"]/dt[text()="Phone:"]'
  },
  EDITIONS: {
      webinar: '//div[@class="profile-edition"]//h3[text()="Webinar Venue"]',
      event: '//div[@class="profile-edition"]//h3[text()="Event Venue"]',
      enterprise: '//div[@class="profile-edition"]//h3[text()="Enterprise Venue"]'
  }
}
const productTabNames = {
  OVERVIEW: {
      expected: 'Overview',
      selector: 'a[href$="overview"]'
  },
  FEATURES: {
      expected: 'Features',
      selector: 'a[href$="features"]'
  },
  REVIEWS: {
      expected: 'Reviews',
      selector: 'a[href$="reviews"]'
  },
  QUESTIONS: {
      expected: 'Questions',
      selector: 'a[href$="questions"]'
  },
  POLICIES: {
      expected: 'Policies & Support',
      selector: 'a[href$="support"]'
  },
  RESOURCES: {
      expected: 'Resources',
      selector: 'a[href$="resources"]'
  },
  EDITIONS: {
      expected: 'Editions & Pricing',
      selector: 'a[href$="editions"]'
  }
}

/**
 * Verify that all elements in the header are visible and present
 * @param title of product to be expected
 */
async function verifyProductProfileHeader(productToSearch) {
  await verifyProductLabel(productToSearch, productSelectors.TITLE)
  await verifyProductLabel(expectedLabelStrings.DESCRIPTION, productSelectors.DESCRIPTION)
  await verifyProductLabel(expectedLabelStrings.BADGE, productSelectors.BADGE)
  await verifyElementIsVisible(productSelectors.IMAGE)
  await verifyElementIsVisible(productSelectors.BUYBUTTON)
}

/**
 * Verify that all tabs on product profile page display correct text
 */
async function verifyProductTabs() {
  await verifyProductLabel(productTabNames.OVERVIEW.expected, productTabNames.OVERVIEW.selector)
  await verifyProductLabel(productTabNames.FEATURES.expected, productTabNames.FEATURES.selector)
  await verifyProductLabel(productTabNames.REVIEWS.expected, productTabNames.REVIEWS.selector)
  await verifyProductLabel(productTabNames.QUESTIONS.expected, productTabNames.QUESTIONS.selector)
  await verifyProductLabel(productTabNames.POLICIES.expected, productTabNames.POLICIES.selector)
  await verifyProductLabel(productTabNames.RESOURCES.expected, productTabNames.RESOURCES.selector)
  await verifyProductLabel(productTabNames.EDITIONS.expected, productTabNames.EDITIONS.selector)
}

/**
 * Verify all elements on the overview page are present
 */
async function verifyOverviewPage() {
  await verifyElementIsVisible(productSelectors.SCREENSHOT)
  await verifyElementIsVisible(productSelectors.SIDEBAR)
  await verifyProductLabel(expectedLabelStrings.DETAILS, productSelectors.DETAILS, true)
  await verifyProductLabel(expectedLabelStrings.PRICING, productSelectors.PRICING, true)
}

/**
 * Ensure footer is visible
 */
async function verifyFooterIsVisible() { 
  await verifyElementIsVisible(productSelectors.SIMILARAPPS)
  await verifyElementIsVisible(productSelectors.FOOTER)
}

/**
 * Verify if header is in expanded state
 */
async function verifyHeaderIsExpanded() {
  if (await page.waitForSelector('div[class$="is-fixed"]') == null)
    return true;
  else
    return false;
}

/**
 *  Verify if header is resizing with mouse scroll
 */
async function verifyHeaderResize() {
  await mouseHoverXPATH('//div[@id="footer-universal"]');
  expect(
    await verifyHeaderIsExpanded()
  ).toBeFalsy();
  await mouseHoverXPATH('//div[@class="ad-uniheader__container"]');
  expect(
    await verifyHeaderIsExpanded()
  ).toBeTruthy();
}

/**
 * Click and cycle through screenshots modal on overview page
 */
async function verifyScreenshotsFeature() { 
  await page.waitForSelector('li[class="stack--item"] a[class$="screenshots-link"]')
  await page.click('li[class="stack--item"] a[class$="screenshots-link"]')
  // Paginators
  await page.click('button[aria-label="right"]')
  await page.click('button[aria-label="left"]')
  // Close modal
  await page.click('div[id="profile-screenshots"] h3 a')
}

/**
 * @param buyButtonString expected string from the buy button
 */
async function verifyBuyButton(buyButtonString) {
  await verifyElementIsVisible(productSelectors.BUYBUTTON)
  await verifyProductLabel(buyButtonString, productSelectors.BUYBUTTONTEXT)
}

module.exports = {
  verifyProductProfileHeader,
  verifyProductTabs,
  verifyOverviewPage,
  verifyFooterIsVisible,
  verifyHeaderResize,
  verifyScreenshotsFeature,
  expectedLabelStrings,
  verifyBuyButton
} 