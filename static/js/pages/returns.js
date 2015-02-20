$(document).ready(function(){
    require(['essentials_plugins'], function () {
        tooltips();
    });
});

FFAPI.returns = FFAPI.returns || {};
FFAPI.returns.methods = FFAPI.returns.methods || {};
FFAPI.returns.variables = FFAPI.returns.variables || {};



////////////////////////////////////////////
/****************    UPS    ***************/
////////////////////////////////////////////

//BINDS

FFAPI.returns.methods.OnUPSContinueSubmit = function () {
    $('.selectForm').chosen();
    $('.label-check, .label-radio').checkradio();
}

////////////////////////////////////////////
/****************    DHL    ***************/
////////////////////////////////////////////

//BINDS

$("body").on('change', '#Day', function () {
    var jQthis = $(this),
        button = $(".account-returns .button-black"),
        loaderMask = $(".account-dhl_loader");
    //SHOW DHL LOADING STATE

    loaderMask.removeClass("hide");

    //REMOVE OPTIONS FROM PICKUPFROM
    $("#Begin :gt(0)").remove();
    $("#Begin").prop("disabled", "disabled").val("").trigger("chosen:updated");
    //REMOVE OPTIONS FROM PICKUPTO
    $("#End :gt(0)").remove();
    $("#End").prop("disabled", "disabled").val("").trigger("chosen:updated");
    button.attr("disabled", "disabled");

    $.ajax({
        "url": window.universal_variable.page.subfolder + "/Returns/Dhl/GetPickUpTimeFromList",
        "type": "POST",
        "cache": false,
        "dataType": "json",
        "data": {
            "time": jQthis.val(),
            "RMA": $("#RMA").val(),
            "hour": $("#hour").val()
        },
        "success": function (data) {
            //REPLACE THE OPTIONS ON SELECT JQTHIS
            var beginSelect = $("#Begin");

            for (index = 0; index < data.timeList.length; ++index) {
                beginSelect.append("<option value='" + data.timeList[index].Item1 + "'>" + data.timeList[index].Item2 + "</option>");
            }

            //REMOVE DISABLE FROM PICKUPFROM
            beginSelect.removeProp("disabled");
            //UPDATE CHOSEN
            beginSelect.trigger("chosen:updated");
            //HIDE DHL LOADING STATE
            loaderMask.addClass("hide");
            button.removeAttr("disabled");
        },
        "error": function (data) {
            return false;
        }
    });

});


$("body").on('change', '#Begin', function () {
    var jQthis = $(this),
        button = $(".account-returns .button-black"),
        loaderMask = $(".account-dhl_loader");

    //SHOW DHL LOADING STATE
    loaderMask.removeClass("hide");
    //REMOVE OPTIONS FROM PICKUPTO
    $("#End :gt(0)").remove();
    $("#End").prop("disabled", "disabled").val("").trigger("chosen:updated");
    button.attr("disabled", "disabled");

    $.ajax({
        "url": window.universal_variable.page.subfolder + "/Returns/Dhl/GetPickUpTimeToList",
        "type": "POST",
        "cache": false,
        "dataType": "json",
        "data": {
            "time": $("#Day").val(),
            "pickUpFrom": $("#Begin").val(),
            "RMA": $("#RMA").val(),
            "hour": $("#hour").val()
        },
        "success": function (data) {
            //REPLACE THE OPTIONS ON SELECT JQTHIS
            var endSelect = $("#End");
            for (index = 0; index < data.timeList.length; ++index) {
                endSelect.append("<option value='" + data.timeList[index].Item1 + "'>" + data.timeList[index].Item2 + "</option>");
            }
            //REMOVE DISABLE FROM PICKUPTO
            endSelect.removeProp("disabled");
            //UPDATE CHOSEN
            endSelect.trigger("chosen:updated");
            //HIDE DHL LOADING STATE
            loaderMask.addClass("hide");
            button.removeAttr("disabled");
        },
        "error": function (data) {
            return false;
        }
    });

});

