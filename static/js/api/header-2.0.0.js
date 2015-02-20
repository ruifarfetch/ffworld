
    /**
 * This module contains global methods of our API
 * @module FFAPI
 *
 *  DEPENDENCIES
 *  jquery.ffmenu.js - FFAPI.variables.ffmenu.headerPriNavLinks
 *  responsive-1.0.0.js - FFAPI.responsive.mediaQuerieHeader
 *
 *
 */
/**
 Header javaScript file. It contains the function to make the top drawer work
 @deprecated api/
 @class header-2.0.0.js
 **/
/*===============================================================
 =      Top Drawer Animations to open the different options     =
 ================================================================*/
////try {
/**
 * Header variables definition
 * <b><i>FFAPI.variables.header = FFAPI.variables.header || {};<br /></i></b>
 * @property FFAPI.variables.header
 * @type Object
 */
FFAPI.variables.header = FFAPI.variables.header || {};
/**
 * Header methods definition
 * <b><i>FFAPI.methods.header = FFAPI.methods.header || {};<br /></i></b>
 * @property FFAPI.methods.header
 * @type Object
 */
FFAPI.methods.header = FFAPI.methods.header || {};
/**
 * FFAPI Variables visibleTab. The Tab that is visible.
 * <b><i>FFAPI.variables.header.visibleTab = '';<br /></i></b>
 * @property FFAPI.variables.header.visibleTab
 * @type String
 */
FFAPI.variables.header.visibleTab = '';
/**
 * FFAPI Variables tab Opener Link. It saves the link that made the Tab open. To remove the active class if another is pressed
 * <b><i>FFAPI.variables.header.tabOpenerLink = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenerLink
 * @type String
 */
FFAPI.variables.header.tabOpenerLink = '';
/**
 * FFAPI Variables tab Open Class. The class to add to the link when it's open
 * <b><i>FFAPI.variables.header.tabOpenClass = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenClass
 * @type String
 */
FFAPI.variables.header.tabOpenClass = '';
/**
 * FFAPI Variables tab clicked option
 * <b><i>FFAPI.variables.header.tabOpenClicked = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenClicked
 * @type String
 */
FFAPI.variables.header.tabOpenClicked = '';
/**
 * FFAPI Variables tab validation
 * <b><i>FFAPI.variables.header.tabOpenVal = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenVal
 * @type String
 */
FFAPI.variables.header.tabOpenVal = '';
/**
 * FFAPI Variables tab was opened before
 * <b><i>FFAPI.variables.header.tabOpenedBefore = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenedBefore
 * @type String
 */
FFAPI.variables.header.tabOpenedBefore = '';


/**
 * FFAPI Variables tab Container Height. Height of the Tabs Container
 * <b><i>FFAPI.variables.header.tabContainerHeight = 0;<br /></i></b>
 * @property FFAPI.variables.header.tabContainerHeight
 * @type String
 */
FFAPI.variables.header.tabContainerHeight = 0;
/**
 * FFAPI Variables header Container Height. Height of the Header
 * <b><i>FFAPI.variables.header.headerContainerHeight = 0;<br /></i></b>
 * @property FFAPI.variables.header.headerContainerHeight
 * @type String
 */
FFAPI.variables.header.headerContainerHeight = 75;
/**
 * FFAPI Variables resizing window time.
 * <b><i>FFAPI.variables.header.resizeWindowTime = 300;<br /></i></b>
 * @property FFAPI.variables.header.resizing
 * @type String
 */
FFAPI.variables.header.resizeWindowTime = 300;
/**
 * FFAPI Variables resizing. It checks if the window is resizing. Once you stop resizing, after FFAPI.variables.resizeWindowTime it executes a function
 * <b><i>FFAPI.variables.header.resizing = '';<br /></i></b>
 * @property FFAPI.variables.header.resizing
 * @type String
 */
FFAPI.variables.header.resizing = '';
/**
 * FFAPI Variables arrow Position number. Check the position of the arrow necessary for our element
 * <b><i>FFAPI.variables.header.arrowPosNumber = 0;<br /></i></b>
 * @property FFAPI.variables.header.arrowPosNumber
 * @type String
 */
FFAPI.variables.header.arrowPosNumber = 0;
/**
 * FFAPI Variables menu position array. Saves the width of each menu link
 * <b><i>FFAPI.variables.header.menuPos = [];<br /></i></b>
 * @property FFAPI.variables.header.menuPos
 * @type String
 */
FFAPI.variables.header.menuPos = [];
/**
 * FFAPI Variables menu position array. Saves the position of the arrow for each menu link
 * <b><i>FFAPI.variables.header.menuPosFinal = [];<br /></i></b>
 * @property FFAPI.variables.header.menuPosFinal
 * @type String
 */
FFAPI.variables.header.menuPosFinal = [];
/**
 * FFAPI Variables Header Slider ID.
 * <b><i>FFAPI.variables.header.headerSliderId = ''<br /></i></b>
 * @property FFAPI.variables.header.headerSliderId
 * @type Object
 */
FFAPI.variables.header.headerSliderId = '';

/**
 * FFAPI Variables Header Slider.
 * <b><i>FFAPI.variables.header.headerSlider = ''<br /></i></b>
 * @property FFAPI.variables.header.headerSlider
 * @type Object
 */
FFAPI.variables.header.headerSlider = '';

/**
 * FFAPI Variables Header Slider Parent.
 * <b><i>FFAPI.variables.header.headerSliderParent = ''<br /></i></b>
 * @property FFAPI.variables.header.headerSliderParent
 * @type Object
 */
FFAPI.variables.header.headerSliderParent = '';

/**
 * FFAPI Variables Header Slider Parent Container.
 * <b><i>FFAPI.variables.header.headerSliderContainer = ''<br /></i></b>
 * @property FFAPI.variables.header.headerSliderContainer
 * @type Object
 */
FFAPI.variables.header.headerSliderContainer = '';

/**
 * FFAPI Variables Sliders on the drawer array
 * <b><i>FFAPI.variables.header.sliderNamesFinal = [];<br /></i></b>
 * @property FFAPI.variables.header.sliderNamesFinal
 * @type Array
 */
FFAPI.variables.header.sliderNamesFinal = [];
/**
 * FFAPI Variables Form that is visible
 * <b><i>FFAPI.variables.header.visibleForm = 'form_validate_sign_in';<br /></i></b>
 * @property FFAPI.variables.header.visibleForm
 * @type String
 */
FFAPI.variables.header.visibleForm = 'form_validate_sign_in';

/**
 * FFAPI Variables Form that is visible
 * <b><i>FFAPI.variables.header.visibleForm = 'form_validate_sign_in';<br /></i></b>
 * @property FFAPI.variables.header.visibleForm
 * @type String
 */
FFAPI.variables.header.restartBxSlider = [];
/**
 * FFAPI Variables used to check if the search Container is visible.
 * <b><i>FFAPI.variables.header.searchContainerVisible = false;<br /></i></b>
 * @property FFAPI.variables.header.searchContainerVisible
 * @type String
 */
FFAPI.variables.header.searchContainerVisible = false;


