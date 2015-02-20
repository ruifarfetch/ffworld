require(['plu_domReady'], function () {

    //-----------
    // Variables
    //-----------
    var

    // Class
    accordionAccount = FFAPI.plugins.accordion.get(document.getElementById('accordion-account')),
    id_prefix = 'account-';
    //---------------------

    function hashHandler(refName) {

        if(!accordionAccount) return;

        var accordionItem = document.getElementById(id_prefix + refName);

        // Slide down accordion item
        accordionAccount.slideDown(accordionItem);

        // Scroll to accordion item
        FFAPI.plugins.scroll.to(accordionItem, 0);
    }

    // On hash change
    window.onhashchange = function () {
        hashHandler(FFAPI.methods.urlHash());
    };

    // On page load
    var hash = FFAPI.methods.urlHash();
    if(hash) { hashHandler(hash); }

    ///IE8 Buttons Fix
    if (ffbrowser.isIE8 === true) {
        $("a > button").on('click', function () {
            location.href = $(this).closest("a").attr("href");
        });
    }

    if (!Modernizr.input.placeholder) {
        $('input').placeholder();
    }

    /*Click Colect Returns*/
    var return_steps = $('.returns-steps'),
        return_arrow = $('.returns-steps-address .arrow_right'),
        returns_steps_last = $('.returns-steps-date');

    $('.account-returns-type-options label').on( "click", function() {
        if($('.account-returns-type-option-InStore input:radio').is(':checked')) { 
            return_steps.addClass('returns-steps_inStore');
            returns_steps_last.addClass('hide');
            return_arrow.addClass('hide');
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
            return_arrow.removeClass('hide');

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

            var returns_steps_delay = setTimeout(function(){
                returns_steps_last.removeClass('hide');
            }, 350);

        }

    });


    var details = $(".account-details");
    detailsEditLink = $(".account-details-editLink"),
    detailsCancelLink = $(".account-details-cancelFormLink"),
    detailsEditsForm = $(".account-details-edit"),
    addressAddCTA = $(".account-address-addCTA"),
    addressEditLink = $(".account-address-editLink"),
    addressEditForm = $(".account-address-edit"),
    addressAddForm = $(".account-address-add"),
    orders = $(".account-orders>tbody>tr"),
    refer = $(".account-refer>tbody>tr"),
    credits = $(".account-credits>tbody>tr");
    var body = $('body');


    /*Details*/
    body.on('click', ".account-details-editLink", function () {
        FFAPI.methods.trackingClickstream("246");
        $(".account-details-edit").show();
        $(".account-details").hide();
    });
    body.on('click', ".account-details-cancelFormLink", function () {
        $(".account-details").show();
        $(".account-details-edit").hide();
    });

    /*Address Book*/
    body.on('click', ".account-address-addCTA", function (e) {
        $(this).hide();
        $(".account-address-edit").remove();
        FFAPI.methods.trackingClickstream("247");
        $.ajax({
            "url": window.universal_variable.page.subfolder + "/myaccount/GetFormAddressEdit",
            "type": "POST",
            "cache": false,
            "data": {
                "addressId": 0
            },
            "success": function (data) {
                var wrapper = $('#add-address-wrapper');
                wrapper.html(data);
                $('html,body').animate({ scrollTop: wrapper.offset().top }, 500);
                FFAPI.account.methods.BindsOnAddressForm(wrapper);
                $(".account-address-add").slideDown();
            },
            "error": function (data) {
                return false;
            }
        });


        e.preventDefault();
    });
    body.on('click', ".account-address-editLink", function (e) {
        var addressId = $(this).data("addressid");
        FFAPI.methods.trackingClickstream("248");
        $.ajax({
            "url": window.universal_variable.page.subfolder + "/myaccount/GetFormAddressEdit",
            "type": "POST",
            "cache": false,
            "data": {
                "addressId": addressId
            },
            "success": function (data) {

                $('.account-address-edit').remove();
                var wrapper = $('#edit-address-wrapper-' + addressId);
                wrapper.html(data);
                wrapper.find('.account-address-edit').show();
                $('html,body').animate({ scrollTop: wrapper.offset().top }, 500);

                FFAPI.account.methods.BindsOnAddressForm(wrapper);
            },
            "error": function (data) {
                return false;
            }
        });


        e.preventDefault();

        // Go get the form for edition to myaccountcontroller



    });
    body.on('click', ".account-address-cancelFormLink", function (e) {
        $(".account-address-addCTA").show();
        $(".account-address-add").slideUp();
        var editForm = $(this).closest(".account-address-edit");
        editForm.slideUp(function () { $(this).remove(); });
        var addressinfo = $(this).closest(".edit-address-wrapper").siblings(".address-info-wrapper");
        $('html,body').animate({ scrollTop: addressinfo.offset().top - 10 }, 500);
        e.preventDefault();
    });
    body.on('click', ".account-address-deleteLink", function (e) {
        var jQthis = $(this),
            addressId = jQthis.data("addressid");
        FFAPI.methods.trackingClickstream("249");
        $.ajax({
            "url": window.universal_variable.page.subfolder + "/myaccount/DeleteAddress",
            "type": "POST",
            "cache": false,
            "data": {
                "addressId": addressId
            },
            "success": function (data) {
                if (data == "True") {
                    jQthis.closest('.field .mb10').slideUp().remove();
                }
            },
            "error": function (data) {
                return false;
            }
        });


        e.preventDefault();

    });

    body.on('click', '.label-radio', function (e) {
        var jQthis = $(this),
            addressId = jQthis.data("addressid");
        FFAPI.account.methods.SetDefaultShippingAddress(addressId);
    });


    body.on('click', "#OldReferFriend", function (e) {
        $(".oldReferWrapper").slideToggle();
    });    

    /*BEGIN - Toggle results*/

    body.on('click', "#creditWrapper .account-showAll", function (e) {
        if ($(this).hasClass('triggered')) {
            toggleResults(credits, 4);
            $(this).removeClass('triggered');
        } else {
            credits.show();
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("259"); }
            $(this).addClass('triggered');
        }
        e.preventDefault();
    });

    body.on('click', "#orderWrapper .account-showAll", function (e) {
        if ($(this).hasClass('triggered')) {
            toggleResults(orders, 5);
            $(this).removeClass('triggered');
        } else {
            orders.show();
            $(this).addClass('triggered');
        }
        e.preventDefault();
    });

    body.on('click', "#referFriendWrapper .account-showAll", function (e) {
        if ($(this).hasClass('triggered')) {
            toggleResults(refer, 4);
            $(this).removeClass('triggered');
        } else {
            refer.show(); orders.show();
            $(this).addClass('triggered');
        }
        e.preventDefault();
    });

    function toggleResults(row, elements) {
        row.slice(row.length - (row.length - elements), row.length).hide();
    }

    toggleResults(orders, 5);
    toggleResults(refer, 4);
    toggleResults(credits, 4);

    /*END - Toggle results*/

});

