FFAPI.payment = FFAPI.payment || {};
FFAPI.payment.methods = FFAPI.payment.methods || {};
FFAPI.payment.variables = FFAPI.payment.variables || {};
FFAPI.payment.variables.cardTypes = FFAPI.payment.variables.cardTypes || {};
var body = $('body');

body.on('click', '#btnAddNewCard', function (e) {
    FFAPI.payment.methods.setTokenizationVisible(false);
    e.preventDefault();
});

body.on('click', ".checkoutDeliveryOptions:not('.groupByRegion') label", function (e) {
    var jQThis = $(this).parent();
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse('{ "tid": 187, "val": ' + jQThis.attr("data-id") + ' }'); }

    if (!jQThis.hasClass("active")) {
        $.ajax({
            "url": window.universal_variable.page.subfolder + "/Checkout/Checkout/UpdateBasketShippingInfo",
            "type": "POST",
            "cache": false,
            "data": {
                "storeId": jQThis.attr("data-store-id"),
                "serviceId": jQThis.attr("data-id"),
                "serviceType": jQThis.attr("data-type")
            },
            "success": function (data) {
                $("#summaryWrapper").html(data);
            }
        });
    }
});

body.off('click', "button.js-btnContinue").on('click', "button.js-btnContinue", function (e) {
    var href = $(this).data('href');
    if (href) {
        window.location.href = href;
    } else {
        FFAPI.methods.loadingButtons('summaryContinueButton');
        FFAPI.methods.loadingButtons('reviewOrderContinueButton');
        $('form#review').submit();
    }
    e.preventDefault();
});

body.off('click', "#summaryWrapper button.js-btn-addpromo").on('click', "#summaryWrapper button.js-btn-addpromo", function (e) {
    $('#formAddPromo').submit();
    e.preventDefault();
});

FFAPI.methods.onBeginUpdatePromoCode = function () {
    FFAPI.payment.variables.pixelContent = $('#mmWrapper').html();
};

FFAPI.methods.onCompleteUpdatePromoCodeMM = function () {
    $('#mmWrapper').html(FFAPI.payment.variables.pixelContent);
};

FFAPI.methods.OnCompleteUpdatePromoCode = function () {
    var options = $('#summaryWrapper input[data-store-id]');
    options.each(function () {
        var jQThis = $(this);
        var storeId = jQThis.data('store-id');
        var shippingOptionId = jQThis.data('shipping-id');
        var shippingOptionCost = jQThis.data('shipping-cost');
        var htmlElement = $('[data-store-id=' + storeId + '][data-id=' + shippingOptionId + ']');
        htmlElement.find('p.mr10').text(shippingOptionCost);
    });
};

FFAPI.methods.OnCompleteUpdatePromoCodeBR = function () {
    var national = $('[data-region="NATIONAL"]');
    var international = $('[data-region="INTERNATIONAL"]');

    if (national) {
        var shippingOption = $('#summaryWrapper input[data-shipping-type="FlatRateNational"]').first();
        var shippingOptionCost = shippingOption.data('shipping-cost');
        national.find('p.mr10').text(shippingOptionCost);
    }
    if (international) {
        var shippingOption = $('#summaryWrapper input[data-shipping-type="FlatRateInternational"]').first();
        var shippingOptionCost = shippingOption.data('shipping-cost');
        international.find('p.mr10').text(shippingOptionCost);
    }
};