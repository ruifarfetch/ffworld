
/**
Loads javaScript file. It contains the JavaScript files loading using require.
It uses conditional loading for IE8 and IE9 polyfills and specific for IE8 (js/plugins/selectivizr.js','js/api/responsive-IE8-1.0.0.js)
@deprecated
@class loads.js
**/
var jsFolderMain = 'js/',
jsSubFolderEssentials = jsFolderMain + 'essentials/',
jsSubFolderPolyfills = jsFolderMain + 'polyfills/',
jsSubFolderPolyfillsIe8 = jsSubFolderPolyfills + 'ie8/',
jsSubFolderExternal = jsFolderMain + 'external/',
jsSubFolderApi = jsFolderMain + 'api/',
jsSubFolderPages = jsFolderMain + 'pages/',
jsSubFolderModules = jsFolderMain + 'modules/',
jsSubFolderPlugins = jsFolderMain + 'plugins/',
jsSubFolderBundles = 'jsbundles/',
jsMinified = '';


/////////////////////////////////////////////////////
/////Require config paths////////////////////////////
/////////////////////////////////////////////////////
require.config({
    baseUrl: requireMainFolder, // DEFINED ON SERVER SIDE
    paths: {
        ///Essentials loading
        velocity: jsSubFolderBundles + 'velocity' + jsMinified,
        essentials: jsSubFolderBundles + 'essentials-secure' + jsMinified,
        forms_validations: jsSubFolderBundles + 'forms_validations' + jsMinified,
        multiselect: jsSubFolderBundles + 'multiselect' + jsMinified,
        listing: jsSubFolderBundles + 'listing' + jsMinified,
        detail: jsSubFolderBundles + 'detail' + jsMinified,
        ///Single files for loading on specific times
        api_header: jsSubFolderBundles + 'header' + jsMinified,
        plu_domReady: jsSubFolderBundles + 'domReady' + jsMinified,
        plu_fastclick: jsSubFolderBundles + "fastclick" + jsMinified,
        //Listing.js
        plu_multipleSelect: jsSubFolderBundles + "jquery.multiple" + jsMinified,
        ///Checkout_detail_listing_sizehelp
        plu_resTables: jsSubFolderBundles + "responsive-tables" + jsMinified,
        ///designersDirectory.js / helpContact.js /countrySelector.js /checkout.js /careers
        plu_fixto: jsSubFolderBundles + "fixto" + jsMinified,
        ///boutiqueDirectory.js / designersDirectory.js / listing.js
        plu_waypoints: jsSubFolderBundles + "waypoints" + jsMinified,
        plu_waypointsSticky: jsSubFolderBundles + "waypoints-sticky" + jsMinified,
        ///checkout.js
        plu_politespace: jsSubFolderBundles + "politespace" + jsMinified,
        ///Editorial
        plu_masonry: jsSubFolderBundles + "masonry" + jsMinified,
        ///Myaccount
        plu_maskedinput: jsSubFolderBundles + "maskedinput" + jsMinified,
        /// designersDirectory.js 
        plu_clear_input: jsSubFolderBundles + 'clear_input' + jsMinified,
        /// rating.js  - marketing_br
        plu_rate: jsSubFolderBundles + 'rateit' + jsMinified,
        /// Pages will not be bundled
        pag_homepage: jsSubFolderBundles + "homepage" + jsMinified,
        pag_forgotpassword: jsSubFolderBundles + "forgotpassword" + jsMinified,
        pag_product: jsSubFolderBundles + "product" + jsMinified,
        pag_landing: jsSubFolderBundles + "landing" + jsMinified,
        pag_listing: jsSubFolderBundles + "listing" + jsMinified,
        pag_detail: jsSubFolderBundles + "detail" + jsMinified,
        pag_designers: jsSubFolderBundles + "designers" + jsMinified,
        pag_designersDirectory: jsSubFolderBundles + "designersDirectory" + jsMinified,
        pag_checkout: jsSubFolderBundles + "checkout" + jsMinified,
        pag_checkoutBasket: jsSubFolderBundles + "checkoutBasket" + jsMinified,
        pag_checkoutAddress: jsSubFolderBundles + "checkoutAddress" + jsMinified,
        pag_checkoutPayment: jsSubFolderBundles + "checkoutPayment" + jsMinified,
        pag_checkoutReview: jsSubFolderBundles + "checkoutReview" + jsMinified,
        pag_checkoutConfirmation: jsSubFolderBundles + "checkoutConfirmation" + jsMinified,
        pag_editorial: jsSubFolderBundles + "editorial" + jsMinified,
        pag_post: jsSubFolderBundles + "post" + jsMinified,
        pag_boutiqueDirectory: jsSubFolderBundles + "boutiqueDirectory" + jsMinified,
        pag_countrySelector: jsSubFolderBundles + "countrySelector" + jsMinified,
        pag_rating: jsSubFolderBundles + "rating" + jsMinified,
        pag_helpContact: jsSubFolderBundles + "helpContact" + jsMinified,
        pag_aboutUs: jsSubFolderBundles + "aboutUs" + jsMinified,
        pag_account: jsSubFolderBundles + "account" + jsMinified,
        pag_returns: jsSubFolderBundles + "returns" + jsMinified,
        pag_careers: jsSubFolderBundles + "careers" + jsMinified,
        pag_marketing_br: jsSubFolderBundles + "marketing_br" + jsMinified,
        pag_affiliates: jsSubFolderBundles + "affiliates" + jsMinified,
        pag_ambassadors: jsSubFolderBundles + "ambassadors" + jsMinified,
        pag_login: jsSubFolderBundles + "login" + jsMinified
    },
    waitSeconds:180,
    shim: {
        essentials: {
            deps: ['velocity']
        },
        api_header: {
            deps: ['essentials']
        },
        forms_validations: {
            deps: ['essentials']
        },
        pag_checkout: {
            deps: ['forms_validations', 'plu_fixto']
        },
        pag_checkoutAddress: {
            deps: ['pag_checkout', 'plu_maskedinput']
        },
        pag_checkoutPayment: {
            deps: ['pag_checkout', 'plu_maskedinput']
        },
        pag_checkoutReview: {
            deps: ['pag_checkout']
        },
        pag_checkoutConfirmation: {
            deps: ['pag_checkout']
        },
        pag_returns: {
            deps: ['forms_validations', 'plu_fixto']
        },
    }

});

