/**
* This module contains global methods for the listing
* @module COUNTRY SELECTOR v2.0
*/


//COUNTRY SELECTION V2.0


//VARIABLES
FFAPI.variables.country = FFAPI.variables.country || {};
FFAPI.methods.country = FFAPI.methods.country || {};

FFAPI.variables.country.windowInnerWidth = window.innerWidth;
FFAPI.variables.country.header = document.getElementsByTagName('header')[0];
FFAPI.variables.country.headerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.header);
FFAPI.variables.country.infoBannersContainer = document.getElementsByClassName('info-banners-container')[0];
FFAPI.variables.country.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.infoBannersContainer);
FFAPI.variables.country.sidekick = document.getElementsByClassName('country-header')[0];
FFAPI.variables.country.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.sidekick);
FFAPI.variables.country.sidekickDiv = document.getElementsByClassName('sidekick-country-selector')[0];
FFAPI.variables.country.countryList = document.getElementsByClassName('country-list')[0];
FFAPI.variables.country.searchInputDesktop = document.getElementsByClassName('country-desktop-input')[0];
FFAPI.variables.country.searchInputMobile = document.getElementsByClassName('country-mobile-input')[0];
FFAPI.variables.country.clearButton = document.getElementById('clearResultsBtn');
FFAPI.variables.country.clearInput = document.getElementsByClassName('clear-input');
FFAPI.variables.country.searchInput = document.getElementsByClassName('form-search-country-input');



//JQuery / others
var htmlTag = $('html'),
    searchInputDesktop = $('.country-desktop-input'),
    searchInputMobile = $('.country-mobile-input'),
    inputs = $('.form-search-country-input'),
    countryFiltersWrapper = $('.country-filters-wrapper'),
    clearButtonSearch = $('#clearResultsBtn'),
    htmlHasIpadClass = false,
    htmlHasAndroidClass = false,
    htmlHasIphoneClass = false,
    desktopInputIsFocused = false,
    htmlHasTouchClass = false,
    htmlHasMobileClass = false,
    mobileInputIsFocused = false,
    //helper
    headerShadowHeight = 2;



//GLOBAL SETTINGS
window.scrollTo(0, 0);

//CHECKS IF IS IPAD
htmlTag.hasClass('ipad') ? htmlHasIpadClass = true : htmlHasIpadClass = false;

//CHECKS IF IS ANDROID
htmlTag.hasClass('android') ? htmlHasAndroidClass = true : htmlHasAndroidClass = false;

//CHECKS IF IS IPHONE
htmlTag.hasClass('iphone') ? htmlHasIphoneClass = true : htmlHasIphoneClass = false;

//CHECKS IF IS MOBILE DEVICE
htmlTag.hasClass('mobile-device') ? htmlHasMobileClass = true : htmlHasMobileClass = false;

//CHECKS IF IS TOUCH DEVICE
htmlTag.hasClass('touch') ? htmlHasTouchClass = true : htmlHasTouchClass = false;


//TO CONTROL THE ANIMATION LATTER ON INPUT FOCUSOUT AND ON IPAD/ANDROID
searchInputDesktop.on('focusin', function () {
    desktopInputIsFocused = true;
    if (htmlHasIpadClass || (htmlHasAndroidClass && FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet)) {
        FFAPI.methods.country.sidekickAnimationState(true);
    }
});

//TO CONTROL THE ANIMATION LATTER ON INPUT FOCUSOUT AND ON IPAD/ANDROID
searchInputDesktop.on('focusout', function () {
    desktopInputIsFocused = false;
    if (htmlHasIpadClass || (htmlHasAndroidClass && FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet)) {
        FFAPI.methods.country.sidekickAnimationState(true);
    }
});


//FUNCTION TO ANIMATE THE SIDEKICK 
FFAPI.methods.country.sidekickAnimationOnScroll = function () {
    'use strict';

    var scrollY;
    //set the variable according to the browser
    htmlTag.hasClass('msie') ? scrollY = document.documentElement.scrollTop : scrollY = window.scrollY;

    //ANIMATE ONLY WHEN
    if ((FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet + 1) && (!(htmlHasIpadClass && desktopInputIsFocused)) && (!(htmlHasAndroidClass && desktopInputIsFocused))) {
        //set the position of the info banners container and the sidekick according to the scroll position
        if (scrollY > 30) {
            FFAPI.variables.country.infoBannersContainer.style.top = (FFAPI.variables.country.headerHeight - FFAPI.variables.country.infoBannersContainerHeight - 120) + 'px';
            FFAPI.variables.country.sidekick.style.top = (FFAPI.variables.country.headerHeight - 110) + 'px';
        } else if (scrollY < 30) {
            FFAPI.variables.country.infoBannersContainer.style.top = (FFAPI.variables.country.headerHeight - headerShadowHeight) + 'px';
            FFAPI.variables.country.sidekick.style.top = (FFAPI.variables.country.headerHeight + FFAPI.variables.country.infoBannersContainerHeight - headerShadowHeight) + 'px';
        }
        FFAPI.plugins.scroll.headerOffset = FFAPI.variables.country.headerHeight + FFAPI.plugins.scroll.extraOffset;
    }
}

