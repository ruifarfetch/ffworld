////////////////////////////////////////////
/**************    ADDRESS    *************/
////////////////////////////////////////////

//INIT VARIABLES

FFAPI.address = FFAPI.address || {};
FFAPI.address.methods = FFAPI.address.methods || {};
FFAPI.address.variables = FFAPI.address.variables || {};

FFAPI.address.variables.checkoutSelection = $(".checkoutSelection");
FFAPI.address.variables.checkoutSelectionBox = FFAPI.address.variables.checkoutSelection.find(".checkout-mainContent-boxModule");
FFAPI.address.variables.checkoutSelectedAddressInput = FFAPI.address.variables.checkoutSelectionBox.find("input[name='defaultShipping']");

// {BINDS}


FFAPI.address.methods.bindAddressContinueSummary = function () {
    $('body').off('click', "#summaryWrapper button.js-btnContinue").on('click', "#summaryWrapper button.js-btnContinue", function (e) {
        var targetForm = $(this).data('target-form');
        if (targetForm) {
            $('#' + targetForm).submit();
        } else {
            $("#AddressForm").submit();
        }
        e.preventDefault();
    });
};

FFAPI.address.methods.BindSelectAddressBoxes = function () {
    FFAPI.address.variables.checkoutSelectionBox.click(function (e) {
        var jQThis = $(this);
        // If user clicked on edit it doesnt do this
        if ($(e.target).is("a") || $(e.target).closest('#checkout_add_address').length > 0) {
            return;
        }
        FFAPI.address.methods.setAddress(jQThis);
    });
};

FFAPI.address.methods.BindAddANewAddressLink = function () {
    $(".addNewAddress").click(function (e) {
        $(e.target).find('a').click();
    });
};

FFAPI.address.methods.onNewAddressClick = function (btnContinueText) {
    //Bind Chosen Dropdowns
    FFAPI.address.initAddOrEditAddress(false);
    $('#btnContinue').text(btnContinueText);
    FFAPI.address.methods.bindAddressContinueSummary();
    $("body").scrollTop(0);
    if (ffbrowser.isIE8 === false && window.innerWidth > 1024) {
        $('.sticky').fixTo('.sticky-holder', {
            mind: 'header'
        });
    }
};

// {METHODS}

//SELECT ADDRESS PAGE
FFAPI.address.methods.setAddress = function (checkoutBoxElement) {

    var addressID = checkoutBoxElement.find("input").val(),
        jQThisLabel = checkoutBoxElement.find('label');

    // Set the address
    // Checks if we are not setting the actual address
    if ($('#address').val() != addressID) {
        var success = FFAPI.address.methods.updateShippingAddressAjax(addressID);

        // Set the address id
        $('#address').val(addressID);

        // Set the checkout address box active
        FFAPI.address.variables.checkoutSelectionBox.removeClass('checkout-mainContent-boxModule_active');
        checkoutBoxElement.addClass('checkout-mainContent-boxModule_active');

        //Sets the inputs
        jQThisLabel.addClass('label-check_active');
        jQThisLabel.find('input[type=radio]').prop('checked', true);
        checkoutBoxElement.find("input[name='defaultShipping']").attr('checked', true);
        FFAPI.address.variables.checkoutSelectedAddressInput.attr('checked', false)


        // Set the radio buttons on/off
        FFAPI.address.variables.checkoutSelectionBox.find("label").removeClass('label-check_active').find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        jQThisLabel.find('span').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');


        //Show Continue links
        $('.js-checkout-selectShippingAddress-shipMobBtn').hide();
        if (window.innerWidth < 480) {
            checkoutBoxElement.find('.js-checkout-selectShippingAddress-shipMobBtn').show();
        }
    }
};
FFAPI.address.methods.updateShippingAddressAjax = function (addressID, callback) {
    if (FFAPI.variables.updateSummaryDetailsXHR && FFAPI.variables.updateSummaryDetailsXHR.readyState != 4) {
        FFAPI.variables.updateSummaryDetailsXHR.abort();
    }

    FFAPI.variables.updateSummaryDetailsXHR = $.ajax({
        "url": window.universal_variable.page.subfolder + "/Checkout/Checkout/UpdateShippingAddress",
        "type": "POST",
        "cache": false,
        "data": {
            "addressID": addressID
        },
        "success": function (data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                $("#summaryWrapper").html(data);
                FFAPI.address.methods.bindAddressContinueSummary();
            }
            if (callback) {
                callback();
            }
        },
        "error": function (data) {
            return false;
        }
    });
};