FFAPI.returns.methods.initStepOneReturnTypeRadio = function () {
    /*Click Colect Returns*/
    var return_steps = $('.returns-steps'),
        return_step_one_arrow = $('.returns-steps-items .arrow_right');
        return_arrow = $('.returns-steps-address .arrow_right'),
        returns_steps_last = $('.returns-steps-date'),
        returns_steps_second = $('.returns-steps-address');

    $('.account-returns-type-options label').on("click", function () {
        var numSteps = $('#Steps').val();
        if ($('.account-returns-type-option-InStore input:radio').is(':checked')) {
            return_steps.addClass('returns-steps_inStore');
            returns_steps_last.addClass('hide');
            returns_steps_second.removeClass('hide');
            return_arrow.addClass('hide');
            return_step_one_arrow.removeClass('hide');
            $('.js-summary-returnType-inStore').removeClass('hide');
            $('.account-steps-container-ups .returns-steps-address').removeClass('hide');
            $('.js-summary-returnType-byCourier').addClass('hide');
            if ($('.js-summary-returnType-byUps').length > 0) {
                $('.js-summary-returnType-byUps').addClass('hide');
                $('.returns-steps-items').find('.arrow_right').removeClass('hide')
                $('.js-returns-Ups-btn').addClass('hide');
                $('.js-returns-InStore-btn').removeClass('hide');
            }
        }

        else {
            return_steps.removeClass('returns-steps_inStore');
            if (numSteps > 1) {
                return_arrow.removeClass('hide');
            } else {
                returns_steps_second.addClass('hide');
                return_step_one_arrow.addClass('hide');
            }

            $('.js-summary-returnType-inStore').addClass('hide');
            $('.js-summary-returnType-byCourier').removeClass('hide');
            $('.account-steps-container-ups .returns-steps-address').addClass('hide');
            if ($('.js-summary-returnType-byUps').length > 0) {
                $('.js-summary-returnType-byCourier').addClass('hide');
                $('.js-summary-returnType-byUps').removeClass('hide');
                $('.returns-steps-items').find('.arrow_right').addClass('hide');
                $('.js-returns-InStore-btn').addClass('hide');
                $('.js-returns-Ups-btn').removeClass('hide');
                $('.js-returns-InStore-btn').addClass('hide');
            }
            if (numSteps > 1) {
                var returns_steps_delay = setTimeout(function () {
                    returns_steps_last.removeClass('hide');
                }, 350);
            }
        }

    });
};

FFAPI.returns.methods.initStepOneReturnTypeRadio();
//var returns_items = $('.js-returns-items'),
//returns_items_furtherInfo = $('.js-returns-items-furtherInfo');


//returns_items.on('click', function () {
//$(this).parent().find('.js-returns-checkItem').find('span').removeClass('icon-box-unchecked').addClass('glyphs icon-box-checked');
//});

FFAPI.returns.methods.updateItemsSummary = function () {
    var items = $('input:checkbox:checked').length;
    $('.js-summary-numItems').text(items);
};

var returns_items_dropdown = $('.js-returns-items select'),
    returns_items_textarea = $('.js-returns-items textarea'),
    returns_items_furtherInfo = $('.js-returns-items-furtherInfo');

$('body').on('change', '.js-returns-items select', function (evt, params) {
    var tmpElem = $(this).parent().parent().find('.js-returns-checkItem');
    tmpElem.find('input').prop('checked', 'checked');
    tmpElem.find('span').removeClass('icon-box-unchecked').addClass('glyphs icon-box-checked');
    FFAPI.returns.methods.updateItemsSummary();
});

$('body').on('focus keydown keyup', '.js-returns-items textarea', function () {
    var tmpElem = $(this).parent().parent().find('.js-returns-checkItem');
    if (tmpElem.find('span').hasClass('icon-box-unchecked')) {

        if ($.trim($(this).val()) == "") {
            tmpElem.find('input').removeProp('checked');
            tmpElem.find('span').removeClass('glyphs icon-box-checked').addClass('icon-box-unchecked');
        }
        else {
            tmpElem.find('input').prop('checked', 'checked');
            tmpElem.find('span').removeClass('icon-box-unchecked').addClass('glyphs icon-box-checked');
        }

    }
    else {

    }
    FFAPI.returns.methods.updateItemsSummary();
});

