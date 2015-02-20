var FFAPI = FFAPI || {};
FFAPI.address = FFAPI.address || {};
FFAPI.vippayments = FFAPI.vippayments || {};
FFAPI.vippayments.methods = FFAPI.vippayments.methods || {};
FFAPI.vippayments.variables = FFAPI.vippayments.variables || {};
FFAPI.address.methods = FFAPI.address.methods || {};
FFAPI.address.variables = FFAPI.address.variables || {};

FFAPI.vippayments.methods.RemoveOrderDetail = function () {
    $("#vipSelectedOrder").html("");
};

FFAPI.vippayments.methods.InitDropDownBindings = function () {
    $('#CurrencyList_div li a').bind("click", function (e) {
        var value = $(this).data('val');
        $('#CurrencyList_input').val(value);
        FFAPI.vippayments.methods.CurrencyConverterService(value);
    });

    $('#CardList_div li a').bind("click", function (e) {
        var value = $(this).data('val');
        $('#CardList_input').val(value);
    });

    $('#MonthList_div li a').bind("click", function (e) {
        var value = parseInt($(this).data('val'));
        $('#MonthList_input').val(value);
    });
    $('#YearList_div li a').bind("click", function (e) {
        var value = parseInt($(this).data('val'));
        $('#YearList_input').val(value);
    });
};

FFAPI.vippayments.methods.SelectedOrderInit = function () {
    FFAPI.vippayments.methods.InitDropDownBindings();

    $(document).ready(function () {
        $('.dropdown').dropdown({});
        $.validator.unobtrusive.parse($('#paymentForm'));
        var countryID = $('#CountryID').val();
        if (countryID == 216 || countryID == 36) {
            $('.show').hide();
            $('.hide:not(.js-load-search)').show();
            $("[id$=HasStateDropDown]").attr("checked", "checked");
        }
        else {
            $('.show').show();
            $('.hide:not(.js-load-search)').hide();
            $("[id$=HasStateDropDown]").removeAttr("checked");
        }
        require(['forms_validations'], function () {
            $('.selectForm').chosen();
        });
    });
};

FFAPI.vippayments.methods.RemoveOrderDetail = function () {
    $("#vipSelectedOrder").html("");

};

FFAPI.vippayments.methods.InitLoadingAnimations = function () {
};

FFAPI.vippayments.methods.StartSearchAnimation = function () {
    FFAPI.vippayments.variables.searchButton.start();
};

FFAPI.vippayments.methods.EndSearchAnimation = function () {
    FFAPI.vippayments.variables.searchButton.stop();
};

FFAPI.vippayments.methods.StartPaymentAnimation = function () {
    FFAPI.vippayments.variables.makePaymentButton.start();
};

FFAPI.vippayments.methods.EndPaymentAnimation = function () {
    FFAPI.vippayments.variables.makePaymentButton.stop();
};

FFAPI.vippayments.methods.InitLoadingAnimations();

$("#CurrencyList_input").change(function () {

});

FFAPI.vippayments.methods.CurrencyConverterService = function (destCurrencyName) {
    var maxValueCurrencyElem = $('#MaxValueCurrency');
    if (destCurrencyName === maxValueCurrencyElem.val())
        return;
    var maxValueElem = $('#MaxValue');

    $.ajax({
        type: "GET",
        url: universal_variable.page.subfolder + 'VIPOrders/CurrencyConverter',
        data: {
            originCurrency: $('#OriginalOrderCurrency').val(),
            destCurrency: destCurrencyName,
            value: $('#OriginalOrderAmount').val(),
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result, e) {
            maxValueElem.val(result.Amount);
            maxValueCurrencyElem.val(result.Currency);
            /* Force input validation */
            $('#paymentForm').validate().element('#Amount');
        }
    });
};