FFAPI.address.CountryOptionsUpdated = function () {
    var container = $('#dvCountryOptionsContainer');
    if ($('#dvCountryOptions').is(':empty') == false) {
        container.removeClass('hide');
        container.slideDown();
    } else {
        container.addClass('hide');
    }
};

FFAPI.address.showStatesDropDown = function (visible) {
    if (visible) {
        var statesSelect = $('#StateList');
        if (statesSelect.data('chosen') == undefined) {
            statesSelect.chosen();
        }
        $('#stateDropDown').removeClass('hide').show();
        $('#stateInput').addClass('hide');
        $("[id$=HasStateDropDown]").attr("checked", "checked");
        $("[id$=HasStateDropDown]").prop("checked", "checked");

    } else {
        $('#stateDropDown').addClass('hide');
        $('#stateInput').removeClass('hide');
        $("[id$=HasStateDropDown]").removeAttr("checked");
        $("[id$=HasStateDropDown]").removeProp("checked", "checked");
    }
};

FFAPI.address.cleanStates = function () {
    $("#StateDD").val('');
    $("#StateName").val('');
};

FFAPI.address.showCitiesDropDown = function (visible) {
    if (visible) {
        var citiesSelect = $('#CityList');
        if (citiesSelect.data('chosen') == undefined) {
            citiesSelect.chosen();
        }
        $('#citiesDropDown').removeClass('hide').show();
        $('#cityInput').addClass('hide');
        $("[id$=HasCityDropDown]").attr("checked", "checked");
        $("[id$=HasCityDropDown]").prop("checked", "checked");

    } else {
        $('#citiesDropDown').addClass('hide');
        $('#cityInput').removeClass('hide');
        $("[id$=HasCityDropDown]").removeAttr("checked");
        $("[id$=HasCityDropDown]").removeProp("checked", "checked");
    }
};

FFAPI.address.cleanCities = function () {
    $("#CityDD").val('');
    $("#City").val('');
};

