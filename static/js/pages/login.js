FFAPI.methods.onLoginComplete = function (result) {
    if (result.responseJSON != undefined) {
        eval(result.responseJSON);
    } else {
        var updateTargetId = $("#login-signIn");
        updateTargetId.html(result.responseText);
    }
}