$(document).ready(function () {
/**
 * FFAPI Variables tabContainer JS Object. The HTML Object that has the Tabs. Used for animations
 * <b><i>FFAPI.variables.header.tabContainerJs = document.getElementsByClassName(FFAPI.variables.header.tabContainerName);<br /></i></b>
 * @property FFAPI.variables.header.tabContainerJs
 * @type Object
 */
FFAPI.variables.header.tabContainerJs = document.getElementsByClassName('tabs-top-container');

/**
 * FFAPI Variables tab Openers.The class of the links that open the tabs
 * <b><i>FFAPI.variables.header.tabOpeners = document.getElementsByClassName('tab-opener');;<br /></i></b>
 * @property FFAPI.variables.header.tabOpeners
 * @type Object
 */
FFAPI.variables.header.tabOpeners = document.getElementsByClassName('tab-opener');
/**
 * FFAPI Variables tab Openers Length. The length of the links that open the tabs
 * <b><i>FFAPI.variables.header.tabOpenersLength = FFAPI.variables.header.tabOpeners.length;<br /></i></b>
 * @property FFAPI.variables.header.tabOpenersLength
 * @type String
 */
FFAPI.variables.header.tabOpenersLength = FFAPI.variables.header.tabOpeners.length;
/**
 * FFAPI JS Variables arrow top. The arrow on the top that shows on the bottom of the drawer
 * <b><i>FFAPI.variables.header.arrowTopDrawerJS = document.getElementsByClassName('arrow-slider_top');<br /></i></b>
 * @property FFAPI.variables.header.arrowTopDrawerJS
 * @type Object
 */
FFAPI.variables.header.arrowTopDrawerJS = document.getElementsByClassName('arrow-slider_top');
/**
 * FFAPI JS Variables Loader HTML element. The drawer HTML loading element
 * <b><i>FFAPI.variables.header.drawerTopLoaderJS = document.getElementsByClassName('loader-html');<br /></i></b>
 * @property FFAPI.variables.header.drawerTopLoaderJS
 * @type Object
 */
FFAPI.variables.header.drawerTopLoaderJS = document.getElementsByClassName('loader-html');

/**
 * FFAPI Variables Menu Header Search. The search area element
 * <b><i>FFAPI.variables.header.menuHeaderSearchJS = document.getElementsByClassName('header-search')<br /></i></b>
 * @property FFAPI.variables.header.menuHeaderSearchJS
 * @type Object
 */
FFAPI.variables.header.menuHeaderSearchJS = document.getElementsByClassName('header-search');
/**
 * FFAPI Variables Menu Input Search.
 * <b><i>FFAPI.variables.header.inputSearch = document.getElementsByClassName('input-search');<br /></i></b>
 * @property FFAPI.variables.header.inputSearch
 * @type Object
 */
FFAPI.variables.header.inputSearch = document.getElementsByClassName('input-search');
/**
 * FFAPI Variables Search No Results. The area the show no results
 * <b><i>FFAPI.variables.header.headerSearchNoResultsJS = document.getElementsByClassName('header-search-noResults');<br /></i></b>
 * @property FFAPI.variables.header.headerSearchNoResultsJS
 * @type Object
 */
FFAPI.variables.header.headerSearchNoResultsJS = document.getElementsByClassName('header-search-noResults');


/**
 * FFAPI Variables Search InputBox.
 * <b><i>FFAPI.variables.header.searchInput = $('#autocomplete-group');<br /></i></b>
 * @property FFAPI.variables.header.searchInput
 * @type Object
 */
FFAPI.variables.header.searchInput = $('#autocomplete-group');


/**
 * Generic event handler recalculating the height of the TabTopHeight
 * @method FFAPI.methods.header.updateTabTopHeight
 */
FFAPI.methods.header.updateTabTopHeight = function () {
    /// If there is a visible Tab id element
    /// We get it's height and the height of the visible Tab
    var element = document.getElementById(FFAPI.variables.header.visibleTab);
    if (element !== null) {
        //var heightContainer = $('#' + FFAPI.variables.header.visibleTab + " .container").height(),
        //var height = $('#' + FFAPI.variables.header.visibleTab).height() + 2;
        var height = (FFAPI.methods.getElementHeight(element));
        /// update the tabContainerHeight with the height variable
        FFAPI.methods.header.updateTabContainerHeight(height);
    }
};

/**
 * Generic event handler to add the height and the paddingTop to the body
 * @method FFAPI.methods.header.updateTabContainerHeight
 */
FFAPI.methods.header.updateTabContainerHeight = function (heightContainer) {
    if (!Modernizr.csstransitions) {
        /// update the tabContainerHeight
        FFAPI.variables.header.tabContainer.animate({
            height: heightContainer
        }, FFAPI.variables.animationSpeed);
        /// Update the tabContainerHeight variable
        FFAPI.variables.header.tabContainerHeight = heightContainer;
        /// Update Body element
        FFAPI.variables.bodyElement.animate({
            'padding-top': (heightContainer + FFAPI.variables.header.headerContainerHeight)
        }, FFAPI.variables.animationSpeed);
    } else {
        /// update the tabContainerHeight
        FFAPI.variables.header.tabContainerJs[0].style.height = heightContainer + 'px';
        /// Update the tabContainerHeight variable
        FFAPI.variables.header.tabContainerHeight = heightContainer;
        //Update Body element
        FFAPI.variables.bodyElementJS[0].style.paddingTop = (heightContainer + FFAPI.variables.header.headerContainerHeight) + 'px';
    }
};

/**
 * Preloader visible while loading the html for the tab clicked
 * @method FFAPI.methods.header.preloadTab
 */

FFAPI.methods.header.preloadTab = function () {
    /// JQUERY ANIMATION
    /// Animate the tabContainerName if no cssTransitions
    if (!Modernizr.csstransitions) {
        if (FFAPI.variables.header.visibleTab === '') {
            /// Animate the body padding-top
            FFAPI.variables.bodyElement.animate({
                'padding-top': 100 + FFAPI.variables.header.headerContainerHeight
            }).addClass('opened-header');
            /// Animate the tabContainer height
            FFAPI.variables.header.tabContainer.animate({
                height: '100'
            });
        }
        /// Show the preloader
        FFAPI.variables.header.drawerTopLoader.removeClass('anim-opacity0').show().animate({
            opacity: '1'
        });
    }
        /// if csstransitions you just add the styles
    else {
        if (FFAPI.variables.header.visibleTab === '') {
            /// Set the body padding-top
            FFAPI.variables.bodyElementJS[0].style.paddingTop = (100 + FFAPI.variables.header.headerContainerHeight) + 'px';
            /// Set the tabContainer height
            FFAPI.variables.header.tabContainerJs[0].style.height = '100px';
        }
        /// Make the loader visible
        FFAPI.variables.header.drawerTopLoaderJS[0].style.display = 'block';
        FFAPI.methods.addClass(FFAPI.variables.header.drawerTopLoaderJS[0], 'animation-fade-in');

    }
}
/**
 * Hide the preloader
 * @method FFAPI.methods.header.hidePreloadTab
 */
FFAPI.methods.header.hidePreloadTab = function () {
    /// JQUERY ANIMATION
    /// Animate the tabContainerName if no cssTransitions
    if (!Modernizr.csstransitions) {
        /// Hide the preloader
        FFAPI.variables.header.drawerTopLoader.animate({
            opacity: '0'
        });
    }
        /// if csstransitions you just add the styles
    else {
        /// Make the loader invisible
        FFAPI.variables.header.drawerTopLoaderJS[0].style.display = 'none';
        FFAPI.methods.removeClass(FFAPI.variables.header.drawerTopLoaderJS[0], 'animation-fade-in');
    }
};

/**
 * Clicking on Tab to open a top panel. Checks if there is any open tab. Remove the Bind and adds the Bind on the end of the animation. Opens a top Panel with animation
 * @method FFAPI.methods.header.formOpenerClick
 */
FFAPI.methods.header.formOpenerClick = function () {
    /// Get the data-attribute data-loaded
    var jQThis = this,
        tabData = jQThis.getAttribute('data-tab'),
        tabLoaded = Boolean(jQThis.getAttribute('data-loaded')),
        tabDataEl = document.getElementById(tabData);

    /// Add the class to the body to be animated
    FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'animatedAll');
    if (FFAPI.variables.header.visibleTab === tabData) {
        /// Close this Tab
        FFAPI.methods.header.closeTab(jQThis);
        return false;

    } else {
        /// Set the tabOpenClicked variable to this
        FFAPI.variables.header.tabOpenClicked = jQThis;
        if (tabLoaded === true) {
            FFAPI.methods.header.formOpener();
            return false;

        } else {
            FFAPI.methods.header.preloadTab();
            return true;

        }
    }
};

/**
 * Making the necessary animations after the tab of the form is clicked
 * @method FFAPI.methods.header.formOpener
 */
FFAPI.methods.header.formOpener = function () {

    var jQThis = FFAPI.variables.header.tabOpenClicked,
        tabData = jQThis.getAttribute('data-tab'),
        tabLoaded = Boolean(jQThis.getAttribute('data-loaded')),
        tabNumber = jQThis.getAttribute('data-number-tab'),
        tabDataEl = document.getElementById(tabData),
        tabDataName = '#' + tabData;

    /// Make the links active
    FFAPI.methods.header.tabActive(jQThis, tabNumber);
    /// Make the headerSliderId null
    FFAPI.variables.header.headerSliderId = '';

    // If it has never been loaded give the necessary behaviours
    if (!tabLoaded) {
        /// Set data-loaded
        jQThis.setAttribute('data-loaded', true);
        /// Bind the click on the sign-in or register buttons
        FFAPI.methods.header.bindSignInOrRegisterClick();


    }
    /// Hide the preload Tab
    FFAPI.methods.header.hidePreloadTab();

    /// Check if there is a visible Tab and fadeOut that tab
    /// Open the drawer of this Tab
    /// Update the height and focusInput on the form 

    if (FFAPI.variables.header.visibleTab != '') {
        FFAPI.methods.header.fadeOutTab(FFAPI.variables.header.visibleTab);
        /// Make this the visibleTab
        FFAPI.variables.header.visibleTab = tabData;
        /// Open this Tab
        FFAPI.methods.header.openDrawer(tabDataEl, 1);
    } else {
        /// Make this the visibleTab
        FFAPI.variables.header.visibleTab = tabData;
        /// Open this Tab
        FFAPI.methods.header.openDrawer(tabDataEl, 0);
    }

    /// Update the tabTopHeight
    FFAPI.methods.header.updateTabTopHeight();
    ///Focus on the first input


    FFAPI.methods.header.focusInput();

};

/**
 * Clicking on Tab to open a carousel top panel. If it's the same it just closes it
 * @method FFAPI.methods.header.carouselOpenerClick
 */
FFAPI.methods.header.carouselOpenerClick = function () {
    /// Get the data-attribute data-loaded
    var jQThis = this,
        tabData = jQThis.getAttribute('data-tab'),
        tabLoaded = Boolean(jQThis.getAttribute('data-loaded')),
        tabDataEl = document.getElementById(tabData);

    /// Add the class to the body to be animated
    FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'animatedAll');
    if (FFAPI.variables.header.visibleTab === tabData) {
        /// Close this Tab
        FFAPI.methods.header.closeTab(jQThis);
        return false;

    } else {
        /// Set the tabOpenClicked variable to this
        FFAPI.variables.header.tabOpenClicked = jQThis;
        if (tabLoaded === true) {
            FFAPI.methods.header.carouselOpener();
            return false;

        } else {
            FFAPI.methods.header.preloadTab();
            return true;

        }
    }
};

/**
 * Opens a carousel
 * @method FFAPI.methods.header.carouselOpener
 */
