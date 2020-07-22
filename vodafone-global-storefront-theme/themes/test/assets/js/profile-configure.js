/* eslint-disable */
$.fn.configureProduct = function(productId, defaultEditionId) {

    var HIDDEN_ADDON_CLASS = "addon-configurator--hidden";
    var HIDDEN_CLASS = "hidden";
    var SELECTED_ADDON_CLASS = "addon-configurator--selected";
    var SELECTED_EDITION_CLASS = "configurator-editions-box--selected";
    var EDITIONS_MODIFIER_CLASS = "configurator-editions-container--expanded";
    var EDITIONS_ARROWS_CONTAINER = "edition-arrows-container__open";
    var CONFIGURATOR_EDITIONS_TOGGLE = "configurator-editions-toggle__open";
    var CHANGE_EDITION_TOGGLE = "toggle-expand__open";

    var $editionArrows = $(".edition-arrows-container");
    var changeEditionSelector = ".toggle-expand";
    var $changeEdition= $(changeEditionSelector);
    var $configuratorEditionToggle = $(".configurator-editions-toggle");
    
    var $container = $(this);
    var editionSelector = ".js-select-edition";
    var editionsContainerSelector = ".js-editions";

    var addonSelector = ".js-select-addon";
    var addonRemoveSelector = ".js-remove-addon";
    var configuratorAddonSelector = ".addon-configurator";
    var configuratorEditionSelector = ".configurator-editions-box";
    var profileEditionSelector = ".profile-edition";
    var configuratorButtonsSelector = ".configurator--button";
    var $configuratorButtons = $(configuratorButtonsSelector);
    var $profileEdition = $(profileEditionSelector);
    var $configuratorAddons = $container.find(configuratorAddonSelector);

    var selectedEditionId = parseInt(defaultEditionId, 10);
    var selectedAddons = [];

    var setDefaultAddons = function() {
        $(".profile_header .js-selected-addons .selected-addon--content").map(function() {
            selectedAddons.push($(this).data("addon-id"));
        });
    }

    var toggleAddons = function() {
        $configuratorAddons.each(function() {
            var $addon = $(this);
            var doesAddonMatchEdition = $addon.data("parentEditionId") === selectedEditionId;
            var isGlobalAddon = !$addon.data("parentEditionId");
            var shouldAddonBeVisible = doesAddonMatchEdition || isGlobalAddon;
            var isAddonHidden = $addon.hasClass(HIDDEN_ADDON_CLASS);
            if (shouldAddonBeVisible && isAddonHidden) {
                $addon.removeClass(HIDDEN_ADDON_CLASS);
            };
            if (!shouldAddonBeVisible && !isAddonHidden) {
                $addon.addClass(HIDDEN_ADDON_CLASS);
            };
        });
    };

    var selectEdition = function($selectedEditionContainer) {
        unselectEditions();
        $selectedEditionContainer.addClass(SELECTED_EDITION_CLASS);
        $selectedEditionContainer.find(profileEditionSelector).attr("data-selected","true");
    };


    var selectAddon = function($selectedAddonContainer) {
        $selectedAddonContainer.addClass(SELECTED_ADDON_CLASS);
    };

    var unselectAddon = function($selectedAddonContainer) {
        $selectedAddonContainer.removeClass(SELECTED_ADDON_CLASS);
    };

    var updateEditionPreview = function() {
        var $editionPreview = $("[data-edition-preview-template=" + selectedEditionId + "]");
        $(".preview-wrapper .js-selected-edition").html($editionPreview.find(".js-selected-edition").html())
    }

    var unselectEditions = function() {
        $profileEdition.attr("data-selected", "false");
        $container.find(editionSelector).each(function() {
            $(this).closest(configuratorEditionSelector).removeClass(SELECTED_EDITION_CLASS);
        });
    };

    var unselectAddons = function() {
        clearSelectedAddons();
        selectedAddons = [];
        clearAddonsPreview();
    }

    var clearSelectedAddons = function() {
        selectedAddons.forEach(function(addonId) {
            var $addon = $container.find(".js-addons *[data-edition-id=" + addonId + "]");
            $addon.closest(configuratorAddonSelector).removeClass(SELECTED_ADDON_CLASS);
        });
    }

    var clearAddonsPreview = function() {
        $(".js-selected-addons").html("");
        $(".selection_preview--wrapper").removeClass("selection_preview--active");
    }

    var toggleExpandLabel = function() {
        if (selectedAddons.length < 2) {
            $(".expand--header").addClass(HIDDEN_CLASS);
            $(".js-toggle-footer").addClass(HIDDEN_CLASS);
        } else {
            $(".expand--header").removeClass(HIDDEN_CLASS);
            $(".js-toggle-footer").removeClass(HIDDEN_CLASS);
        }
    }

    var updateExpandLabel = function() {
        $(".expand--number").text(selectedAddons.length - 1);
    }

    var toggleSelectedAddonsTitle = function() {
        if (selectedAddons.length < 1) {
            $(".selected-addon--wrapper").addClass(HIDDEN_CLASS);
        } else {
            $(".selected-addon--wrapper").removeClass(HIDDEN_CLASS);
        }
    }
    
    if (defaultEditionId) {
        var $defaultEdition = $container.find(".js-main-editions *[data-edition-id=" + selectedEditionId + "]");
        selectEdition($defaultEdition);
        toggleAddons();
    };

    var renderAddonPreviewSection = function() {
        clearAddonsPreview();
        if (selectedAddons.length) {
            $(".selection_preview--wrapper").addClass("selection_preview--active");
            selectedAddons.forEach(function(addonId){
                var $previewMatchingEditions = $("[data-addon-preview-template=" + addonId + "][data-edition-parentId=" + selectedEditionId + "]");
                var $previewGlobalEditions = $("[data-addon-preview-template=" + addonId + "][data-edition-parentId='']");
                if ($previewMatchingEditions || $previewGlobalEditions) {
                    $(".js-selected-addons").append($previewMatchingEditions.html()).append($previewGlobalEditions.html());
                }
            });
            updateExpandLabel();
        }
        toggleSelectedAddonsTitle();
        toggleExpandLabel();
    }

    var isEditionSelected = function($selectedEditionContainer) {
        return $selectedEditionContainer.hasClass(SELECTED_EDITION_CLASS);
    }

    var addAddon = function(selectedAddonId) {
        if (!selectedAddons.includes(parseInt(selectedAddonId, 10))) {
            selectedAddons.push(selectedAddonId);
        }
    }

    var removeAddon = function(selectedAddonId) {
        var index = selectedAddons.indexOf(selectedAddonId);
        if (index !== -1) {
            selectedAddons.splice(index, 1);
        }
    }

    var getSelectedEdition = function() {
        return $container.find(".js-main-editions *[data-edition-id=" + selectedEditionId + "]");
    }
    var getSelectedAddons = function() {
        var addons = [];
        if (selectedAddons.length) {
            selectedAddons.forEach(function(addonId) {
                var $addon = $container.find(".js-addons *[data-edition-id=" + addonId + "]");
                var addonPPID = $addon.data("ppid");
                addons.push(addonPPID);
            });
        }
        return addons
    }

    var buildUrlParameters = function(editionParam, addonParam) {
        var parameters = [];
        var $edition = getSelectedEdition();
        var editionPPID = $edition.data("ppid");
        parameters.push(editionParam + "=" + editionPPID);

        if (selectedAddons.length) {
            selectedAddons.forEach(function(addonId) {
                var $addon = $container.find(".js-addons *[data-edition-id=" + addonId + "]");
                var addonPPID = $addon.data("ppid");
                parameters.push(addonParam + "=" + addonPPID);
            });
        }

        var queryString = parameters.join("&");
        return queryString;
    }

    var updateButtonUrl = function($configuratorButton) {
        var baseUrl = $configuratorButton.data("base");
        var editionParam = $configuratorButton.data("edition-param");
        var addonParam = $configuratorButton.data("addon-param");

        var parameters = buildUrlParameters(editionParam, addonParam);
        
        var buttonCtaUrl = baseUrl + "&" + parameters;
        $configuratorButton.find("a").attr("href", buttonCtaUrl);
        var $edition = getSelectedEdition();
        var editionPPID = $edition.data("ppid");
        $configuratorButton.find("a").data("eppid", editionPPID);
        $configuratorButton.find("a").data("appid", getSelectedAddons());
    }

    var updateButtonsUrl = function() {
        $configuratorButtons.each(function() {
            updateButtonUrl($(this));
        });
    }

    setDefaultAddons();
    toggleSelectedAddonsTitle();
    toggleExpandLabel();
    updateButtonsUrl();

    selectedAddons.forEach(function(addonId) {
        var $addon = $container.find(".js-addons *[data-edition-id=" + addonId + "]");
        selectAddon($addon);
    })

    $container.on("click", editionSelector, function(e) {
        e.preventDefault();
        var $selectedEditionButton = $(this);
        var $selectedEditionContainer = $selectedEditionButton.closest(configuratorEditionSelector);
        if (isEditionSelected($selectedEditionContainer)) {
            return;
        }
        selectedEditionId = $selectedEditionContainer.data("editionId");
        unselectAddons();
        toggleAddons();
        selectEdition($selectedEditionContainer);
        updateEditionPreview();
        updateExpandLabel();
        toggleExpandLabel();
        toggleSelectedAddonsTitle();
        updateButtonsUrl();
        $(editionsContainerSelector).trigger("edition:resize");
    });

    $container.on("click", addonSelector, function(e) {
        e.preventDefault();
        var $selectedAddonButton = $(this);
        var $selectedAddonContainer = $selectedAddonButton.closest(configuratorAddonSelector);
        selectedAddonId = $selectedAddonContainer.data("editionId");
        addAddon(selectedAddonId);
        selectAddon($selectedAddonContainer);
        renderAddonPreviewSection();
        updateButtonsUrl();
        $(editionsContainerSelector).trigger("edition:resize");
    });

    $container.on("click", addonRemoveSelector, function(e) {
        e.preventDefault();
        var $selectedAddonButton = $(this).closest(".profile-actions").find(".js-select-addon");
        var $selectedAddonContainer = $selectedAddonButton.closest(configuratorAddonSelector);
        selectedAddonId = $selectedAddonContainer.data("editionId");
        removeAddon(selectedAddonId);
        unselectAddon($selectedAddonContainer);
        renderAddonPreviewSection();
        updateButtonsUrl();
        $(editionsContainerSelector).trigger("edition:resize");
    });

    var toggleEditionExpand = function() {
        var $editions = $container.find(".configurator-editions-container");
        $(".js-editions-container").css("display","block");
        if (!$editions.hasClass(EDITIONS_MODIFIER_CLASS)) {
            $editions.addClass(EDITIONS_MODIFIER_CLASS);
            $editionArrows.addClass(EDITIONS_ARROWS_CONTAINER);
            $configuratorEditionToggle.addClass(CONFIGURATOR_EDITIONS_TOGGLE);
            $changeEdition.addClass(CHANGE_EDITION_TOGGLE);
            $profileEdition.addSliderOnMobile();
        }
    }

    $container.on("click", changeEditionSelector, function() {
        toggleEditionExpand();
        $(editionsContainerSelector).trigger("edition:resize");
    })

};

