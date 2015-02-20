/**
* This module contains global methods for the checkout
* @module CHECKOUT
*/
/**
    Checkout javaScript file. It contains the function to make the checkout work on desktop and mobile
    @deprecated pages/
    @class checkout.js
    **/

    
    var body = $('body');
    if ($('.no-touch .sliderTabs-slide').length > 0) { 
    $('.no-touch .sliderTabs-slide').rollover({});
    }
    
        tooltips();
$(".checkout-text-input").tipsy({ trigger: 'focus', gravity: 'w', html: 'true' });
   
    require(['plu_fixto'], function () {
        if (ffbrowser.isIE8 === false && window.innerWidth > 1024) {
            $('.sticky').fixTo('.sticky-holder', {
                mind: 'header'
            });
        }
    });

    /*get width on different browser support*/
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    FFAPI.variables.checkout = FFAPI.variables.checkout || {};

    /**
    list items change size/quantity
    */

    /*quantity*/
    body.on('click', '.js-checkout-display-quantity-btn', function () {

            FFAPI.variables.checkout.display_selectQuantity_container = document.querySelectorAll('.js-checkout-display-selectQuantity-container'),
            FFAPI.variables.checkout.display_selectQuantity = document.querySelectorAll('.js-checkout-display-selectQuantity'),
            FFAPI.variables.checkout.display_quantity = document.querySelectorAll('.js-checkout-display-quantity'),
            jQThis = $(this);

        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).next(FFAPI.variables.checkout.display_selectQuantity).show();
        jQThis.hide();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).find(FFAPI.variables.checkout.display_quantity).hide();
        jQThis.next('.js-checkout-display-quantity-btn-cancel').show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).addClass('pt10');
    });

    body.on('click', '.js-checkout-display-quantity-btn-cancel', function () {

            FFAPI.variables.checkout.display_selectQuantity_container = document.querySelectorAll('.js-checkout-display-selectQuantity-container'),
            FFAPI.variables.checkout.display_selectQuantity = document.querySelectorAll('.js-checkout-display-selectQuantity'),
            FFAPI.variables.checkout.display_quantity = document.querySelectorAll('.js-checkout-display-quantity'),
            jQThis = $(this);

        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).next(FFAPI.variables.checkout.display_selectQuantity).hide();
        jQThis.hide();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).find(FFAPI.variables.checkout.display_quantity).show();
        jQThis.prev('.js-checkout-display-quantity-btn').show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).next('.js-checkout-display-quantity').show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectQuantity_container).removeClass('pt10');
    });


    /*size*/
    body.on('click', '.js-checkout-display-size-btn', function () {
            FFAPI.variables.checkout.display_selectSize_container = document.querySelectorAll('.js-checkout-display-selectSize-container'),
            FFAPI.variables.checkout.display_selectSize = document.querySelectorAll('.js-checkout-display-selectSize'),
            FFAPI.variables.checkout.display_size = document.querySelectorAll('.js-checkout-display-size'),
            jQThis = $(this);

        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).next(FFAPI.variables.checkout.display_selectSize).show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).find(FFAPI.variables.checkout.display_size).hide();
        jQThis.hide();
        jQThis.next('.js-checkout-display-size-btn-cancel').show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).addClass('pt10');
    });

    body.on('click', '.js-checkout-display-size-btn-cancel', function () {
            FFAPI.variables.checkout.display_selectSize_container = document.querySelectorAll('.js-checkout-display-selectSize-container'),
            FFAPI.variables.checkout.display_selectSize = document.querySelectorAll('.js-checkout-display-selectSize'),
            FFAPI.variables.checkout.display_size = document.querySelectorAll('.js-checkout-display-size'),
            jQThis = $(this);

        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).next(FFAPI.variables.checkout.display_selectSize).hide();
        jQThis.hide();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).find(FFAPI.variables.checkout.display_size).show();
        jQThis.prev('.js-checkout-display-size-btn').show();
        jQThis.parent().find(FFAPI.variables.checkout.display_selectSize_container).removeClass('pt10');
    });


    /**
    sign in page
    */
            
    $(".checkout-signIn-remember").click(function () {
    if ($(this).find(".label-check_active").length > 0) {
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(149); }
        }
    });


    /*select address page*/
    $('.checkout-main-content-address .checkout-mainContent-boxModule').on('click', function () {
        var jQThis = $(this);
        var jQThisLabel = jQThis.find("label");

        if (!$(this).hasClass('checkout-mainContent-boxModule-addNewAddress')) {

            $(".checkout-mainContent-boxModule").removeClass("checkout-mainContent-boxModule_active");
            $(".checkout-mainContent-boxModule").find("label").removeClass('label-check_active').find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
            $('.js-checkout-selectShippingAddress-shipMobBtn').hide();

            jQThis.addClass("checkout-mainContent-boxModule_active");
            jQThisLabel.addClass('label-check_active');
            jQThisLabel.find('input[type=radio]').prop('checked', true);
            jQThisLabel.find('span').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');

            if (window.innerWidth < 480) {
                jQThis.find('.js-checkout-selectShippingAddress-shipMobBtn').show();
            }
        }
    });

    if (window.innerWidth > 480) {
        $('.js-checkout-selectShippingAddress-shipMobBtn').hide();
    } else {
        $('.checkout-mainContent-boxModule_active').find('.js-checkout-selectShippingAddress-shipMobBtn').show();
    }


    $(window).smartresize(function () {
        if (window.innerWidth > 480) {
            $('.js-checkout-selectShippingAddress-shipMobBtn').hide();
        } else {
            $('.checkout-mainContent-boxModule_active').find('.js-checkout-selectShippingAddress-shipMobBtn').show();
        }
    });


    /*payment page*/

    var payMethod_creditCard = $('.checkout-payMethod-Box-creditCard'),
        payMethod_creditCard_token = $('.checkout-payMethod-Box-creditCard')
    payMethod_creditCard_form = $('.js-checkout-paycreditcard-form'),
    payMethod_Paypal = $('.checkout-payMethod-Box-paypal-container'),
    payMethod_Paypal_form = $('.js-checkout-payMethod-tab-paypal-desc'),
    payMethod_PagSeguro = $('.checkout-payMethod-Box-pagSeguro-container'),
    payMethod_PagSeguro_form = $('.js-checkout-payMethod-tab-pagSeguro-desc'),
        checkout_sameAsShipping_continueBtn = $('.js-checkout-sameAsShipping-continueBtn'),




    // Same as shipping checkbox toggle
    $('.js-checkout-sameShipping-container').click(function () {
        $('.js-checkout-sameAsShipping-form').slideToggle();
        $('.js-checkout-sameAsShipping-addressBox').fadeToggle();
        $('.js-checkout-sameAsShipping-addNewAddressBox').fadeToggle();
        $('.js-checkout-sameAsShipping-creditCard').slideToggle();
        $('.js-checkout-sameAsShipping-continueBtn').slideToggle();
    });


    // Click on Credit Card Tab   
    payMethod_creditCard.on('click', function () {
        payMethod_Paypal.find('span:first').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_PagSeguro.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_PagSeguro_form.hide();
        payMethod_creditCard.find('span:first').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');
        payMethod_creditCard_form.slideDown();

    });

    // Credit Card Tokenization open default
    if ($('.js-checkout-payMethod-Box-creditCard-tokenization').length > 0) {
        payMethod_creditCard_form.slideDown();
    }

    // Click on Credit Card Tokenization   
    payMethod_creditCard_token.on('click', function () {
        payMethod_Paypal.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_Paypal_form.hide();
        payMethod_PagSeguro.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_PagSeguro_form.hide();

    if (!$('.js-mc-hasBilling').length) {
        mc_payment_continue_btn.hide();
        }

        payMethod_creditCard.find('span').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');
        payMethod_creditCard_form.slideDown(function () {
            $('.radioTokenCard:checked').closest('.js-checkout-mainContent-boxModule-payment-token:visible').click();
        });
        checkout_sameAsShipping_continueBtn.show();
        
    });


    // Click on Paypal Tab
    payMethod_Paypal.on('click', function () {
        payMethod_creditCard.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_creditCard_form.slideUp();
        payMethod_PagSeguro.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_PagSeguro_form.hide();
        payMethod_Paypal.find('span').removeClass('icon-radio-unchecke').addClass('glyphs icon-radio-checked');
        mc_payment_continue_btn.show();
        payMethod_Paypal_form.show();
        checkout_sameAsShipping_continueBtn.show().addClass('pt10');
        


    });

    // BR ONLY Click on PagSeguro Tab
    payMethod_PagSeguro.on('click', function () {
        payMethod_creditCard.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_creditCard_form.slideUp();
        payMethod_Paypal.find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');
        payMethod_PagSeguro.find('span').removeClass('icon-radio-unchecke').addClass('glyphs icon-radio-checked');
        payMethod_PagSeguro_form.show();
        checkout_sameAsShipping_continueBtn.show();
    });

    //multichanel payment
    var mc_payment_continue_btn = $('.js-mc-payment-continue-btn'),
        mc_saveBilling = $('.js-mc-addBilling'),
        mc_creditCard_tab = $('.js-checkout-select-paymethod-container');

    mc_saveBilling.on('click', function () {
        mc_payment_continue_btn.show();
        mc_creditCard_tab.addClass('js-mc-hasBilling');

        $('html,body').animate({
        scrollTop: $(".teste").offset().top
        });

    });

    /*select payment page*/

    $(".checkout-mainContent-boxModule-selectPayment .checkout-mainContent-boxModule").click(function () {
        var jQThis = $(this);
        var jQThisLabel = jQThis.find("label:first");
        var regularBoxHeight = 218;


        if (!$(this).hasClass('checkout-mainContent-boxModule-addNewAddress')) {

            $(".checkout-mainContent-boxModule-selectPayment .checkout-mainContent-boxModule")
            .removeClass("checkout-mainContent-boxModule_active");

            $(".checkout-mainContent-boxModule-selectPayment .checkout-mainContent-boxModule")
            .find("label").removeClass('label-check_active')
            .find('span').removeClass('glyphs icon-radio-checked').addClass('icon-radio-unchecked');

            jQThis.addClass("checkout-mainContent-boxModule_active");
            $('.checkout-mainContent-boxModule').not(jQThis).find('.js-checkout-selectPayment-cvv-container').hide();
            if ($(this).find('.js-checkout-selectPayment-cvv-container').length) {
            jQThis.find('.js-checkout-selectPayment-cvv-container').show();
                if (window.innerWidth > 480) {
                    $('.checkout-mainContent-boxModule').addClass('checkout-selectPayment-cvv-container-boxHeight')
                }

            } else {
                
                if (window.innerWidth > 480) {
                    $('.checkout-mainContent-boxModule').removeClass('checkout-selectPayment-cvv-container-boxHeight')
                }
            }


            jQThisLabel.addClass('label-check_active');
            jQThisLabel.find('input[type=radio]').prop('checked', true);
            jQThisLabel.find('span:first').removeClass('icon-radio-unchecked').addClass('glyphs icon-radio-checked');

            var cardData = jQThis.find('[name="Detail.PaymentMethodDetails.TokenizationDetails.cardData"]').data();
            var cardId = jQThis.find('[name="Detail.PaymentMethodDetails.TokenizationDetails.Id"]').val();
            var cvv = jQThis.find('[name="Detail.PaymentMethodDetails.TokenizationDetails.CCV"]').val();
            if (cvv == undefined) {
                cvv = "";
            }
            $('#SelectedTokenId').val(cardId);
            $('#SelectedTokenCCV').val(cvv);
            //FFAPI.payment.methods.setContinueEnabled(true, 'formCreditCardToken');
            if (window.innerWidth < 480) {
                jQThis.find('.js-checkout-selectPayment-cvv-CTA').show();
            }


        }

    });


    if (window.innerWidth > 480) {
        $('.js-checkout-selectPayment-cvv-CTA').hide();
    } else {
        $('.checkout-mainContent-boxModule_active').find('.js-checkout-selectPayment-cvv-CTA').show();
    }


    $(window).smartresize(function () {
        if (window.innerWidth > 480) {
            $('.js-checkout-selectPayment-cvv-CTA').hide();
        } else {
            $('.checkout-mainContent-boxModule_active').find('.js-checkout-selectPayment-cvv-CTA').show();
        }
    });

    /*check if change country is russia*/

    $(".js-checkout-getcountry").change(function () {
        var getCountry = $(".js-checkout-getcountry").val();
        $('.js-checkout-countrySelect-tooltip ').css('display', 'inline');de
        if (getCountry == 'Russia') {
            $('.js-checkout-countrySelect-tooltip ').slideDown();
        } else {
            $('.js-checkout-countrySelect-tooltip ').slideUp();
        }

    });

    body.on('click', ".js-checkout-countrySelect_dismiss", function () {
        $('.js-checkout-countrySelect-tooltip ').slideUp('fast', function () {
            $('.js-checkout-countrySelect-tooltip ').css('display', '');
        });
    });


    /*confirmation page slider*/
    if ($('.js-checkout-turnToSlider-mobile').length > 0) {
        var checkoutTurnToSlider = $('.js-checkout-turnToSlider-mobile').bxSlider();
    if (checkoutTurnToSlider.length > 0) {
            if (width > 480) {
                checkoutTurnToSlider.destroySlider();
            }

            $(window).smartresize(function () {
                if (window.innerWidth < 480) {
                    checkoutTurnToSlider.reloadSlider({
                        minSlides: 1,
                        maxSlides: 1,
                        slideMargin: 0,
                        moveSlides: 1,
                    });
                } else {
                    if (window.innerWidth > 480) {
                        checkoutTurnToSlider.destroySlider();
                    }
                }
            });
        }
    }


    //clickstream checkout
    FFAPI.methods.checkoutSetEditBagClickstreamTag = function (clickstreamTag, clickstreamValue) {
        var item = $('#checkout_editbag');
        if (item != null) {
            item.attr(clickstreamTag, clickstreamValue);
        }
    };

    FFAPI.methods.onCompleteSubscribeStore = function (data) {
    if (data.responseJSON) {
            if (data.responseJSON.success == true) {
                $('#subscribeStoresContainer').html(data.responseJSON.message);
            } else {
                $('#subscribeStoresErrorContainer').html(data.responseJSON.message);
            }
        }
    };

    /**
    MC existing checkout accordion
    */

    $('.js-checkout-mcAccordionTarget-Address').click(function () {
        // Update summary box with default address costs
        FFAPI.address.methods.updateShippingAddressAjax($('#address').val());
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(269); }
    });