//THIS FUNCTION DETERMINATES IF THE SIDEKICK WILL OR NOT ANIMATE ACCORDING TO THE WINDOW WIDTH
FFAPI.methods.country.sidekickAnimationState = function (reSetMarginToList) {
    'use strict';
    FFAPI.variables.country.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.sidekick);
    FFAPI.variables.country.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.infoBannersContainer);

    if (FFAPI.variables.country.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
        //RESET ANIMATION OF THE SIDEKICK
        FFAPI.variables.country.infoBannersContainer.style.cssText = 'position:relative;top:0;';
        FFAPI.variables.country.sidekick.style.cssText = 'position:relative;top:0;';
        FFAPI.variables.country.countryList.style.marginTop = '0';

    } else if ((htmlHasIpadClass && desktopInputIsFocused) || (htmlHasAndroidClass && desktopInputIsFocused && FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet)) {
        //RESET THE SIDEKCICK ANIMATION
        FFAPI.variables.country.infoBannersContainer.style.cssText = 'position:relative;top:0px;';
        FFAPI.variables.country.sidekick.style.cssText = 'position:relative;top:0;';
        FFAPI.variables.country.countryList.style.marginTop = '0';
    } else {
        //ACTIVATE THE SIDEKCICK ANIMATION
        FFAPI.variables.country.infoBannersContainer.style.cssText = 'position:fixed;';
        FFAPI.variables.country.sidekick.style.cssText = 'position:fixed;';

        //RESET VARS
        FFAPI.variables.country.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.infoBannersContainer);
        FFAPI.variables.country.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.sidekick);

        if (reSetMarginToList) {
            //SET THE MARGIN-TOP TO THE .COUNTRY-LIST ACCORDING TO THE HEIGHT OF THE ANIMATION-CONTAINER(SIDEKICK)
            FFAPI.variables.country.countryList.style.marginTop = FFAPI.variables.country.infoBannersContainerHeight + FFAPI.variables.country.sidekickHeight + 'px';
        }
    }
};


//FUNCTION TO PASS THE VALUE FROM ONE INPUT TO THE OTHER
FFAPI.methods.country.sameInputValues = function () {
    $(FFAPI.variables.country.searchInputMobile).on('keyup', function () {
        FFAPI.variables.country.searchInputDesktop.value = this.value;
    });

    $(FFAPI.variables.country.searchInputDesktop).on('keyup', function () {
        FFAPI.variables.country.searchInputMobile.value = this.value;
    });
};


//FUNCTION TO HIDE THE SIDEKICK WHEN THE USER STARTS SEARCHING ON MOBILE
FFAPI.methods.country.hideSidekickOnSearch = function () {
    var valueOfInputs = searchInputMobile.val();
    console.log(valueOfInputs);
    if (valueOfInputs !== '' && FFAPI.variables.country.windowInnerWidth < FFAPI.responsive.fablet) {
        FFAPI.variables.country.sidekick.style.display = 'none';
    } else {
        FFAPI.variables.country.sidekick.style.display = 'block';
    }   
};


FFAPI.methods.country.calcSidekickPosition = function (headerHeight) {
    'use strict';
    //RECALCULATE VARIABLES
    FFAPI.variables.country.headerHeight = headerHeight || FFAPI.methods.getElementHeight(FFAPI.variables.country.header);
    FFAPI.variables.country.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.infoBannersContainer);
    FFAPI.variables.country.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.country.sidekick);
    FFAPI.variables.country.windowInnerWidth = window.innerWidth;

    var scrollY;
    //set the variable according to the browser
    htmlTag.hasClass('msie') ? scrollY = document.documentElement.scrollTop : scrollY = window.scrollY;

    //RUN FUNCTIONS
    FFAPI.methods.country.sidekickAnimationState(true);

    //TO AVOID BUGS ON ANDROID
    FFAPI.methods.country.sidekickAnimationOnScroll();
};


$('header').on('heightChanged', function (e, headerHeight) {
    setTimeout(function () {
        FFAPI.methods.country.calcSidekickPosition(headerHeight);
    }, 150);
});


$(window).smartresize(function () {
    'use strict';
    FFAPI.methods.country.calcSidekickPosition();
    FFAPI.variables.country.hideSidekickOnSearch();
});


//FUNCTION ON SCROLL
$(document).on('scroll', function () {
    'use strict';
    var scrollY;
    //set the variable according to the browser
    htmlTag.hasClass('msie') ? scrollY = document.documentElement.scrollTop : scrollY = window.scrollY;

    //RUN FUNCTIONS ON SCROLL
    FFAPI.methods.country.sidekickAnimationOnScroll();
});

//RUN FUNCTIONS ON PAGE LOAD
FFAPI.methods.country.sidekickAnimationState(true);
FFAPI.methods.country.sidekickAnimationOnScroll();
FFAPI.methods.country.sameInputValues();
FFAPI.methods.country.hideSidekickOnSearch();




//WHEN CLOSING THE INFO BANNER RUN THE FUNCTION TO RECALCULATE THE ANIMATION OF THE SIDEKICK
$('.close-info-banner').on('click', function () {
    setTimeout(function () {
        if (FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet) {
            FFAPI.methods.country.sidekickAnimationState(false);
            FFAPI.methods.country.sidekickAnimationOnScroll();
        }
    }, FFAPI.variables.animationSpeed);
});

FFAPI.methods.country.autoCloseInfoBanner = function () {
    FFAPI.variables.infoBanner = document.getElementsByClassName('info');

    for (var i = 0; i < FFAPI.variables.infoBanner.length; i++) {
        var attrState = FFAPI.variables.infoBanner[i].getAttribute('data-auto-close');
        if (attrState === 'true') {
            /*FFAPI.methods.elSlideUp($(FFAPI.variables.infoBanner[i]), FFAPI.variables.slideUpSpeed);
            setTimeout(function () {
                if (FFAPI.variables.country.windowInnerWidth > FFAPI.responsive.fablet) {
                    FFAPI.methods.country.sidekickAnimationState(false);
                    FFAPI.methods.country.sidekickAnimationOnScroll();
                }
            }, (FFAPI.variables.slideUpSpeed + FFAPI.variables.animationSpeed));*/
        }
    }
};

FFAPI.methods.country.autoCloseInfoBanner();