FFAPI.methods.header.carouselOpener = function () {
    var jQThis = FFAPI.variables.header.tabOpenClicked,
        tabData = jQThis.getAttribute('data-tab'),
        tabLoaded = jQThis.getAttribute('data-loaded'),
        tabContent = jQThis.getAttribute('data-content'),
        tabNumber = jQThis.getAttribute('data-number-tab'),
        tabContentStarted = jQThis.getAttribute('data-content-started'),
        tabDataEl = document.getElementById(tabData),
        tabDataName = '#' + tabData,
        tabDataObject = $(tabDataName);

    /// Make the links active
    FFAPI.methods.header.tabActive(jQThis, tabNumber);

    // If it has never been loaded give the necessary behaviours
    if (!tabLoaded) {
        /// Set data-loaded
        jQThis.setAttribute('data-loaded', true);
    }
    /// Hide the preload Tab
    FFAPI.methods.header.hidePreloadTab();
    /// Get the info of the bxSlider
    FFAPI.methods.header.getBxSliderInfo(tabDataObject);

    if (ffbrowser.isIE8 === true) {
        responsiveIE.linkButtons();
    }

    /// Check if there is a visibleTab
    if (FFAPI.variables.header.visibleTab != '') {
        /// FadeOut the visible Tab
        FFAPI.methods.header.fadeOutTab(FFAPI.variables.header.visibleTab);
        /// Make this the visibleTab
        FFAPI.variables.header.visibleTab = tabData;
        /// Open this Drawer
        FFAPI.methods.header.openDrawer(tabDataEl, 1);
    } else {
        /// Make this the visibleTab
        FFAPI.variables.header.visibleTab = tabData;
        /// Open this Tab
        FFAPI.methods.header.openDrawer(tabDataEl, 0);
        /// Check if the BXSlider has already Started
    }


    /// Check if the tabContent Started or not
    /// If it's to start the slider for the first time 
    if (tabContentStarted != 'true') {
        /// Start the BXSlider with callback
        FFAPI.methods.header.bxSliderStart(jQThis);
        /// If it was already initialized
    } else {
        /// Check if the slider has to be restarted
        /// This was done because of the resize of the window
        ///Restart the BxSlider
        if (FFAPI.variables.header.restartBxSlider[FFAPI.variables.header.headerSliderId] === 0) {
            FFAPI.methods.header.bxSliderReload(jQThis);
        } else {
            ///After Starting BXlider
            FFAPI.methods.header.afterBxSlider(jQThis);
        }

    }
};

/**
 * Make the tab links inactive and the active link with different color
 * @param  {[type]} jQThis    The object of the link we clicked
 * @param  {[type]} tabNumber Which tab number is opened
 * @method FFAPI.methods.header.tabActive
 */
FFAPI.methods.header.tabActive = function (jQThis, tabNumber) {
    /// Animate the colors of the tabOpeners by removing and adding classes
    for (var i = 0; i < FFAPI.variables.header.tabOpenersLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkActive');
        FFAPI.methods.addClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkInactive');

    }
    ///Add to this the link Active
    FFAPI.methods.removeClass(jQThis, 'anim-linkInactive');
    FFAPI.methods.addClass(jQThis, 'anim-linkActive');

    /// Animate the arrow to the correct position
    if (!Modernizr.csstransitions) {
        FFAPI.variables.header.arrowTopDrawer.animate({
            'left': FFAPI.variables.header.menuPosFinal[parseInt(tabNumber)]
        }, FFAPI.variables.animationSpeed);
    } else {

        /// Just change the position
        FFAPI.variables.header.arrowTopDrawerJS[0].style.left =
            FFAPI.variables.header.menuPosFinal[parseInt(tabNumber)] + 'px';
    }
};

/**
 * Close the specific tab making the necessary options
 * @param  {Object} jQThis Which tabOpener to close
 * @method FFAPI.methods.header.closeTab
 */
FFAPI.methods.header.closeTab = function (jQThis) {
    for (var i = 0; i < FFAPI.variables.header.tabOpenersLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkInactive');
        FFAPI.methods.removeClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkActive');

    }
    var tabToClose = document.getElementById(FFAPI.variables.header.visibleTab);

    if (!Modernizr.csstransitions) {

        $(tabToClose).fadeOut(FFAPI.variables.animationSpeed, function () {
            $(tabToClose).css('display', 'none');
        }).removeClass('animation-fade-in animation-fade-in-delayed').addClass('animation-fade-out');
    } else {
        tabToClose.style.opacity = 1;
        FFAPI.methods.removeClass(tabToClose, 'animation-fade-in');
        FFAPI.methods.removeClass(tabToClose, 'animation-fade-in-delayed');
        /// Add the anim-opacity0 class
        FFAPI.methods.addClass(tabToClose, 'animation-fade-out');
        /// Display none after FFAPI.variables.animationSpeed
        setTimeout(function () {
            tabToClose.style.display = 'none';
        }, FFAPI.variables.animationSpeed);
    }

    /// No tab open Class
    FFAPI.variables.header.tabOpenClass = '';
    /// No visible Tab
    FFAPI.variables.header.visibleTab = '';
    /// No tabOpenerLink
    FFAPI.variables.header.tabOpenerLink = '';
    /// No tabContainerHeight
    FFAPI.variables.header.tabContainerHeight = 0;
    /// Make no tabOpenClicked
    FFAPI.variables.header.tabOpenClicked = '';
    /// Animate the drawer
    FFAPI.methods.header.closeDrawer();
};

/**
 * Close The drawer and animate it on closeing
 * @method FFAPI.methods.header.closeDrawer
 */
FFAPI.methods.header.closeDrawer = function () {
    /// JQUERY ANIMATION
    /// Animate the tabContainerName if no cssTransitions
    if (!Modernizr.csstransitions) {

        /// Animate the body padding-top
        FFAPI.variables.bodyElement.animate({
            'padding-top': FFAPI.variables.header.headerContainerHeight
        }).removeClass('opened-header');
        /// Animate the tabContainer height
        FFAPI.variables.header.tabContainer.animate({
            height: '0'
        });

    }
        /// if csstransitions you just add the styles
    else {

        /// Set the body padding-top
        FFAPI.variables.bodyElementJS[0].style.paddingTop = (FFAPI.variables.header.headerContainerHeight) + 'px';
        /// Set the tabContainer height
        FFAPI.variables.header.tabContainerJs[0].style.height = '0';




    }
};

/**
 * Open the drawer with necessary animations
 * @method FFAPI.methods.header.openDrawer
 */
FFAPI.methods.header.openDrawer = function (tabDataEl, visibleTab) {
    /// JQUERY ANIMATION
    if (!Modernizr.csstransitions) {
        var $jQThis = $(tabDataEl);
        $jQThis.removeClass('animation-fade-in animation-fade-in-delayed animation-fade-out anim-opacity').fadeIn((FFAPI.variables.animationSpeed * 2), function () {
            $jQThis.css('display', 'block');
            $jQThis.css('opacity', '1');
        });
        if (FFAPI.variables.header.tabContainerHeight === 0) {
            FFAPI.variables.header.tabContainerHeight = 200;
        }
        FFAPI.methods.header.animateDrawer();

    } else {
        /// Give a height just in case
        if (FFAPI.variables.header.tabContainerHeight === 0) {
            FFAPI.variables.header.tabContainerHeight = 200;
        }
        /// Animate the drawer
        FFAPI.methods.header.animateDrawer();

        /// Display block the tab
        tabDataEl.style.opacity = 0;
        tabDataEl.style.display = 'block';
        FFAPI.methods.removeClass(tabDataEl, 'hide');

        /// If we have to delay the animation or not
        if (visibleTab === 1) {
            FFAPI.methods.addClass(tabDataEl, 'animation-fade-in');
        } else {
            FFAPI.methods.addClass(tabDataEl, 'animation-fade-in-delayed');
        }

        /// remove the fadeOut classes
        FFAPI.methods.removeClass(tabDataEl, 'animation-fade-out');
        FFAPI.methods.removeClass(tabDataEl, 'animation-fade-out-delayed');
    }
    /// Just to be sure it has the behaviour to close the buttons
    FFAPI.methods.header.closeHeaderButtons();
};

/**
 * Animate drawer with css transitions and animate jquery if necessary
 * @param  {[type]} heightGap value of the heightGap to use
 * @method FFAPI.methods.header.animateDrawer
 */
FFAPI.methods.header.animateDrawer = function (heightGap) {
    heightGap = typeof heightGap !== 'undefined' ? heightGap : 2;
    if (!Modernizr.csstransitions) {
        /// Animate the height of the container
        FFAPI.variables.header.tabContainer
            .animate({
                'height': FFAPI.variables.header.tabContainerHeight + heightGap
            }, FFAPI.variables.header.animationSpeed);
        /// Animate the body padding-top
        FFAPI.variables.bodyElement
            .animate({
                'padding-top': FFAPI.variables.header.tabContainerHeight + FFAPI.variables.header.headerContainerHeight
            });

        /// Animate the opacity of the headerSliderParent
        $(FFAPI.variables.header.headerSliderParent)
            .animate({
                'opacity': 1
            }, FFAPI.variables.header.animationSpeed, function () {
                $(FFAPI.variables.header.headerSliderParent)
                    .removeClass('animation-fade-out')
                    .addClass('animation-fade-in');
            });


    } else {
        /// Set the height of the container
        FFAPI.variables.header.tabContainerJs[0].style.height = (FFAPI.variables.header.tabContainerHeight + heightGap) + 'px';
        /// Set the body margin top
        FFAPI.variables.bodyElementJS[0].style.paddingTop = (FFAPI.variables.header.tabContainerHeight + FFAPI.variables.header.headerContainerHeight) + 'px';
        /// Set the visibility to visible
        if (FFAPI.variables.header.headerSliderParent[0] !== undefined) {
            FFAPI.methods.removeClass(FFAPI.variables.header.headerSliderParent[0], 'animation-fade-out');
            FFAPI.methods.addClass(FFAPI.variables.header.headerSliderParent[0], 'animation-fade-out');

        }
    }
};

/**
 * FadeOut the tab to switch between tabs
 * @param  {Object} jQThis Tab to fadeOut
 * @method FFAPI.methods.header.fadeOutTab
 */
FFAPI.methods.header.fadeOutTab = function (jQThis) {
    /// JQUERY ANIMATION
    if (!Modernizr.csstransitions) {
        var $jQThis = $("#" + jQThis);
        $jQThis.removeClass('animation-fade-in animation-fade-in-delayed animation-fade-out anim-opacity').fadeOut(FFAPI.variables.animationSpeed, function () {
            $jQThis.css('display', 'none');
        });
    } else {

        ///Get the Element
        var tabDataEl = document.getElementById(jQThis);
        /// Hide the Element
        tabDataEl.style.opacity = 1;
        tabDataEl.style.display = 'none';
        FFAPI.methods.removeClass(tabDataEl, 'animation-fade-in');
        FFAPI.methods.removeClass(tabDataEl, 'animation-fade-in-delayed');
        FFAPI.methods.addClass(tabDataEl, 'animation-fade-out');
    }
};