/*
*  maps .js
*/


    FFAPI.variables.maps = FFAPI.variables.maps || {},
    FFAPI.methods.maps = FFAPI.methods.maps || {},
    FFAPI.variables.maps.inputVal = $(".checkout-text-input"),
    FFAPI.variables.maps.searchBtn = $(".mc-search button"),
    FFAPI.variables.maps.mapsCanvas = $("#map-canvas");

    var activeWindow = null; 

FFAPI.methods.maps.loadPins = function (bounds, lat, lng, name, address, open) {
    var myLatlng = new google.maps.LatLng(lat, lng);
        var image = '/framework/static/images/pin.svg';

        var infoWindow = new google.maps.InfoWindow({
            content: "<div class='h5 mt10 mb10'>" + name + "</h5></div>" + address + "<div class='small color-medium-grey'>" + open + "</div><button class='js-checkout-mc-fauxTable-selectBtn-action mt10 mb10 button-black'>Select<span class='glyphs icon-thinArrow float-right'></span></button>"
            });

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: image
            });

            bounds.extend(marker.position);
            
    google.maps.event.addListener(marker, 'click', function () {

        if (activeWindow != null) {
            activeWindow.close();
                } 
                
        infoWindow.open(map, this);

                activeWindow = infoWindow;

                $('.js-checkout-mc-fauxTable-selectBtn-action').click(function () { 
            $('.js-checkout-mc-searchFormAndResults-container').slideUp(function () {
                    $('.js-checkout-mc-selectedMcAddress').slideDown();
                    });       
                });
            });
           
    }



