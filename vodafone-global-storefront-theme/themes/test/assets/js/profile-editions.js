/* eslint-disable */
$.fn.editionSizing = function(resizeEvent) {
    var rows = [];
    var headerMax = [];
    var pricesMax = [];
    var detailsMax = [];

    /**
     * parse the list of editions, separating them in rows based on their position,
     * and calculating the max height of the header and prices
     * @param $container - the outer wrapper
     */
    var adjustAll = function($container) {
        var row = [];
        var top = 0;
        $container.find('.js-edition-box:not(.addon-configurator--hidden)').each(function(index, edition) {
            var elTop = $(edition).position().top;
            if (elTop !== top && row.length) {
                rows.push(row);
                row = [];
            }
            top = elTop;
            row.push($(edition));

            calculateMaxHeight($(edition), '.js-edition-header', headerMax);
            calculateMaxHeight($(edition), '.js-edition-prices', pricesMax);
            calculateMaxHeight($(edition), '.js-edition-details', detailsMax);
        });
        rows.push(row);

        // trigger the processing of the first row,
        // now that everything has been calculated
        adjustElementsInRow(0);
    };

    /**
     * calculate the max height of the given element for this edition
     * @param $edition - the edition element
     * @param selector - the selector to find in the element
     * @param target - the target array of heights to update
     */
    var calculateMaxHeight = function($edition, selector, target) {
        var $element = $edition.find(selector);

        // find out which row index we are at (at this point we are in the first parsing of the editions list)
        var rowIndex = rows.length;

        // define a maxHeight as the max existing height for this row, or default to 0
        var maxHeight = target[rowIndex] || 0;

        // if the current edition has an element of the type we are looking for, calculate
        if ($element.length) {
            $element.height('auto');
            maxHeight = Math.max($element.height(), maxHeight);
        }

        // update the maxHeight value for this row index in the given target array
        target[rowIndex] = maxHeight;
    };

    /**
     * adjust the height of elements in one row (header, prices)
     * @param rowIndex - the index of the row to update
     */
    var adjustElementsInRow = function(rowIndex) {
        var row = rows[rowIndex];

        if(!row) { return; }

        $(row).each(function(idx, item) {
            var $header = item.find('.js-edition-header');
            if ($header.length) {
                $header.height(headerMax[rowIndex] + "px");
            }
            var $prices = item.find('.js-edition-prices');
            if ($prices.length) {
                $prices.height(pricesMax[rowIndex] + "px");
            }
            var $details = item.find('.js-edition-details');
            if ($details.length) {
                $details.height(detailsMax[rowIndex] + "px");
            }
        });

        // after finishing, adjust the next row
        adjustElementsInRow(rowIndex + 1);
    };

    return this.each(function() {
        var $container = $(this);
        adjustAll($container);
        window.addEventListener('resize', function() {
            adjustAll($container);
        });

        // need to make this resize when the toggling action is performed
        var toggleSelector = '.js-edition-bullets-toggle';
        var toggleDetailSelector = '.js-edition-details';
        $container.on('click', toggleSelector, function() {
            adjustAll($container);
        });
        $container.on('click',toggleDetailSelector, function() {
            adjustAll($container);
        })

        // need to make this resize on generic resizeEvent trigger
        if (resizeEvent) {
            $container.on(resizeEvent, function() {
                adjustAll($container);
            });
        }
    })
};

$.fn.editionBulletsToggle = function() {
    return this.each(function() {
        var toggleSelector = '.js-edition-bullets-toggle';
        var $container = $(this);
        if ($container.find(toggleSelector).length) {
            $container.on('click', toggleSelector, function() {
                $container.toggleClass('toggled');
            });
        }
    })
};
