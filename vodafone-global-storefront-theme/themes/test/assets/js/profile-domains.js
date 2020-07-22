/* eslint-disable */
$.fn.profileDomains = function(options) {
    options = options || {};
    var eppid = options.eppid || '';
    var appid = options.appId || '';
    var API = new ActionAPI();
    var endpoint = options.endpoint || '';
    var query = options.query ? JSON.parse(options.query) : {};
    var i18n = options.i18n ? JSON.parse(options.i18n) : {};
    var userIsLoggedIn = options.userIsLoggedIn === 'true';
    var loginUrl = options.loginUrl || '';
    var checkoutUrl = options.checkoutUrl || '';
    var $container = $(this);
    var $checkoutBtn = $container.find('.js-checkout-button');
    var $recommendedDomainsContainer = $container.find('.js-recommended-content');
    var $addedDomainsContainer = $container.find('.js-added-content');
    var $loadingOverlay = $container.find('.js-domains-loader');
    var placeholder = $container.find('.js-domains-placeholder').html().trim();
    var domainRow = $container.find('.js-domains-row').html().trim();
    var addBtn = $container.find('.js-domains-row__add').html().trim();
    var addedBtn = $container.find('.js-domains-row__added').html().trim();
    var removeBtn = $container.find('.js-domains-row__remove').html().trim();
    var localStorageRoot = 'standaloneDomainsCart:' + appid;
    var dataStore = {
        recommended: [],
        added: JSON.parse(window.localStorage.getItem(localStorageRoot)) || []
    };

    /**
     * reset the recommended data container
     */
    var resetRecommendedDomainsContainer = function() {
        $loadingOverlay.addClass('is-hidden');
        $recommendedDomainsContainer.html($(placeholder).append(i18n.recommendedPlaceholder));
    };

    /**
     * reset the added data container
     */
    var resetAddedDomainsContainer = function() {
        $addedDomainsContainer.html($(placeholder).append(i18n.addedPlaceholder));
    };

    /**
     * identify an added item by its name
     * @param name
     * @returns {*}
     */
    var findAddedItem = function(name) {
        return dataStore.added.find(function(item) {
            return item.name === name;
        });
    };

    /**
     * build the common part of the domain row
     * @param rowData
     * @param index
     * @returns {jQuery|HTMLElement}
     */
    var buildDomainDataRow = function(rowData, index) {
        var newRow = $(domainRow);
        newRow.find('.js-domains-row__name').append(rowData.name);
        newRow.find('.js-domains-row__price').append(rowData.formattedPricePerYear);
        return newRow;
    };

    /**
     * display recommended data in the UI
     */
    var showRecommendedData = function() {
        if (!dataStore.recommended.length) {
            resetRecommendedDomainsContainer();
            return;
        }

        var domains = $('<div></div>');
        dataStore.recommended.forEach(function(rowData, index) {
            var newRecommendedRow = buildDomainDataRow(rowData, index);

            var newActionButton = typeof findAddedItem(rowData.name) !== 'undefined' ?
                $(addedBtn) :
                $(addBtn);
            newActionButton.attr('data-id', index);

            newRecommendedRow.find('.js-domains-row__button').append(newActionButton);
            domains.append(newRecommendedRow);
        });
        $recommendedDomainsContainer.html(domains[0].children);
    };

    /**
     * display added data in the UI
     */
    var showAddedData = function() {
        if (!dataStore.added.length) {
            resetAddedDomainsContainer();
            $checkoutBtn.attr('disabled','disabled');
            return;
        }

        $checkoutBtn.removeAttr('disabled');
        var domains = $('<div></div>');
        dataStore.added.forEach(function(rowData, index) {
            var newAddedRow = buildDomainDataRow(rowData, index);

            var newRemoveButton = $(removeBtn);
            newRemoveButton.attr('data-id', index);

            newAddedRow.find('.js-domains-row__button').append(newRemoveButton);
            domains.append(newAddedRow);
        });
        $addedDomainsContainer.html(domains[0].children);
    };

    /**
     * call the API to retrieve the desired data
     */
    var makeCall = function() {
        $loadingOverlay.removeClass('is-hidden');
        var queryString = Object.keys(query).map(function(key) {
            return key + '=' + query[key];
        }).join('&');

        API.get(
            endpoint + '?' + queryString,
            {},
            function(data) {
                data = data || [];
                $loadingOverlay.addClass('is-hidden');
                Object.assign(dataStore, { recommended: data });
                showRecommendedData();
            },
            resetRecommendedDomainsContainer
        );
    };

    /**
     * process the search term
     */
    var handleSearch = function() {
        var searchInput = $container.find('.js-domains-input');
        if (!searchInput) { return; }

        var searchString = searchInput.val().trim();

        // update the query string in the data we keep
        query = Object.assign(query, { q: searchString });

        // only make the call if we have a search string
        if (searchString) { makeCall(); }
    };

    /**
     * react to a user's click to add an item
     * @param e
     */
    var handleItemAdd = function(e) {
        var itemIndex = e.currentTarget.dataset.id;
        var itemData = dataStore.recommended[itemIndex];
        if (typeof findAddedItem(itemData.name) === 'undefined') {
            dataStore.added.push(itemData);
            // persist the added items list
            window.localStorage.setItem(localStorageRoot, JSON.stringify(dataStore.added));
            showRecommendedData();
            showAddedData();
        }
    };

    /**
     * react to a user's click to remove an item
     * @param e
     */
    var handleItemRemove = function(e) {
        var itemIndex = e.currentTarget.dataset.id;
        dataStore.added.splice(itemIndex, 1);
        // persist the added items list
        window.localStorage.setItem(localStorageRoot, JSON.stringify(dataStore.added));
        showRecommendedData();
        showAddedData();
    };

    /**
     * click on the checkout button
     */
    var handleGoToCheckout = function() {
        if (userIsLoggedIn) {
            window.location.href = checkoutUrl;
        } else {
            window.location.href = loginUrl + checkoutUrl;
        }
    };

    var resetAllDomainContainers = function() {
        window.localStorage.clear();
        $container.find('.js-domains-input').val('');
        dataStore.added = [];
        showRecommendedData();
        showAddedData();
        resetRecommendedDomainsContainer();
    }

    var handleAddToCart = function() {
        var domainNames = [];
        dataStore.added.forEach(function(rowData) {
            domainNames.push(rowData.name);
        });
        AD_addToCart(eppid, undefined, {'domains': domainNames});
        resetAllDomainContainers();
    };

    var buildBuyNowLink = function() {
        var baseBuyNowLink = '/api/internal/storefront/v1/cta?productId='+ appid + '&type=BUY&eppid=' + eppid;
        var domains = [];
        dataStore.added.forEach(function(rowData) {
            domains.push('domain=' + rowData.name);
        });
        var domainQueries = domains.join('&');
        return baseBuyNowLink + "&" + domainQueries;
    }

    var handleBuyNow = function() {
        var buyNowLink = buildBuyNowLink();
        window.location.href = buyNowLink;
        resetAllDomainContainers();
    };

    /**
     * handling key-ups in order to react to enter, backspace and delete
     */
    $container.on('keyup', '.js-domains-input', function(e) {
        if (e.keyCode === 13) { handleSearch(); }

        // clear the recommended domains list when the search term is cleared
        var searchInput = $container.find('.js-domains-input');
        if (searchInput && !searchInput.val().trim()) {
            dataStore.recommended = [];
            showRecommendedData();
        }
    });

    /**
     * handling clicks
     */
    $container.on('click', '.js-domains-button', handleSearch);
    $container.on('click', '.js-domains-row__button-add', handleItemAdd);
    $container.on('click', '.js-domains-row__button-remove', handleItemRemove);
    $container.on('click', '.js-checkout-button', handleGoToCheckout);
    $container.on('click', '.js-checkoutv2-addToCart', handleAddToCart);
    $container.on('click', '.js-checkoutv2-buyNow', handleBuyNow);

    showAddedData();
};
