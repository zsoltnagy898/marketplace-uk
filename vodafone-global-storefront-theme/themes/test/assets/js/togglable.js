/* eslint-disable */

$.fn.togglable = function(key, hash) {
    return this.each(function() {
        var $container = $(this);
        var toggleClass = '.js-' + key + '-toggle';
        var contentClass = '.js-' + key + '-content';
        var prevBtnClass = '.js-' + key + '-prev';
        var nextBtnClass = '.js-' + key + '-next';
        var hashPattern = '#' + hash + '/';

        var selectItem = function(elementId) {
            // deselect old items
            $container.find(toggleClass + '.selected').removeClass('selected');
            $container.find(contentClass + '.selected').removeClass('selected');

            // select new item
            $container.find(toggleClass + '[data-id=' + elementId + ']').addClass('selected');
            $container.find(contentClass + '[data-id=' + elementId + ']').addClass('selected');
        }

        // init select if provided by hash
        if (hash && location.hash) {
            var $selectedItem = $container.find(toggleClass + '.selected');
            var selectedItemId = $selectedItem ? $selectedItem.data('id') : '';
            var elementId = location.hash.replace(hashPattern, "");

            // do nothing if it's first item (selected by default)
            if (elementId !== selectedItemId) {
                selectItem(elementId);
            }
        }

        // click on a togglable entry in the left menu
        $container.on('click', toggleClass, function(e) {
            e.preventDefault();

            var $selectedItem = $container.find(toggleClass + '.selected');
            var selectedItemId = $selectedItem ? $selectedItem.data('id') : '';

            var $element = $(this);
            var elementId = $element.data('id');

            // do nothing if this is the currently selected item
            if (elementId === selectedItemId) {
                return;
            }

            selectItem(elementId);

            if (hash) { 
                location.replace(hashPattern + elementId);
            }
        });

        if ($container.find(prevBtnClass).length) {
            // click on the "previous" button
            $container.on('click', prevBtnClass, function() {
                var $selectedItem = $container.find(toggleClass + '.selected');
                var $prevItem = $selectedItem.parent().prev();

                // if this is the first item, we need to wrap around to the last
                if (!$prevItem.length) {
                    $prevItem = $selectedItem.parent().siblings().last();
                }

                // if we do have an entry, toggle it
                if ($prevItem.length) {
                    $prevItem.find(toggleClass).click();
                }
            });
        }

        if ($container.find(nextBtnClass).length) {
            // click on the "next" button
            $container.on('click', nextBtnClass, function() {
                var $selectedItem = $container.find(toggleClass + '.selected');
                var $nextItem = $selectedItem.parent().next();

                // if this is the last item, we need to wrap around to the first
                if (!$nextItem.length) {
                    $nextItem = $selectedItem.parent().siblings().first();
                }

                // if we do have an entry, toggle it
                if ($nextItem.length) {
                    $nextItem.find(toggleClass).click();
                }
            });
        }
    })
};