$(document).ajaxComplete(function () {
    $(".checkout-mc-loader").hide();
    });

$('.js-checkout-mcAccordionTarget-mc').click(function () {
    getAllMap();
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(268); }
});

    /**
    MC existing checkout select mc boutique
    */
    
    $(FFAPI.variables.bodyElement).on('click', '.js-checkout-mc-fauxTable-selectBtn-action', function () {
        if (FFAPI.address.variables.isGuestRegistration) {
        $('.js-checkout-mc-searchFormAndResults-container').slideUp(function () {
                $('.js-checkout-mc-selectedMcAddress').slideDown();
            });       
        }
    }); 


    $('.js-checkout-mc-fauxTable-selectBtn-action-change').click(function () {
        $('.js-checkout-mc-selectedMcAddress').slideUp(function () {
            $('.js-checkout-mc-searchFormAndResults-container').slideDown();
            FFAPI.methods.maps.bindEvents();
            getAllMap();
            google.maps.event.trigger(map, 'resize');
            FFAPI.address.methods.setContinueEnabled(false);
            // Clickstream
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(276); }
        });
    });

/*
Quick checkout
*/




    /*

    ////////////////////////main top drawers 

    */
    
$('.js-checkout-mainContent-boxModule-payment-token').click(function () {
       
    if ($(this).hasClass("js-quick-payment-paypal-boxModule")) {
            $('.js-quick-paypal-btn').removeClass('hide');
            $('.js-quick-card-btn').addClass('hide');
            $('.js-checkout-payMethod-Box-creditCard-tokenization').slideUp();
            $('.js-payments-mc-topactions .js-quick-change-action-cancel').hide();
            $('.js-payments-mc-topactions .js-quick-change-action-change').show();
            $('html,body').animate({ scrollTop: $('.quick_topactions-container').offset().top }, 'slow');      
        }
          else {
            $('.js-quick-paypal-btn').addClass('hide');
            $('.js-quick-card-btn').removeClass('hide');
          }
    });
   
   

    $('.js-quick-change-action-change').click(function () {
         $(this).hide();
         $(this).next('.js-quick-change-action-cancel').show();
         $(this).parent().parent().next('.js-quick-boxSelector-container').slideDown();
    });


    $('.js-quick-change-action-cancel').click(function () {
        $(this).hide();
        $(this).prev('.js-quick-change-action-change').show();
        $(this).parent().parent().next('.js-quick-boxSelector-container').slideUp();
        $(this).parent().parent().parent().find('.js-quick-addNewForm-container').slideUp();

        if ($(this).parent().parent().next('.js-quick-addNewForm').find('#quick-TogglePlusShipping').hasClass('icon-less')) {
            $(this).find('.js-checkout-mainContent-boxModule-addNewIcon-small .icon-less')
            .removeClass('icon-less')
            .addClass('icon-more'); 

    } else {

            $(this).find('.js-checkout-mainContent-boxModule-addNewIcon-small .icon-more')
            .removeClass('icon-more')
            .addClass('icon-less');   
        }
    });

    /*
    ////////////////////////add new form drawers 
    */

    $('.js-quick-addNewForm').click(function () {

        if ($(this).find('#quick-TogglePlusShipping').hasClass('icon-less')) {
            
            $(this).parent().next('.js-quick-addNewForm-container').slideUp();
            $(this).find('.js-checkout-mainContent-boxModule-addNewIcon-small .icon-less')
            .removeClass('icon-less')
            .addClass('icon-more'); 

    } else {

            $(this).parent().next('.js-quick-addNewForm-container').slideDown();
            $(this).find('.js-checkout-mainContent-boxModule-addNewIcon-small .icon-more')
            .removeClass('icon-more')
            .addClass('icon-less');   
        }
       
    });

    /*
    ////////////////////////combine multichanel module with quick checkout
    */
    $('.js-quick-boxSelector-container .checkout-mainContent-boxModule').click(function () {
        if ($(this).hasClass('js-checkout-mainContent-boxModule-mc')) {
            $('.js-checkout-mc-main-container').slideDown();  
            $('.js-quick-addNewForm-container').slideUp();
            $('.js-checkout-mainContent-boxModule-addNewIcon-small .icon-less').removeClass('icon-less').addClass('icon-more');
            if (window.innerWidth < 480) {
                $('html,body').animate({ scrollTop: $('.js-checkout-mc-main-container').offset().top }, 'slow');
            }
        }
        else {
            $('.js-checkout-mc-main-container').slideUp(); 
        }    
    });

    /*
    ////////////////////////uncheck address radio buttons when click add new address
    */