$.fn.addSliderOnMobile = function() {
    var MOBILE_WIDTH = 641;
    
    var $editionsContainer = $(".configurator-editions");
    var $editionArrows = $(".edition-arrows-container");

    var $profileEdition = $(".profile-edition");

    var getSelectedEditionIndex = function() {
        var $container = $profileEdition;
        var $el = $(".profile-edition[data-selected='true']");
        return $container.index($el);
    }

    var handleSlider = function() {
        var isMobileWidth = document.documentElement.clientWidth <= MOBILE_WIDTH;
        var isSliderActive = $(".slick-initialized.slick-slider").length > 0;

        if (isMobileWidth && !isSliderActive) {
            mobileSlider($editionsContainer, $editionArrows ,{
                dots: false,
                infinite: false,
                draggable: true,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 0,
                adaptiveHeight: false,
                arrows: false,
                initialSlide: getSelectedEditionIndex(),
            })
            $(".slick-list").addClass("profile-box");
            $(".edition-arrows-container").css("display","block");
        } else if (!isMobileWidth && isSliderActive) {
            $editionsContainer.slick('unslick');
            $(".edition-arrows-container").css("display","none");
        }
    }
    handleSlider();

    // handle window resize
    $(window).resize(function() {
        handleSlider();
    });
};