FFAPI.address.initAddOrEditAddress = function (editMode) {
    $('.selectForm').chosen();
    //form
    if (editMode) {
        $('#summaryContinueButton').remove();
    }
    $('body').off("change", "#countryList").on("change", "#countryList", function () {
        $('#CountryID').val($(this).val());
        FFAPI.address.cleanStates();
        FFAPI.address.cleanCities();

        if ($(this).val() > 0) {
            $('#Country').val($.trim($("#countryList option:selected").text()));
        }
        else {
            $('#Country').val("");
        }

        // update billing address form, if required
        var billingForm = $('#billingAddressFormInputs');
        if (billingForm.length > 0) {
            var isBrBillingAddress = $('#BrBillingAddress').prop('checked');
            if (isBrBillingAddress && $(this).val() != 28 || !isBrBillingAddress && $(this).val() == 28) {
                //GET FORM
                var formData = $('#billingAddressFormInputs input').serialize();
                $.ajax({
                    "url": FFAPI.address.variables.billingFormAction,
                    "type": "POST",
                    "cache": false,
                    "data": formData,
                    "success": function (data) {
                        $('#billingAddressFormInputs').html(data);
                        $.validator.unobtrusive.parse(document);
                    },
                    "error": function (data) {
                        return false;
                    }
                });
                return;
            }
        }
        //
        if ($(this).val() == 216 || $(this).val() == 36 || $(this).val() == 28 || $(this).val() == 42) {
            FFAPI.address.showStatesDropDown(true);
            FFAPI.address.methods.UpdateStates($(this).val());

            $("[id$=HasStateDropDown]").attr("checked", "checked");
            if ($(this).val() == 28) {
                FFAPI.address.showCitiesDropDown(true);
                $('#billingAddressCity').addClass('hide');
                $('.billBR').removeClass('hide');
                FFAPI.address.methods.maskUserAddressesBR();
            } else if ($(this).val() == 42) {
                FFAPI.address.showCitiesDropDown(true);
                $('#billingAddressCity').removeClass('hide');
                $('.billBR').addClass('hide');
                FFAPI.address.methods.unmaskUserAddressesBR();
            } else {
                FFAPI.address.showCitiesDropDown(false);
                $('#billingAddressCity').removeClass('hide');
                $('.billBR').addClass('hide');
                FFAPI.address.methods.unmaskUserAddressesBR();
            }
        }
        else {
            FFAPI.address.showStatesDropDown(false);
            FFAPI.address.showCitiesDropDown(false);

            FFAPI.address.methods.unmaskUserAddressesBR();
            $('#billingAddressCity').show();
            $('.billBR').addClass('hide');
            if ($(this).val() == -1) {
                $('#CountryID').val("");
            }
        }
        var jQthis = $(this);
        var elementValidation = jQthis.closest("form").validate();
        elementValidation.element($("#CountryID"));

        FFAPI.address.methods.ArrangeFormFields($(this).val());
    });

    $('body').off("change", "#StateList").on("change", "#StateList", function () {
        FFAPI.address.cleanStates();

        if ($(this).val() == "-1") {
            $("#CityList").val("-1").attr('disabled', true).trigger("chosen:updated");
        } else {
            $("#StateDD").val($(this).val());
            $("#StateName").val($.trim($("#StateList option:selected").text()));
            if ($('#citiesDropDown').is(":visible")) {
                FFAPI.address.cleanCities();
                FFAPI.address.methods.UpdateCities($('#CountryID').val(), $(this).val());
                $("#CityList").attr('disabled', false).trigger("chosen:updated");
            }
        }
        FFAPI.address.methods.validateField($(this), "StateDD");
    });

    $('body').off("change", '#CityList').on("change", '#CityList', function () {
        if ($(this).val() == "-1") {
            FFAPI.address.cleanCities();
        } else {
            $("#CityDD").val($(this).val());
            $("#City").val($.trim($("#CityList option:selected").text()));
        }
    });
};

FFAPI.address.methods.bindCities = function () {
    //var cityList = $("#CityList");
    //cityList.chosen("destroy");
    //$("#StateList").chosen("destroy");
    //$("#CountryList").chosen("destroy");

    ////Desabilitar Cidades
    //if (cityList.val() === "-1") {
    //    cityList.attr('disabled', true).trigger("chosen:updated");
    //}


    return false;
}

//chamada ajax para a Action UpdateCities
//passando como parâmetro a Estado selecionado
FFAPI.address.methods.UpdateCities = function (param1, param2) {
    $("#CityDD").val("");
    $("#City").val("");
    var params = {};
    params.id = param1;
    params.value = param2;
    $.getJSON(FFAPI.address.variables.cityAction, $.param(params, true), FFAPI.address.methods.listCitiesCallBack);
}

//função que irá ser chamada quando terminar
//a chamada ajax
FFAPI.address.methods.listCitiesCallBack = function (json) {
    //Limpar os itens que são maiores que 0
    //Ou seja: não retirar o primeiro item
    $("#CityList :gt(0)").remove();
    $("#CityList").chosen();
    $(json).each(function () {
        //adicionando as opções de acordo com o retorno
        $("#CityList").append("<option value='" + this.id + "'>" + this.value + "</option>");
    });
    if (typeof FFAPI.address.variables.billingSameAsShippingAddressCityDD === "undefined") {
        $("#CityList").trigger("chosen:updated");
    }
    else {
        $("select#CityList").val(FFAPI.address.variables.billingSameAsShippingAddressCityDD).trigger('chosen:updated');
        delete FFAPI.address.variables.billingSameAsShippingAddressCityDD;
    }
}

