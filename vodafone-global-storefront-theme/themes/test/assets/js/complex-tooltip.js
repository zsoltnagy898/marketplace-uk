/* eslint-disable */

$.complexTooltip = function(selector) {

    var createGlobalTooltip = function() {
        var $globalTooltip = $("<div class='tooltip--complex tooltip--complex--global'></div>");
        $("body").append($globalTooltip);
    };

    var globalTooltipOnHover = function($globalTooltip, $tooltip) {
        $globalTooltip.append($tooltip.clone());
        var destination = $($tooltip).parent().offset();
        $globalTooltip.css({ position: "absolute", top: destination.top, left: destination.left, display: "block" }).addClass("is-active");
    };

    var isTooltipInViewport = function($tooltip) {
        if ($tooltip.offset()) {
            var elementBottom = $tooltip.offset().top + $tooltip.outerHeight();
            var viewportBottom = $(window).scrollTop() + $(window).height();

            return elementBottom < viewportBottom;
        }
        return false;
    };

    var setTooltipPosition = function($tooltip) {
        $tooltip.removeClass("tooltip--complex__content--top").addClass("tooltip--complex__content--bottom");
        if(!isTooltipInViewport($tooltip) || $("body").attr("data-page") === "profile") {
            $tooltip.removeClass("tooltip--complex__content--bottom").addClass("tooltip--complex__content--top");
        }
    };

    var setComplexTooltip = function() {
        $(document).on("mouseenter", selector, function() {
            var $tooltip = $(this).find(".js-complex-tooltip");
            if ($tooltip.length) {
                var $globalTooltip = $("body").find(".tooltip--complex--global");
                var tooltipWidth = $tooltip.outerWidth();
                var marginLeft = (-1) * tooltipWidth / 2;
                $tooltip.css({ "margin-left": marginLeft });
                setTooltipPosition($tooltip);
                globalTooltipOnHover($globalTooltip, $tooltip);
            }
        });
        $(document).on("mouseleave", selector, function() {
            var $globalTooltip = $("body").find(".tooltip--complex--global");
            $globalTooltip.find(".tooltip--complex__content").remove();
            $globalTooltip.removeClass("is-active");
        })
    };
    createGlobalTooltip();
    setComplexTooltip();
};
