const { retrieveText, mouseHoverXPATH, trimRemoveLineBreaks } = require('../../testsUtils/setup/utils');
const carouselProductSelector = '//div[contains(@class,"slick-active")]//div[contains(@class,"hero__item_content")]';
const callToActionButtonSelector = '//div[contains(@class,"slick-active")]//a[contains(@class,"button__large")]';
const carouselProductTitleSelector = '//div[contains(@class,"adb-is-active")]//a[contains(@class,"adb-title__xxlarge")]';
const carouselImageSelector = '//div[contains(@class,"slick-active")]//div[contains(@class,"hero__item_image")]';
const sliderCategories = {
    FEATURED: 'featured',
    POPULAR: 'popular'
}
const carouselActions = {
    NEXT: 'next',
    PREVIOUS: 'prev'
}

/**
 * Select a product in feature slider
 * @param numOfProduct number of the product in the slider (order from left to right)
 */
async function selectProductInSlider(numOfProduct) {
    let sliderProductSelector = `(//div[contains(@class, "slider")]//h3)[${numOfProduct}]`;
    if (
        await retrieveText(
            sliderProductSelector, true) !== null) {
        let sliderName =
            await trimRemoveLineBreaks(
                await retrieveText(
                    sliderProductSelector, true)
            );
        await (
            await page.$x(
                sliderProductSelector
            ))[0].click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        let productProfileName =
            await trimRemoveLineBreaks(
                await retrieveText(
                    'h1[class^="profile_header--title"]')
            );
        expect(sliderName).toBe(
            productProfileName
        );
    } else throw `Number of product ${numOfProduct} does not exist`;
}

/**
 * Select the featured apps View All button 
 * @param nameForSlider determines what is being expected of URL
 * @param index determines which slider on the page
 */
async function selectSliderViewAll(nameForSlider, index) {
    switch (nameForSlider) {
        case 'featured': {
            await (
                await page.$x(`(//a[contains(@class,"toolbar--item")])[${index}]`))[0].click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            let pageURL = page.url();
            expect(
                pageURL.slice(-8)).toBe(
                    'FEATURED'
                );
        }
            break;
        case 'popular': {
            await (
                await page.$x(`(//a[contains(@class,"toolbar--item")])[${index}]`))[0].click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            let pageURL = page.url();
            expect(
                pageURL.slice(-10)).toBe(
                    'POPULARITY'
                );
        }
            break;
    };
}

/**  
 * Select the next and previous on carousel
 * @param direction 'next' or 'prev'
 */
async function scrollCarousel(direction) {
    switch (direction) {
        case 'next': {
            let carouselProduct =
                await trimRemoveLineBreaks(
                    await retrieveText(
                        carouselProductSelector, true)
                );
            await page.click(`a[class$="next__link"]`);
            let nextCarouselProduct =
                await trimRemoveLineBreaks(
                    await retrieveText(
                        carouselProductSelector, true)
                );
            expect(carouselProduct).not.toBe(
                nextCarouselProduct
            );
        }
            break;
        case 'prev': {
            let carouselProduct =
                await trimRemoveLineBreaks(
                    await retrieveText(
                        carouselProductSelector, true)
                );
            await page.click(`a[class$="prev__link"]`);
            let prevCarouselProduct =
                trimRemoveLineBreaks(
                    await retrieveText(
                        carouselProductSelector, true)
                );
            expect(carouselProduct).not.toBe(
                prevCarouselProduct
            );
        }
            break;
        default:
            throw `direction parameter is invalid`
    }
}

/**  
 * Select Call to Action Button  
 */
async function selectCallToActionButton() {
    await mouseHoverXPATH(
        callToActionButtonSelector
    );
    let productName = await retrieveText(
        carouselProductTitleSelector, true);
    await (
        await page.$x(
            callToActionButtonSelector
        ))[0].click();
    let productProfileName = await retrieveText(
        'h1[class^="adb-summary--title"]'
    );
    expect(productName).toBe(
        productProfileName
    );
}

/** 
 * Select Product title 
 */
async function selectProductTitleText() {
    await mouseHoverXPATH(
        carouselProductTitleSelector
    );
    let productName =
        await retrieveText('//div[contains(@class,"slick-active")]//a[contains(@class,"title__xxlarge")]', true);
    await (
        await page.$x(
            carouselProductTitleSelector
        ))[0].click();
    let productProfileName =
        await retrieveText(
            'h1[class^="adb-summary--title"]'
        );
    expect(productName).toBe(
        productProfileName
    );
}

/** 
 * Mouse Over carousel for ~6 seconds 
 */
async function mouseOverCarousel() {
    await mouseHoverXPATH(
        carouselImageSelector
    );
    let currentProduct =
        retrieveText(
            carouselImageSelector, true);
    await page.waitFor(6000); // Ensure carousel does not scroll to next product while hovering the cursor 
    let nextProduct =
        retrieveText(
            carouselImageSelector, true);
    expect(currentProduct).toEqual(   // Carousel should not navigate product so the name should remain the same 
        nextProduct
    );
}

/** 
 * Mouse Over product tile
 * @param numOfTileinSlider represents which tile in the feature slider to hover
 */
async function mouseOverApplicationTile(numOfTileinSlider) {
    const featureSliderAppSelector = `(//div[contains(@class, "slider")]//h3//a)[${numOfTileinSlider}]`;
    if (await retrieveText(featureSliderAppSelector, true) !== null) {
        const sliderName =
            await retrieveText(featureSliderAppSelector, true);
        await mouseHoverXPATH(`(//div[contains(@class, "logo-container")])[${numOfTileinSlider}]`);
        const tileName =
            await retrieveText(`(//span[contains(@class, "tooltip--complex")]//h3)[${numOfTileinSlider}]`, true);
        expect(sliderName).toBe(
            tileName
        );
    } else throw `Tile ${numOfTileinSlider} does not exist`;
}

/** 
 * Select slider arrows 
 * @param slider Determines which slider the actions will be applied  
 */
async function selectSliderArrows(slider) {
    // These selectors are null until the disabled state appears once end of slider is reached on the arrow button
    const disabledSliderArrowNext =
        `(//div[@class="feature-content slider-list"])[${slider}]//button[@aria-label="next" and @disabled="disabled"]`;
    const disabledSliderArrowPrev =
        `(//div[@class="feature-content slider-list"])[${slider}]//button[@aria-label="prev" and @disabled="disabled"]`;
    for (let i = 0; (await page.$x(disabledSliderArrowNext) == null); i++) {
        await (
            await page.$x(
                `(//div[@class="feature-content slider-list"])[${slider}]//button[@aria-label="next"]`
            ))[0].click();
    };
    expect(
        await page.$x(disabledSliderArrowNext)).toBeTruthy(); // if the slider reaches the end, the "next" arrow button should not be clickable
    for (let i = 0; (await page.$x(disabledSliderArrowPrev) == null); i++) {
        await (
            await page.$x(
                `(//div[@class="feature-content slider-list"])[${slider}]//button[@aria-label="prev"]`
            ))[0].click();
    };
    expect(
        await page.$x(disabledSliderArrowPrev)).toBeTruthy(); // if the slider reaches the end, the "prev" arrow button should not be clickable
}

module.exports = {
    sliderCategories,
    carouselActions,
    selectProductInSlider,
    selectSliderViewAll,
    scrollCarousel,
    selectCallToActionButton,
    mouseHoverXPATH,
    selectProductTitleText,
    mouseOverCarousel,
    mouseOverApplicationTile,
    selectSliderArrows
};