//chamada ajax para a Action UpdateStates
//passando como parâmetro a Pais selecionado
FFAPI.address.methods.UpdateStates = function (uf) {
    $.getJSON(FFAPI.address.variables.stateAction + '/' + uf, FFAPI.address.methods.listStatesCallBack);
}
//função que irá ser chamada quando terminar
//a chamada ajax
FFAPI.address.methods.listStatesCallBack = function (json) {
    //Limpar os itens que são maiores que 0
    //Ou seja: não retirar o primeiro item
    $("#StateList :gt(0)").remove();
    $("#StateList").chosen();
    $(json).each(function () {
        //adicionando as opções de acordo com o retorno
        $("#StateList").append("<option value='" + this.id + "'>" + this.value + "</option>");
    });
    if (typeof FFAPI.address.variables.billingSameAsShippingAddressStateDD === "undefined") {
        $("#StateList").trigger("chosen:updated");

        $("#StateDD").val("");
        $("#StateName").val("");
    }
    else {
        $("select#StateList").val(FFAPI.address.variables.billingSameAsShippingAddressStateDD).trigger('chosen:updated');
        delete FFAPI.address.variables.billingSameAsShippingAddressStateDD;
        if (typeof FFAPI.address.variables.billingSameAsShippingAddressCityDD !== "undefined") {
            $("#StateList").trigger("change");
        }
    }
}

//chamada ajax para a Action UpdateCities
//passando como parâmetro a Estado selecionado
FFAPI.address.methods.UpdateCities = function (param1, param2) {
    FFAPI.address.cleanCities();
    var params = {};
    params.id = param1;
    params.value = param2;
    $.getJSON(FFAPI.address.variables.cityAction, $.param(params, true), FFAPI.address.methods.listCitiesCallBack);
}

//função que irá ser chamada quando terminar
//a chamada ajax
FFAPI.address.methods.listCitiesCallBack = function (json) {
    //Limpar os itens que são maiores que 0
    //Ou seja: não retirar o primeiro item
    $("#CityList :gt(0)").remove();
    $("#CityList").chosen();
    $(json).each(function () {
        //adicionando as opções de acordo com o retorno
        $("#CityList").append("<option value='" + this.id + "'>" + this.value + "</option>");
    });
    if (typeof FFAPI.address.variables.billingSameAsShippingAddressCityDD === "undefined") {
        $("#CityList").trigger("chosen:updated");
    }
    else {
        $("select#CityList").val(FFAPI.address.variables.billingSameAsShippingAddressCityDD).trigger('chosen:updated');
        delete FFAPI.address.variables.billingSameAsShippingAddressCityDD;
    }
}

FFAPI.address.methods.maskUserAddressesBR = function () {
    $("#DDD").mask("99");
    $("#Zip").mask("99999-999");
    $("#CPF").mask("999.999.999-99");
}

FFAPI.address.methods.unmaskUserAddressesBR = function () {
    $("#DDD").unmask();
    $("#Zip").unmask();
    $("#CPF").unmask();
}

FFAPI.address.methods.validateField = function (element, elementId) {
    var jQthis = $(element);
    var elementValidation = jQthis.closest("form").validate();
    var id = jQthis.attr("id");

    elementValidation.element($("#" + elementId));
    jQthis.siblings('.form-validator_error').show();
};
//ADD ADDRESS PAGE

//CLICKSTREAM 

$(".checkout-mainContent-boxModule-addNewAddress").click(function () {
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(159); }
});

var initialBoxHeight = $(".checkout-mainContent-boxModule").outerHeight();
$(".showAddress").bind("click", function (e) {
    e.preventDefault();
    var jQThis = $(this),
        shown = jQThis.prev(),
        hidden = jQThis.next(),
        hiddenHeight = hidden.outerHeight(),
        totalHeight = initialBoxHeight + hiddenHeight,
        currentBoxHeight = $(".checkout-mainContent-boxModule").outerHeight();

    shown.html(shown.html() + hidden.html()).css("word-break", "break-word");
    jQThis.remove();
    hidden.remove();
    if (totalHeight > currentBoxHeight) {
        jQThis.find(".checkout-mainContent-boxModule").css("height", totalHeight);
    }
    return false;
});