/**
 * Get the bxSlider Info objects in order to start the bxslider
 * @param  {[type]} tabDataObject Object data name
 * @method FFAPI.methods.header.getBxSliderInfo
 */
FFAPI.methods.header.getBxSliderInfo = function (tabDataObject) {
    /// Get the id of the slide
    FFAPI.variables.header.headerSliderId = tabDataObject.find('.js-slider-header').attr('id');
    /// Ge the id of the slider plus the cardinal
    FFAPI.variables.header.headerSlider = '#' + FFAPI.variables.header.headerSliderId;
    /// Get the slider parent
    FFAPI.variables.header.headerSliderParent = tabDataObject.find('.js-slider-header-parent');
    /// Get the slider header container
    FFAPI.variables.header.headerSliderContainer = tabDataObject.find('.js-slider-header-container');
    /// Set the opacity to 0 to don't show the drawer   
    if (typeof FFAPI.variables.header.headerSliderParent[0] != 'undefined') {
        if (!Modernizr.csstransitions) {
            $(FFAPI.variables.header.headerSliderParent.selector)
                .removeClass('animated-transition animation-fade-in animation-fade-in-delayed anim-opacity')
                .addClass('animation-fade-out');
        } else {
            FFAPI.methods.addClass(FFAPI.variables.header.headerSliderParent[0], 'animation-fade-out');
        }
    }
};

FFAPI.methods.header.bxSliderOptions = function (sliderId) {
    var sliderOptions = {
        slideMargin: 2,
        moveSlides: 2,
        pager: false
    };

    if (window.innerWidth >= 1440 + 1) {
        sliderOptions.minSlides = 6;
        sliderOptions.maxSlides = 6;
    } else if (window.innerWidth < 1280 + 1) {

        sliderOptions.minSlides = 4;
        sliderOptions.maxSlides = 4;
    } else if (window.innerWidth < 1440 + 1) {

        sliderOptions.minSlides = 5;
        sliderOptions.maxSlides = 5;
    }

    // Set max width of each slide
    var containerWidth = FFAPI.variables.header.headerSliderContainer.width() * 1.0;
    sliderOptions.slideWidth = (containerWidth / sliderOptions.maxSlides) - sliderOptions.slideMargin - 1;

    // Remove controls and infinite loop setting if not necessary
    var slidesCount = $("#" + sliderId).find('li:not(.bx-clone)').length;
    if (slidesCount && sliderOptions.minSlides >= slidesCount) {
        sliderOptions.controls = false;
        sliderOptions.infiniteLoop = false;
    }

    return sliderOptions;
}

/**
 * Start the BXSlider with callback
 * @param  {[type]} jQThis Tab object opener to start
 * @method FFAPI.methods.header.bxSliderStart
 */
FFAPI.methods.header.bxSliderStart = function (jQThis) {
    // Get default slider options
    var sliderOptions = FFAPI.methods.header.bxSliderOptions($(jQThis).data('slider-id'));

    // Set onSliderLoad callback
    sliderOptions.onSliderLoad = function () {
        // Rollover effect on images
        $('.no-touch .sliderTabs-slide').rollover({
            animate: true,
            crossfade: true
        });
        // After Starting BXlider
        FFAPI.methods.header.afterBxSlider(jQThis);
        // Add variables to know the started slider
        FFAPI.variables.header.restartBxSlider.push(FFAPI.variables.header.headerSliderId);
        FFAPI.variables.header.restartBxSlider[FFAPI.variables.header.headerSliderId] = 1;
    };

    if (typeof FFAPI.variables.header.headerSliderId != 'undefined' && FFAPI.variables.header.headerSliderId != '') {
        if ($("#" + FFAPI.variables.header.headerSliderId).find('li').length > 0) {

            /// Show the headerParent before making the slider.
            if (!Modernizr.csstransitions) {
                $(FFAPI.variables.header.headerSliderParent)
                    .css({
                        opacity: '0',
                        display: 'block'
                    }).removeClass('animated-transition animation-fade-out animation-fade-in');
            }

            FFAPI.variables.header.sliderNamesFinal[FFAPI.variables.header.headerSliderId] = $(FFAPI.variables.header.headerSlider).bxSlider(sliderOptions);
        } else {
            FFAPI.variables.header.headerSliderId = '';
            /// Show the headerParent before making the slider.
            if (!Modernizr.csstransitions) {
                $(FFAPI.variables.header.headerSliderParent)
                    .css({
                        opacity: '0',
                        display: 'block'
                    }).removeClass('animated-transition animation-fade-out animation-fade-in');
            }
            FFAPI.methods.header.afterBxSlider(jQThis);
        }
    } else {
        FFAPI.methods.header.updateTabTopHeight();
    }
};

/**
 * Reload the BXSlider based on the window width
 * @param  {[type]} jQThis BXSlider to reload
 * @method FFAPI.methods.header.bxSliderReload
 */
FFAPI.methods.header.bxSliderReload = function (jQThis) {
    // Get default slider options
    var sliderOptions = FFAPI.methods.header.bxSliderOptions($(jQThis).data('slider-id'));

    sliderOptions.onSliderLoad = function () {
        // Rollover effect on images
        $('.no-touch .sliderTabs-slide').rollover({
            animate: true,
            crossfade: true
        });
        // After Starting BXlider
        FFAPI.methods.header.afterBxSlider(jQThis);
        FFAPI.variables.header.restartBxSlider[FFAPI.variables.header.headerSliderId] = 1;
    };

    if (typeof FFAPI.variables.header.headerSliderId != 'undefined' && FFAPI.variables.header.headerSliderId != '') {

        /// Show the headerParent before making the slider.
        if (!Modernizr.csstransitions) {
            $(FFAPI.variables.header.headerSliderParent)
                .removeClass('animated-transition animation-fade-out anim-opacity')
                .addClass('animation-fade-in');
        }

        FFAPI.variables.header.sliderNamesFinal[FFAPI.variables.header.headerSliderId].reloadSlider(sliderOptions);
    } else {
        FFAPI.methods.header.updateTabTopHeight();
    }
};

/**
 * After the BxSlider is loaded
 * @param  {[type]} jQThis BXSlider loaded
 * @method FFAPI.methods.header.afterBxSlider
 */
FFAPI.methods.header.afterBxSlider = function (jQThis) {
    /// Update tabContainerHeight
    FFAPI.variables.header.tabContainerHeight = $(FFAPI.variables.header.headerSliderContainer).height();
    /// Animate the header Drawer 
    if (Modernizr.csstransitions) {
        FFAPI.methods.addClass(FFAPI.variables.header.headerSliderParent[0], 'animation-fade-in');
        FFAPI.methods.removeClass(FFAPI.variables.header.headerSliderParent[0], 'animation-fade-out');
    } else {
        $(FFAPI.variables.header.headerSliderParent).show().addClass('animation-fade-in').css('opacity', '1');
    }
    /// Set this attribute to content started
    jQThis.setAttribute('data-content-started', true);
    /// Update the tabTopHeight
    FFAPI.methods.header.updateTabTopHeight();
};


/**
 * Focus on the first input with the class input_black
 * @method FFAPI.methods.header.focusInput
 */
FFAPI.methods.header.focusInput = function () {
    /// Focus on the first input found
      if (document.getElementById(FFAPI.variables.header.visibleForm)) {
    var t = document.getElementById(FFAPI.variables.header.visibleForm);
         if (t) {
        var h = t.getElementsByClassName('input_black');
        h[0].blur();
        h[0].focus();
    }
      }
      /// EnterKey function
    FFAPI.methods.header.enterKeyOnForm();
};


/**
 * Clicking on Sign in button inside the drawer it opens the form
 * @method FFAPI.methods.header.selectSignIn
 * @param
 */
FFAPI.methods.header.selectSignIn = function () {
    /// Add Class active to the button
    FFAPI.methods.addClass(FFAPI.variables.header.signInButton[0], 'active');
    /// Remove Class active from the button
    FFAPI.methods.removeClass(FFAPI.variables.header.registerButton[0], 'active');
    /// Change the visible form
    FFAPI.variables.header.visibleForm = 'form_validate_sign_in';
    /// Add the method of enterKey
    FFAPI.methods.header.enterKeyOnForm();

    if (!Modernizr.csstransitions) {
        ///Just to be sure the variables are well defined
        FFAPI.variables.header.signinContainerClass = $('.header-signin');
        FFAPI.variables.header.registerContainerClass = $('.header-register');
        /// JQUERY ANIMATION
        /// Hide the visible container and show the other
        FFAPI.variables.header.registerContainerClass.stop().fadeOut("fast", function () {
            FFAPI.variables.header.signinContainerClass.fadeIn("slow", function () {
                FFAPI.variables.header.registerContainerClass.hide();
            });
            /// Focus on the first input found
            FFAPI.methods.header.focusInput();
            /// Update the Tab height if necessary
            FFAPI.methods.header.updateTabTopHeight();
        });


    } else {
        /// CSS3 animations
        /// Remove Class from the form previous visible
        /// Add Class to fadeOut the form
        FFAPI.methods.removeClass(FFAPI.variables.header.registerContainerClassJS[0], 'animation-fade-in');
        FFAPI.methods.removeClass(FFAPI.variables.header.registerContainerClassJS[0], 'animation-fade-in-delayed');
        FFAPI.methods.addClass(FFAPI.variables.header.registerContainerClassJS[0], 'animation-fade-out');

        setTimeout(function () {
            ///Hide totally this form
            FFAPI.variables.header.registerContainerClassJS[0].style.display = 'none';
            ///Remove the hide class if exists from the now visible form
            FFAPI.methods.removeClass(FFAPI.variables.header.signinContainerClassJS[0], 'hide');
            /// Add opacity 0
            FFAPI.variables.header.signinContainerClassJS[0].style.opacity = 0;
            /// Display the element
            FFAPI.variables.header.signinContainerClassJS[0].style.display = 'block';
            /// Removes the fade-out-class
            FFAPI.methods.removeClass(FFAPI.variables.header.signinContainerClassJS[0], 'animation-fade-out');
            /// Adds the fade-in-delayed class
            FFAPI.methods.addClass(FFAPI.variables.header.signinContainerClassJS[0], 'animation-fade-in-delayed');
            /// Focus on the first input found
            FFAPI.methods.header.focusInput();
            /// Update the Tab height if necessary
            FFAPI.methods.header.updateTabTopHeight();

        }, FFAPI.variables.animationSpeed);
        ///Force focus on IPAD
        FFAPI.methods.header.focusInput();

    }
};