$('.js-quick-addNewForm').on("click", function () {
      if ($('.js-checkout-mainContent-boxModule-mc').hasClass('checkout-mainContent-boxModule_active')) {
        $('.js-checkout-mainContent-boxModule-mc').removeClass('checkout-mainContent-boxModule_active');
        $('.js-checkout-mainContent-boxModule-mc').find('label').removeClass('label-check_active');  
        $('.js-checkout-mainContent-boxModule-mc').find('.js-boxModule-address').prop('checked', false);
        $('.js-checkout-mainContent-boxModule-mc').find('.icon-radio-checked').removeClass('glyphs, icon-radio-checked').addClass('icon-radio-unchecked');  
      }
        else {
            
        }    
    });

   /*
    ////////////////////////close when select shipping address
    */ 
$('.js-shipping-mc-boxModule').on("click", function () {
        $('.js-quick-boxSelector-shipping-container').slideUp();
        $('html,body').animate({ scrollTop: $('.quick_topactions-container').offset().top }, 'slow');
        $('.js-shipping-mc-topactions .js-quick-change-action-cancel').hide();
        $('.js-shipping-mc-topactions .js-quick-change-action-change').show();
});

    /*
    ////////////////////////close when select billing address
    */ 
$('.js-billing-mc-boxModule').on("click", function () {
        $('.js-quick-boxSelector-billing-container').slideUp();
        $('html,body').animate({ scrollTop: $('.quick_topactions-container').offset().top }, 'slow');
        $('.js-billing-mc-topactions .js-quick-change-action-cancel').hide();
        $('.js-billing-mc-topactions .js-quick-change-action-change').show();
    });


    /*
    ////////////////////////close when select new payment option
    */ 
   //$('.js-checkout-mainContent-boxModule-payment-token').on( "click", function() {
       // $('.js-checkout-payMethod-Box-creditCard-tokenization').slideUp();
        //$('html,body').animate({ scrollTop: $('.quick_topactions-container').offset().top }, 'slow');
        //$('.js-payments-mc-topactions .js-quick-change-action-cancel').hide();
        //$('.js-payments-mc-topactions .js-quick-change-action-change').show();
   // });