/**
 * Used to enable/disable the continue button
 * The targetForm parameter, set's the form ID that the button will use to submit the form
 */
FFAPI.address.methods.setContinueEnabled = function (state, targetForm) {
    if (state) {
        $("#summaryWrapper button.js-btnContinue").data('target-form', targetForm);
        $('#summaryWrapper button.js-btnContinue').slideDown();
    } else {
        $('#summaryWrapper button.js-btnContinue').slideUp();
    }
};

/* China Address */
FFAPI.address.methods.ArrangeFormFields = function (countryId) {

    /* Change order of cities and states dropdowns */
    if ($('#divCities') && $('#divStates')) {
        if (countryId == '42') { /* CHINA */
            $('#divStates').insertBefore('#divCities');
        } else {
            $('#divCities').insertBefore('#divStates');
        }
    }

    /* Change label for states dropdown */
    if ($('#lblStates') && $('#lblProvinces')) {
        if (countryId == '42') { /* CHINA */
            $('#lblStates').hide();
            $('#lblProvinces').show();
        } else {
            $('#lblStates').show();
            $('#lblProvinces').hide();
        }
    }

    /* Change default option for states dropdown */
    if ($('#StateList') && $('#txtDefaultOptionState') && $('#txtDefaultOptionProvince')) {
        if (countryId == '42') { /* CHINA */
            $('select[id=StateList] > option:first-child')
                .text($('#txtDefaultOptionProvince').val());
        } else {
            $('select[id=StateList] > option:first-child')
                .text($('#txtDefaultOptionState').val());
        }
    }
}

/* MultiChannel */
$('.js-checkout-mcAccordionTarget-mc').click(function () {
    var jQThis = $('.js-checkout-mc-selectedMcAddress');
    if (jQThis.length > 0) {
        FFAPI.address.methods.setContinueEnabled(true, 'ClickCollectShippingForm');
    } else {
        FFAPI.address.methods.setContinueEnabled(false);
    }
});

$('.js-checkout-mcAccordionTarget-Address').click(function () {
    $('#IsClickAndCollect').val(false);
    FFAPI.address.methods.setContinueEnabled(true, 'AddressForm');
});

FFAPI.address.variables.isGuestRegistration = false;

/* Multichannel Search results - Select Address  */
$(FFAPI.variables.bodyElement).on('click', '.js-checkout-mc-fauxTable-selectBtn-action', function () {
    var jQThis = $(this);
    var span = jQThis.find('span');
    var storeId = span.data('store-id');
    var addressId = span.data('addr-id');
    if (FFAPI.address.variables.isGuestRegistration) {
        /* Set form input values*/
        $('#ClickCollectStoreId').val(storeId);
        $('#CollectPoint').val(addressId);
        $('.IsClickAndCollect').val(true);

        /* Show selected store details (name and address) */
        if (FFAPI.methods.maps.isMapVisible()) {
            var storeName = jQThis.siblings('.js-map-store-name').text();
            var storeAddress = jQThis.siblings('.js-map-store-address').text();
        }
        else {
            var storeName = jQThis.find('.js-store-name').val();
            var storeAddress = jQThis.find('.js-store-addr1').val();
        }
        $('#js-mc-address').html(storeName + '<br>' + storeAddress);
        FFAPI.address.methods.setContinueEnabled(true, 'ClickCollectShippingForm');
    } else {
        $('#clickCollectAddrId').val(addressId);
        $('#ClickCollectShippingForm').submit();
    }
    // Clickstream
    if (typeof (_fftrkobj) !== "undefined") {
        var tid = 274;
        if (FFAPI.methods.maps.isMapVisible()) {
            tid = 275;
        }
        _fftrkobj.track({ tid: tid, val: storeId });
    }
});