/**
 * Clicking on Register button inside the drawer it opens the form
 * @method FFAPI.methods.header.selectRegister
 * @param
 */
FFAPI.methods.header.selectRegister = function () {
    /// Add Class active to the button
    FFAPI.methods.addClass(FFAPI.variables.header.registerButton[0], 'active');
    /// Remove Class active from the button
    FFAPI.methods.removeClass(FFAPI.variables.header.signInButton[0], 'active');
    /// Change the visible form
    FFAPI.variables.header.visibleForm = 'form_validate_register';
    /// Add the method of enterKey
    FFAPI.methods.header.enterKeyOnForm();

    if (!Modernizr.csstransitions) {
        ///Just to be sure the variables are well defined
        FFAPI.variables.header.signinContainerClass = $('.header-signin');
        FFAPI.variables.header.registerContainerClass = $('.header-register');
        /// JQUERY ANIMATION ///
        /// Hide the visible container and show the other
        FFAPI.variables.header.signinContainerClass.stop().removeClass('hide').fadeOut("fast", function () {
            FFAPI.variables.header.registerContainerClass.fadeIn("slow", function () {
                FFAPI.variables.header.signinContainerClass.hide();
            });
            /// Focus on the first input found
            /// FFAPI.methods.header.focusInput();
            /// Update the Tab height if necessary
            FFAPI.methods.header.updateTabTopHeight();
        });
    } else {
        /// CSS3 animations
        /// Remove Class from the form previous visible
        /// Add Class to fadeOut the form
        FFAPI.methods.removeClass(FFAPI.variables.header.signinContainerClassJS[0], 'animation-fade-in');
        FFAPI.methods.removeClass(FFAPI.variables.header.signinContainerClassJS[0], 'animation-fade-in-delayed');
        FFAPI.methods.addClass(FFAPI.variables.header.signinContainerClassJS[0], 'animation-fade-out');
        setTimeout(function () {
            ///Hide totally this form
            FFAPI.variables.header.signinContainerClassJS[0].style.display = 'none';
            ///Remove the hide class if exists from the now visible form
            FFAPI.methods.removeClass(FFAPI.variables.header.registerContainerClassJS[0], 'hide');
            /// Add opacity 0
            FFAPI.variables.header.registerContainerClassJS[0].style.opacity = 0;
            /// Display the element
            FFAPI.variables.header.registerContainerClassJS[0].style.display = 'block';
            /// Removes the fade-out-class
            FFAPI.methods.removeClass(FFAPI.variables.header.registerContainerClassJS[0], 'animation-fade-out');
            /// Adds the fade-in-delayed class
            FFAPI.methods.addClass(FFAPI.variables.header.registerContainerClassJS[0], 'animation-fade-in-delayed');
            /// Focus on the first input found
            /// FFAPI.methods.header.focusInput();
            /// Update the Tab height if necessary
            FFAPI.methods.header.updateTabTopHeight();

        }, FFAPI.variables.animationSpeed);

    }
};

/**
 * Bind the signIn or Register button click
 * @method FFAPI.methods.header.bindSignInOrRegisterClick
 * @param e {event}
 */
FFAPI.methods.header.bindSignInOrRegisterClick = function (e) {
    /**
     * FFAPI Variables Sign in Button element.
     * <b><i>FFAPI.variables.header.signInButton = document.getElementsByClassName('header-signIn-btn');;<br /></i></b>
     * @property FFAPI.variables.header.signInButton
     * @type Object
     */
    FFAPI.variables.header.signInButton = document.getElementsByClassName('header-signIn-btn');

    /**
     * FFAPI Variables Register Sign in Class
     * <b><i>FFAPI.variables.header.signinContainerClassJS = document.getElementsByClassName('header-signin');<br /></i></b>
     * @property FFAPI.variables.header.signinContainerClassJS
     * @type String
     */
    FFAPI.variables.header.signinContainerClassJS = document.getElementsByClassName('header-signin');

    /**
     * FFAPI Variables Register Button element.
     * <b><i>FFAPI.variables.header.registerButton = document.getElementsByClassName('header-register-btn');<br /></i></b>
     * @property FFAPI.variables.header.registerButton
     * @type Object
     */
    FFAPI.variables.header.registerButton = document.getElementsByClassName('header-register-btn');

    /**
     * FFAPI Variables Register Container Class
     * <b><i>FFAPI.variables.header.registerContainerClassJS = 'header-register';<br /></i></b>
     * @property FFAPI.variables.header.registerContainerClassJS
     * @type String
     */
    FFAPI.variables.header.registerContainerClassJS = document.getElementsByClassName('header-register');

    FFAPI.methods.bindElemClick(FFAPI.variables.header.signInButton, FFAPI.methods.header.selectSignIn);
    FFAPI.methods.bindElemClick(FFAPI.variables.header.registerButton, FFAPI.methods.header.selectRegister);
    /*require(['plu_chosen'], function () {
        $('.no-touch .selectForm').chosen();
    });*/
    FFAPI.methods.header.onLoadForms();
};

/**
 * If there is any tabClicked and there is a visibleTab it simulates the click on the last tabOpener link
 * @method FFAPI.methods.header.closeCurrentEvents
 */
