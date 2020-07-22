/* eslint-disable */

function mobileSlider($el, $container, options) {

    this.$el = $el;
    this.$container = $container;

    this.$prev = this.$container.find(".configure-slider-prev");
    this.$next = this.$container.find(".configure-slider-next");

    this.init = function() {
        this.$el.slick(options);
        this.$next.on('click', function(e) {
            e.preventDefault();
            this.$el.slick('slickNext');
        }.bind(this));
        this.$prev.on('click', function(e) {
            e.preventDefault();
            this.$el.slick('slickPrev');
        }.bind(this));
    }

    this.setSlide = function(index) {
        this.$el.slick('slickGoTo', index);
    }

    this.isNextEnabled = function() {
        return this.getCurrentSlide() < (this.itemsLength - this.$el.slick('slickGetOption','slidesToScroll'));
    }

    this.isPrevEnabled = function() {
        return this.getCurrentSlide() !== 0;
    }

    this.getCurrentSlide = function() {
        return this.$el.slick('slickCurrentSlide');
    }

    this.getItem = function(index) {
        return this.children.findByIndex(index);
    }

    this.getCurrentItem = function() {
        return this.getItem(this.getCurrentSlide());
    }

    this.isInfinite = function() {
        return !!this.options.infinite;
    }

    this.init();
}