/*Returns slider on last step*/
var carouselReturns = $('.js-sliderCarouselReturns');
if (FFAPI.responsive.mediaQuerieXS.matches) {
    carouselReturns.bxSlider({
        minSlides: 1,
        controls: false
    });
}


/*DEV SIDE*/

//INIT VARIABLES

FFAPI.account = FFAPI.account || {};
FFAPI.account.methods = FFAPI.account.methods || {};
FFAPI.account.variables = FFAPI.account.variables || {};


////////////////////////////////////////////
/**************    DETAILS    *************/
////////////////////////////////////////////

//BINDS

FFAPI.account.methods.BindsOnDetailsRefresh = function () {

    $('.selectForm').chosen();

    if ($("#DetailHasErrors").val() == "True") {
        $(".account-details-edit").show();
        $(".account-details").hide();
    }

    FFAPI.account.methods.ChangeDayDetailForm();
}

$("select[name='birthMonth'], select[name='birthYear'] ").on('change', function () {
    FFAPI.account.methods.ChangeDayDetailForm();
});

//METHODS
FFAPI.account.methods.ChangeDayDetailForm = function () {
    var selectedDay = $("select[name='birthDay']"),
       selectedYear = $("select[name='birthYear']"),
       selectedMonth = $("select[name='birthMonth']"),
       d = new Date(selectedYear.val(), selectedMonth.val(), 0),
       numberOfDays = d.getDate();

    if ((selectedDay).val() != "") {
        var oldSelectedDay = (selectedDay).val();
    }

    selectedDay.find("option:gt(0)").remove();
    for (i = 1 ; i <= numberOfDays; i++) {
        selectedDay.append($('<option></option').val(i).html(i));
    }

    if (oldSelectedDay) {
        if (oldSelectedDay > numberOfDays) {
            selectedDay.val("");
        } else {
            selectedDay.val(oldSelectedDay);
        }

    }
    selectedDay.trigger("chosen:updated");
}

