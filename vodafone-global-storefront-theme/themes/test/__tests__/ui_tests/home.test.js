const {
  selectProductInSlider,
  selectSliderViewAll,
  scrollCarousel,
  mouseOverApplicationTile,
  mouseOverCarousel,
  selectSliderArrows,
  sliderCategories,
  carouselActions } = require('../page_elements/pages/HomePage');
const {
  baseUrl,
  homePageTitle } = require('../testsUtils/setup/constants');
const { navigateToPage } = require('../testsUtils/setup/utils');

describe("Home Page", () => {
  test(
    "Homepage Carousel / Slider",
    async () => {
      // Navigate to Marketplace Homepage
      await navigateToPage(baseUrl + '/en-US/home', homePageTitle)
      // Click a Product in the featured apps slider
      await selectProductInSlider(2)
      await navigateToPage(baseUrl + '/en-US/home', homePageTitle)
      // Click "View all" button from featured apps + Click marketplace header
      await selectSliderViewAll(sliderCategories.FEATURED, 1)
      await navigateToPage(baseUrl + '/en-US/home', homePageTitle)
      // Click "View all" button from popular apps + Click marketplace header
      await selectSliderViewAll(sliderCategories.POPULAR, 3)
      await navigateToPage(baseUrl + '/en-US/home', homePageTitle)
      // Click left and right to cycle through applications on the carousel
      await scrollCarousel(carouselActions.NEXT)
      await scrollCarousel(carouselActions.PREVIOUS)
      // Mouse Over Carousel for 6seconds
      await mouseOverCarousel()
      // Mouse Over app tile icon
      await mouseOverApplicationTile(1)
      // Click slider arrows until the end of product lists
      await selectSliderArrows(1)
    },
    90000
  )
})
