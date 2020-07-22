$(".js-add-cart").on("click", function(e) {
    e.preventDefault();
    var eppid = $(this).data("eppid");
    var appid = $(this).data("appid") || [];
    window.scrollTo(0,0);
    AD_addToCart(eppid, appid);
})