//Apply methods when everything is ready
FFAPI.account.methods.ChangeDayDetailForm();


////////////////////////////////////////////
/**************    ADDRESS    *************/
////////////////////////////////////////////

//BINDS

FFAPI.account.methods.BindsOnAddressForm = function (wrapper) {
    wrapper.find('.selectForm').chosen();

    var countryID = $('#CountryID').val();

    if (countryID == 216 || countryID == 36) {
        FFAPI.account.methods.showStatesDropDown(true);
    } else if (countryID == 42) {
        FFAPI.account.methods.showStatesDropDown(true);
        FFAPI.account.methods.showCitiesDropDown(true);
    }

    $.validator.unobtrusive.parse(document);
    FFAPI.account.methods.TryActivateBrazil();

    if (!Modernizr.input.placeholder) {
        $('input').placeholder();
    }

    var countryID = $('#CountryID').val();
    FFAPI.account.methods.ArrangeFormFields(countryID);
}

FFAPI.account.methods.OnSaveUserAddressComplete = function (selector) {
    var resultWrapper = $("#" + selector);
    var successAddress = resultWrapper.find("address");
    if (successAddress.length > 0) {
        var addressInfo = resultWrapper.siblings(".address-info-wrapper");
        addressInfo.find("address").html(successAddress.html());
        resultWrapper.siblings(".edit-address-wrapper").html("");
        $('html,body').animate({ scrollTop: addressInfo.offset().top }, 500);
    }
    else {
        var onErrorForm = resultWrapper.find(".account-address-edit");
        if (onErrorForm.length > 0) {
            var resultReplaced = resultWrapper.siblings(".edit-address-wrapper");
            resultReplaced.html(onErrorForm.html());
            FFAPI.account.methods.BindsOnAddressForm(resultReplaced);
        }
    }
};

FFAPI.account.methods.OnAddUserAddressComplete = function () {
    var resultWrapper = $("#add-address-wrapper-result");

    var onErrorForm = resultWrapper.children(".account-address-add");
    var resultReplaced = $("#add-address-wrapper");
    if (onErrorForm.length > 0) {
        resultReplaced.html(onErrorForm.html());
        FFAPI.account.methods.BindsOnAddressForm(resultReplaced);
    } else {
        var successAdd = resultWrapper.html();
        $("#addressBookWrapper").html(successAdd);

        
        $('.label-check, .label-radio').checkradio();
        
    }
};

//METHODS
FFAPI.account.methods.SetDefaultShippingAddress = function (addressId) {
    $.ajax({
        "url": window.universal_variable.page.subfolder + "/myaccount/SetDefaultShippingAddress",
        "type": "POST",
        "cache": false,
        "data": {
            "addressID": addressId
        },
        "success": function (data) {
        }
    });
}

FFAPI.account.methods.showStatesDropDown = function (visible) {
    if (visible) {
        var statesSelect = $('#StateList');
        if (statesSelect.data('chosen') == undefined) {
            statesSelect.chosen();
        }
        $('#stateDropDown').removeClass('hide').show();
        $('#stateInput').addClass('hide');
        $("[id$=HasStateDropDown]").attr("checked", "checked");

    } else {
        $('#stateDropDown').addClass('hide');
        $('#stateInput').removeClass('hide');
        $("[id$=HasStateDropDown]").removeAttr("checked");
    }
};

FFAPI.account.methods.cleanStates = function () {
    $("#StateDD").val('');
    $("#StateName").val('');
};

