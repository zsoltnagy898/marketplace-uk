/* eslint-disable */

$.fn.ratingFeature = function() {
    return this.each(function() {
        var $container = $(this);
        var $numberContainer = $container.find('.js-rating-number');
        var $ratingDetailsContainer = $container.find('.js-rating-details');
    
        var labelGuard = function(rate) {
            var toShow = (rate == 1) ? "js-rating-label-single-star" : "js-rating-label-multi-stars";
            var toHide = (rate == 1) ? "js-rating-label-multi-stars" : "js-rating-label-single-star";
    
            $ratingDetailsContainer.find("."+toShow).removeClass("is-hidden");
            $ratingDetailsContainer.find("."+toHide).addClass("is-hidden");
        }

        $container.find(".js-rating-icon").on("mouseenter", function() {
            var rate = $(this).data("rating");
            $numberContainer.text(rate);
            labelGuard(rate);
            $ratingDetailsContainer.removeClass("is-hidden");
        });
        $container.on("mouseleave", function() {
            var rate = $container.find("input:checked").val();
            if (rate) {
                $numberContainer.text(rate);
            } else {
                $ratingDetailsContainer.addClass("is-hidden");
            }
        });

        // init
        var rate = $container.find("input:checked").val();
        if (rate) {
            $numberContainer.text(rate);
        } else {
            $ratingDetailsContainer.addClass("is-hidden");
        }
    })
}
