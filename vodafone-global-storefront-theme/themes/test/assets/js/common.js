/* eslint-disable */

$(document).ready(function() {
    $(".js-dropdown-select").dropDownFilter();
    $('.js-toggle-more').toggleMore();
    var isNotTouch= !('ontouchstart' in window);
    if (isNotTouch) {
        $(document).simpleTooltip(".tooltip");
        $.complexTooltip(".tooltip--complex");
        $(".tooltip--complex__overview").dotdotdot({
            truncate:"node"
        });
    }
    $(document).on("click", ".modal button[rel*='modal:close']", function(e) {
        e.preventDefault();
        $.modal.close();
    }); 
});
