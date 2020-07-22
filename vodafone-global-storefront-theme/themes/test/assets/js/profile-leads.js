/* eslint-disable */
$.fn.profileLeads = function(options) {
    var i18n = {};
    var API = {};
    var Notification = {};
    var mainEndpoint = "";
    var $container = $("#lead-form-modal");

    var toggleStates = function() {
        var selectedCountry = $container.find('select[name=country]').val();
        var selectedPhoneCode = $container.find('select[name=country] option:selected').data('custom-value')
        var provinceSection = $container.find('.js-form-province');
        var stateSection = $container.find('.js-form-state');
        provinceSection.addClass("hidden");
        stateSection.addClass("hidden");
        
        if (selectedCountry === "US" || selectedCountry === "USA") {
            stateSection.removeClass("hidden");
        }
        if (selectedCountry === "CA" || selectedCountry === "CAN") {
            provinceSection.removeClass("hidden");
        }
        $('.js-form-phone .js-prefix').html("+" + selectedPhoneCode);
        $('.js-form-phone').data('prefix', "+" + selectedPhoneCode)
    }

    var initLeadForm = function() {
        toggleStates();
        $(".js-profile-lead-form").on("click", function(e) {
            $container
                .find('select[name=country]').on("change", toggleStates)
            LeadForm.clear();
            $container
                .find('button[rel="modal:submit"]')
                .off("click")
                .on("click", function() {
                    if (LeadForm.validate()) {
                        API.post(
                            mainEndpoint,
                            JSON.stringify(leadParser.getData(options)),
                            function() {
                                Notification.success(i18n.sucessMessage, true);
                                $(window).scrollTop(0);
                            },
                            function() {
                                Notification.error(i18n.errorMessage, true);
                            }
                        );
                        $.modal.close();
                    }
                });

            $container.modal({
                fadeDuration: 100
            });
        });
    };
    var init = function() {
        i18n = !!options && !!options.i18n ? options.i18n : {};
        mainEndpoint = !!options && !!options.endpoint ? options.endpoint : "";

        API = new ActionAPI();
        Notification = $('.js-notification-lead').notificationCtrl();
        LeadForm = $('#js-profile-lead-form').formCtrl();
        initLeadForm();
    };
    init();
};


var leadParser = {
    getCustomer: function(data) {
        var state = data.state || data.province;
        var country = data.country;

        return {
            company: {
                name: data.companyName,
                street1: data.street1,
                street2: data.street2,
                city: data.city,
                state: state,
                zip: data.zip,
                country: country,
                size: data.companySize
            },
            contact: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: $('.js-form-phone').data('prefix') + data.phone,
                phoneExtension: ''
            }
        };
    },
    getCustomFields: function(data, customFields) {
        var customData = {}
        customFields.forEach(function(field) {
            customData[field.name] = Array.isArray(data[field.name]) ? data[field.name] : [data[field.name]];
        })
        return customData;
    },
    getData: function(options) {
        var data = {};
        var results = {};
        $("#js-profile-lead-form").serializeArray()
            .forEach(function(x) {
                if (data[x.name]) {
                    if (Array.isArray(data[x.name])) {
                        data[x.name].push(x.value)
                    } else {
                        data[x.name] = [data[x.name]]
                        data[x.name].push(x.value);
                    }
                } else {
                    data[x.name] = x.value;
                }
            });
        results.customer = leadParser.getCustomer(data);
        results.customAttributes = leadParser.getCustomFields(data, options.customFields);
        results.notes = data.notes;
        results.comment = data.comment;
        return $.extend({}, options.otherData, results);
    }
}