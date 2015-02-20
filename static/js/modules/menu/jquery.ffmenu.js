/*global navigator, FFAPI, Modernizr, hoverintent */
/*jslint browser: true */

/**
Used on the megaMenu we have on the Header
@deprecated plugins/
@class jquery.ffmenu.js
**/

/**
 * This module contains global methods of the MegaMenu
 * @module jQuery
 */

/*Variables and methods of ffmenu*/


$(document).ready(function () {
    FFAPI.variables.ffmenu = {
        /**
         * FFAPI variable to check if the secondaryNav is visible
         * <b><i>FFAPI.variables.ffmenu.secondaryNavVisible = false;<br /></i></b>
         * @property FFAPI.variables.ffmenu.secondaryNavVisible
         * @type String
         */
        secondaryNavVisible: false,
        /**
         * FFAPI variable to check if the submenuMobile is visible
         * <b><i>FFAPI.variables.ffmenu.submenuMobileVisible = false;<br /></i></b>
         * @property FFAPI.variables.ffmenu.submenuMobileVisible
         * @type String
         */
        submenuMobileVisible: false,
        /**
         * FFAPI variable of the header nav wrapper
         * <b><i>FFAPI.variables.ffmenu.pullMenu = document.getElementsByClassName('header-nav-wrapper');<br /></i></b>
         * @property FFAPI.variables.ffmenu.pullMenu
         * @type String
         */
        pullMenu: document.getElementsByClassName('header-nav-wrapper'),
        /**
         * FFAPI Responsive Menu Header Arrow bottom. The arrow that shows underneath
         * <b><i>FFAPI.variables.ffmenu.menuHeaderArrow = '.arrow_bottom';<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderArrow
         * @type String
         */
        menuHeaderArrow: $('.arrow-slider_bottom'),
        /**
         * FFAPI Responsive Menu Header Arrow bottom. The arrow that shows underneath pure Javascript object
         * <b><i>FFAPI.variables.ffmenu.menuHeaderArrowJS = document.getElementsByClassName('arrow-slider_bottom');<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderArrowJS
         * @type String
         */
        menuHeaderArrowJS: document.getElementsByClassName('arrow-slider_bottom'),
        /**
         * FFAPI Responsive Menu Header Events to unbind. The events to do the unbind of the ffmenu method
         * <b><i>FFAPI.variables.ffmenu.menuHeaderEventsUnbind = 'mouseenter mouseleave hover click';<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderEventsUnbind
         * @type String
         */
        menuHeaderEventsUnbind: 'mouseenter mouseleave hover click',
        /**
         * FFAPI Responsive Arrow Position on the array
         * <b><i>FFAPI.variables.ffmenu.arrowPosNumber = 0;<br /></i></b>
         * @property FFAPI.variables.ffmenu.arrowPosNumber
         * @type String
         */
        arrowPosNumber: 0,
        /**
         * FFAPI Responsive Menu Position - the position of the menu
         * <b><i>FFAPI.variables.ffmenu.arrowPos = [];<br /></i></b>
         * @property FFAPI.variables.ffmenu.arrowPos
         * @type Array
         */
        arrowPos: [],
        /**
         * FFAPI Responsive
         * <b><i>FFAPI.variables.ffmenu.arrowPosNumber = 0;<br /></i></b>
         * @property FFAPI.variables.ffmenu.arrowPosNumber
         * @type Array
         */
        arrowPosFinal: [],
        /**
         * FFAPI Responsive Menu Visible - check if the menu is visible or not
         * <b><i>FFAPI.variables.ffmenu.menuVisible = false;<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuVisible
         * @type Boolean
         */
        menuVisible: false,
        /**
         * FFAPI Responsive Arrow Visible - check if the arrow is visible
         * <b><i>FFAPI.variables.ffmenu.arrowVisible = false;<br /></i></b>
         * @property FFAPI.variables.ffmenu.arrowVisible
         * @type Boolean
         */
        arrowVisible: false,
        /**
         * FFAPI menu header search click area
         * <b><i>FFAPI.variables.ffmenu.menuHeaderSearch = document.getElementsByClassName('search-click-area');<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderSearch
         * @type Object
         */
        menuHeaderSearch: document.getElementsByClassName('search-click-area'),
        /**
         * FFAPI menu header search click link
         * <b><i>FFAPI.variables.ffmenu.menuHeaderSearchLink = FFAPI.variables.ffmenu.menuHeaderSearch[0].getElementsByTagName('a');<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderSearchLink
         * @type Object
         */
        menuHeaderSearchLink: document.getElementsByClassName('icon-search-click'),
        /**
         * FFAPI menu header search click span
         * <b><i>FFAPI.variables.ffmenu.menuHeaderSearchSpan = FFAPI.variables.ffmenu.menuHeaderSearchSpan[0].getElementsByTagName('span');<br /></i></b>
         * @property FFAPI.variables.ffmenu.menuHeaderSearchSpan
         * @type Object
         */
        menuHeaderSearchSpan: document.getElementsByClassName('link-search-click'),
        /**
         * FFAPI Variables Header Primary Nav Links
         * <b><i>FFAPI.variables.ffmenu.headerPriNavLinks = FFAPI.variables.headerPriNav.find('>li>a');<br /></i></b>
         * @property FFAPI.variables.ffmenu.headerPriNavLinks
         * @type Object
         */

        headerPriNavLinks: $('.js-primary-link'),
        /**
         * FFAPI Responsive Primary Nav items
         * <b><i>FFAPI.variables.ffmenu.primaryNav = $('.js-primary-nav');<br /></i></b>
         * @property FFAPI.variables.ffmenu.primaryNav
         * @type Object
         */
        primaryNav: $('.js-primary-nav'),
        /**
         * FFAPI Responsive Secondary Nav items
         * <b><i>FFAPI.variables.ffmenu.secondaryNav = $('.header-secondary-nav');<br /></i></b>
         * @property FFAPI.variables.ffmenu.secondaryNav
         * @type Object
         */
        secondaryNav: $('.header-secondary-nav'),

        /**
         * FFAPI Responsive Menu
         * <b><i>FFAPI.variables.ffmenu.menu = $(".header-mobile-menu li:not(.header-mobile-back, .header-mobile-submenu-title)");<br /></i></b>
         * @property FFAPI.variables.ffmenu.menu
         * @type Object
         */
        menu: $('.header-mobile-menu li:not(.header-mobile-back, .header-mobile-submenu-title)'),

        /**
         * FFAPI Responsive Back menu links
         * <b><i>FFAPI.variables.ffmenu.backMenu = $(".header-mobile-back");<br /></i></b>
         * @property FFAPI.variables.ffmenu.backMenu
         * @type String
         */
        backMenu: $('.header-mobile-back'),
        /**
         * FFAPI Primary Nav Javascript Object
         * <b><i>FFAPI.variables.ffmenu.primaryNavJS = document.getElementsByClassName('js-primary-nav');<br /></i></b>
         * @property FFAPI.variables.ffmenu.primaryNavJS
         * @type Object
         */
        primaryNavJS: document.getElementsByClassName('js-primary-nav'),
        /**
         * FFAPI Primary Nav Javascript Object Length
         * <b><i>FFAPI.variables.ffmenu.primaryNavLength = FFAPI.variables.ffmenu.primaryNav.length;<br /></i></b>
         * @property FFAPI.variables.ffmenu.primaryNavLength
         * @type Object
         */
        //primaryNavJSLength : this.primaryNavJS.length,
        /**
         * FFAPI Meganav li Javascript Object
         * <b><i>FFAPI.variables.ffmenu.meganavLiJS = document.getElementsByClassName('js-meganav-li');<br /></i></b>
         * @property FFAPI.variables.ffmenu.meganavLiJS
         * @type Object
         */
        meganavLiJS: document.getElementsByClassName('js-meganav-li'),
        /**
         * FFAPI Meganav li Javascript Object Length
         * <b><i>FFAPI.variables.ffmenu.meganavLiJSLength = FFAPI.variables.ffmenu.meganavLiJS.length;<br /></i></b>
         * @property FFAPI.variables.ffmenu.meganavLiJSLength
         * @type Object
         */
        //meganavLiJSLength : FFAPI.variables.ffmenu.meganavLiJS.length,
        /**
         * FFAPI Secondary Nav Javascript Object
         * <b><i>FFAPI.variables.ffmenu.secondaryNavJS = document.getElementsByClassName('jjs-secondary-nav');<br /></i></b>
         * @property FFAPI.variables.ffmenu.secondaryNavJS
         * @type Object
         */
        secondaryNavJS: document.getElementsByClassName('js-secondary-nav'),
        /**
         * FFAPI Secondary Nav Javascript Object Length
         * <b><i>FFAPI.variables.ffmenu.secondaryNavJSLength = FFAPI.variables.ffmenu.secondaryNavJS.length;<br /></i></b>
         * @property FFAPI.variables.ffmenu.secondaryNavJSLength
         * @type Object
         */
        //secondaryNavJSLength : FFAPI.variables.ffmenu.secondaryNavJS.length,
        /**
         * FFAPI Header Mobile Javascript Object
         * <b><i>FFAPI.variables.ffmenu.headerMobileSubmenu = document.getElementsByClassName('header-mobile-submenu');<br /></i></b>
         * @property FFAPI.variables.ffmenu.headerMobileSubmenu
         * @type Object
         */
        headerMobileSubmenu: document.getElementsByClassName('header-mobile-submenu'),
        /**
         * FFAPIHeader Mobile Javascript Object Length
         * <b><i>FFAPI.variables.ffmenu.headerMobileSubmenuLength = FFAPI.variables.ffmenu.headerMobileSubmenu.length;<br /></i></b>
         * @property FFAPI.variables.ffmenu.headerMobileSubmenuLength
         * @type Object
         */
        //headerMobileSubmenuLength : FFAPI.variables.ffmenu.headerMobileSubmenu.length,
        /**
         * FFAPI Primary Nav Link Javascript Object
         * <b><i>FFAPI.variables.ffmenu.primaryLinkJS = document.getElementsByClassName('js-primary-link');<br /></i></b>
         * @property FFAPI.variables.ffmenu.primaryLinkJS
         * @type Object
         */
        primaryLinkJS: document.getElementsByClassName('js-primary-link'),
        /**
         * FFAPI Primary Nav Javascript Object Length
         * <b><i>FFAPI.variables.ffmenu.primaryNavLength = FFAPI.variables.ffmenu.primaryNav.length;<br /></i></b>
         * @property FFAPI.variables.ffmenu.primaryNavLength
         * @type Object
         */
        //primaryLinkJSLength : FFAPI.variables.ffmenu.primaryLinkJS.length,
        /**
         * FFAPI Variables Meganav mask
         * <b><i>FFAPI.variables.ffmenu.meganavMask = document.getElementsByClassName('meganav-mask');<br /></i></b>
         * @property FFAPI.variables.ffmenu.meganavMaskJS
         * @type Object
         */
        meganavMaskJS: document.getElementsByClassName('meganav-mask'),
        /**
         * FFAPI variables anim out class to animate the menu out
         * <b><i>FFAPI.variables.ffmenu.animOut = "header-animate-out-menu";<br /></i></b>
         * @property FFAPI.variables.ffmenu.animOut
         * @type String
         */
        animOut: 'header-animate-out-menu',
        /**
         * FFAPI variables anim out class to animate the submenu out
         * <b><i>FFAPI.variables.ffmenu.animOut2 = "header-animate-out-submenu";<br /></i></b>
         * @property FFAPI.variables.ffmenu.animOut2
         * @type String
         */
        animOutSubmenu: 'header-animate-out-submenu',
        /**
         * FFAPI variables  Anim in Class for the menu
         * <b><i>FFAPI.variables.ffmenu.animIn = "header-animate-in-menu";<br /></i></b>
         * @property FFAPI.variables.ffmenu.animIn
         * @type String
         */
        animIn: 'header-animate-in-menu',
        /**
         * FFAPI variables  Anim in Class for the submenu
         * <b><i>FFAPI.variables.ffmenu.animIn2 = "header-animate-in-submenu";<br /></i></b>
         * @property FFAPI.variables.ffmenu.animIn2
         * @type String
         */
        animInSubmenu: 'header-animate-in-submenu'

    };

    FFAPI.methods.ffmenu = FFAPI.methods.ffmenu || {};


    /// Function definitions
    (function ($) {
        var defaults = {
            speed: FFAPI.variables.animationSpeed,
            eventAction: 'hover',
            effect: 'fade'
        };
        // Methods object
        var methods = {
            /**
             * Destroys the menu behaviours with mouseenter and mouseleave
             * @method methods.destroy
             * @param {Object} jQThis - Html Element
             */
            destroy: function (jQThis) {
                /// Close the mobile menu if open
                if (FFAPI.variables.ffmenu.menuVisible === true) {
                    /// Close the menu mobile
                    FFAPI.responsive.hamburguerMenuClose();

                    /// Set the bodyElement style to null
                    FFAPI.variables.bodyElementJS[0].setAttribute('style', '');

                    /// Set the pullMenu style to null
                    FFAPI.variables.ffmenu.pullMenu[0].setAttribute('style', '');
                }
                /// Remove all the listeners
                FFAPI.methods.removeListenerAll(FFAPI.variables.ffmenu.primaryNavJS);
                FFAPI.variables.ffmenu.primaryNavJS = document.getElementsByClassName('js-primary-nav');
                FFAPI.methods.removeListenerAll(FFAPI.variables.ffmenu.meganavLiJS);
                FFAPI.variables.ffmenu.meganavLiJS = document.getElementsByClassName('js-meganav-li');
                FFAPI.variables.ffmenu.primaryNav = $('.js-primary-nav');

                /// Change the variables to the visible menus
                FFAPI.variables.ffmenu.submenuMobileVisible = false;
                FFAPI.variables.ffmenu.secondaryNavVisible = false;

                /// Remove header-animate-in-menu class from the js-primary-nav
                var i = 0;
                //Get the children - li
                for (i = 0; i < FFAPI.variables.ffmenu.primaryNavJS.length; i++) {
                    /// Get the first link - it's always the a element
                    FFAPI.variables.ffmenu.primaryNavJS[i].setAttribute('style', '');
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.primaryNavJS[i], FFAPI.variables.ffmenu.animIn);
                }

                /// Remove style from all the meganavLI
                var k = 0;
                for (k; k < FFAPI.variables.ffmenu.meganavLiJS.length; k++) {
                    /// Remove the style from the meganavLiJS
                    FFAPI.variables.ffmenu.meganavLiJS[k].setAttribute('style', '');
                }

                /// Remove header-animate-in-submenu class 
                /// and header-animate-out-submenu class from the js-secondary-nav
                var j = 0;
                //Get the children - li
                for (j; j < FFAPI.variables.ffmenu.secondaryNavJS.length; j++) {
                    /// Get the first link - it's always the a element
                    FFAPI.variables.ffmenu.secondaryNavJS[j].setAttribute('style', '');
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.secondaryNavJS[j], FFAPI.variables.ffmenu.animOutSubmenu);
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.secondaryNavJS[j], FFAPI.variables.ffmenu.animInSubmenu);
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.secondaryNavJS[j], 'anim-showAtAll');
                    if (!Modernizr.csstransitions) {
                        FFAPI.variables.ffmenu.secondaryNavJS[j].style.display = 'none';
                    }
                }

                /// Remove all css from the header-mobile-submenu
                k = 0;
                for (k; k < FFAPI.variables.ffmenu.headerMobileSubmenu.length; k++) {
                    /// Get the first link - it's always the a element
                    FFAPI.variables.ffmenu.headerMobileSubmenu[k].setAttribute('style', '');

                }

                ///Hide the magenav mask
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'hide');
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'animation-to-show09');


                $('.header-mobile-menu').attr('style', '');
                $('.header-mobile-submenu').attr('style', '');

                FFAPI.variables.ffmenu.primaryNav.attr('style', '');

                FFAPI.variables.ffmenu.headerPriNavLinks.removeClass('anim-linkInactive');

                /// JQUERY UNBINDINGS ///////////////////////////////////////////
                ///////////////////////////////////////////////////////////////// 
                /// Remove clicks on the ffmenu 
                FFAPI.variables.ffmenu.headerPriNavLinks.off('click');
                /// Rempve Click on the secondary Nav
                FFAPI.variables.ffmenu.menu.off('click');
                /// Remove Click on the backMenu
                FFAPI.variables.ffmenu.backMenu.off('click');
                /// Remove all the bindings off the first li
                jQThis.find('>li').off(FFAPI.variables.ffmenu.menuHeaderEventsUnbind);
                /// Remove all the bindings off the primary links
                jQThis.off(FFAPI.variables.ffmenu.menuHeaderEventsUnbind);

            },

            /**
             * Binds the primary Nav Click
             * @method methods.primaryNavClick
             * @param {Object} jQThis
             */
            primaryNavClick: function (event, jQThis) {
                ///console.log('CLICK 1 - Clicked the Primary Nav');
                FFAPI.variables.ffmenu.primaryNav.removeClass(FFAPI.variables.ffmenu.animOut);
                ///Prevent default of this
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                /// Stop propagation of the event
                event.stopPropagation ? event.stopPropagation() : event.returnValue = false;

                /// Get the variables of this
                var $jQThis = $(jQThis),
                    hrefLink = $jQThis.attr('href'),
                    goUrl = $jQThis.attr('data-gourl');

                if (goUrl === 'true' && goUrl === true) {
                    window.location = hrefLink;
                    return true;
                }

                $auxVar = $jQThis.next('.header-secondary-nav');

                if (Modernizr.csstransitions) {
                    /// Show the header-secondary-nav
                    $auxVar.addClass('anim-showAtAll');
                    /// Add the primaryNav the height og the visible secondary-nav
                    var auxHeight = $auxVar.outerHeight() + 20;
                    FFAPI.variables.ffmenu.primaryNavJS[0].style.height = auxHeight + 'px';
                } else {
                    /// Animate easily the primaryNav
                    FFAPI.variables.ffmenu.primaryNav.css({
                        visibility: 'hidden'
                    }).animate({
                        left: -270
                    }, FFAPI.variables.animationSpeed);

                    /// Show the header-secondary-nav
                    /// With necessary animations
                    /// and css attributes

                    $auxVar.css({
                        'visibility': 'visible',
                        'display': 'block'
                    }).animate({
                        opacity: 1
                    },
                        FFAPI.variables.animationSpeed, function () {

                            $auxVar.addClass('anim-showAtAll');
                            /// Add the primaryNav the height og the visible secondary-nav
                            var auxHeight = $auxVar.outerHeight() + 20;
                            FFAPI.variables.ffmenu.primaryNavJS[0].style.height = auxHeight + 'px';
                        });
                }


                if (Modernizr.csstransitions) {
                    /// Adds the class animIn to the parent of the primaryNav
                    FFAPI.variables.ffmenu.primaryNav.addClass(FFAPI.variables.ffmenu.animIn);
                } else {
                    /*FFAPI.variables.ffmenu.primaryNav
                    .animate({
                        'left':'-270px'},
                        FFAPI.variables.animationSpeed, function() {
                           // FFAPI.variables.ffmenu.primaryNav.css('visibility', 'hidden');
                        /* stuff to do after animation is complete 
                    });*/
                    $('.header-mobile-menu').css('display', 'block');
                    $('.header-mobile-submenu').css('display', 'none');

                }


                /// Say that the secondaryNavisVisible = true
                FFAPI.variables.ffmenu.secondaryNavVisible = true;

            },

            /**
             * Binds the Secondary Nav Click
             * @method methods.secondaryNavClick
             * @param {Object} jQThis
             */
            secondaryNavClick: function (event, jQThis) {
                //console.log('CLICK 2- Clicked the Secondary Nav');
                ///Prevent default of this
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                /// Stop propagation of the event
                /// event.stopPropagation ? event.stopPropagation() : event.returnValue = false;

                var $jQThis = $(jQThis),
                    hrefLink = $jQThis.attr('data-gourl'),
                    $jQSecondary = $jQThis.parent().parent().find(".header-mobile-submenu"),
                    $jQSecondaryNav = $jQThis.parents('ul.header-secondary-nav'),
                    $jQSecondaryNavLi = $jQSecondaryNav.parent('li');

                /// If it has link it should go to that Link
                if (hrefLink != '' && hrefLink != '#' && hrefLink != undefined) {
                    window.location = $jQThis.attr('href');
                    return true;
                } else {

                    /// Check if it's still a link and go to that link
                    if ($jQThis.has('a').length > 0) {

                        hrefLink = $jQThis.find('a').attr('href');
                        hrefLinkGoUrl = $jQThis.find('a').attr('data-gourl');

                        if (hrefLinkGoUrl != '' && hrefLinkGoUrl != '#' && hrefLinkGoUrl != undefined) {
                            window.location = hrefLink;
                            return true;
                        }
                    }

                    /// Add the primaryNav the height of the visible secondary-nav
                    var auxHeight = 670;
                    FFAPI.variables.ffmenu.primaryNavJS[0].style.height = auxHeight + 'px';
                    $jQSecondaryNavLi.css('height', auxHeight);

                    ///console.log(auxHeight);

                    if (Modernizr.csstransitions) {
                        $jQSecondaryNav.css('height', auxHeight);
                        $jQSecondaryNav.addClass(FFAPI.variables.ffmenu.animInSubmenu)
                            .removeClass(FFAPI.variables.ffmenu.animOutSubmenu);

                    } else {
                        $jQSecondaryNav.css('height', auxHeight);
                        $jQSecondaryNav.animate({
                            left: 0
                        }, FFAPI.variables.animationSpeed);
                        $('.header-mobile-menu').css('display', 'block');

                    }


                    /// Hide the submenu parent that might be open
                    $('.header-mobile-submenu').hide();

                    /// Show the next Secondary Nav
                    $jQSecondary.show();

                    /// Say that the secondaryNavisVisible = false
                    FFAPI.variables.ffmenu.secondaryNavVisible = false;

                    /// Say that the submenuMobileVisible = true;
                    FFAPI.variables.ffmenu.submenuMobileVisible = true;


                }

                return false;
            },

            /**
             * Binds the Back Nav Click
             * @method methods.secondaryNavClick
             * @param {Object} jQThis
             */
            backNavClick: function (event, jQThis) {
                //console.log('CLICK 3 - Clicked the Back Nav');

                ///Prevent default of this
                event.preventDefault();
                /// Stop propagation of the event
                event.stopPropagation();

                /// get the jqueryObject
                var $jQThis = $(jQThis);

                /// If the secondaryNav is visible
                if (FFAPI.variables.ffmenu.secondaryNavVisible === true) {
                    /// console.log('SecondaryNavVisible');
                    ///Change the visible menu variable
                    FFAPI.variables.ffmenu.secondaryNavVisible = false;
                    FFAPI.variables.ffmenu.submenuMobileVisible = false;

                    FFAPI.variables.ffmenu.primaryNavJS[0].style.height = '';
                    FFAPI.variables.ffmenu.secondaryNav.css('height', '');
                    FFAPI.variables.ffmenu.secondaryNav.attr('style', '');

                    FFAPI.variables.ffmenu.primaryNav.find('>li').css('height', '');

                    if (Modernizr.csstransitions) {
                        /// Remove the class header-animate-in-menu to all header-primary-nav
                        /// FFAPI.variables.ffmenu.primaryNav.removeClass(FFAPI.variables.ffmenu.animIn);

                        /// Remove the class header-animate-out-menu to all header-primary-nav
                        FFAPI.variables.ffmenu.primaryNav.addClass(FFAPI.variables.ffmenu.animOut);


                        /// After FFAPI.variables.animationSpeed) remove the animation classes
                        setTimeout(function () {
                            /*   FFAPI.variables.ffmenu.primaryNav.removeClass(FFAPI.variables.ffmenu.animOut);
                            FFAPI.variables.ffmenu.primaryNav.removeClass(FFAPI.variables.ffmenu.animIn);
                            FFAPI.variables.ffmenu.secondaryNav.removeClass('anim-showAtAll');
                            FFAPI.variables.ffmenu.primaryNavJS[0].style.height = '';*/
                            FFAPI.variables.ffmenu.primaryNav.removeClass(FFAPI.variables.ffmenu.animIn);
                            FFAPI.variables.ffmenu.secondaryNav.removeClass('anim-showAtAll');

                        }, FFAPI.variables.animationSpeed);

                    } else {

                        $('.header-mobile-menu').css('display', 'none');
                        $('.header-mobile-submenu').css('display', 'none');

                        FFAPI.variables.ffmenu.primaryNav.css({
                            visibility: 'visible'
                        }).animate({
                            left: 0
                        }, FFAPI.variables.animationSpeed, function () {

                            FFAPI.variables.ffmenu.secondaryNav.css('visibility', 'hidden');
                            FFAPI.variables.ffmenu.primaryNavJS[0].style = '';
                            FFAPI.variables.ffmenu.primaryNavJS[0].style.height = '600px';
                        });

                    }

                    return true;
                }

                /// If the submenuMobile is visible
                if (FFAPI.variables.ffmenu.submenuMobileVisible === true) {
                    ///console.log('ThirdNavVisible');
                    ///Change the visible menu variable
                    FFAPI.variables.ffmenu.submenuMobileVisible = false;
                    FFAPI.variables.ffmenu.secondaryNavVisible = true;

                    /// Get the jQSecondaryNav
                    var $jQSecondaryNav = $jQThis.parents('ul.header-secondary-nav');



                    if (Modernizr.csstransitions) {
                        ///Remove class of the animation of the submenu
                        FFAPI.variables.ffmenu.secondaryNav.removeClass(FFAPI.variables.ffmenu.animInSubmenu);

                        ///Add the class of the animation out of the submenu
                        $jQSecondaryNav.addClass(FFAPI.variables.ffmenu.animOutSubmenu);
                    } else {

                        $('.header-mobile-submenu').css('display', 'none');
                        $jQSecondaryNav.animate({
                            left: 270
                        }, FFAPI.variables.animationSpeed);
                    }
                    FFAPI.variables.ffmenu.primaryNavJS[0].style = '';
                    FFAPI.variables.ffmenu.primaryNavJS[0].style.height = '';
                    $jQSecondaryNav.attr('style', '');

                    var auxHeight = 670;
                    $jQSecondaryNav.css('height', auxHeight);
                    ///console.log(auxHeight);

                    ///var $jPrimaryNav = $jQThis.parents('ul.header-primary-nav');

                    FFAPI.variables.ffmenu.primaryNavJS[0].style.height = auxHeight + 'px';
                    ///console.log(auxHeight);

                    return true;

                }
            },

            /**
             * Binds the menu click behaviour
             * @method methods.mouseClickBind
             * @param {Object} jQThis - Html Element
             */
            mouseClickBind: function (jQThis) {

                /// Click on the primary Nav
                FFAPI.variables.ffmenu.headerPriNavLinks.on('click', function (event) {
                    methods.primaryNavClick(event, this);
                });

                /// Click on the secondary Nav
                FFAPI.variables.ffmenu.menu.on('click', function (event) {
                    methods.secondaryNavClick(event, this);
                });

                /// Click on the backMenu
                FFAPI.variables.ffmenu.backMenu.on('click', function (event) {
                    methods.backNavClick(event, this);
                });

            },

            /**
             * Binds the menu Hover behaviour
             * @method methods.mouseHoverBind
             * @param {Object} jQThis - Html Element
             */
            mouseHoverBind: function (jQThis) {
                /// Get all the li width to calculate the right position for the arrow.
                /// ON THE MOUSEOVER OF THE UL ///
                /// Get all the li width to calculate the right position for the arrow.
                var config = {
                    sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
                    interval: 0, // number = milliseconds for onMouseOver polling interval
                    timeout: 300 // number = milliseconds delay before onMouseOut
                };
                /// On hover the UL add the config
                hoverintent(FFAPI.variables.ffmenu.primaryNavJS[0],
                    function () {
                        // Handler in
                    }, function () {
                        // Handler out
                        FFAPI.methods.ffmenu.ffmenuOut(FFAPI.variables.ffmenu.primaryNavJS[0]);
                    }).options(config);

                /// 
                /// On hover of each li element
                /// ************************************************************
                /// TEST BECAUSE WE HAD PREVIOUS .no-touch .js-primary-nav>li
                /// ************************************************************
                /// 


                var config2 = {
                    timeout: 50
                }, i = 0;

                for (i; i < FFAPI.variables.ffmenu.meganavLiJS.length; i++) {
                    hoverintent(FFAPI.variables.ffmenu.meganavLiJS[i],
                  function () {
                      // Handler in
                      FFAPI.methods.ffmenu.ffmenuHover(this);
                  }, function () {
                      // Handler out
                  }).options(config2);
                }

                /// When mousepver on the header arrow
                FFAPI.variables.ffmenu.menuHeaderArrowJS[0].onmouseover = function () {
                    FFAPI.variables.ffmenu.arrowVisible = true;
                };
                /// When mouseout on the header arrow
                FFAPI.variables.ffmenu.menuHeaderArrowJS[0].onmouseout = function () {
                    FFAPI.variables.ffmenu.arrowVisible = false;
                };
            },




            /**
             * Initializes the menu
             * @method methods.init
             * @param {Object} options - menu options
             */
            init: function (options) {
                if (this.length) {
                    // extend options, set defaults for options not set
                    var settings = {},
                        jQDiv, arrow, allLinks, jQthis;

                    if (options) {
                        settings = $.extend(settings, defaults, options);
                    } else {
                        settings = defaults;
                    }

                    /// When it's for mouseover
                    if (settings.eventAction === 'hover') {
                        /// Add the hover method to the mobile menu
                        methods.mouseHoverBind(this);
                        /// Add the click to the mobile menu
                    } else {
                        methods.mouseClickBind(FFAPI.variables.ffmenu.headerPriNavLinks);
                    }
                }
                return this;
            }
        };

        // Method caller. Will call "init" with given parameters if no methods are called
        $.fn.ffmenu = function (method, args) {
            return this.each(function () {
                if (methods[method]) {
                    if (args) {
                        return methods[method].apply($(this), args);
                    } else {
                        return methods[method]($(this));
                    }
                } else if (typeof method === 'object' || !method) {
                    return methods.init.call($(this), method);
                } else {
                    $.error('Method ' + method + ' does not exist on jQuery.ffmenu');
                }
            });
        };
    })(jQuery);


    /**
     * ffmenu hover intent object
     * @param  {[type]} object object li
     * @method FFAPI.methods.ffmenu.ffmenuHover
     */
    FFAPI.methods.ffmenu.ffmenuHover = function (object) {
        //Variable
        var $jQThis = $(object),
            $jQThisLink = $(object).find('>a'),
            isCarousel = $jQThisLink.data('content'),
            isCarouselStart = $jQThisLink.data('slider-id'),
            $theSubMenu = $jQThis.find('>ul.header-secondary-nav'),
            i = 0;


        /// Add the inactive links to the search
        FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderSearchLink[0], 'anim-linkActive');
        FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderSearchLink[0], 'anim-linkInactive');

        FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderSearchSpan[0], 'anim-linkActive');
        FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderSearchSpan[0], 'anim-linkInactive');

        /// Add the classes from the links
        FFAPI.variables.ffmenu.headerPriNavLinks
            .removeClass('anim-linkActive')
            .addClass('anim-linkInactive');

        /// Animate this link
        $jQThisLink
            .removeClass('anim-linkInactive')
            .addClass('anim-linkActive');

        /// If the searchContainer is visible we make it hidden;
        /// if (typeof FFAPI.variables.header.searchContainerVisible != "undefined") {
        if (FFAPI.variables.header.searchContainerVisible) {
            FFAPI.variables.header.searchContainerVisible = false;

        }

        /// If it has a submenu it will show the submenu
        if ($theSubMenu.length > 0) {

            /// Show the mask
            FFAPI.methods.ffmenu.meganavMask();
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'hide');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'animation-to-show09');


            FFAPI.variables.ffmenu.secondaryNav.removeClass('anim-visible animation-to-show');
            if (!Modernizr.csstransitions) {
                FFAPI.variables.ffmenu.secondaryNav.css('visibility', 'hidden').css('display', 'none');
            } else {
                FFAPI.variables.ffmenu.secondaryNav.addClass('anim-hidden');
            }

            /// Remove the classes from the subMenu
            $theSubMenu.removeClass('anim-hidden animation-to-hide');


            /// If there is a menuVisible we just change the visiblity and the display
            if (FFAPI.variables.ffmenu.menuVisible === true) {
                if (!Modernizr.csstransitions) {
                    $theSubMenu.css('visibility', 'visible').css('display', 'block');
                } else {
                    $theSubMenu.addClass('anim-visible');
                }
            } else {
                /// We do a fadeIn animation
                if (!Modernizr.csstransitions) {
                    $theSubMenu.css({
                        visibility: 'visible',
                        display: 'block'
                    }).fadeIn('fast');
                } else {
                    $theSubMenu.addClass('animation-to-show');
                }
            }


            /// SHOW THE menuheaderArrow
            if (!Modernizr.csstransitions) {
                FFAPI.variables.ffmenu.menuHeaderArrow.animate({
                    'left': FFAPI.variables.ffmenu.arrowPosFinal[$jQThis.index()]
                }).show();
            } else {
                FFAPI.variables.ffmenu.menuHeaderArrowJS[0].style.left = FFAPI.variables.ffmenu.arrowPosFinal[$jQThis.index()] + 'px';
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-hide');
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-show');
            }
            /// END SHOW THE menuheaderArrow



            /// Define that there is a menuVisible
            FFAPI.variables.ffmenu.menuVisible = true;




            /// Redraw the slider if necessary and if the content is a carousel
            if (isCarousel === 'carousel' && FFAPI.variables.jsSliderSingle.length > 0) {
                for (i; i < FFAPI.variables.jsSliderSingleId.length; i++) {
                    /// If the slider was already started we redraw the Slider
                    if (FFAPI.variables.jsSliderSingleId[i] === isCarouselStart) {
                        FFAPI.variables.jsSliderSingle[i].redrawSlider();
                        i = FFAPI.variables.jsSliderSingleId.length;
                    }
                }
            }


            /// If it doesn't have a submenu to make visible
        } else { /// Else it will fadeout the arrow and the visible meganav

            /// Hide the mask
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'animation-to-show09');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'hide');

            ///HIDE THE ARROW
            if (!Modernizr.csstransitions) {
                FFAPI.variables.ffmenu.menuHeaderArrow.hide();
            } else {
                /// Remove the class of the arrowBottom anim-showAtAll
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-show');
                /// Add the class of the arrowBottom anim-notShowAtAll
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-hide');
            }
            ///END HIDE THE ARROW


            /// Change the visibility of the menuHeaderNavName
            FFAPI.variables.ffmenu.secondaryNav
                .removeClass('animation-to-show')
                .removeClass('anim-visible')
                .addClass('anim-hidden');

            if (!Modernizr.csstransitions) {
                FFAPI.variables.ffmenu.secondaryNav.css({
                    visibility: 'hidden',
                    display: 'none'
                }).fadeOut('fast');
            }



            /// No menu visible
            FFAPI.variables.ffmenu.menuVisible = false;



        }
    }

    /**
     * ffmenu hover intent out object
     * @param  {[type]} object object li
     * @method FFAPI.methods.ffmenu.ffmenuOut
     */
    FFAPI.methods.ffmenu.ffmenuOut = function (object) {
        if (FFAPI.variables.ffmenu.arrowVisible === false) {
            ///Animations to hide the secondarynav
            if (!Modernizr.csstransitions) {
                /// Hide the secondaryNav
                FFAPI.variables.ffmenu.secondaryNav.removeClass('animation-to-show anim-visible').addClass('animation-to-hide').fadeOut(FFAPI.variables.animationSpeed, function () {
                    // $(object).css('visibility', 'hidden');
                });
                /// Hide the arrow
                FFAPI.variables.ffmenu.menuHeaderArrow.hide();
            } else {
                /// Hide the secondaryNav
                FFAPI.variables.ffmenu.secondaryNav.removeClass('animation-to-show anim-visible').addClass('animation-to-hide');
                FFAPI.variables.ffmenu.secondaryNav.removeClass('animation-to-hide')
                /// Hide the arrow
                /// Remove the class of the arrowBottom anim-showAtAll
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-show');
                /// Add the class of the arrowBottom anim-notShowAtAll
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderArrowJS[0], 'animation-to-hide');
            }

            /// Hide the mask
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'animation-to-show09');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.meganavMaskJS[0], 'hide');


            /// Remove the classes from the links
            FFAPI.variables.ffmenu.headerPriNavLinks
                .removeClass('anim-linkInactive')
                .addClass('anim-linkActive');

            /// Remove the inactive links from the search
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderSearchLink[0], 'anim-linkInactive');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderSearchLink[0], 'anim-linkActive');


            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderSearchSpan[0], 'anim-linkInactive');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderSearchSpan[0], 'anim-linkActive');

            FFAPI.variables.ffmenu.menuVisible = false;


        } // function = onMouseOut callback (REQUIRED)
    }

    FFAPI.variables.ffmenu.visibleMenu = false;

    FFAPI.variables.ffmenu.touchDesktopMenu = function () {
        ///on touch devices show submenu
        $('.touch .js-primary-link').on('click', function (event) {
            event.preventDefault();
            FFAPI.variables.ffmenu.visibleMenu = true;
            FFAPI.methods.ffmenu.ffmenuHover($(this).parent('li'));
        });
    };


    /// on touchstart hide the ffmenu if it's shown
    $(document).on('touchstart', function (event) {
        /// Check if it's not inside the primaryNav
        if (!FFAPI.variables.ffmenu.primaryNav.is(event.target)
            && FFAPI.variables.ffmenu.primaryNav.has(event.target).length === 0) {
            if (FFAPI.variables.ffmenu.visibleMenu === true) {
                FFAPI.methods.ffmenu.ffmenuOut();
            }
        }
    });



    /**
     * When transforming the mobile menu to the meganav we need to calculate the arrow Position
     * @method FFAPI.methods.ffmenu.calculateArrowPosition
     */
    FFAPI.methods.ffmenu.calculateArrowPosition = function () {
        if (FFAPI.variables.ffmenu.arrowPos.length === 0) {
            var i = 0;
            for (i; i < FFAPI.variables.ffmenu.primaryLinkJS.length; i++) {
                /// Get the width of the element and add a great formula to achieve this result
                var outerWidth = FFAPI.methods.getElementWidth(FFAPI.variables.ffmenu.primaryLinkJS[i]),
                    theWidth = outerWidth - 20,
                    diffWidth = outerWidth - theWidth,
                    halfWidth = theWidth / 2,
                    arrowDifferenceWidth = 10;

                /// Add the final width of the elements
                FFAPI.variables.ffmenu.arrowPosNumber += outerWidth;
                /// Add it to the array
                FFAPI.variables.ffmenu.arrowPos.push(FFAPI.variables.ffmenu.arrowPosNumber);
                /// Add to menuPosFinal array the correct value to move the arrow
                FFAPI.variables.ffmenu.arrowPosFinal.push((FFAPI.variables.ffmenu.arrowPos[i] - diffWidth - arrowDifferenceWidth - halfWidth));

            }
        }
    };



    /**
    Used on the megaMenu we have on the Header
    It's the search mobile part. This file is always loaded on mobile
    **/


    /**
     * FFAPI variable to check if the search is visible
     * <b><i>FFAPI.variables.ffmenu.searchIsVisible = false;<br /></i></b>
     * @property FFAPI.variables.ffmenu.searchIsVisible
     * @type String
     */
    FFAPI.variables.ffmenu.searchIsVisible = false;
    /**
     * FFAPI variable to check what gender is selected
     * <b><i>FFAPI.variables.ffmenu.genderSelected = 'women';<br /></i></b>
     * @property FFAPI.variables.ffmenu.genderSelected
     * @type String
     */
    FFAPI.variables.ffmenu.genderSelected = 'women';


    /**
     * FFAPI object of the gender selection container
     * <b><i>FFAPI.variables.ffmenu.genderSelectionContainer = $('.gender-selection-container');<br /></i></b>
     * @property FFAPI.variables.ffmenu.genderSelectionContainer
     * @type Object
     */
    FFAPI.variables.ffmenu.genderSelectionContainer = $('.gender-selection-container');
    /**
     * FFAPI button men Javascript Object
     * <b><i>FFAPI.variables.ffmenu.buttonMen = document.getElementsByClassName('button-men');<br /></i></b>
     * @property FFAPI.variables.ffmenu.buttonMen
     * @type Object
     */
    FFAPI.variables.ffmenu.buttonMen = document.getElementsByClassName('button-men');
    /**
     * FFAPI button women Javascript Object
     * <b><i>FFAPI.variables.ffmenu.buttonWomen = document.getElementsByClassName('button-women');<br /></i></b>
     * @property FFAPI.variables.ffmenu.buttonWomen
     * @type Object
     */
    FFAPI.variables.ffmenu.buttonWomen = document.getElementsByClassName('button-women');
    /**
     * FFAPI arrow gender men Javascript Object
     * <b><i>FFAPI.variables.ffmenu.arrowGenderMen = document.getElementsByClassName('arrow-gender-men');<br /></i></b>
     * @property FFAPI.variables.ffmenu.arrowGenderMen
     * @type Object
     */
    FFAPI.variables.ffmenu.arrowGenderMen = document.getElementsByClassName('arrow-gender-men');
    /**
     * FFAPI arrow gender women Javascript Object
     * <b><i>FFAPI.variables.ffmenu.arrowGenderWomen = document.getElementsByClassName('arrow-gender-women');<br /></i></b>
     * @property FFAPI.variables.ffmenu.arrowGenderWomen
     * @type Object
     */
    FFAPI.variables.ffmenu.arrowGenderWomen = document.getElementsByClassName('arrow-gender-women');
    /**
     * FFAPI Search Mobile Input Javascript Object
     * <b><i>FFAPI.variables.ffmenu.searchMobileInput = document.getElementsByClassName('search-mobile-input');<br /></i></b>
     * @property FFAPI.variables.ffmenu.searchMobileInput
     * @type Object
     */
    FFAPI.variables.ffmenu.searchMobileInput = document.getElementsByClassName('search-mobile-input');
    /**
     * FFAPI Gender selected Radio Button Javascript Object
     * <b><i>FFAPI.variables.ffmenu.genderSelectedRadio = document.getElementsByClassName('mobile_gender_search');<br /></i></b>
     * @property FFAPI.variables.ffmenu.genderSelectedRadio
     * @type Object
     */
    FFAPI.variables.ffmenu.genderSelectedRadio = document.getElementsByName('mobile_gender_search');
    /**
     * FFAPI Header Nav Javascript Object
     * <b><i>FFAPI.variables.ffmenu.headerNav = document.getElementsByClassName('header-nav');<br /></i></b>
     * @property FFAPI.variables.ffmenu.headerNav
     * @type Object
     */
    FFAPI.variables.ffmenu.headerNav = document.getElementsByClassName('header-nav');
    /**
     * FFAPI Mobile Search Close Icon Javascript Object
     * <b><i>FFAPI.variables.ffmenu.mobileSearchCloseIcon = document.getElementsByClassName('mobile-search-closeIcon');<br /></i></b>
     * @property FFAPI.variables.ffmenu.mobileSearchCloseIcon
     * @type Object
     */
    FFAPI.variables.ffmenu.mobileSearchCloseIcon = document.getElementsByClassName('mobile-search-closeIcon');
    /**
     * FFAPI Close search mobile Javascript Object
     * <b><i>FFAPI.variables.ffmenu.mobileSearchClose = document.getElementsByClassName('close-search-mobile');<br /></i></b>
     * @property FFAPI.variables.ffmenu.mobileSearchClose
     * @type Object
     */
    FFAPI.variables.ffmenu.mobileSearchClose = document.getElementsByClassName('close-search-mobile');


    /**
     * When clicking on select men on the mobile search
     * @method FFAPI.methods.ffmenu.selectMen
     */
    FFAPI.methods.ffmenu.selectMen = function (event) {
        event.preventDefault(); event.stopPropagation();
        if (FFAPI.variables.ffmenu.genderSelected === 'women') {

            /// Change the gender to men
            FFAPI.variables.ffmenu.genderSelected = 'men';

            /// Change the classes to active
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.buttonWomen[0], 'button-gender-active');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.buttonWomen[0], 'button-gender-inactive');
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.buttonMen[0], 'button-gender-inactive');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.buttonMen[0], 'button-gender-active');

            /// Show the arrow of Gender Women
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.arrowGenderMen[0], 'hide');
            /// Hide the arrow of Gender Men
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderWomen[0], 'hide');

            /// Make the radioButton value to men value
            FFAPI.variables.ffmenu.genderSelectedRadio[1].checked = true;

            /// Set the Placeholder of the search input
            FFAPI.variables.ffmenu.searchMobileInput[0].setAttribute("placeholder", FFAPI.variables.ffmenu.buttonMen[0].getAttribute('data-placeholder'));
            /// Focus on the search-monile-input
            FFAPI.variables.ffmenu.searchMobileInput[0].focus();

        } else {
            return;
        }
    }

    /**
     * When clicking on select womemen on the mobile search
     * @method FFAPI.methods.ffmenu.selectWomen
     */
    FFAPI.methods.ffmenu.selectWomen = function (event) {
        event.preventDefault(); event.stopPropagation();
        if (FFAPI.variables.ffmenu.genderSelected === 'men') {

            /// Change the gender to men
            FFAPI.variables.ffmenu.genderSelected = 'women';
            /// Change the classes to active
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.buttonMen[0], 'button-gender-active');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.buttonMen[0], 'button-gender-inactive');
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.buttonWomen[0], 'button-gender-inactive');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.buttonWomen[0], 'button-gender-active');

            /// Show the arrow of Gender Women
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.arrowGenderWomen[0], 'hide');
            /// Hide the arrow of Gender Men
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderMen[0], 'hide');

            /// Make the radioButton value to men value
            FFAPI.variables.ffmenu.genderSelectedRadio[0].checked = true;

            /// Set the placeholder value to the one defined on the mobile search
            FFAPI.variables.ffmenu.searchMobileInput[0].setAttribute("placeholder", FFAPI.variables.ffmenu.buttonWomen[0].getAttribute('data-placeholder'));
            /// Set the Placeholder of the search input
            FFAPI.variables.ffmenu.searchMobileInput[0].focus();

        } else {
            return;
        }
    }


    /**
     * When focus on the search mobile input
     * @method FFAPI.methods.ffmenu.searchFocusEvent
     */
    FFAPI.methods.ffmenu.searchFocusEvent = function () {
        if (FFAPI.variables.ffmenu.searchIsVisible === false) {
            /// Declare the searchIsVisible to true
            FFAPI.variables.ffmenu.searchIsVisible = true;
            /// Remove the class hide from the mobileSearchCloseIcon
            if (FFAPI.variables.ffmenu.searchMobileInput[0].value.length > 0) {
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.mobileSearchCloseIcon[0], 'hide');
            }
            /// Remove the class hide from the mobileSearchClose
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.mobileSearchClose[0], 'hide');
            /// Add the bind click to the close icon
            FFAPI.methods.bindElemClick(FFAPI.variables.ffmenu.mobileSearchClose, FFAPI.methods.ffmenu.searchHideEvent);

            ///JQUERY ANIMATION///
            FFAPI.variables.ffmenu.genderSelectionContainer.slideDown(FFAPI.variables.animationSpeed, function () {
                if (FFAPI.variables.ffmenu.genderSelected === 'men') {
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.arrowGenderMen[0], 'hide');
                    FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderWomen[0], 'hide');
                } else {
                    FFAPI.methods.removeClass(FFAPI.variables.ffmenu.arrowGenderWomen[0], 'hide');
                    FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderMen[0], 'hide');
                }

                /// Calculate the height of the mobleSearchClose
                var auxHeight = window.innerHeight - FFAPI.methods.getElementHeight(document.getElementsByClassName('header-search-mobile')[0]);
                FFAPI.variables.ffmenu.mobileSearchClose[0].style.height = auxHeight + 'px';

            });

            /// FadeOut the primaryNav menu
            if (!Modernizr.csstransitions) {
                FFAPI.methods.fadeOut(FFAPI.variables.ffmenu.primaryNavJS[0]);
            } else {
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.primaryNavJS[0], 'animation-fade-in');
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.primaryNavJS[0], 'animation-fade-out');
            }

            if (FFAPI.variables.ffmenu.genderSelected === 'men') {
                /// Set the placeholder value to the one defined on the mobile search
                FFAPI.variables.ffmenu.searchMobileInput[0].setAttribute("placeholder", FFAPI.variables.ffmenu.buttonMen[0].getAttribute('data-placeholder'));
            } else {
                /// Set the placeholder value to the one defined on the mobile search
                FFAPI.variables.ffmenu.searchMobileInput[0].setAttribute("placeholder", FFAPI.variables.ffmenu.buttonWomen[0].getAttribute('data-placeholder'));
            }

        } else {
            return false;
        }
    };

    /**
     * On hiding the mobile search input
     * @method FFAPI.methods.ffmenu.searchHideEvent
     */
    FFAPI.methods.ffmenu.searchHideEvent = function () {
        if (FFAPI.variables.ffmenu.searchIsVisible === true) {
            /// Declare the searchIsVisible to false
            FFAPI.variables.ffmenu.searchIsVisible = false;
            /// Add the class to the closeIcon and arrow genders
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.mobileSearchCloseIcon[0], 'hide');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderWomen[0], 'hide');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.arrowGenderMen[0], 'hide');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.mobileSearchClose[0], 'hide');

            /// Set the value of the input to empty
            FFAPI.variables.ffmenu.searchMobileInput[0].value = '';

            /// Set the placeholder value to the one defined on the mobile search
            FFAPI.variables.ffmenu.searchMobileInput[0].setAttribute("placeholder", FFAPI.variables.ffmenu.searchMobileInput[0].getAttribute('data-placeholder'));

            ///JQUERY ANIMATION///
            FFAPI.variables.ffmenu.genderSelectionContainer.slideUp(FFAPI.variables.animationSpeed);

            /// FadeIn the primaryNav menu
            if (!Modernizr.csstransitions) {
                FFAPI.methods.fadeIn(FFAPI.variables.ffmenu.primaryNavJS[0], 0);
            } else {
                FFAPI.methods.removeClass(FFAPI.variables.ffmenu.primaryNavJS[0], 'animation-fade-out');
                FFAPI.methods.addClass(FFAPI.variables.ffmenu.primaryNavJS[0], 'animation-fade-in');
            }

            /// Unbinds the click to the close icon
            FFAPI.methods.unbindElemClick(FFAPI.variables.ffmenu.mobileSearchClose, FFAPI.methods.ffmenu.searchHideEvent);
        } else {
            return false;
        }
    };

    /**
     * On clicking on the clocse icon on the input search of mobile
     * @method FFAPI.methods.ffmenu.closeIconBehaviour
     */
    FFAPI.methods.ffmenu.closeIconBehaviour = function () {
        /// Set the value of the input to empty
        FFAPI.variables.ffmenu.searchMobileInput[0].value = '';
        /// Focus on the input
        FFAPI.variables.ffmenu.searchMobileInput[0].focus();
        /// Hide th close Icon
        FFAPI.methods.addClass(FFAPI.variables.ffmenu.mobileSearchCloseIcon[0], 'hide');
    };


    /**
     * The behaviors of the search mobile input keys
     * @method FFAPI.methods.ffmenu.searchMobileInputKeys
     */
    FFAPI.methods.ffmenu.searchMobileInputKeys = function () {
        if (ffbrowser.isIE8 === false) {

            if(FFAPI.variables.ffmenu.searchMobileInput[0]) {
                FFAPI.variables.ffmenu.searchMobileInput[0].onkeydown = function (event) {

                    var keycode = ('which' in event) ? event.which : event.keyCode;
                    if (keycode === FFAPI.keycode.enter) {
                        event.preventDefault();
                        var selectedValue = '', searchText = '';
                        for (var i = 0; i < FFAPI.variables.ffmenu.genderSelectedRadio.length; i++) {
                            if (FFAPI.variables.ffmenu.genderSelectedRadio[i].checked) selectedValue = FFAPI.variables.ffmenu.genderSelectedRadio[i].value;
                        }

                        searchText = FFAPI.variables.ffmenu.searchMobileInput[0].value;

                        ///console.log('just search for ' + searchText + ' on gender ' + selectedValue);
                        FFAPI.methods.redirectToSearchResults(searchText, selectedValue);
                    }
                }

                FFAPI.variables.ffmenu.searchMobileInput[0].onkeyup = function (event) {
                    if (FFAPI.variables.ffmenu.searchMobileInput[0].value.length > 0) {
                        FFAPI.methods.removeClass(FFAPI.variables.ffmenu.mobileSearchCloseIcon[0], 'hide');
                    } else {
                        FFAPI.methods.addClass(FFAPI.variables.ffmenu.mobileSearchCloseIcon[0], 'hide');
                    }
                    return false;
                } 
            }
        }
    }

    /**
     * Add the meganav mask the necessary height
     * @method FFAPI.methods.ffmenu.meganavMask
     */
    FFAPI.methods.ffmenu.meganavMask = function () {

        var height = FFAPI.methods.getDocHeight() - FFAPI.methods.getElementHeight(document.querySelectorAll('header')[0]);
        /// Define the meganavaMask height
        if(FFAPI.variables.ffmenu.meganavMaskJS[0]) {
            FFAPI.variables.ffmenu.meganavMaskJS[0].style.height = height + 'px';
        }
    }



    if (ffbrowser.isIE8 !== true) {
        ///******************///
        ///     BINDINGS
        ///******************///
        /// Binding the clicks to the buttons
        /// Select women Button
        FFAPI.methods.bindElemClick(FFAPI.variables.ffmenu.buttonWomen, FFAPI.methods.ffmenu.selectWomen);
        /// Select men Button
        FFAPI.methods.bindElemClick(FFAPI.variables.ffmenu.buttonMen, FFAPI.methods.ffmenu.selectMen);
        /// Binding the click to the close icon
        FFAPI.methods.bindElemClick(FFAPI.variables.ffmenu.mobileSearchCloseIcon, FFAPI.methods.ffmenu.closeIconBehaviour);
        /// Binding on focus event of the search-mobile-input
        if (FFAPI.variables.ffmenu.searchMobileInput[0]) {
            FFAPI.variables.ffmenu.searchMobileInput[0].onfocus = FFAPI.methods.ffmenu.searchFocusEvent;
        }
        /// Binding on blur event of the search-mobile-input - to close the search-mobile-input
        /// FFAPI.variables.ffmenu.searchMobileInput[0].onblur = FFAPI.methods.ffmenu.searchHideEvent;
        /// Adding the keys behaviour of the inputs
        FFAPI.methods.ffmenu.searchMobileInputKeys();
    }

});