require(['plu_fixto'], function () {
    if (ffbrowser.isIE8 === false && window.innerWidth > 1024) {
        $('.sticky').fixTo('.sticky-holder', {
            mind: 'header'
        });
    }
});


$('#BoxNumber').on('change', function () {
    $('.js-summary-numBoxes').text($(this).val());
});

$('.js-return-item').click(function () {
    FFAPI.returns.methods.updateItemsSummary();
});

/* Multichannel Search results - Select Address  */
$(FFAPI.variables.bodyElement).on('click', '.js-checkout-mc-fauxTable-selectBtn-action', function () {
    var jQThis = $(this);
    var span = jQThis.find('span');
    var storeId = span.data('store-id');
    var addressId = span.data('addr-id');
    $('#returnInStoreAddressId').val(addressId);
    $('#stepTwoFrom').submit();
});

var returnsSummaryContinueButton = $('.js-summary-continue');

FFAPI.returns.methods.onStepOneComplete = function (data) {
    if (data != undefined && data.responseJSON != undefined && data.responseJSON.error) {
        window.location = data.responseJSON.url;
        return;
    }
    var isConfirmation = $('.field-confirmation').length > 0;    
    if (isConfirmation) {
        $('.checkout-steps-container').remove();
        $('.account-returns-summaryBox-container').remove();
    } else {
        var isStepTwo = $('.field-step-two').length > 0;
        if (isStepTwo) {
            var isReturnInStore = $('.field-return-in-store').length > 0;
            if (isReturnInStore) {
                $('.js-summary-continue').addClass('hide');
                FFAPI.methods.maps.bindEvents();
                getAllMap();
            } else {
                $('.js-summary-continue').removeClass('hide');
            }
            //update Step
            $('.returns-steps-items').removeClass('checkout-active-step');
            $('.returns-steps-address').addClass('checkout-active-step');
            //hide the current step content
            $('.field-step-one').addClass('hide');
            //convert select to hidden fields (mobile issues)
            $(".form-step-one select").replaceWith(function () {
                var jQThis = $(this);
                return $("<input>", {
                    value: jQThis.val(),
                    name: this.name,
                    type: "hidden",
                    id: this.id
                });
            });
            //move form data from old form to the new one
            $('.form-step-one input').appendTo('.form-step-two').hide();
        } else {
            $('.js-summary-continue').removeClass('hide');
        }
    }
    // remove old form data
    $('.js-remove').remove();

    // Rebindings
    $('.selectForm').chosen();
    $('.label-check, .label-radio').checkradio();
    FFAPI.variables.formsToValidate = $('form[data-ajax=true], .form-validator');
    FFAPI.variables.formsToValidate.data("unobtrusiveValidation", null);
    FFAPI.variables.formsToValidate.data("validator", null);
    $.validator.unobtrusive.parse(document);
    // Step One Radios
    FFAPI.returns.methods.initStepOneReturnTypeRadio();
    // Summary
    FFAPI.methods.resetButtons('summaryContinueButton');
    returnsSummaryContinueButton.removeData('loading');
};

FFAPI.returns.methods.onStepOneBegin = function () {
    $('.field-step-one').addClass('js-remove');
    returnsSummaryContinueButton.data('loading', true);
    FFAPI.methods.loadingButtons('summaryContinueButton');    
};

FFAPI.returns.methods.onStepOneFailure = function (url) {
    document.location = url;
    FFAPI.methods.resetButtons('summaryContinueButton');    
};

$('.js-summary-continue').on('click', function () {
    var isLoading = returnsSummaryContinueButton.data('loading');
    if (!isLoading) {
        $('form').submit();
    }
});


$(document).ready(function () {
    $("body").on('click', '.notice_error span.icon-close', function () {
        $(this).closest(".notice_error").hide();
    });
});