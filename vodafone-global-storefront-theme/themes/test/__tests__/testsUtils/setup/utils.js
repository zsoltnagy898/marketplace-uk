/**
 * Retrieve text from selector
 */
async function retrieveText(path, isXPath) {
    let pathData;
    if (isXPath) {
        pathData =
            await page.$x(path);
    } else {
        pathData =
            await page.$$(path);
    }
    let pathTextContent =
        await pathData[0].getProperty('textContent');
    let text =
        await pathTextContent.jsonValue();
    return text;
}

/** 
 * Select Marketplace header 
 */
async function selectMarketplaceHeader() {
    await page.click(`a[id='shop']`);
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    let pageURL = await page.url();
    expect(pageURL.includes('/home')).toBeTruthy();
}

/** 
 * Login Marketplace manager to Theme manager
 * @param username Marketplace Manager username
 * @param password Marketplace Manager password
 */
async function loginMarketplaceManager(username, password) {
    await page.type(emailSelector, username);
    await page.type(passSelector, password);
    await page.click(signInSelector);
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
}

/**
 * Mouse Over Action using XPATH
 */
async function mouseHoverXPATH(xpath) {
    await (await page.$x(xpath))[0].hover();
}

/**
 * Remove spaces and line breaks surrounding string
 */
async function trimRemoveLineBreaks(text) {
    let stringName = text.replace(/(\r\n|\n|\r)/gm, "").trim();
    return stringName;
}

/**
 * Navigate to specific URL
 * @param url Url to navigate to
 * @param title page title of destination
 */
async function navigateToPage(url, title) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector("body");
    const pageTitle = await page.title();
    expect(pageTitle).toBe(title);
}

/**
 * Use the search bar in the naviagtion
 */
async function useSearchBar(toSearch) {
    if (!!toSearch) {
        const searchBarSelector = 'input[data-auto-input="search:input"]';
        await page.waitForSelector(searchBarSelector);
        await page.type(searchBarSelector, toSearch);
        await page.click('button[data-auto-action="search:button"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
    } else {
        throw "useSearchBar has invalid toSearch parameter"
    }
}

/**
 * Verify that a web element is Visible
 */
async function verifyElementIsVisible(selector, isXPath) {
    if (isXPath)
        expect(
            await page.waitForXPath(selector,
                { visible: true })).toBeTruthy();
    else
        expect(
            await page.waitForSelector(selector,
                { visible: true })).toBeTruthy();
}

/**
 * Verify Name of the Product corresponds to product page
 * @param expectedString string that will be used in the expect statement 
 * @param selector selector string for product to verify
 * @param boolean to determine if selector is XPath or CSS
 */
async function verifyProductLabel(expectedString, selector, isXPath) {
    if (isXPath) {
        await page.waitForXPath(selector);
        var productTitle =
            await retrieveText(selector, true);
    }
    if (!isXPath) {
        await page.waitForSelector(selector);
        var productTitle =
            await retrieveText(selector);
    }
    if (!!expectedString) {
        await trimRemoveLineBreaks(productTitle);
        expect(
            productTitle
        ).toBe(expectedString);
    } else {
        throw "verifyProductLabel has invalid expectedString parameter"
    }
}

module.exports = {
    retrieveText,
    selectMarketplaceHeader,
    loginMarketplaceManager,
    mouseHoverXPATH,
    trimRemoveLineBreaks,
    navigateToPage,
    useSearchBar,
    verifyElementIsVisible,
    verifyProductLabel
};
