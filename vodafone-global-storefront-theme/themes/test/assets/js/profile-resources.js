/* eslint-disable */
$.fn.resources = function() {
    return this.each(function() {
        var $container = $(this);

        // init
        $container.find('.js-resource-toggle').first().addClass('selected');
        $container.find('.js-resource-content').first().removeClass('is-hidden');
        $container.find('[data-toggle="collapse"]').first().addClass('open');
        var $initialIFrame = $container.find('.js-resource-content').first().find('iframe');
        $initialIFrame.attr('src', $initialIFrame.attr('data-link'));
        // end init

        // set up handlers
        $container.on('click', '[data-toggle="collapse"]', function(e){
            e.preventDefault();
            $(this).toggleClass('open');
        });
        $container.on('click', '.js-resource-toggle', function(e) {
            e.preventDefault();

            var $currentResource = $container.find('.js-resource-toggle.selected');
            var currentResourceId = $currentResource ? $currentResource.data('id') : '';

            var $selectedResource = $(this);
            var selectedResourceId = $selectedResource.data('id');

            // do nothing if this is the currently selected resource
            if (currentResourceId === selectedResourceId) {
                return;
            }

            // get iframes for current open and newly selected
            var $currentResourceIFrame = $container.find('.js-resource-content[data-id=' + currentResourceId + ']').find('iframe');
            var $selectedResourceIFrame = $container.find('.js-resource-content[data-id=' + selectedResourceId + ']').find('iframe');

            var defaultBlank = 'about:blank';
            var selectedIframeDataLink = $selectedResourceIFrame.attr('data-link');

            // load selected resource's iframe
            // kill previously selected, so it eg. video will stop if played
            $currentResourceIFrame.attr('src', defaultBlank);
            $selectedResourceIFrame.attr('src', selectedIframeDataLink);

             // deselect old resource
            $currentResource.removeClass('selected');
            $container.find('.js-resource-content[data-id=' + currentResourceId + ']').addClass('is-hidden');

            // select new resource
            $selectedResource.addClass('selected');
            $container.find('.js-resource-content[data-id=' + selectedResourceId + ']').removeClass('is-hidden');
        });
    });
};