/////////////////////////////////////////////////////
/////Start the JavaScript requirement////////////////
/////////////////////////////////////////////////////

///
// Loads Essentials files - API e essential menus
// @method require(['essentials'], function() {
///

require(['essentials'], function () {

    /////////////////////////////////////////////////////
    ///// HEADER  LOADING MENU LOADING - FOOTER  ////////
    /////////////////////////////////////////////////////   
    if (ffbrowser.isIE8 === true) {
       
    } else {
        /// If it's a small device start the menu with click
        if (FFAPI.responsive.goneSmallQuerie.matches) {
            ///console.log("Gone Small");
            listenerSmall();
        }

        /// If it's a small device start the menu with click listener
        FFAPI.responsive.goneSmallQuerie.addListener(function () {
            if (FFAPI.responsive.goneSmallQuerie.matches) {
                ////console.log("Gone Small Listener");
                listenerSmall();
                
            }
        });

        
    }///END ELSE


    ///FASTCLICK
    if (FFAPI.variables.touchSupported === true) {
        require(['fastclickStarter']);
    }


    ///Initialize Plugins
    require(['pluginIniatializer']);

    ///Get the script page
    $(document).ready(function () {
        /// Start mediaQuerieSetValues - it starts the responsive images
        if (ffbrowser.isIE8 === false) {
            FFAPI.responsive.mediaQuerieSetValues();
        }
        /// When document ready load the required file for page
        FFAPI.variables.page = FFAPI.variables.bodyElement.data('page');
        /// When it's different from null loads the required file
        if (FFAPI.variables.page !== '' && FFAPI.variables.page !== null && FFAPI.variables.page !== undefined) {
            require(['pag_' + FFAPI.variables.page], function () {
                $('.js-visible').removeClass('anim-hidden');
                /// Remove Unobtrousive Mask
                FFAPI.methods.removeElementDom('unobtrosive-mask', 'header-user');
            });
        } else {
            $('.js-visible').removeClass('anim-hidden');
            /// Remove Unobtrousive Mask
            FFAPI.methods.removeElementDom('unobtrosive-mask', 'header-user');
        }
        FFAPI.methods.removeElementDom('unobtrosive-mask', 'header-user');
    });


    ///Validate the form
    require(['forms_validations'], function () {
        FFAPI.variables.formsToValidate = $('form[data-ajax=true], .form-validator');
        FFAPI.variables.formsToValidate.data("unobtrusiveValidation", null);
        FFAPI.variables.formsToValidate.data("validator", null);

        $.validator.unobtrusive.parse(document);

        FFAPI.variables.formsToValidate.validate({
            errorClass: 'form-validator_error',
            validClass: 'form-validator_success'
        });



        ///Chosen
        $('.no-touch .selectForm').chosen();
        ///Checkradio
        $('.label-check, .label-radio').checkradio();
    });
});///END essentials


///Define Functions for loading necessary files
///FastClick
define('fastclickStarter', ['plu_fastclick'], function (FastClick) {
    var initialize = function () {
        new FastClick(document.body);
    }
    return {
        initialize: initialize
    };
});

///Subfolders
define('subfolders', ['essentials'], function () {
});


///Start plugins
define('pluginIniatializer', ['essentials'], function () {
    $(document).ready(function () {
        /// Remove class hide from slider to show the images if exists
        var element = document.getElementsByClassName('sliderArticleModule'),
        elementLength = element.length;
        for (var i = 0; i < elementLength; i++) {
            if (typeof (element[i]) !== 'undefined' && element[i] !== null) {
                FFAPI.methods.removeClass(element[i], 'hide');
            }
        }
    });
    ///Start the tooltips
    //tooltips();
});


///Small Listener Function
function listenerSmall() {
    ///Remove the class from the bodyElement
    FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'animatedAll');
};