FFAPI.account.methods.showCitiesDropDown = function (visible) {
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

FFAPI.account.methods.cleanCities = function () {
    $("#CityDD").val('');
    $("#City").val('');
};

FFAPI.account.methods.AddressBindings = function (editMode) {
    $('body').on("change", "#countryList", function () {
        $('#CountryID').val($(this).val());
        $('#Country').val($.trim($("#countryList option:selected").text()));
        FFAPI.account.methods.cleanStates();
        FFAPI.account.methods.cleanCities();

        if ($(this).val() == 216 || $(this).val() == 36 || $(this).val() == 28 || $(this).val() == 42) {
            FFAPI.account.methods.showStatesDropDown(true);
            FFAPI.account.methods.UpdateStates($(this).val());

            $("[id$=HasStateDropDown]").attr("checked", "checked");
            if ($(this).val() == 28) {
                FFAPI.account.methods.showCitiesDropDown(true);
                $('#billingAddressCity').addClass('hide');
                $('.billBR').removeClass('hide');
                FFAPI.account.methods.maskUserAddressesBR();
            } else if ($(this).val() == 42) {
                FFAPI.account.methods.showCitiesDropDown(true);
                $('#billingAddressCity').removeClass('hide');
                $('.billBR').addClass('hide');
            } else {
                FFAPI.account.methods.showCitiesDropDown(false);
                $('#billingAddressCity').removeClass('hide');
                $('.billBR').addClass('hide');
            }
        }
        else {
            FFAPI.account.methods.showStatesDropDown(false);
            FFAPI.account.methods.showCitiesDropDown(false);

            $('#billingAddressCity').show();
            $('.billBR').addClass('hide');
            if ($(this).val() == -1) {
                $('#CountryID').val("");
            } else {
                $("[id$=HasStateDropDown]").removeProp("checked");
            }
        }

        var jQthis = $(this);
        var elementValidation = jQthis.closest("form").validate();
        elementValidation.element($("#CountryID"));

        FFAPI.account.methods.ArrangeFormFields($(this).val());
    });

    $('body').on("change", "#StateList", function () {
        $("#CityDD").val("");
        $("#CityList").val("-1").attr('disabled', true).trigger("chosen:updated");

        if ($(this).val() == "-1") {
            $("#StateDD").val("");        
            $("#StateName").val("");   
        } else {
            $("#StateDD").val($(this).val());
            $("#StateName").val($.trim($("#StateList option:selected").text()));
            if ($('#citiesDropDown').is(":visible")) {
                FFAPI.account.methods.UpdateCities($('#CountryID').val(), $(this).val());
                $("#CityList").attr('disabled', false).trigger("chosen:updated");
            }
        }
        FFAPI.account.methods.validateField($(this), "StateDD");
    });

    $('body').on("change", '#CityList', function () {
        if ($(this).val() == "-1") {
            $("#CityDD").val("");
            $("#City").val("");
        } else {
            $("#CityDD").val($(this).val());
            $("#City").val($.trim($("#CityList option:selected").text()));
        }
        FFAPI.account.methods.validateField($(this), "CityDD");
    });
};

FFAPI.account.methods.UpdateCities = function (param1, param2) {
    var params = {};
    params.id = param1;
    params.value = param2;
    $.getJSON(window.universal_variable.page.subfolder + "/myaccount/UpdateCities/", $.param(params, true), FFAPI.account.methods.listCitiesCallBack);
};

FFAPI.account.methods.listCitiesCallBack = function (json) {
    //Limpar os itens que são maiores que 0
    //Ou seja: não retirar o primeiro item
    $("#CityList :gt(0)").remove();
    $(json).each(function () {
        //adicionando as opções de acordo com o retorno
        $("#CityList").append("<option value='" + this.id + "'>" + this.value + "</option>");
    })
    $("#CityList").trigger('chosen:updated');
};

FFAPI.account.methods.UpdateStates = function (uf) {
    $.getJSON(window.universal_variable.page.subfolder + "/myaccount/UpdateStates/" + uf, FFAPI.account.methods.listStatesCallBack);
};

FFAPI.account.methods.listStatesCallBack = function (json) {
    //Limpar os itens que são maiores que 0
    //Ou seja: não retirar o primeiro item
    $("#StateList :gt(0)").remove();

    $(json).each(function () {
        //adicionando as opções de acordo com o retorno
        $("#StateList").append("<option value='" + this.id + "'>" + this.value + "</option>");
    });
    $("#StateList").trigger('chosen:updated');
    $("#StateDD").val("");
    $("#StateName").val("");
};

FFAPI.account.methods.maskUserAddressesBR = function () {
    require(['plu_maskedinput'], function () {
        $("#DDD").mask("99");
        $("#Zip").mask("99999-999");
        $("#CPF").mask("999.999.999-99");
    });

};

FFAPI.account.methods.unmaskUserAddressesBR = function () {
    require(['plu_maskedinput'], function () {
        $("#DDD").unmask();
        $("#Zip").unmask();
        $("#CPF").unmask();
    });
};

FFAPI.account.methods.validateField = function (element, elementId) {
    var jQthis = $(element);
    var elementValidation = jQthis.closest("form").validate();
    var id = jQthis.attr("id");

    elementValidation.element($("#" + elementId));
    jQthis.siblings('.form-validator_error').show();
};

FFAPI.account.methods.TryActivateBrazil = function () {
    var brazilEnabled = $("#BrAddressBookEnabled").val();

    if (brazilEnabled) {

        $("[id$=HasStateDropDown]").attr("checked", "checked");
        $("[id$=HasStateDropDown]").prop("checked", "checked");
        $("[id$=HasCityDropDown]").attr("checked", "checked");
        $("[id$=HasCityDropDown]").prop("checked", "checked");
        if ($("#StateList").val() == "-1") {
            $("#CityList").val("-1").attr('disabled', true).trigger("chosen:updated");
        }
        FFAPI.account.methods.maskUserAddressesBR();
    }
};

//METHODS TO RUN 

FFAPI.account.methods.AddressBindings(true);



////////////////////////////////////////////
/**************    ORDERS     *************/
////////////////////////////////////////////

//BINDS

$(".orderModal").on('click', function () {
    var jQthis = $(this);
    var orderCode = jQthis.data('ordercode');
    var wrapperToReplace = jQthis.data('target');
    if (orderCode != "") {
        var returnButton = jQthis.parent().parent().find("a[data-orderreturnbutton='" + wrapperToReplace + "']");
        FFAPI.account.variables.returnButtonHtml = returnButton.length > 0 ? returnButton[0].outerHTML : "";
        FFAPI.account.methods.GetOrderInformation(orderCode, wrapperToReplace);
    }
});

//METHODS

FFAPI.account.methods.GetOrderInformation = function (orderCode, wrapperToReplace) {

    $.ajax({
        "url": window.universal_variable.page.subfolder + "/myaccount/GetOrderInformation",
        "type": "POST",
        "cache": false,
        "data": {
            "ordercode": orderCode
        },
        "success": function (data) {
            var wrapper = $(wrapperToReplace);
            wrapper.find(".modal-content").html(data);
            if (FFAPI.account.variables.returnButtonHtml != "") {
                wrapper.find(".returnButtonWrapper").html(FFAPI.account.variables.returnButtonHtml);
            }
        },
        "error": function (data) {
            return false;
        }
    });
}


////////////////////////////////////////////
/**************    VOUCHER    *************/
////////////////////////////////////////////

//BINDS

//METHODS

FFAPI.account.methods.GetCreditsInfo = function () {
    $.ajax({
        "url": window.universal_variable.page.subfolder + "/myaccount/GetCreditsInfo",
        "type": "POST",
        "cache": false,
        "success": function (data) {
            $("#creditWrapper").html(data);
        }
    });
}

////////////////////////////////////////////
/************* REFER A FRIEND *************/
////////////////////////////////////////////

//BINDS

//METHODS


//CLICKSTREAM BINDINGS 
FFAPI.methods.trackingClickstream = function (id) {
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(id); }
};

$(".detailsAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("260"); });
$(".addressAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("261"); });
$(".ordersAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("262") });
$(".giftvouchersAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("263"); });
$(".referafriendAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("264"); });
$(".creditsAccordion .js-accordion-title").on('click', function () { FFAPI.methods.trackingClickstream("265"); });
$("#addVoucherCodeButton").on('click', function () { FFAPI.methods.trackingClickstream("250"); });

/* China Address */

FFAPI.account.methods.ArrangeFormFields = function (countryId) {

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
};


