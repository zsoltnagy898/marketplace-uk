/* eslint-disable */

$.fn.notificationCtrl = function() {
    var $container = $(this);

    var prepareTemplate = function(status, message) {
        var $tmp = $(".local_alert_template").clone();
        $tmp.removeClass("is-hidden").removeClass("local_alert_template");
        $tmp.addClass("local_alert__" + status);
        $tmp.find(".js-notification-content").html(message);
        $tmp.find(".alert-close").on("click", function() { $(this).closest(".local_alert").remove() });
        return $tmp;
    }

    return {
        add: function(status, message, _clear) {
            var $template = prepareTemplate(status, message);
            if (_clear) {
                return $container.html($template);
            }
            return $container.append($template);
        },
        error: function(message, _clear) {
            return this.add("error", message, _clear);
        },
        warning:function(message, _clear) {
            return this.add("warning", message, _clear);
        },
        pending: function(message, _clear) {
            return this.add("pending", message, _clear);
        },
        success: function(message, _clear) {
            return this.add("success", message, _clear);
        }
    }
}