FFAPI.methods.header.closeCurrentEvents = function (e) {
    if (e != undefined) {
        /// Prevent Default event
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    /// Check if there is an visibleTab
    /// If yes it closes it
    if (FFAPI.variables.header.visibleTab !== '') {
        /// Hide this visible Tab
        FFAPI.methods.header.hideVisibleTab(FFAPI.variables.header.visibleTab);
        /// Close the currentTab
        FFAPI.methods.header.closeTab(FFAPI.variables.header.tabOpenClicked);
    }
};

/**
 * Hide the Tab that is visible animting it
 * @param  {Object} visibleTab Which Tab is visible and we want it to hide
 * @method FFAPI.methods.header.hideVisibleTab
 */
FFAPI.methods.header.hideVisibleTab = function (visibleTab) {
    if (!Modernizr.csstransitions) {
        $("#" + visibleTab).fadeTo('fast', 0, function () {
            $(this).attr('style', '').removeClass('animation-fade-in').addClass('animation-fade-out');
        });
    } else {
        var aux = document.getElementById(visibleTab);
        FFAPI.methods.removeClass(aux, 'animation-fade-in');
        FFAPI.methods.addClass(aux, 'animation-fade-out');
    }
}


/**
 * Listener for the media querie of the header. If it matches it will make the FFAPI.methods.header.closeCurrentEvents
 * @method FFAPI.methods.header.mediaQuerieHeaderListener
 */
FFAPI.responsive.mediaQuerieHeaderListener = function () {
    if (FFAPI.responsive.goneSmallQuerie.matches) {
        FFAPI.methods.header.closeCurrentEvents();
    }
};

/**
 * Just do this in case the browser is different from IE8
 * @type {Boolean}
 * @method ffbrowser.isIE8 === false
 */
if (ffbrowser.isIE8 === false) {
    /**
     * Add the listener to the mediaQuerieHeader.
     * @method FFAPI.responsive.goneSmallQuerie.addListener(function ()
     */
    FFAPI.responsive.goneSmallQuerie.addListener(function () {
        FFAPI.responsive.mediaQuerieHeaderListener();
    });
}

/**
 * Calculate the Position of the arrow based on the tabOpenersLinks
 * @method FFAPI.methods.header.menuPositionArrow(function ()
 */
FFAPI.methods.header.menuPositionArrow = function () {
    /// Calculate the positions of the array of menus
    var aux = 0;
    /// Go throw all the tab openers
    for (var i = 0; i < FFAPI.variables.header.tabOpenersLength; i++) {
        /// Get the outerWidth
        /// var width = $(FFAPI.variables.header.tabOpeners[i]).parent('li').outerWidth();
        var width = FFAPI.methods.getElementWidth(FFAPI.variables.header.tabOpeners[i].parentNode);
        /// Get the margin
        var getTheMargin = width / 2 + 6;
        /// If it's the last change the margin
        if ((i + 1) == (FFAPI.variables.header.tabOpenersLength)) {
            getTheMargin -= 10;
        }
        /// Add a total width variable
        FFAPI.variables.header.arrowPosNumber += width;
        /// Add it to the array
        FFAPI.variables.header.menuPos.push(FFAPI.variables.header.arrowPosNumber);
        /// Add to menuPosFinal array the correct value to move the arrow
        FFAPI.variables.header.menuPosFinal.push((FFAPI.variables.header.menuPos[aux] - getTheMargin));
        aux += 1;
    }
};



/**
 * Making the necessary animations while the search button is clicked
 * @method FFAPI.methods.header.searchClick
 */
FFAPI.methods.header.searchClick = function (e) {
    if (e !== undefined) {
        /// Prevent Default event
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }

    }





    ///////////////////////////////////////////////////////////
    /// If the searchContainer is not visible - show it
    ///////////////////////////////////////////////////////////
    if (FFAPI.variables.header.searchContainerVisible === false) {
        ///Hide the headertabs if they are open
        FFAPI.methods.header.closeCurrentEvents();
        ///Show the container
        /// Empty the attribute style to don't use the issue on the ffmenu
        FFAPI.variables.header.searchContainerJS[0].setAttribute('style', '');
        ///Get the necessary height - used JQUERY for browser issues
        ///var aux = $(document).height() - $('header').outerHeight() - 6 + FFAPI.variables.header.tabContainerHeight;
        /// var height = $(document).innerHeight() + $('footer').outerHeight() - $('header').outerHeight() - 6;
        var height = FFAPI.methods.getDocHeight() + FFAPI.methods.getElementHeight(document.querySelectorAll('footer')[0]) - FFAPI.methods.getElementHeight(document.querySelectorAll('header')[0]);
        /// Define the searchContainer height
        FFAPI.variables.header.searchContainerJS[0].style.height = height + 'px';


        /// Remove the animation-to-hide
        FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'animation-to-hide');
        FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'anim-hidden');
        ///// Remove the anim-noDisplayHidden
        FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'anim-noDisplayHidden');
        /// Add the animation to show
        FFAPI.methods.addClass(FFAPI.variables.header.searchContainerJS[0], 'animation-to-show');


        /// If no CSS transitions
        if (!Modernizr.csstransitions) {
            /// Show the search Container
            FFAPI.variables.header.searchContainer.animate({
                opacity: '1'
            }, FFAPI.variables.animationSpeed, function () {
                FFAPI.variables.header.searchContainer.show();
                FFAPI.variables.header.searchContainer.css('visibility', 'visible');
                FFAPI.variables.header.inputSearch[0].focus();
            });
            /// Show the arrowBottom
            FFAPI.variables.ffmenu.menuHeaderArrow.css({
                'left': 'inherit',
                right: (FFAPI.methods.getElementWidth(FFAPI.variables.header.menuHeaderSearchJS[0]) / 2 - 20)
            }).show();
            /// Hide the noresults 
            FFAPI.variables.header.headerSearchNoResults.hide(FFAPI.variables.animationSpeed);
            /// Show the close search Button
            FFAPI.variables.header.closeHeaderSearchButton.show(FFAPI.variables.animationSpeed);
            /// If CSS transition
        } else {

            /// Define the position of the arrow
            FFAPI.variables.ffmenu.menuHeaderArrow[0].style.left = 'inherit';
            FFAPI.variables.ffmenu.menuHeaderArrow[0].style.right = (FFAPI.methods.getElementWidth(FFAPI.variables.header.menuHeaderSearchJS[0]) / 2 - 20) + 'px';
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderArrow[0], 'animation-to-hide');
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderArrow[0], 'animation-to-show');

            /// Hide the noSearch results
            FFAPI.methods.addClass(FFAPI.variables.header.headerSearchNoResultsJS[0], 'hide');
            /// Close the close searchButton
            FFAPI.methods.addClass(FFAPI.variables.header.closeHeaderSearchButtonJS[0], 'show');
        }

        /// Class to the searchButton
        FFAPI.methods.addClass(FFAPI.variables.header.searchButton[0], 'active');
        /// FFAPI.variables.header.inputSearch[0].value = '';
        FFAPI.variables.header.inputSearch[0].focus();



        /// Autocomplete Actions
        FFAPI.variables.header.searchInput.autocomplete({
            minChars: 3,
            serviceUrl: window.universal_variable.page.subfolder + '/Search/GetSearchResultsByTextAllGenders',
            appendTo: '.header-autocomplete-containter',
            onSelect: function (suggestion) {
                $('#selection-group').html('You selected: ' + suggestion.value + ' <b>(' + suggestion.category + ')</b>');
            },
            deferRequestBy: FFAPI.variables.animationSpeed,
            categories: true,
            paramName: 'SearchText',
            type: 'GET',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            transformResult: function (response) {
                return {
                    suggestions: $.map(response, function (dataItem) {
                     return { value: dataItem.Label, data: dataItem.URL, category: dataItem.GenderID === 248 ? FFAPI.translations.genderMen : FFAPI.translations.genderWomen };
                    })
                };
            },
            formatResult: function (suggestion, currentValue, a) {
                var refLink = suggestion.data;

                if (refLink.lastIndexOf('?') === -1) {
                    refLink += '?q=' + currentValue;
                }
                else {
                    if (refLink.lastIndexOf('?q=') === -1 && refLink.lastIndexOf('&q=') === -1) {
                        refLink += '&q=' + currentValue;
                    }
                }

                return '<a href="' + refLink + '">' + suggestion.value + '</a>';
            }
        });



        /// Indicate the searchContainer in visible
        FFAPI.variables.header.searchContainerVisible = true;

        ///////////////////////////////////////////////////////////
        /// Else - hide it
        ///////////////////////////////////////////////////////////
    } else {
        /// Remove the animation to show
        FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'animation-to-show');
        FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'anim-visible');
        /// Add the animation-fade-out
        FFAPI.methods.addClass(FFAPI.variables.header.searchContainerJS[0], 'animation-to-hide');
        /// Remove the class of the searchButton
        FFAPI.methods.removeClass(FFAPI.variables.header.searchButton[0], 'active');
        /// Lose the focus on this input
        FFAPI.variables.header.inputSearch[0].blur();

        if (!Modernizr.csstransitions) {
            /// Add the animation-fade-out
            FFAPI.methods.removeClass(FFAPI.variables.header.searchContainerJS[0], 'animation-to-hide');
            /// Hide the search Container
            FFAPI.variables.header.searchContainer.animate({
                opacity: '0'
            }, FFAPI.variables.animationSpeed, function () {
                FFAPI.variables.header.searchContainer.hide();
                FFAPI.variables.header.searchContainer.css('visibility', 'hidden');
            });
            /// Hide the arrowBottom
            FFAPI.variables.ffmenu.menuHeaderArrow.hide();
            /// Hide the close search Button
            FFAPI.variables.header.closeHeaderSearchButton.hide(FFAPI.variables.animationSpeed);
        } else {

            /// After the animation add the class anim-noDisplayHidden
            setTimeout(function () {
                ///// Add the anim-noDisplayHidden
                FFAPI.methods.addClass(FFAPI.variables.header.searchContainerJS[0], 'anim-noDisplayHidden');
            }, FFAPI.variables.animationSpeed);

            /// Remove the class of the arrowBottom anim-showAtAll
            FFAPI.methods.removeClass(FFAPI.variables.ffmenu.menuHeaderArrow[0], 'animation-to-show');
            /// Add the class of the arrowBottom anim-notShowAtAll
            FFAPI.methods.addClass(FFAPI.variables.ffmenu.menuHeaderArrow[0], 'animation-to-hide');
        }
        /// Indicate the searchContainer in not visible
        FFAPI.variables.header.searchContainerVisible = false;
    }
};

/**
 * Close header search area when click on icon-close
 * @method FFAPI.methods.header.closeHeaderSearch
 *
 **/
FFAPI.methods.header.closeHeaderSearch = function () {
    /// Animate the colors of the tabOpeners by removing and adding classes
    /// In this case we remove the inactive Classes 
    for (var i = 0; i < FFAPI.variables.header.tabOpenersLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkInactive');
        FFAPI.methods.addClass(FFAPI.variables.header.tabOpeners[i], 'anim-linkActive');

    }
    /// Make the links of the ffmenu to removeClass anim-linkInactive
    /// Add the class anim-linkActive to this
    /// It's better to be a Jquery object because it's complex to give it an extra class
    FFAPI.variables.ffmenu.headerPriNavLinks
        .removeClass('anim-linkInactive')
        .addClass('anim-linkActive');

    /// Execute the click to close the search
    FFAPI.methods.header.searchClick();
};


/**
 * Binds clicking on the button search and the close button. Has to prevent any action while click are on course
 * @method FFAPI.methods.header.bindSearchClick
 */
FFAPI.methods.header.bindSearchClick = function () {
    /**
     * FFAPI Variables Search Button element.
     * <b><i>FFAPI.variables.header.searchButton = document.getElementsByClassName('header-search')[0].getElementsByClassName('search-click-area');<br /></i></b>
     * @property FFAPI.variables.header.searchButton
     * @type Object
     */
    FFAPI.variables.header.searchButton = document.getElementsByClassName('search-click-area');


    if (!Modernizr.csstransitions) {
        $(FFAPI.variables.header.searchButton[0]).on('click', function (event) {
            FFAPI.methods.header.searchClick(event);
        });
    } else {
        FFAPI.methods.bindElemClick(FFAPI.variables.header.searchButton, FFAPI.methods.header.searchClick);
    }



    /**
     * FFAPI Variables Close Header Search Button element.
     * <b><i>FFAPI.variables.header.closeHeaderSearchButtonJS = document.getElementsByClassName('header-search-close');<br /></i></b>
     * @property FFAPI.variables.header.closeHeaderSearchButtonJS
     * @type Object
     */
    FFAPI.variables.header.closeHeaderSearchButtonJS = document.getElementsByClassName('header-search-close');
    FFAPI.methods.bindElemClick(FFAPI.variables.header.closeHeaderSearchButtonJS, FFAPI.methods.header.closeHeaderSearch);


    /**
     * FFAPI Variables Menu Header Search Container. The header search Container
     * <b><i>FFAPI.variables.header.searchContainerJS = document.getElementsByClassName('header-search-container');<br /></i></b>
     * @property FFAPI.variables.header.searchContainerJS
     * @type Object
     */
    FFAPI.variables.header.searchContainerJS = document.getElementsByClassName('header-search-container');
    //FFAPI.methods.bindElemClick(FFAPI.variables.header.searchContainerJS, FFAPI.methods.header.clickOnSearchContainer);



    FFAPI.methods.header.escapeSearchInput();
};



