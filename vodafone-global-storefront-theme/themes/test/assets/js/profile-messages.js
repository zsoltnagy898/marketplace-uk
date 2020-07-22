$.fn.profileMessages = function (options) {

    // kill the check if there is no query parameter in the link
    if (!window.location.search) return null;

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }

    var actionMessages = {};
    if(!!options && !!options.actionMessages){
        try {
            actionMessages = JSON.parse($('<textarea />').html(options.actionMessages).text());
        } catch (e) {
            // do nothing, as actionMesages already have default value
        }
    } 

    var AVAILABLE_MESSAGES = {
        accessRequested: {
            success: actionMessages.requestAccessSuccess,
            fail: actionMessages.requestAccessFail
        },
        purchaseRequested: {
            success: actionMessages.requestPurchaseSuccess,
            fail: actionMessages.requestPurchaseFail
        }
    }
    var messageFlags = Object.keys(AVAILABLE_MESSAGES);

    var activeFlags = [];
    var messageFlagsLen =  messageFlags.length;
    for (var i = 0; i < messageFlagsLen; i++) {
        var flagValue = getQueryVariable(messageFlags[i]);
        if (flagValue) {
            activeFlags.push(
                flagValue === "true" ? {
                    message: AVAILABLE_MESSAGES[messageFlags[i]].success,
                    type: 'success'
                } : {
                    message: AVAILABLE_MESSAGES[messageFlags[i]].fail,
                    type: 'error'
                }
            );
        }
    }

    // do nothing if flag not matching with available flags
    if (!activeFlags) return null;

    return this.each(function () {
        var $container = $(this);
        var Notification = $container.notificationCtrl();

        activeFlags.forEach(function (flag) {
            setTimeout(function () {
                Notification.add(flag.type, flag.message);
            }, 0);
        });
    });
}