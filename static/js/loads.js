
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
jsSubFolderBundles = 'js/',
jsMinified = '';


/////////////////////////////////////////////////////
/////Require config paths////////////////////////////
/////////////////////////////////////////////////////
require.config({
    baseUrl: requireMainFolder, // DEFINED ON SERVER SIDE
    paths: {
        ///Essentials loading
        velocity: jsSubFolderBundles + 'velocity' + jsMinified,
        essentials: jsSubFolderBundles + 'essentials' + jsMinified,
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
        plu_scrollReveal: jsSubFolderBundles + 'scrollReveal' + jsMinified,
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
        ///Social Share Plugin
        plu_socialShare: jsSubFolderBundles + 'socialShare' + jsMinified,
        /// Pages will not be bundled
        pag_homepage: jsSubFolderBundles + "homepage" + jsMinified,
        pag_forgotpassword: jsSubFolderBundles + "forgotpassword" + jsMinified,
        pag_product: jsSubFolderBundles + "product" + jsMinified,
        pag_landing: jsSubFolderBundles + "landing" + jsMinified,
        pag_listing: jsSubFolderBundles + "listing" + jsMinified,
        pag_detail: jsSubFolderBundles + "detail" + jsMinified,
        pag_designers: jsSubFolderBundles + "designers" + jsMinified,
        pag_designersDirectory: jsSubFolderBundles + "designersDirectory" + jsMinified,
        pag_unfollow: jsSubFolderBundles + "unfollow" + jsMinified,
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
        pag_login: jsSubFolderBundles + "login" + jsMinified,
        api_main: jsSubFolderApi + 'main-2.0.0',
        plu_dropdown: jsSubFolderPlugins + 'jquery.dropdown-1.0.1' + jsMinified,
        pag_reviews: jsSubFolderBundles + "reviews" + jsMinified,
        pag_unfollow: jsSubFolderBundles + "unfollow" + jsMinified
    },
    waitSeconds:180,
    shim: {
        essentials: {
            deps: ['velocity']
        }
    }

});

require(['essentials'], function () {
	// Register accordions
	FFAPI.plugins.accordion.register(document.getElementsByTagName('body')[0]);

	// Initialize accordions
	FFAPI.plugins.accordion.init();

    // Initialize tabs
    FFAPI.plugins.tabs.init();
});