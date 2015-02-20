FFAPI.payment = FFAPI.payment || {};
FFAPI.payment.methods = FFAPI.payment.methods || {};
FFAPI.payment.variables = FFAPI.payment.variables || {};
FFAPI.payment.variables.cardTypes = FFAPI.payment.variables.cardTypes || {};

/**
 * Events 
 */
var body = $('body');

body.on('change', '#NumberOfInstallments', function (e) {
    var val = $(this).val();
    $('.numberOfInstallmentsInput').val(val);
    e.preventDefault();
});

body.on('click', '.btnSaveEditedCard', function (e) {
    var validator = $('#formCreditCardToken').validate();
    if (validator.form()) {
        var selectedCardId = $('.radioTokenCard:checked').val();
        var cardBoxModuleCCV = $('#card-' + selectedCardId + ' input[name$="CCV"]');
        if (cardBoxModuleCCV.length > 0) {
            var editCardFormCCV = $('#editcard-' + selectedCardId + ' input[name$="CCV"]');
            if (editCardFormCCV.length > 0) {
                cardBoxModuleCCV.val(editCardFormCCV.val());
            }
        }
        $('.btnCancelEditCard').click();
    }
    e.preventDefault();
});

body.on('click', '.btnCancelEditCard', function (e) {
    var editCardForms = $('.editcards');
    var creditCardList = $('#creditCardList');
    editCardForms.addClass('hide');
    creditCardList.removeClass('hide');
    var selectedCardId = $('.radioTokenCard:checked').val();
    // disable date validators for edit saved card form
    FFAPI.payment.methods.setEditCardDateValidators(selectedCardId, false);

    FFAPI.payment.methods.setContinueEnabled(true, "formCreditCardToken");
    e.preventDefault();
});

body.on('click', '.editCardLink', function (e) {
    var jQThis = $(this);
    var cardId = jQThis.data('card-id');
    var editCardForm = $('#editcard-' + cardId);
    var creditCardList = $('#creditCardList');
    editCardForm.removeClass('hide');
    creditCardList.addClass('hide');

    // enable date validators
    FFAPI.payment.methods.setEditCardDateValidators(cardId, true);
    $('.js-checkout-sameAsShipping-continueBtn').hide();
    e.preventDefault();
});

body.on('click', '#btnAddNewCard', function (e) {
    FFAPI.payment.methods.setTokenizationVisible(false);
    e.preventDefault();
});

body.on('click', '#btnBackToCardList', function (e) {
    FFAPI.payment.methods.setTokenizationVisible(true);
    e.preventDefault();
});

/**
 * When an address is to be edited, if it is the shipping address, we need to copy the address contents into the form
 */
body.on('click', '.editBillingAddress', function (e) {
    $('#js-shipping-summary').hide();
    $('#js-billing-summary').hide();
    FFAPI.payment.methods.setContinueEnabled(false);
    FFAPI.payment.methods.setNewCreditCardFormVisible(false);

    var summaryId = $(this).closest('.js-summary-container').prop('id');
    if (summaryId == 'js-shipping-summary') {
        FFAPI.payment.methods.copyShippingToBillingAddress();
    }
    else {
        FFAPI.payment.methods.setBillingAddressFormVisible(true);
    }

    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(179); }
});

/**
 * Click on a payment type box (credit card, paypal, etc)
 */
body.on('click', '.checkout-payMethod-Box', function () {
    var inputElem = $(this).find('input[type="radio"]');
    if ($(this).is('input')) {
        inputElem = $(this);
    }
    var selectedPaymentId = inputElem.data('payment');
    var formExternalPaymentInput = $('#Detail_PaymentMethodDetails_ExternalPaymentMethodId');
    if (selectedPaymentId == formExternalPaymentInput.val()) {
        return;
    }
    // mark as selected and unselect others
    $('.js-checkout-select-paymethod-container').find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
    $(this).find('span').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');

    formExternalPaymentInput.val(selectedPaymentId);

    if (selectedPaymentId > -1) {
        $('.js-checkout-paycreditcard-form').slideUp();
        var form = $(this).closest('form');
        FFAPI.payment.methods.setContinueEnabled(true, form.attr('id'));

        if (selectedPaymentId == 1) {
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(181); }
        }
        else if (selectedPaymentId == 2) {
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(182); }
        }
        FFAPI.payment.methods.HideBRInstallments();
    } else {
        $('.js-checkout-paycreditcard-form').slideDown()
        FFAPI.payment.methods.showCreditCardForm();
    }
});

