/* eslint-disable */

$.fn.formCtrl = function() {
    var $container = $(this);
    var fields = [];

    // clear form fields
    var clear = function() {
        $container.find('.is-error').removeClass('is-error');
        fields.forEach( function(field) {
            field.$container.find(":input").prop("checked", false);
            if (!field.$container.hasClass('input--no-clear')) {
                field.setValue("")
            }
        });
    }

    // add extra features, like validation, or listeners based on actions
    // return object of the specific field with extra information read from DOM element
    var addFeatures = function($fieldContainer) {
        var type = $fieldContainer.data('field-type');
        var required = $fieldContainer.data('field-required');
        var toValidate = []; 
        var $input;

        if (type === "rating") {
            $input = $fieldContainer.find("input");
        } else {
            $input = $fieldContainer.find(type)
        }

        // required validation
        if (required) {
            toValidate.push( {type: "not-empty", params: []} );
        }

        // max length validation
        if (type === "textarea" && $input.data("maxlength")) {
            var maxLength = $input.data("maxlength");
            $input.on("keyup", function(e) {
                var _newLimit = maxLength - $input.val().length;
                $fieldContainer.find(".js-maxlength-count").text(_newLimit);
            });
            toValidate.push({type: "max-length", params: [maxLength]});
        }

        var getValue = function() {
            switch (type) {
                case "rating":
                    return $container.find("input:checked").val();
                case "checkbox":
                    return $container.find("input:checked").val();
                default:
                    return $input.val();
            }
        }
        var setValue = function(val) {
            if ($input.prop("type") === "checkbox") {
                return;
            }
            switch (type) {
                case "rating":
                    $container.find("input:checked").prop("checked", false);
                    $container.find('input[value="' + val + '"]').prop("checked", true);
                    return $container.find("input:checked").val();
                default:
                    $input.val(val);
                    return $input.val();
            }
        }
        return {
            $container: $fieldContainer,
            $input: $input,
            getValue: getValue,
            setValue: setValue,
            type: type,
            toValidate: toValidate,
            required: required
        }
    }

    // get form typed data
    var getFormData = function() {
        var _data = {};
        fields.forEach(
            function(field) {
                _data[field.$input.attr("name")] = field.getValue();
            }
        );
        return _data;
    }

    var validate = function() {
        var _formValid = true;
        $container.find(".is-error").removeClass("is-error");
        $container.find(".js-error-message").html("");
        fields.forEach(
            function(field) {
                var currentFieldValid = true;
                var errorMessage = "";

                field.toValidate.forEach(
                    function(validation) {
                        var value = field.getValue();
                        if (field.$container.is(":not(:visible)")) {
                            return;
                        }
                        switch (validation.type) {
                            case "not-empty":
                                currentFieldValid = value !== "" && value;
                                errorMessage = field.$container.find(".js-error-message").data("message-required");
                            break;
                            case "max-length":
                                var maxLength = validation.params[0];
                                var currentLength = value.length;

                                if (maxLength - currentLength < 0) {
                                    errorMessage = field.$container.find(".js-error-message").data("message-maxlength");
                                    currentFieldValid = false;
                                }
                            break;
                        }
                    }
                );

                if (!currentFieldValid) {
                    field.$container.find(".js-error-message").html(errorMessage);
                    field.$container.addClass("is-error");
                }
                _formValid = _formValid && currentFieldValid;
            }
        );
        return _formValid;
    }

    // map all fields ( DOM elements with class 'form--field' )
    // parse / add features based on element attributes
    // execute at init
    var mapFields = function() {
        var _fields = [];
        $container.find(".form--field").each(function() {
            _fields.push( addFeatures($(this)) );
        });
        fields = _fields;
    }
    mapFields();

    return {
        fields: fields,
        validate: validate,
        getData: getFormData,
        clear: clear
    }
}