FFAPI.variables.header.loadSearch = document.getElementsByClassName('js-load-search');
FFAPI.variables.header.loadSearchVisible = false;


/**
 * When focus on the search input press esc to exit to close the header search
 * @method FFAPI.methods.header.escapeSearchInput
 */
FFAPI.methods.header.escapeSearchInput = function (e) {
    FFAPI.variables.header.searchInput.keypress(function (e) {
        e = e || window.event;
        var keyCode = e.keyCode;
        if (keyCode == FFAPI.keycode.escape) {
            FFAPI.methods.header.closeHeaderSearch();
        } else if (keyCode == FFAPI.keycode.enter) {
            e.preventDefault(); e.stopPropagation();

            //Show Search Loading Event
            FFAPI.methods.header.searchLoading();

            var genderInContext = 249; // Default search gender: women
            if (window.universal_variable && window.universal_variable.page && window.universal_variable.page.contextGenderId) {
                if (window.universal_variable.page.contextGenderId !== '0') {
                    genderInContext = window.universal_variable.page.contextGenderId;

                }
                FFAPI.methods.redirectToSearchResults(FFAPI.variables.header.searchInput.val(), genderInContext);


            }

        }
    });
};


/**
 * When enter is pressed on the search it shows a loading at the center of the page
 * @method FFAPI.methods.header.searchLoading
 */
FFAPI.methods.header.searchLoading = function () {
    ///Remove the hide class from the loadSearch
    FFAPI.methods.removeClass(FFAPI.variables.header.loadSearch[0], 'hide');
    ///Define it's height
    FFAPI.variables.header.loadSearch[0].style.height = FFAPI.methods.getDocHeight() + 'px';
    /// Add a variable to inform it's visible
    FFAPI.variables.header.loadSearchVisible = true;
    /// Disable the search input attribute
    FFAPI.variables.header.searchInput.attr('disabled', true);
}

/**
 * Just in case, we have a hideSearchLoading function
 * @method FFAPI.methods.header.searchLoading
 */
FFAPI.methods.header.hideSearchLoading = function () {
    ///Remove the hide class from the loadSearch
    FFAPI.methods.addClass(FFAPI.variables.header.loadSearch[0], 'hide');
    /// Add a variable to inform it's visible
    FFAPI.variables.header.loadSearchVisible = false;
    /// Disable the search input attribute
    FFAPI.variables.header.searchInput.attr('disabled', false);
}

/**
 * To submit the form on the inputs of the forms on the headers
 * @method FFAPI.methods.header.enterKeyOnForm
 */
FFAPI.methods.header.enterKeyOnForm = function (e) {
    e = e || window.event;
      if (document.getElementById(FFAPI.variables.header.visibleForm)) {
    /// Get the visibleForm and the inputs inside
    var auxForm = document.getElementById(FFAPI.variables.header.visibleForm),
        auxInputs = auxForm.getElementsByTagName('input'),
        auxInputsLength = auxInputs.length,
        auxButtons = auxForm.getElementsByClassName('submit-button'),
        auxButtonsLength = auxButtons.length;


    /// Add the keypress function to all of the inputs
    for (var i = 0; i < auxInputsLength; i++) {
        auxInputs[i].onkeypress = function (e) {
            FFAPI.methods.header.enterKeySubmitForm(e, auxForm)
        };
    }


    /// Add the keypress auxButtons to all of the submit buttons
    for (i = 0; i < auxButtonsLength; i++) {
        auxButtons[i].onkeypress = function (e) {
            FFAPI.methods.header.enterKeySubmitForm(e, auxForm)
        };
    }
      }
};

/**
 * Funtion for the enterkey on the inputs of the forms
 * @param  {[type]} e       event
 * @param  {[type]} auxForm form object
 * @method FFAPI.methods.header.enterKeySubmitForm
 */
FFAPI.methods.header.enterKeySubmitForm = function (e, auxForm) {
    e = e || window.event;
    var keyCode = e.keyCode;
    if (keyCode == FFAPI.keycode.enter) {
        ///Trigger the click of the submit-button
        $(auxForm).find('.submit-button').trigger('click');
        if (e != undefined) {
            /// Prevent Default event
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
        return false;
    }
}

/**
 * On loading the forms it's necessary to add some specific functions
 * @method FFAPI.methods.header.onLoadForms
 */
FFAPI.methods.header.onLoadForms = function () {
    ///Only fo this for the <IE10
    if (!Modernizr.input.placeholder) {
        $('input').placeholder();
    }
    /// CheckRadio Plugin is always necessary and has a general class
    $('.label-check, .label-radio').checkradio();

    /// Chosen Plugin is always necessary and has a general class
    $('.no-touch .selectForm').chosen();
};

/**
 * Before loading AjaxForms on the Header - it will add th necessary functions before the ajax request is made
 * @method FFAPI.methods.header.beforeAjaxForms
 */
FFAPI.methods.header.beforeAjaxForms = function () {
    FFAPI.methods.loadingButtons(FFAPI.variables.header.visibleForm);
};


/**
 * After loading AjaxForms on the Header - it will add the necessary functions to keep the forms working
 * @method FFAPI.methods.header.afterAjaxForms
 */
FFAPI.methods.header.afterAjaxForms = function () {
    FFAPI.methods.header.closeHeaderButtons();
    FFAPI.methods.header.updateTabTopHeight();
    FFAPI.methods.header.bindSignInOrRegisterClick();
    FFAPI.methods.header.enterKeyOnForm();
    FFAPI.methods.resetButtons(FFAPI.variables.header.visibleForm);
};

/**
 * Generic event handler recalculating the height of the TabSearch and the TabLoading if visibleTab
 * @method FFAPI.methods.header.updateTabSearchHeight
 */
FFAPI.methods.header.updateTabSearchHeight = function () {

    ///////////////////////////////////////////////////////////
    /// If the searchContainer is visible
    ///////////////////////////////////////////////////////////
    if (FFAPI.variables.header.searchContainerVisible === true) {
        ///Get the necessary height - used JQUERY for browser issues
        /// var height = $(document).innerHeight() + $('footer').outerHeight() - $('header').outerHeight() - 6;
        var height = FFAPI.methods.getDocHeight() + FFAPI.methods.getElementHeight(document.querySelectorAll('footer')[0]) - FFAPI.methods.getElementHeight(document.querySelectorAll('header')[0]);
        /// Define the searchContainer height
        FFAPI.variables.header.searchContainerJS[0].style.height = height + 'px';
    }



    ///////////////////////////////////////////////////////////
    /// If the search loading is visible
    ///////////////////////////////////////////////////////////
    if (FFAPI.variables.header.loadSearchVisible === true) {
        ///Get the necessary height - used JQUERY for browser issues
        /// var height = $(document).innerHeight() + $('footer').outerHeight() - $('header').outerHeight() - 6;
        var height = FFAPI.methods.getDocHeight();
        /// Define the searchContainer height
        FFAPI.variables.header.loadSearch[0].style.height = height + 'px';
    }

};


/**
 * Binds clicking on the button close within tabs. Has to prevent any action while click are on course
 * @method FFAPI.methods.header.closeHeaderButtons
 */


FFAPI.methods.header.closeHeaderButtons = function () {
    /**
     * FFAPI Variables header tabs close.
     * <b><i>FFAPI.variables.header.closeDrawerButtons = document.getElementsByClassName('header-tabs-close');<br /></i></b>
     * @property FFAPI.variables.header.closeDrawerButtons
     * @type Object
     */
    FFAPI.variables.header.closeDrawerButtons = document.getElementsByClassName('header-tabs-close');
    FFAPI.methods.bindElemClick(FFAPI.variables.header.closeDrawerButtons, FFAPI.methods.header.closeCurrentEvents);
};



/**
 * Join all function that trigger when window resize
 * @method FFAPI.methods.header.triggerFunctionOnWindowResize
 */
FFAPI.methods.header.triggerFunctionOnWindowResize = function () {
    /// If it's gone small just remove the bodyeElement info.
    if (FFAPI.responsive.goneSmallQuerie.matches === true) {
        FFAPI.variables.header.tabContainerHeight = 0;
        FFAPI.variables.bodyElementJS[0].setAttribute('style', '');
        FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'opened-header');
        /// FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
        FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
    } else {
        FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
    }

    /// If there is a visibleTab
    if (FFAPI.variables.header.visibleTab !== '') {
        /// Update the bxSlider
        if (FFAPI.variables.header.headerSliderId != '') {
            FFAPI.methods.header.bxSliderReload(FFAPI.variables.header.tabOpenClicked);
        } else {
            FFAPI.methods.header.updateTabTopHeight();
        }
    }
    /// Update the tabSearchHeight
    FFAPI.methods.header.updateTabSearchHeight();

    ///Update the height of the meganavaMask
    FFAPI.methods.ffmenu.meganavMask();
};

/**
 * Update the Bag Item count
 * @method FFAPI.methods.header.updateHeaderSlider
 * @param  {[type]} data     Data object
 * @param  {[type]} status   Status of the reques
 * @param  {[type]} xhr
 * @param  {[type]} sliderId what's the id of the slider
 * @param  {[type]} elem     what's the element
 */

