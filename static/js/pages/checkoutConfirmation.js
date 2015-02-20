var initialBoxHeight = $(".checkout-steps-confirmation-box").outerHeight();
$(".showAddress").bind("click", function (e) {
    e.preventDefault();
    var jQThis = $(this),
        shown = jQThis.prev(),
        hidden = jQThis.next(),
        hiddenHeight = hidden.outerHeight(),
        totalHeight = initialBoxHeight + hiddenHeight - 20,
        currentBoxHeight = $(".checkout-steps-confirmation-box").outerHeight() - 20;

    shown.html(shown.html() + hidden.html()).css("word-break", "normal");
    jQThis.remove();
    hidden.remove();
    if (totalHeight > currentBoxHeight) {
        $(".checkout-steps-confirmation-box").css("height", totalHeight);
    }
    return false;
});