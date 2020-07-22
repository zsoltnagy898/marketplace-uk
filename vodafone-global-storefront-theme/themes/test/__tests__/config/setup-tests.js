const { baseUrl } = require('../testsUtils/setup/constants');

// by default this function receives `puppeteer` instance to work with
module.exports = (puppeteer, options) => {
    // Instantiating a new chrome instance before every test
    beforeAll(async () => {
        jest.setTimeout(500000);
        // make browser instance page global so it can be accessed in each test.
        console.log(`Launching a browser`);
        global.browser = await puppeteer.launch({
            headless: options.HEADLESS || false,
            timeout: 60000,
            slowMo: 0
        });
        global.page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(baseUrl);
    })
}
