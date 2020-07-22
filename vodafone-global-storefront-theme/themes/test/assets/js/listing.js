/* eslint-disable */


$.fn.listing = function (options) {
    var MOBILE_BREAKPOINT = 640;

    return this.each(function () {
        var $container = $(this);
        var $contentContainer = $(this).find(".listing-items");
        var storedCompareApps = sessionStorage.getItem('selectedCompareApps');
        var selectedCompareApps = storedCompareApps ? storedCompareApps.split(",") : [];

        function changeListing(url) {
            if (options.refresh) {
                window.location = url;
                return;
            }
            history.pushState(null, null, url);
            var itemsUrl = url.replace("/listing", "/listing/items");

            if ($(window).width() > 800) {
                $(window).scrollTop(0);
            }
            $container.find(".listing-overlay").removeClass("is-hidden");
            $.ajax({
                url: itemsUrl
            }).
            done(function (data) {
                $container.find(".listing-overlay").addClass("is-hidden");
                $contentContainer.find(".content").html(data);
                updateCompareUI();
            });
        }

        function updateFromFilters() {
            var $filters = $container.find(".js-option-filter:checked");
            var pl = $container.find("#pl").val();
            var searchQuery = $container.find("#searchQuery").val();
            var baseUrl = location.pathname + "?";
            var sort = $container.attr('data-sort');
            var filters = [];

            $filters.each(function() {
                var $filter = $(this);
                var query = $filter.attr("data-query-key");
                var value = $filter.val();
                var parentCats = $(".js-option-filter:checked").filter('[data-parent]').map(function (el) { return $(this).attr("data-parent") }).toArray();
                var nullIfParent = (query === "cat" && parentCats.find(function(cat) { return cat === value}))

                if(!nullIfParent) {
                    filters.push(query + "=" + value);
                }
            })
            if (sort) {
                filters.push("order" + "=" + sort);
            }
            if(pl) {
                filters.push("pl" + "=" + pl);
            }
            if(searchQuery) {
                filters.push("q" + "=" + searchQuery);
            }
            var url = baseUrl + filters.join("&");
            changeListing(url);
        }

        function showHideSubMenu($checkbox) {
            var value = $checkbox.val();
            var isChecked = $checkbox.is(':checked')
            if(!isChecked) {
                $("input[data-parent='"+ value +"']").prop("checked", false);
            }
            $("div[data-parent='"+ value +"']")[isChecked ? "removeClass" : "addClass"]("is-hidden");
        }

        function showHideCompare() {
            var $button = $container.find(".js-compare-button");
            if(selectedCompareApps.length >= 2) {
                $button.removeClass("is-disabled");
                $button.find(".icon__check").show();
            } else {
                $button.addClass("is-disabled");
                $button.find(".icon__check").hide();
            }
        }

        function renderCompareCheckboxSelected() {
            $container.find(".js-compare-checkbox").prop('checked', false);
            $container.find(".js-compare-label").removeClass("is-active");

            selectedCompareApps.forEach(function(appId) {
                var $containerCheckbox = $container.find(".js-compare-checkbox[data-app-id="+appId+"]");
                $containerCheckbox.prop('checked', true);
                $containerCheckbox.closest(".js-compare-label").addClass("is-active");
            })
        }

        function renderCompareCheckboxDisabled() {
            $container.find(".js-compare-label").removeClass("is-disabled");
            $container.find(".js-compare-label input").prop("disabled", false);

            if (selectedCompareApps.length >= 4) {
                var $containerCheckbox = $container.find(".js-compare-label:not(.is-active)");
                $containerCheckbox.addClass("is-disabled");
                $containerCheckbox.find("input").prop("disabled", true);
            } else {
                var $containerCheckbox = $container.find(".js-compare-label.is-disabled")
                $containerCheckbox.removeClass("is-disabled");
                $containerCheckbox.find("input").prop("disabled", false);
            }
        }

        function updateCompareUI() {
            renderCompareCheckboxSelected();
            renderCompareCheckboxDisabled();
            showHideCompare();
        }

        function clearCompareApps() {
            selectedCompareApps = [];
            sessionStorage.removeItem('selectedCompareApps');
        }

        $container.on("click", ".pagination--button", function(evt) {
            evt.preventDefault();
            if( $(this).hasClass('is-disabled') ) return;
            var url = $(this).attr("href");
            changeListing(url)
        })

        $container.on("click", ".js-clearfilter", function(evt) {
            evt.preventDefault();
            $container.find(".js-option-filter").prop("checked", false);
            $container.find(".form--nested_fields").addClass("is-hidden");
            clearCompareApps();
            updateCompareUI();
            updateFromFilters();
        })

        $container.on("click", ".js-show-filters", function(evt) {
            evt.preventDefault();
            $container.find(".listing-items").hide()
            $container.find(".listing-navigator").show()
        })

        $container.on("click", ".js-hide-filters", function(evt) {
            evt.preventDefault();
            $container.find(".listing-items").show()
            $container.find(".listing-navigator").hide()
        })

        $container.on("change", ".js-grid-filters", function(evt) {
            var url = $(this).find("option:selected").attr("href");
            $container.attr("data-sort", $(this).val());
            changeListing(url)
        })

        $container.on("change", ".js-option-filter", function(evt) {
            var $checkbox = $(this);
            showHideSubMenu($checkbox);
            updateFromFilters();
        })

        $container.on("click", ".js-tag-remove", function(evt) {
            var checkboxId = $(this).attr("data-query-id");
            var checkboxKey = $(this).attr("data-query-key");
            var $checkbox =  $("input[data-query-key="+checkboxKey+"][value="+checkboxId+"]")
            $checkbox.prop("checked", false);
            showHideSubMenu($checkbox);
            updateFromFilters();
        })

        $container.on("change", ".js-compare-checkbox", function(evt) {
            var $checkbox = $(this);
            var isChecked = $checkbox.is(":checked");
            var $label = $checkbox.closest(".js-compare-label");
            var appId = $checkbox.attr("data-app-id");
            $label[isChecked ? "addClass" : "removeClass"]("is-active");
            if (isChecked) {
                selectedCompareApps.push(appId);
            } else {
                var appIndex = selectedCompareApps.indexOf(appId);
                selectedCompareApps.splice(appIndex, 1);
            }
            sessionStorage.setItem('selectedCompareApps', selectedCompareApps);
            showHideCompare();
            renderCompareCheckboxDisabled()
        })

        $container.on("click", ".js-compare-button", function(evt) {
            evt.preventDefault();
            if (selectedCompareApps.length >=2) {
                $button = $(this);
                var baseUrl = $button.attr("data-base-url");
                window.location = baseUrl + "?productId=" + selectedCompareApps.join("&productId=");
            }
        })

        $container.on("click", ".js-tile", function(evt) {
            navigateToProduct(evt, this);
        })
        // mobile click on row
        $container.on("click", ".listing-row", function(evt) {
            if ($(window).width() <= MOBILE_BREAKPOINT) {
                navigateToProduct(evt, this);
            }
        })
        
        function navigateToProduct(evt, el) {
            var $target = $(evt.target);
            if (!$target.hasClass("js-compare-label") && !$target.closest(".js-compare-label").length) {
                var url = $(el).data("url");
                window.location.href = url;
            }
        }

        

        $container.on("click", ".js-list-view", function(evt) {
            sessionStorage.setItem("listingView", "list");
            updateCompareUI();
            $container
                .addClass("listing-show-list")
                .removeClass("listing-grid-list");
        })

        $container.on("click", ".js-grid-view", function(evt) {
            sessionStorage.setItem("listingView", "grid");
            updateCompareUI();
            $container
                .addClass("listing-grid-list")
                .removeClass("listing-show-list");
        })

        $(window).on("popstate", function () {
            window.location.reload();
        });
        updateCompareUI();
    });
}