FFAPI.methods.header.updateHeaderSlider = function (data, status, xhr, sliderId, elem) {
    var sliderElemsCount = FFAPI.variables.header.sliderNamesFinal[sliderId].getSlideCount();
    if (sliderElemsCount > 0) {
        FFAPI.variables.header.sliderNamesFinal[sliderId].find("li[data-saved-id='" + elem + "']").remove();
        if (sliderElemsCount > 1) {
            /// FFAPI.variables.header.sliderNamesFinal[sliderId].reloadSlider();
            /// This was done because of the resize of the window
            FFAPI.methods.header.bxSliderReload(FFAPI.variables.header.tabOpenClicked);
        } else {
            FFAPI.variables.header.sliderNamesFinal[sliderId].destroySlider();
            FFAPI.variables.header.sliderNamesFinal[sliderId] = undefined;
            FFAPI.variables.header.tabOpenClicked.setAttribute('data-content-started', false);
        }
    } else {
        if (sliderId === 'sliderwishlist') {
            $(".wishlistEmpty").show();
        }

        if (sliderId === 'sliderbag') {
            $(".bagEmpty").show();
            FFAPI.methods.header.updateTabTopHeight();
        }
    }

    if (data.wishlistItemsCount !== undefined) {
        FFAPI.methods.header.updateWishListItemCount(data.wishlistItemsCount,"");
        if (data.wishlistItemsCount < 1) {
            $(".wishlistEmpty").show();
            FFAPI.methods.header.updateTabTopHeight();
        } else {
            $(".wishlistEmpty").hide();
        }
    }
    if (data.bagTotalFormatted !== undefined) {
        FFAPI.methods.header.updateBagTotal(data.bagTotalFormatted);
    }
    if (data.bagItemsCount !== undefined) {
        FFAPI.methods.header.updateBagItemCount(data.bagItemsCount);
        if (data.bagItemsCount < 1) {
            $(".bagEmpty").show();
            FFAPI.methods.header.updateTabTopHeight();
        } else {
            $(".bagEmpty").hide();
        }
    }
    if (data.bagInstallments !== undefined) {
        var bagInstElem = $(".js-bag-installments");
        if (bagInstElem.length > 0) {
            FFAPI.methods.header.updateBagInstallments(data.bagInstallments);
        }
    }
    FFAPI.methods.header.updateTabTopHeight();
};

/**
 * Clicking on searchContainer should stop the propogation of the click to don't allow to hide this container
 * @param  {[type]} e Event click
 * @method FFAPI.methods.header.clickOnSearchContainer
 */
FFAPI.methods.header.clickOnSearchContainer = function (e) {
    if (e != undefined) {

        if ($(e.target).is("a")) {
            return true;
        }

        /// Prevent Default event
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation()
        } else {
            e.returnValue = false;
        }
    }
    return false;

}

/**
 * On document ready load the mediaQuerieHeaderListener
 * Calculate the position of the arrow
 * Make an hoverIntent on the search-click-area
 * @method $(document).ready(function($)
 */
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/// JQUERY OBJECTS FOR Animations
//////////////////////////////////////////////////////////////////////////////////
/*Variables that are going to be used in case it doesn't support CSS transitions*/
if (!Modernizr.csstransitions) {
    FFAPI.variables.header.arrowTopDrawer = $('.arrow-slider_top');
    FFAPI.variables.header.tabContainer = $('.tabs-top-container');
    FFAPI.variables.header.drawerTopLoader = $('.loader-html');
    FFAPI.variables.header.closeHeaderSearchButton = $('.header-search-close');
    FFAPI.variables.header.searchContainer = $('.header-search-container');
    FFAPI.variables.header.headerSearchNoResults = $('.header-search-noResults');
}
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///
/// Start the mediaQuerieHeaderListener
FFAPI.responsive.mediaQuerieHeaderListener();
/// Get the menuPositions of the Arrow
FFAPI.methods.header.menuPositionArrow();
/// Apply the bindSearchClick function - search click
FFAPI.methods.header.bindSearchClick();

/// On hover the search click area
/*$('.search-click-area').hoverIntent({
    timeout: 0, // number = milliseconds delay before onMouseOut
    over: function () {
        /// Add a color to the links on the primaryNav
        FFAPI.variables.ffmenu.headerPriNavLinks
            .removeClass('anim-linkActive')
            .addClass('anim-linkInactive');
    },
    out: function () {
        /// Check if the search container is visible
        /// if it's not remove the inactive classes from the menu
        if (FFAPI.variables.header.searchContainerVisible === false) {
            /// Remove a color to the links on the primaryNav
            FFAPI.variables.ffmenu.headerPriNavLinks
                .removeClass('anim-linkInactive')
                .addClass('anim-linkActive');
        }

    }
});*/


var config = {
    timeout: 0 // number = milliseconds delay before onMouseOut
},
    jQThis = document.getElementsByClassName('search-click-area')[0];


hoverintent(jQThis,
function () {
    // Handler in
    /// Add a color to the links on the primaryNav
    FFAPI.variables.ffmenu.headerPriNavLinks
        .removeClass('anim-linkActive')
        .addClass('anim-linkInactive');
}, function () {
    /// Check if the search container is visible
    /// if it's not remove the inactive classes from the menu
    if (FFAPI.variables.header.searchContainerVisible === false) {
        /// Remove a color to the links on the primaryNav
        FFAPI.variables.ffmenu.headerPriNavLinks
            .removeClass('anim-linkInactive')
            .addClass('anim-linkActive');
    }
}).options(config);

//Add the necessary height for the meganavmask.
FFAPI.methods.ffmenu.meganavMask();

/**
 * On resizing the window after FFAPI.variables.resizeWindowTime it updates
 * the Tab Top Height FFAPI.methods.header.updateTabTopHeight if there is any visible tab
 * @method $(window).resize
 */
$(window).resize(function () {
    ///Mark the sliders to restart case you need to
    for (var aux = 0; aux < FFAPI.variables.header.restartBxSlider.length; aux++) {
        FFAPI.variables.header.restartBxSlider[FFAPI.variables.header.restartBxSlider[aux]] = 0;
    }
    /// Add a function after the resize of the window and the resizeWindowTime
    clearTimeout(FFAPI.variables.header.resizing);
    FFAPI.variables.header.resizing = setTimeout(FFAPI.methods.header.triggerFunctionOnWindowResize, FFAPI.variables.resizeWindowTime);
});


/**
 * FFAPI Variables fo the headerDrawer
 * <b><i>FFAPI.variables.header.headerDrawer = '';<br /></i></b>
 * @property FFAPI.variables.header.headerDrawer
 * @type String
 */
FFAPI.variables.header.headerDrawer = '';
/**
 * FFAPI Variables fo the Tab Opener
 * <b><i>FFAPI.variables.header.tabOpenersObject = '';<br /></i></b>
 * @property FFAPI.variables.header.tabOpenersObjects
 * @type String
 */
FFAPI.variables.header.tabOpenersObjects = '';
/**
 * FFAPI Variables fo the Html element
 * <b><i>FFAPI.variables.header.html = '';<br /></i></b>
 * @property FFAPI.variables.header.html
 * @type String
 */
FFAPI.variables.header.html = '';
/**
 * FFAPI Variables fo the Header element
 * <b><i>FFAPI.variables.header.headerElement = '';<br /></i></b>
 * @property FFAPI.variables.header.headerElement
 * @type String
 */
FFAPI.variables.header.headerElement = '';
/**
 * FFAPI Variables fo the Header Search element
 * <b><i>FFAPI.variables.header.headerSearchElement = '';<br /></i></b>
 * @property FFAPI.variables.header.headerSearchElement
 * @type String
 */
FFAPI.variables.header.headerSearchElement = '';
/**
 * Function for when clicking outside the open drawer
 * @method FFAPI.methods.header.bodyMouseUpClick = function(e){
 */
FFAPI.methods.header.bodyMouseUpClick = function (e) {



    /// ********************************************
    /// Check if we have to close the header Drawer
    /// ********************************************
    if (FFAPI.variables.header.headerDrawer === '') {
        FFAPI.variables.header.headerDrawer = $('.js-header-drawer');
    }
    if (FFAPI.variables.header.tabOpenersObjects === '') {
        FFAPI.variables.header.tabOpenersObjects = $('.tab-opener');
    }
    if (FFAPI.variables.header.html === '') {
        FFAPI.variables.header.html = $('html');
    }

    /// Check if it's not inside the headerDrawer and the tabopeners links and if not outisde the bodyElement
    if (!FFAPI.variables.header.headerDrawer.is(e.target)
        && FFAPI.variables.header.headerDrawer.has(e.target).length === 0
        && !FFAPI.variables.header.tabOpenersObjects.is(e.target)
        && FFAPI.variables.header.tabOpenersObjects.has(e.target).length === 0
        && !FFAPI.variables.header.html.is(e.target)) {
        ///Close the Tabs
        ////// If yes it closes it
        if (FFAPI.variables.header.visibleTab !== '') {
            FFAPI.methods.header.closeCurrentEvents();
        }
    }

    /// ********************************************
    /// Check if we have to close the Search Element
    /// ********************************************
    if (FFAPI.variables.header.headerElement === '') {
        FFAPI.variables.header.headerElement = $('header');
    }
    if (FFAPI.variables.header.headerSearchElement === '') {
        FFAPI.variables.header.headerSearchElement = $('.header-search');
    }

    if (FFAPI.variables.header.headerElement.is(e.target)
        || FFAPI.variables.header.headerElement.has(e.target).length !== 0) {

        if (!FFAPI.variables.header.headerSearchElement.is(e.target)
            && FFAPI.variables.header.headerSearchElement.has(e.target).length === 0) {
            if (FFAPI.variables.header.searchContainerVisible === true) {
                FFAPI.methods.header.closeHeaderSearch();
            }
        }
    }
}

///Click on the bodyElement
FFAPI.variables.bodyElement.on('click', FFAPI.methods.header.bodyMouseUpClick);
    // Click sign-in-register when not logged to redirect for the mobile version
    // Only do this on IE8 and IE9 and when not logged
    // We did this to MAKE HTTPS login workin on IE8 and IE9
    //TODO - make this vanillaJS code
    if ((ffbrowser.isIE8 === true || ffbrowser.majorVersion === 9) && !window.universal_variable.user.isLogged) {
       $("#header-sign-register-button").on('click', function (e) {
               e.preventDefault();
               e.stopPropagation();
               var url = this.getAttribute('data-secure-url');
               window.location = url;
       });
    }
/*
 } catch (e) {
 console.log(e);
 try {
 if (window.debug) {
 console.log(e);
 }
 } catch (ex) {
 }
 }*/

});