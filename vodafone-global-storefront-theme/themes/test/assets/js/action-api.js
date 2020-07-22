/* eslint-disable */
var ActionAPI = function() {
    var endpoint = "";
    var type = 'GET';
    var data = {};
    var onError = function() {};
    var onSuccess = function() {};
    var ready = false;


    var prepareCallObject = function() {
        return {
            url: endpoint,
            dataType: type === "DELETE" ? 'text' : 'json',
            contentType:'application/json',
            data: data,
            method: type,
            xhrFields: { withCredentials: true },
            success: onSuccess,
            error: onError
        }
    }

    var call = function() {
        var options = prepareCallObject();
        if (ready) {
            $.ajax(options);
        } else {
            onError();
        }
        ready = false;
    }

    this.get = function(_endpoint, _data, _onSuccessCallback, _onErrorCallback) {
        endpoint = _endpoint;
        type = 'GET';
        data = _data;
        onError = _onErrorCallback;
        onSuccess = _onSuccessCallback;
        ready = true;
        call();
    }

    this.delete = function(_endpoint, _data, _onSuccessCallback, _onErrorCallback) {
        endpoint = _endpoint;
        type = 'DELETE';
        data = _data;
        onError = _onErrorCallback;
        onSuccess = _onSuccessCallback;
        ready = true;
        call();
    }

    this.post = function(_endpoint, _data, _onSuccessCallback, _onErrorCallback) {
        endpoint = _endpoint;
        type = 'POST';
        data = _data;
        onError = _onErrorCallback;
        onSuccess = _onSuccessCallback;
        ready = true;
        call();
    }

    this.put = function(_endpoint, _data, _onSuccessCallback, _onErrorCallback) {
        endpoint = _endpoint;
        type = 'PUT';
        data = _data;
        onError = _onErrorCallback;
        onSuccess = _onSuccessCallback;
        ready = true;
        call();
    }
}
