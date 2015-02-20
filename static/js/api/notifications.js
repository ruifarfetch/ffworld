FFAPI.notifications = FFAPI.notifications || {};

FFAPI.notifications.errorTemplateUrl = "/static/js/ajax/notifications_error.html";

FFAPI.notifications.init = function () {
    FFAPI.notifications.notifications_container = $('#notifications_container');
}

/**
 * Adds an error message to the current page
 * @method FFAPI.notifications.addErrorMessage
 * @param {String} message - Error message
 * @param {String} errorId - An ID to identify the error (useful when we have multiple notifications, and we want to update/remove a specific error)
 */
FFAPI.notifications.addErrorMessage = function (message, errorId) {
    FFAPI.notifications.setErrorMessage(message, errorId, true);
}

/**
 * Removes a specific error message
 * @method FFAPI.notifications.removeErrorMessage
 * @param {String} errorId - The error message ID
 */
FFAPI.notifications.removeErrorMessage = function (errorId) {
    var container = FFAPI.notifications.notifications_container;
    var errorsListContainer = container.find('.container');
    if (errorsListContainer.length > 0) {
        if (errorId != undefined) {
            errorId = 'errId_' + errorId;
            errorsListContainer.find('.' + errorId).remove();
            var currentErrors = container.find('.field').length;
            if (currentErrors == 0) {
                container.empty();
            }
        }
    }
}

/**
 * Removes all error messages
 * @method FFAPI.notifications.clearErrors
 */
FFAPI.notifications.clearErrors = function () {
    var container = FFAPI.notifications.notifications_container;
    container.empty();
}

/**
 * Sets the error message to the current page 
 * @method FFAPI.notifications.setErrorMessage
 * @param {String} message - Error message
 * @param {String} errorId - An ID to identify the error (useful when we have multiple notifications, and we want to update/remove a specific error)
 * @param {boolean} addNew - If true, a new error message will be added, if false, all error messages will be cleared, and a new one will be displayed
 */
FFAPI.notifications.setErrorMessage = function (message, errorId, addNew) {
    var elem = FFAPI.notifications.notifications_container;
    if (elem.length > 0) {
        $.get(FFAPI.notifications.errorTemplateUrl, function (template) {
            var template = Hogan.compile(template);
            var output = '';
            if (errorId == undefined) {
                output = template.render({ "Message": message });
            }
            else {
                errorId = 'errId_' + errorId;
                output = template.render({ "Message": message, "ErrorId": errorId });
            }

            var container = FFAPI.notifications.notifications_container;
            var currentErrors = container.find('.field').length;
            if (addNew !== true || currentErrors == 0) {
                container.html(output);
            } else {
                var errorsListContainer = container.find('.container');
                if (errorsListContainer.length > 0) {
                    if (errorId != undefined) {
                        errorsListContainer.find('.' + errorId).remove();
                    }
                    $(output).find('.field').appendTo(errorsListContainer);
                }
            }
            $(document).scrollTop(0);
        });
    }
}

FFAPI.notifications.init();
