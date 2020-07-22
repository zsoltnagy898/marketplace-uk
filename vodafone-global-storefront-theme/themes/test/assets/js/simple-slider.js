/* eslint-disable */

$.fn.simpleSlider = function() {
    return this.each(function() {
        var $container = $(this);
        var $prev = $container.find(".js-section-prev");
        var $next = $container.find(".js-section-next");
        var $containers = $container.find(".container-slider");
        $containers.each(function() {
            if(!$(this).html().trim()) {
                $(this).remove();
            }
        })
        if ($containers.length > 1) {
            $next.prop("disabled", false);
        }
        $prev.on("click", function() {
            if (!$(this).prop("disabled")) {
                var $current = $container.find(".container-slider.show");
                $current.removeClass("show");
                $current.prev().addClass("show");
                if ($current.prev().is(':first-child')) {
                    $prev.prop("disabled", true);
                }
                $next.prop("disabled", false);
            }
        })
        $next.on("click", function() {
            if (!$(this).prop("disabled")) {
                var $current = $container.find(".container-slider.show");
                $current.removeClass("show");
                $current.next().addClass("show");
                if ($current.next().is(':last-child')) {
                    $next.prop("disabled", true);
                }
                $prev.prop("disabled", false);
            }
        })
    })
};
