
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
jsFolder = jsFolderMain,
jsMinified = '',
requireMainFolder = '../static/';


/////////////////////////////////////////////////////
/////Require config paths////////////////////////////
/////////////////////////////////////////////////////
require.config({
    baseUrl: requireMainFolder, // DEFINED ON SERVER SIDE
    paths: {
        ///Essentials loading
        velocity: jsSubFolderEssentials + 'velocity' + jsMinified,
        essentials: jsSubFolderEssentials + 'ffmodernizr' + jsMinified,
        forms_validations: jsFolder + 'forms_validations' + jsMinified,
        multiselect: jsFolder + 'multiselect' + jsMinified,
        listing: jsFolder + 'listing' + jsMinified,
        detail: jsFolder + 'detail' + jsMinified,
        ///Single files for loading on specific times
        api_header: jsFolder + 'header' + jsMinified,
        plu_domReady: jsFolder + 'domReady' + jsMinified,
        plu_fastclick: jsFolder + "fastclick" + jsMinified,
        //Listing.js
        plu_multipleSelect: jsFolder + "jquery.multiple" + jsMinified,
        ///Checkout_detail_listing_sizehelp
        plu_resTables: jsFolder + "responsive-tables" + jsMinified,
        ///designersDirectory.js / helpContact.js /countrySelector.js /checkout.js /careers
        plu_fixto: jsFolder + "fixto" + jsMinified,
        ///boutiqueDirectory.js / designersDirectory.js / listing.js
        plu_waypoints: jsFolder + "waypoints" + jsMinified,
        plu_waypointsSticky: jsFolder + "waypoints-sticky" + jsMinified,
        plu_scrollReveal: jsFolder + 'scrollReveal' + jsMinified,
        ///checkout.js
        plu_politespace: jsFolder + "politespace" + jsMinified,
        ///Editorial
        plu_masonry: jsFolder + "masonry" + jsMinified,
        ///Myaccount
        plu_maskedinput: jsFolder + "maskedinput" + jsMinified,
        /// designersDirectory.js 
        plu_clear_input: jsFolder + 'clear_input' + jsMinified,
        /// rating.js  - marketing_br
        plu_rate: jsFolder + 'rateit' + jsMinified,
        ///Social Share Plugin
        plu_socialShare: jsFolder + 'socialShare' + jsMinified,
        /// Pages will not be bundled
        pag_homepage: jsFolder + "homepage" + jsMinified,
        pag_forgotpassword: jsFolder + "forgotpassword" + jsMinified,
        pag_product: jsFolder + "product" + jsMinified,
        pag_landing: jsFolder + "landing" + jsMinified,
        pag_listing: jsFolder + "listing" + jsMinified,
        pag_detail: jsFolder + "detail" + jsMinified,
        pag_designers: jsFolder + "designers" + jsMinified,
        pag_designersDirectory: jsFolder + "designersDirectory" + jsMinified,
        pag_unfollow: jsFolder + "unfollow" + jsMinified,
        pag_checkout: jsFolder + "checkout" + jsMinified,
        pag_checkoutBasket: jsFolder + "checkoutBasket" + jsMinified,
        pag_checkoutAddress: jsFolder + "checkoutAddress" + jsMinified,
        pag_checkoutPayment: jsFolder + "checkoutPayment" + jsMinified,
        pag_checkoutReview: jsFolder + "checkoutReview" + jsMinified,
        pag_checkoutConfirmation: jsFolder + "checkoutConfirmation" + jsMinified,
        pag_editorial: jsFolder + "editorial" + jsMinified,
        pag_post: jsFolder + "post" + jsMinified,
        pag_boutiqueDirectory: jsFolder + "boutiqueDirectory" + jsMinified,
        pag_countrySelector: jsFolder + "countrySelector" + jsMinified,
        pag_rating: jsFolder + "rating" + jsMinified,
        pag_helpContact: jsFolder + "helpContact" + jsMinified,
        pag_aboutUs: jsFolder + "aboutUs" + jsMinified,
        pag_account: jsFolder + "account" + jsMinified,
        pag_returns: jsFolder + "returns" + jsMinified,
        pag_careers: jsFolder + "careers" + jsMinified,
        pag_marketing_br: jsFolder + "marketing_br" + jsMinified,
        pag_affiliates: jsFolder + "affiliates" + jsMinified,
        pag_ambassadors: jsFolder + "ambassadors" + jsMinified,
        pag_login: jsFolder + "login" + jsMinified,
        api_main: jsSubFolderApi + 'main-2.0.0',
        plu_dropdown: jsSubFolderPlugins + 'jquery.dropdown-1.0.1' + jsMinified,
        pag_reviews: jsFolder + "reviews" + jsMinified,
        pag_unfollow: jsFolder + "unfollow" + jsMinified
    },
    waitSeconds:180,
    shim: {
        velocity: {
            deps: ['interchange']
        },
        ajaxCalls: {
            deps: ['velocity']
        },
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
        pag_checkoutBasket: {
            deps: ['pag_checkout']
        },
        multiselect: {
            deps: ['essentials']
        },
        pag_designersDirectory: {
            deps: ['forms_validations']
        }

    }

});

