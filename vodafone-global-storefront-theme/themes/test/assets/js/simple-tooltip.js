/* eslint-disable */

$.fn.simpleTooltip = function(selector) {
    var $container = $(this);
    $container.on("mouseenter", selector, function() {
        var $tooltip = $(this).find(".js-simple-tooltip");
        $tooltip.removeClass("is-hidden");

        var tooltipWidth = $tooltip.outerWidth();
        var marginLeft = (-1) * tooltipWidth / 2;

        $tooltip.css({ "margin-left": marginLeft });
    });

    $container.on("mouseleave", selector, function() {
        var $tooltip = $(this).find(".js-simple-tooltip");
        $tooltip.addClass("is-hidden");
    });
};