function toBoolean(value) {
    if (typeof (value) == 'string') {
        value = value.toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
};

/**
 * Click on Continue button
 * As we have multiple forms, we check which form we should submit 
 */
body.off('click', "#summaryWrapper button.js-btnContinue").on('click', "#summaryWrapper button.js-btnContinue", function (e) {
    var targetForm = $(this).data('target-form');
    if (targetForm) {
        if (toBoolean($('#IsTokenizationPayment').val())) {
            var selectedCardId = $('.radioTokenCard:checked').val();
            if (selectedCardId != undefined) {
                // check if the selected card requires some validation (date and/or cvv)
                var selectedCardElement = $('#cardData-' + selectedCardId);
                var isExpired = toBoolean(selectedCardElement.data('isexpired'));
                var requiresCvv = toBoolean(selectedCardElement.data('notmatchaddress'));
                if (isExpired) {
                    var canProccedToReview = true;
                    var formValidator = $('#formCreditCardToken').validate();
                    if (requiresCvv) {
                        var ccvValid = formValidator.check('#editcard-' + selectedCardId + ' input[name$=CCV]');
                        canProccedToReview = ccvValid;
                    }
                    FFAPI.payment.methods.setEditCardDateValidators(selectedCardId, true);
                    var validDate = formValidator.check('#editcard-' + selectedCardId + ' select[name$="ExpiryMonth"]') &&
                                    formValidator.check('#editcard-' + selectedCardId + ' select[name$="ExpiryYear"]');

                    canProccedToReview = canProccedToReview && validDate;
                    FFAPI.payment.methods.setEditCardDateValidators(selectedCardId, false);
                    if (!canProccedToReview) {
                        e.preventDefault();
                        return;
                    }
                }

            }
        }
        $('.numberOfInstallmentsInput').val($('#NumberOfInstallments').val());
        $('#' + targetForm).submit();
    }
    e.preventDefault();
});

/**
 * Method to enable or disable credit card date validation on Edit Saved Cards forms
 */
FFAPI.payment.methods.setEditCardDateValidators = function (cardId, enable) {

    if (enable) {
        $('#editcard-' + cardId + ' select[name$="ExpiryMonth"]').addClass('dropdownhidden');
        $('#editcard-' + cardId + ' select[name$="ExpiryYear"]').addClass('dropdownhidden');
    } else {
        $('#editcard-' + cardId + ' select[name$="ExpiryMonth"]').removeClass('dropdownhidden');
        $('#editcard-' + cardId + ' select[name$="ExpiryYear"]').removeClass('dropdownhidden');
    }

    $('#formCreditCardToken').data("unobtrusiveValidation", null);
    $('#formCreditCardToken').data("validator", null);
    $.validator.unobtrusive.parse(document);
}

/**
 * Used to store the billing address, and get the list of card types available for that address
 */
body.off('click', '#saveCCBillingAddress').on('click', '#saveCCBillingAddress', function (e) {
    if ($(this).is(':visible')) {
        $('#formCreditCard').removeData('validator');
        $.validator.unobtrusive.parse(document);
        $('#billingAddressForm').closest('form').data('validator').settings.ignore += ', #newCreditCardForm input, #newCreditCardForm select';
        var validator = $('#billingAddressForm').closest('form').validate();
        if (validator.form()) {
            FFAPI.payment.methods.updateCards(false);
        }
    }
    else {
        var continueBtn = $('button.js-btnContinue');
        if (continueBtn.is(':visible')) {
            continueBtn.click();
        }
    }
    e.preventDefault();
});

body.on('click', '#checkout-sameAsShipping-container', function () {
    FFAPI.payment.methods.showCreditCardForm();
});

/**
 * Used to enable/disable the continue button
 * The targetForm parameter, set's the form ID that the button will use to submit the form
 */
FFAPI.payment.methods.setContinueEnabled = function (state, targetForm) {
    if (state) {
        $("#summaryWrapper button.js-btnContinue").data('target-form', targetForm);
        $('.js-checkout-sameAsShipping-continueBtn').slideDown();
    } else {
        $('.js-checkout-sameAsShipping-continueBtn').slideUp();
    }
};

/**
 * Used to get the list of cards available
 * It will cache the pair address<->response
 */
FFAPI.payment.methods.updateCards = function (sameAsShipping) {
    var postData = "";
    if (sameAsShipping) {
        var creditCardSelectInput = $('#Detail_PaymentMethodDetails_NewCreditCardDetails_Type');
        if (creditCardSelectInput.data('forSameAsShipping') == false || creditCardSelectInput.data('forSameAsShipping') == undefined) {
            // we need to get the cards to use with billing address same as shipping
            postData = $('#Detail_PaymentMethodDetails_BillingAddress_SameAsShippingAddress').serialize();
            FFAPI.payment.methods.setBillingAddressFormVisible(false);
            FFAPI.payment.methods.setNewCreditCardFormVisible(false);
        }
        else {
            // the card types are already right ;)
            FFAPI.payment.methods.setBillingAddressFormVisible(false);
            FFAPI.payment.methods.setNewCreditCardFormVisible(true);
            FFAPI.payment.methods.setContinueEnabled(true, 'formCreditCard');
            return false;
        }
    }
    else {
        var billingInputs = $('#billingAddressForm input');
        postData = billingInputs.serialize();
        //validate form
        //post billing address
    }

    var data = FFAPI.payment.variables.cardTypes[postData];
    if (data != undefined && data.success == true) {
        FFAPI.payment.methods.processUpdateCardsResponse(data, sameAsShipping);
        return false;
    }
    $('#maskLoading').show();
    $.ajax({
        "url": FFAPI.payment.variables.billingAction,
        "type": "POST",
        "cache": false,
        "data": postData,
        "success": function (data) {
            FFAPI.payment.methods.processUpdateCardsResponse(data, sameAsShipping);
            FFAPI.payment.variables.cardTypes[this.data] = data;
            $('#maskLoading').hide();
        },
        "error": function (data) {
            FFAPI.payment.variables.cardTypes[this.data] = undefined;
            $('#maskLoading').hide();
            return false;
        }
    });
}

FFAPI.payment.methods.processUpdateCardsResponse = function (data, sameAsShipping) {
    if (data.success) {
        if (data.cards.length > 0) {
            var creditCardSelectInput = $('#Detail_PaymentMethodDetails_NewCreditCardDetails_Type');
            creditCardSelectInput.data('forSameAsShipping', sameAsShipping);
            creditCardSelectInput.empty();
            $(data.cards).each(function () {
                creditCardSelectInput.append("<option value='" + this.Code + "'>" + this.Description + "</option>");
            });
            creditCardSelectInput.trigger("chosen:updated");
            FFAPI.payment.methods.setBillingAddressFormVisible(false);
            FFAPI.payment.methods.setNewCreditCardFormVisible(true);
            FFAPI.payment.methods.setContinueEnabled(true, 'formCreditCard');
        }
        if (data.summary != undefined) {
            var billingSummaryContainer = $('#js-billing-summary');
            billingSummaryContainer.empty();
            billingSummaryContainer.append($(data.summary).removeClass('checkout-sameAsShipping-addressBox'));
            $('#js-shipping-summary').hide();
            billingSummaryContainer.removeClass('hide').show();
        }

        $('#formCreditCard').removeData('validator');
        $.validator.unobtrusive.parse(document);
    }
};

FFAPI.payment.methods.setBillingAddressFormVisible = function (state) {
    if (state) {
        var countryID = $('#CountryID').val();
        if (countryID == '42')
        {
            FFAPI.address.methods.UpdateStates(countryID);
            FFAPI.address.showStatesDropDown(true);
            FFAPI.address.showCitiesDropDown(true);
        }
        $('#billingAddressForm').removeClass('hide').show();
        $('#billingSummaryContainer').hide();
    } else {
        $('#billingAddressForm').removeClass('hide').hide();
        $('#billingSummaryContainer').show();
    }
};

FFAPI.payment.methods.setNewCreditCardFormVisible = function (state) {
    if (state) {
        $('body').animate({ scrollTop: $('#newCreditCardForm').offset().top }, 'slow');
        $('#newCreditCardForm').removeClass('hide').show();
    } else {
        $('#newCreditCardForm').hide();
    }
};

FFAPI.payment.methods.copyShippingToBillingAddress = function () {
    // Copy shipping address to billing address form..
    FFAPI.payment.methods.copyShippingToBillingAddress_Aux();
    // toggle same as shipping
    $('.label-check.js-checkout-sameShipping-container').click();
};

FFAPI.payment.methods.copyShippingToBillingAddress_Aux = function () {
    var countryid = $('#billingSameAsShipping_CountryId').val();
    var stateid = $('#billingSameAsShipping_StateDD').val();
    $('#Detail_PaymentMethodDetails_BillingAddress_Address1').val($('#billingSameAsShipping_Address1').val());
    $('#Detail_PaymentMethodDetails_BillingAddress_Address2_Line1').val($('#billingSameAsShipping_Address2_Line1').val());
    $('#Detail_PaymentMethodDetails_BillingAddress_Address2_Line2').val($('#billingSameAsShipping_Address2_Line2').val());
    $('#CountryID').val(countryid);
    $('#StateDD').val(stateid);
    $('#CityDD').val($('#billingSameAsShipping_CityDD').val());
    FFAPI.address.variables.billingSameAsShippingAddressStateDD = stateid;
    FFAPI.address.variables.billingSameAsShippingAddressCityDD = $('#billingSameAsShipping_CityDD').val();
    var countryListElemnt = $("#countryList");
    if (countryListElemnt.length) {
        $("select#countryList").val(countryid).trigger('chosen:updated');
    }

    if (countryid == 216 || countryid == 36 || countryid == 28) {
        FFAPI.address.showStatesDropDown(true);
        FFAPI.address.methods.UpdateStates(countryid, stateid);
    }
    else {
        FFAPI.address.showStatesDropDown(false);
    }

    $("[id$=HasStateDropDown]").attr("checked", "checked");
    $('#CPF').val($('#billingSameAsShipping_CPF').val());
    $('#Detail_PaymentMethodDetails_BillingAddress_Bairro').val($('#billingSameAsShipping_Bairro').val());
    $('#DDD').val($('#billingSameAsShipping_DDD').val());
    $('#StateName').val($('#billingSameAsShipping_StateName').val());
    $('#City').val($('#billingSameAsShipping_City').val());
    $('#Zip').val($('#billingSameAsShipping_Zip').val());
    $('#Detail_PaymentMethodDetails_BillingAddress_Phone').val($('#billingSameAsShipping_Phone').val());
};

/**
 * Method used to show the credit card fields
 * Based on several settings, it can show the billing address form, new credit card form, or the stored credit cards list
 */
FFAPI.payment.methods.showCreditCardForm = function () {
    var hasTokenization = $('#IsTokenizationPayment').length > 0;
    var addingNewCreditCard = $('#IsNewCreditCardPayment').val().toLowerCase() === 'true';
    FFAPI.payment.methods.ShowBRInstallments();
    if (hasTokenization && addingNewCreditCard == false) {
        FFAPI.payment.methods.setTokenizationVisible(true);
    } else {
        FFAPI.payment.methods.setTokenizationVisible(false);
    }
}

FFAPI.payment.methods.setTokenizationVisible = function (state) {
    if (state) {
        $('#IsTokenizationPayment').val(true);
        $('#IsNewCreditCardPayment').val(false);

        $('#formCreditCard').hide();
        FFAPI.payment.methods.setNewCreditCardFormVisible(false);
        FFAPI.payment.methods.setBillingAddressFormVisible(false);
        $('#formCreditCardToken').removeClass('hide').show();
        if ($('.radioTokenCard:checked').length > 0) {
            FFAPI.payment.methods.setContinueEnabled(true, 'formCreditCardToken');
            $(".radioTokenCard:checked").closest(".js-checkout-mainContent-boxModule-payment-token:visible").click();
        } else {
            FFAPI.payment.methods.setContinueEnabled(false);
        }
        FFAPI.payment.methods.tokenizationValidateCards();
    }
    else {
        $('#IsTokenizationPayment').val(false);
        $('#IsNewCreditCardPayment').val(true);

        $('#formCreditCardToken').hide();
        $('#formCreditCard').removeClass('hide').show();

        var sameAsShipping = $('#Detail_PaymentMethodDetails_BillingAddress_SameAsShippingAddress').prop('checked');
        $('#js-billing-summary').hide();
        var countryID = $('#CountryID').val();
        var stateDD = $('#StateDD').val();
        var cityDD = $('#CityDD').val();

        if (sameAsShipping) {
            FFAPI.payment.methods.updateCards(true);
            $('#js-shipping-summary').removeClass('hide').show();
            if (countryID == undefined || countryID <= 1) {
                $('#CountryID').val(1);
            }
            if (stateDD == undefined || stateDD <= 1) {
                $('#StateDD').val(1);
            }
            if (cityDD == undefined || cityDD <= 1) {
                $('#CityDD').val(1);
            }
        } else {
            if (countryID == 1) {
                var countryName = $('#Country').val();
                if (countryName == "" || countryName == undefined) {
                    $('#CountryID').val(0);
                }
            }
            if (stateDD == 1) {
                var stateName = $('#State').val();
                if (stateName == "" || stateName == undefined) {
                    $('#StateDD').val(0);
                }
            }
            if (cityDD == 1) {
                var cityName = $('#City').val();
                if (cityName == "" || cityName == undefined) {
                    $('#CityDD').val(0);
                }
            }
            FFAPI.payment.methods.setBillingAddressFormVisible(true);
            FFAPI.payment.methods.setNewCreditCardFormVisible(false);
            $('#js-shipping-summary').hide();
            FFAPI.payment.methods.setContinueEnabled(false);
        }
    }
}

FFAPI.payment.methods.tokenizationValidateCards = function (state) {

};

$('#ExpMonth').on('change', function () {
    var validator = $(this).closest('form').validate();
    if ($('#ExpYear').val() == "") {
        $(this).siblings('.form-validator_error').hide();
    } else {
        validator.element(this);
        $(this).siblings('.form-validator_error').hide().show();
    }
});

$('#ExpYear').on('change', function () {
    var validator = $(this).closest('form').validate();
    if (validator.element(this)) {
        var expMonth = $('#ExpMonth');
        validator.element(expMonth);
        expMonth.siblings('.form-validator_error').hide().show();
        $(this).siblings('.form-validator_error').hide().show();
    }
    else {
        $('#ExpMonth').siblings('.form-validator_error').hide();
    }
});

FFAPI.payment.methods.OnDeleteCardComplete = function (data) {
    var json = data.responseJSON;
    if (json && json.success == "True") {
        $('#card-' + json.id).remove();
        $('#editcard-' + json.id).remove();
        $('#creditCardList').removeClass('hide');
        $('.js-checkout-sameAsShipping-continueBtn').show();
    }
    $('.modal-close-action').trigger('click');
};

FFAPI.payment.methods.ShowBRInstallments = function () {
    //$('.checkout-summary-brInstalments-container').removeClass('hide');
    //$('.staticInstallments').addClass('hide');
};

FFAPI.payment.methods.HideBRInstallments = function () {
    //$('.checkout-summary-brInstalments-container').addClass('hide');
    //$('.staticInstallments').removeClass('hide');
};