define('interchange', function() {

    FFAPI = {};

    FFAPI.responsive = FFAPI.responsive || {};
    FFAPI.responsive.xs = {
        minw: 0,
        maxw: 480,
        media: {
            matches: false
        }
    };
    FFAPI.responsive.sm = {
        minw: FFAPI.responsive.xs.maxw + 1,
        maxw: 767,
        media: {
            matches: false
        }
    };
    FFAPI.responsive.md = {
        minw: FFAPI.responsive.sm.maxw + 1,
        maxw: 1024,
        media: {
            matches: false
        }
    };
    FFAPI.responsive.xl = {
        minw: FFAPI.responsive.md.maxw + 1,
        maxw: 0,
        media: {
            matches: false
        }
    };

    function makeImagesResponsive(format) {
        if(!FFAPI.responsive[format].media.matches) return;

        ////////GET ALL IMAGES////////

        var images = document.getElementsByTagName('img');
        if( images.length === 0 ){
            return;
        }

        ////////HASATTR FUNCTION////////

        var hasAttr = function(el, attrName){
            return el.hasAttribute(attrName);
        };

        ////////CHECK IF DISPLAY IS RETINA////////

        var retina = window.devicePixelRatio ? window.devicePixelRatio >= 1.2 ? 1 : 0 : 0;

        ////////LOOP ALL IMAGES////////

        for (var i = 0; i < images.length; i++) {

            var image = images[i];

            //set attr names
            var srcAttr = ( retina && hasAttr(image, 'data-src2x') ) ? 'data-src2x' : 'data-src';
            var baseAttr = ( retina && hasAttr(image, 'data-src-base2x') ) ? 'data-src-base2x' : 'data-src-base';

            //check image attributes
            if( !hasAttr(image, srcAttr) ){
                continue;
            }

            var basePath = hasAttr(image, baseAttr) ? image.getAttribute(baseAttr) : '';

            //get attributes
            var queries = image.getAttribute(srcAttr);
            var response = queries.match(new RegExp(format + ':(?!\/)([A-Z0-9_/-]{1,}\.(?:png|jpg|gif|jpeg))', 'i'))[1];

            var isCrossDomain = response.indexOf('//') !== -1 ? 1 : 0;

            var new_source;
            if(isCrossDomain === 1){
                new_source = response;
            } else {
                new_source = basePath + response;
            }

            if(image.src !== new_source){

                //change img src to basePath + response
                image.setAttribute('src', new_source);

            }

        }
    }

    if (window.matchMedia && ffbrowser.isIE8 === false) {
        FFAPI.responsive.xs.media = window.matchMedia('screen and ' + '(max-width: ' + (FFAPI.responsive.xs.maxw) + 'px)');
        FFAPI.responsive.sm.media = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.sm.minw) + 'px) and (max-width:' + (FFAPI.responsive.sm.maxw) + 'px)');
        FFAPI.responsive.md.media = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.md.minw) + 'px) and (max-width:' + (FFAPI.responsive.md.maxw) + 'px)');
        FFAPI.responsive.xl.media = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.xl.minw) + 'px)');

        makeImagesResponsive('xl');
        makeImagesResponsive('md');
        makeImagesResponsive('sm');
        makeImagesResponsive('xs');
        FFAPI.responsive.xl.media.addListener(function () { makeImagesResponsive('xl'); });
        FFAPI.responsive.md.media.addListener(function () { makeImagesResponsive('md'); });        
        FFAPI.responsive.sm.media.addListener(function () { makeImagesResponsive('sm'); }); 
        FFAPI.responsive.xs.media.addListener(function () { makeImagesResponsive('xs'); });
    }
});