$.fn.toggleConfigureSummary = function() {
    var EXPANDED_HEADER_CLASS = "profile_header--content--expanded";

    var $container = $(this);
    var summaryHeaderExpandSelector = ".expand__action";

    var toggleHeaderSummary = function() {
        $(".profile_header--content").toggleClass(EXPANDED_HEADER_CLASS);
    }

    $container.on("click", summaryHeaderExpandSelector, function(e) {
        toggleHeaderSummary();
    });
};

$.fn.toggleMobileSummary = function() {
    var EXPANDED_MOBILE_FOOTER_CLASS = "profile_footer--expanded";

    var $container = $(this);
    var summaryMobileToggleSelector = ".js-toggle-footer";

    var toggleMobileSummary = function() {
        $("body").toggleClass(EXPANDED_MOBILE_FOOTER_CLASS);
    }

    $container.on("click", summaryMobileToggleSelector, function(e) {
        toggleMobileSummary();
    });
}

$.fn.editionDetailsToggle = function() {
    return this.each(function() {
        var toggleSelector = '.js-edition-details-toggle';
        var $container = $(this);
        var $details = $container.find('.js-edition-details');
        if ($container.find(toggleSelector).length) {
            $container.on('click', toggleSelector, function() {
                $details.each(function() {
                    $(this).toggleClass('toggled');
                });
            });
        }
    })
};

$.fn.showEditions = function(editionsLabel) {
    var isActive = !$(".toggle-expand").length;
    if (editionsLabel && isActive) {
        $(".js-editions-container").css("display","block");
    }
};
