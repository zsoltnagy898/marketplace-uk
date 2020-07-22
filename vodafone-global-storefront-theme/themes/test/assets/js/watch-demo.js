/* eslint-disable */
$.fn.watchDemoFeature = function(modalContainerId) {
    return this.each(function () {
        var $watchDemoBtn = $(this);
        var $modalContainer = $(modalContainerId);

        $modalContainer.on("click", '[rel="modal:close"]', function() {
            $modalContainer.find('iframe').attr('src', 'about:blank');
        });

        $watchDemoBtn.on("click", function(e) {
            var demoUrl = $(this).data('link');
            $modalContainer.find('iframe').attr('src', demoUrl);
            $modalContainer.modal({
                fadeDuration: 100
            });
        });
    });
};