define("ajaxCalls", ["jquery"], function($) {
    function renderData() {
        console.log("inside callback");
    }

    var header = 'header';
    if($('header').data('secure') != null) {
        header = 'header-secure';
    }
    var footer = 'footer';
    if($('footer').data('secure') != null) {
        footer = 'footer-secure';
    }

    function getData(options) {
        $.ajax({
            url: requireMainFolder + jsFolderMain + 'ajax/' + header + '.html',
            type: 'GET',
            success: options.successCallback,
            dataType: 'html'
        })
        .done(function (data) {
            $('header').html(data);
        });
        $.ajax({
            url: requireMainFolder + jsFolderMain + 'ajax/' + footer + '.html',
            type: 'GET',
            success: options.successCallback,
            dataType: 'html'
        })
        .done(function (data) {
            $('footer').html(data);
        });
    }

    return {
        getData: getData
    }
});

/////////////////////////////////////////////////////
/////Start the JavaScript requirement////////////////
/////////////////////////////////////////////////////

///
// Loads Essentials files - API e essential menus
// @method require(['essentials'], function() {
///

require(['ajaxCalls'], function (m) {
    m.getData({
        successCallback: function() {
            require(['essentials'], function () {

                // Register accordions
                FFAPI.plugins.accordion.register(document.getElementsByTagName('body')[0]);

                // Initialize accordions
                FFAPI.plugins.accordion.init();

                // Initialize tabs
                FFAPI.plugins.tabs.init();

                // Initialize scroll
                FFAPI.plugins.scroll.init();

                // Initialize dropdown
                FFAPI.plugins.chooser.init();

                // Back to top functionality
                require(['backToTop']);
                
                $(document).ready(function($) {
                    /////////////////////////////////////////////////////
                    ///// HEADER  LOADING MENU LOADING - FOOTER  ////////
                    /////////////////////////////////////////////////////   
                    if (ffbrowser.isIE8 === true) {
                        /// If it's IE8 just start the meganav 
                        /// and the calculations for the arrowPosition
                        /// Doesn't need the footer file
                        listenerBig();
                    } else {
                        /// If it's a small device start the menu with click
                        if (FFAPI.responsive.goneSmallQuerie.matches) {
                            ///console.log("Gone Small");
                            listenerSmall();
                        }

                        /// If it's a small device start the menu with click listener
                        FFAPI.responsive.goneSmallQuerie.addListener(function () {
                            if (FFAPI.responsive.goneSmallQuerie.matches) {
                                ///console.log("Gone Small Listener");
                                listenerSmall();
                                /// Unbind the functions to close the header search and header drawer on clicking outside these elements.
                                FFAPI.variables.bodyElement.off('click', FFAPI.methods.header.bodyMouseUpClick);
                                ///on touch devices show submenu
                                $('.touch .js-primary-link').off('click', FFAPI.methods.ffmenu.touchMeganavLink);
                                /// on touchstart hide the ffmenu if it's shown
                                $(document).off('touchstart', FFAPI.methods.ffmenu.touchstartDocument);
                                ///Remove the classes form the meganavMask
                                if(FFAPI.variables.ffmenu.meganavMaskJS[0]) {
                                    FFAPI.methods.addClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'hide');
                                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'animation-to-show09');
                                }
                            }
                        });

                        /// If it's a big device start the menu with hover
                        if (FFAPI.responsive.goneBigQuerie.matches) {
                            ///console.log('Gone Big');
                            listenerBig();
                        }

                        /// If it's a big device start the menu with hover listener
                        FFAPI.responsive.goneBigQuerie.addListener(function () {
                            if (FFAPI.responsive.goneBigQuerie.matches) {
                                ///console.log("Gone Big Listener");
                                listenerBig();
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
                        $(document).ready(function () {
                            ///Chosen
                            $('.no-touch .selectForm').chosen();
                            ///Checkradio
                            $('.label-check, .label-radio').checkradio();
                        });

                    });

                    ///On touchHeader
                    require(['touchHeader']);

                    ///footerNewsletter Validations
                    require(['footerNewsletter']);
                });
            });
        }
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

///Touch
define('touchHeader', ['essentials'], function () {
    /// Fix header when input is selected 
    fixHeader = $('.touch header');
    $(document).on('focusin', 'input, textarea', function () {
        fixHeader.addClass('unfixed');
        $('body').css('position', 'static');
    })
    $(document).on('focusout', 'input, textarea', function () {
        fixHeader.removeClass('unfixed');
    });
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
        ///Start the tooltips
        //tooltips();
    });
});

///Validate Footer Newsletter
define('footerNewsletter', ['essentials'], function () {
    $(document).ready(function () {
        /**
        * Binds clicking on an item on countries dropdown.
        * @method FFAPI.methods.bindFooterChangeCountryClick
        * @param {Event} e
        */
        FFAPI.methods.bindFooterChangeCountryClick = function () {
            $('body').off('change', '#footerChangeCountry').on('change', '#footerChangeCountry', function () {
                window.location = window.universal_variable.page.subfolder + jQuery(this).val();
            });
        };

        FFAPI.methods.bindFooterChangeCountryClick();

        FFAPI.methods.signNewsLetterResponse = function (data) {
            $('#footerNewsletterForm').replaceWith(data);
            $(document).trigger('subscribedEmail');
            //var label = $('#footerNewsletterValidationMsg');
            //if (data.success) {
            //    $(document).trigger({
            //        type: "FF_MailSignUpEvent",
            //        triggerPos: data.origin,
            //        pageUrl: document.URL,
            //        email: data.email
            //    });
            //    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("251"); }
            //    document.querySelector(".input_white").value = "";
            //    label.text(data.message).removeClass("form-validator_error").addClass("form-validator_success").show();
            //} else {
            //    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("67"); }
            //    $('#footerNewsletterForm').replaceWith(data);
            //}
        };

        var clearMessagesFunc = function () {
            var validationSpan = $('#footerNewsletterValidationMsg');
            validationSpan.text('');
            validationSpan.removeClass('form-validator_success').removeClass('form-validator_error');
        };

        var form = $('#footerNewsletterForm');
        form.find('input[type=text]').off('focusout').on('focusout', function () {
            clearMessagesFunc();
        });

        $('#footerNewsletterValidationMsg').off('click').on('click', function () {
            clearMessagesFunc();
        });

        form.find('input[type=text]').off('click').on('click', function () {
            clearMessagesFunc();
        });
    });
});

define('backToTop', ['essentials'], function () {
    var doc = document.documentElement;
    var backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        // Back-to-top button
        FFAPI.methods.on(window, 'scroll', bttScrollHandler, false);
        function bttScrollHandler() {
            var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            var waypoint = FFAPI.plugins.scroll ? FFAPI.plugins.scroll.headerOffset : 100;

            if (!backToTop) return;

            if (top > waypoint) {
                FFAPI.methods.addClass(backToTop, 'show');
            } else {
                FFAPI.methods.removeClass(backToTop, 'show');
            }
        }

        FFAPI.methods.on(backToTop, 'click', bttClickHandler, false);
        function bttClickHandler() {
            FFAPI.methods.removeClass(backToTop, 'show');
            FFAPI.methods.off(window, 'scroll', bttScrollHandler, false);
            FFAPI.plugins.scroll.to(document.getElementsByTagName('body')[0], 0, function() {
                FFAPI.methods.on(window, 'scroll', bttScrollHandler, false);
            });
        }

        // On page load
        bttScrollHandler();
    }
});

///Small Listener Function
function listenerSmall() {
    $(document).ready(function () {
        ///Start the responsive menu click
        FFAPI.responsive.startffmenuClick();
        ///Remove the class from the bodyElement
        FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'animatedAll');
    });
};

///BIG Listener Function
function listenerBig() {
    $(document).ready(function () {
        /// Calculate the arrowPosition of the meganav
        /// Used the timeout function in order to 
        /// don't block other listeners
        setTimeout(function () {
            FFAPI.methods.ffmenu.calculateArrowPosition();
        }, FFAPI.variables.animationSpeed);
        /// Start the ffmenuHover
        FFAPI.responsive.startffmenuHover();
        /// Loads header and the check option for when the tabs are open.
        require(['api_header']);

        ///on touch devices show submenu
        $('.touch .js-primary-link').on('click', FFAPI.methods.ffmenu.touchMeganavLink);

        /// on touchstart hide the ffmenu if it's shown
        $(document).on('touchstart', FFAPI.methods.ffmenu.touchstartDocument);
    });
};