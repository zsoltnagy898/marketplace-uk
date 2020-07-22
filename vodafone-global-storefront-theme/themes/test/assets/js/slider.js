/* eslint-disable */

function Slider($el, $container, $arrowContainer, options) {
    var settings  = Object.assign({}, {
        slidesToShow: 6,
        slidesToScroll: 6,
        variableWidth: true,
        draggable: false,
        infinite: false,
        rows: 0,
        speed: 600,
        arrows: false,
        showArrowsForSingleItem: true,
        responsive: [
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            }
        ]
    }, options)

    this.$el = $el;
    this.$container = $container;
    this.$arrowContainer = $arrowContainer;
    this.$prev = this.$container.find(".js-slider-prev");
    this.$next = this.$container.find(".js-slider-next");
    var itemPreffix = settings.isBundle ? ".bundle-" : ".";
    var sliderSelector = itemPreffix.concat("slider--item, ").concat(itemPreffix).concat("slider--image");
    this.itemsLength = this.$container.find(sliderSelector).length;
    this.options = settings;

    this.init = function() {
        this.$el.slick(this.options);
        this.$next.on('click', function() {
            this.next()
        }.bind(this));
        this.$prev.on('click', function() {
            this.previous()
        }.bind(this));
        if (!this.showArrowsForSingleItem() && this.itemsLength < 2) {
            this.hideArrowContainer();
        } else {
            this.setDisabledArrows();
        }
    }

    this.heroLinks = function() {
        $container.find(".hero__carousel-nav .js-slider-prev, .hero__carousel-nav .js-slider-next").on("mouseleave", function() {
            $container.find(".slick-slide").removeClass("prev-selected next-selected");
        });
        $container.find(".hero__carousel-nav .js-slider-prev").on("mouseenter", function() {
            $container.find(".slick-current").prev().addClass("prev-selected");
        });
        $container.find(".hero__carousel-nav .js-slider-next").on("mouseenter", function() {
            $container.find(".slick-current").next().addClass("next-selected");
        });
    }

    this.hideArrowContainer = function() {
        this.$arrowContainer.hide();
    }

    this.setDisabledArrows = function() {
        var canDisableArrows = !this.isInfinite() || this.itemsLength < 2;
        this.$next.attr("disabled", canDisableArrows && !this.isNextEnabled());
        this.$prev.attr("disabled", canDisableArrows && !this.isPrevEnabled());
    }

    this.previous = function() {
        this.$el.slick('slickPrev');
        this.setDisabledArrows();
    }

    this.next = function() {
        this.$el.slick('slickNext');
        this.setDisabledArrows();
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

    this.showArrowsForSingleItem = function() {
        return this.$arrowContainer && !!this.options.showArrowsForSingleItem;
    }

    this.isInfinite = function() {
        return !!this.options.infinite;
    }

    this.init();
    this.heroLinks();
}
