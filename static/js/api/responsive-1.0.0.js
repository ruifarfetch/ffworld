/**
 Responsive javaScript file. It contains the functions for responsiveness.<br>
 <b>NOTE: To have responsive images they need to have the following structure</b>: <br><br>
 &lt;img src="http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_54.jpg" <br> class="responsive" <br> data-large = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_1000.jpg" <br> data-medium = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_800.jpg" <br>data-small = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_400.jpg" &gt;
 @deprecated api/
 @class responsive-1.0.0.js
 **/

/**
 * This module contains global methods of our API
 * @module FFAPI
 */

//try {
/**
 * FFAPI responsive object. You can include on this object all the responsive variables and methods you need on your page
 * @property FFAPI.responsive
 * @type Object
 */
FFAPI.responsive = FFAPI.responsive || {};//Is variable initialized
/// General variables for our media queries
/**
 * FFAPI Responsive Mobile Width. The media querie size for mobiles<br /> We use 480 by default.
 * <b><i> FFAPI.responsive.mobile = 480;<br /></i></b>
 * @property FFAPI.responsive.mobile
 * @type Number
 */
FFAPI.responsive.mobile = 480;
/**
 * FFAPI Responsive Fablet Width. The media querie size for fablets <br /> We use 768 by default.
 * <b><i> FFAPI.responsive.fablet = 768;<br /></i></b>
 * @property FFAPI.responsive.fablet
 * @type Number
 */
FFAPI.responsive.fablet = 767;
/**
 * FFAPI Responsive Tablet Width. The media querie size for tablets <br /> We use 1024 by default.
 * <b><i> FFAPI.responsive.tablet = 1024;<br /></i></b>
 * @property FFAPI.responsive.tablet
 * @type Number
 */
FFAPI.responsive.tablet = 1024;
/**
 * FFAPI Responsive Desktops Width. The media querie size for desktops <br /> We use 1440 by default.
 * <b><i> FFAPI.responsive.desktop = 1440;<br /></i></b>
 * @property FFAPI.responsive.desktop
 * @type Number
 */
FFAPI.responsive.desktop = 1440;

/// Check what responsive images we have loaded
/**
 * FFAPI Responsive Loaded Huge Images. Variable to check if Huge Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedHugeImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedHugeImages
 * @type Boolean
 */
FFAPI.responsive.loadedHugeImages = false;
/**
 * FFAPI Responsive Loaded Large Images. Variable to check if Large Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedXLImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedXLImages
 * @type Boolean
 */
FFAPI.responsive.loadedXLImages = false;
/**
 * FFAPI Responsive Loaded Medium Images. Variable to check if Medium Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedMDImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedMDImages
 * @type Boolean
 */
FFAPI.responsive.loadedMDImages = false;
/**
 * FFAPI Responsive Loaded Small Images. Variable to check if Small Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedSMImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedSMImages
 * @type Boolean
 */
FFAPI.responsive.loadedSMImages = false;
/**
 * FFAPI Responsive Loaded Extra Small Images. Variable to check if Extra Small Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedXSImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedXSImages
 * @type Boolean
 */
FFAPI.responsive.loadedXSImages = false;
/**
 * FFAPI Responsive is bigger than Large. Variable to check if images loaded are bigger than Large <br />
 * <b><i> FFAPI.responsive.biggerThanXL = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanXL
 * @type Boolean
 */
FFAPI.responsive.biggerThanXL = false;
/**
 * FFAPI Responsive is bigger than Medium. Variable to check if images loaded are bigger than Medium <br />
 * <b><i> FFAPI.responsive.biggerThanMD = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanMD
 * @type Boolean
 */
FFAPI.responsive.biggerThanMD = false;
/**
 * FFAPI Responsive is bigger than Small. Variable to check if images loaded are bigger than Small <br />
 * <b><i> FFAPI.responsive.biggerThanSM = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanSM
 * @type Boolean
 */
FFAPI.responsive.biggerThanSM = false;
/**
 * FFAPI Responsive is bigger than Extra Small. Variable to check if images loaded are bigger than Extra Small <br />
 * <b><i> FFAPI.responsive.biggerThanXS = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanXS
 * @type Boolean
 */
FFAPI.responsive.biggerThanXS = false;

/// Responsive images names
/**
 * FFAPI Responsive Large Image Name end. Variable that tells us the end name of the Large images <br />
 * <b><i> FFAPI.responsive.imageXL = "1000";<br /></i></b>
 * @property FFAPI.responsive.imageXL
 * @type String
 */
FFAPI.responsive.imageXL = "1000";
/**
 * FFAPI Responsive Medium Image Name end. Variable that tells us the end name of the Medium images <br />
 * <b><i> FFAPI.responsive.imageMD = "800";<br /></i></b>
 * @property FFAPI.responsive.imageMD
 * @type String
 */
FFAPI.responsive.imageMD = "800";
/**
 * FFAPI Responsive Small Image Name end. Variable that tells us the end name of the Small images <br />
 * <b><i> FFAPI.responsive.imageSM = "400";<br /></i></b>
 * @property FFAPI.responsive.imageSM
 * @type String
 */
FFAPI.responsive.imageSM = "400";

/// Responsive MediaQueries
/**
 * FFAPI Responsive Media Querie Huge. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieHuge = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieHuge
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieHuge = false;
/**
 * FFAPI Responsive Media Querie Large. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieXL = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieXL
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieXL = false;
/**
 * FFAPI Responsive Media Querie Medium. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieMD = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieMD
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieMD = false;
/**
 * FFAPI Responsive Media Querie Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieSM = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieSM
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieSM = false;
/**
 * FFAPI Responsive Media Querie Extra Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieXS = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieXS
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieXS = false;
/**
 * FFAPI Responsive Media Querie Header. Variable will be a Window matchMedia. It will helps us to check when the user needs to load the header-2.0.0.js and the event Listeners on this file..
 * <b><i> FFAPI.responsive.mediaQuerieHeader = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieHeader
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieHeader = false;
/**
 * FFAPI Responsive Media Querie Gone Small. Variable will be a Window matchMedia. It will helps us to check when the screen goes small and the behaviours we need
 * <b><i> FFAPI.responsive.goneSmallQuerie = false;<br /></i></b>
 * @property FFAPI.responsive.goneSmallQuerie
 * @type Boolean
 */
FFAPI.responsive.goneSmallQuerie = false;
/**
 * FFAPI Responsive Media Querie Gone Big. Variable will be a Window matchMedia. It will helps us to check when the screen goes big and the behaviours we need
 * <b><i> FFAPI.responsive.goneBigQuerie = false;<br /></i></b>
 * @property FFAPI.responsive.goneBigQuerie
 * @type Boolean
 */
FFAPI.responsive.goneBigQuerie = false;

$(document).ready(function () {
    /**
     * FFAPI Variables header trigger. The header trigger - Used for the ffmenu
     * <b><i>FFAPI.variables.headerTrigger =  $(".header-trigger");<br /></i></b>
     * @property FFAPI.variables.headerTrigger
     * @type Object
     */
    FFAPI.variables.headerTrigger = $('.header-trigger');
    /**
     * FFAPI Variables close mobile menu transparent div
     * <b><i>FFAPI.variables.closeMobile =  $(".js-close-mobile");<br /></i></b>
     * @property FFAPI.variables.closeMobile
     * @type Object
     */
    FFAPI.variables.closeMobileJS = document.getElementsByClassName('js-close-mobile');
    /**
     * FFAPI Variables header Nav List Items. The header Nav list items
     * <b><i>FFAPI.variables.headerNavLi =  $(".js-primary-nav");<br /></i></b>
     * @property FFAPI.variables.headerNavLi
     * @type Object
     */
    FFAPI.variables.headerNavLi = $('.js-primary-nav');
    /**
     * FFAPI Variables notice error close button.
     * <b><i>FFAPI.variables.noticeErrorCloseButton = $(".notice_error span.icon-close");<br /></i></b>
     * @property FFAPI.variables.noticeErrorCloseButton
     * @type Object
     */
    FFAPI.variables.noticeErrorCloseButton = $('.notice_error span.icon-close');
    /**
     * FFAPI Variables Touchstart detection
     * <b><i>FFAPI.variables.touchSupported = false;<br /></i></b>
     * @property FFAPI.variables.touchSupported
     * @type Object
     */
});
FFAPI.variables.touchSupported = false;
if (Modernizr.touch) {
    FFAPI.variables.touchSupported = true;
}




/// Responsive Images Checker function
/**
 * Nothing for now
 * @method FFAPI.responsive.checkResponsiveImages
 */
FFAPI.responsive.checkResponsiveImages = function () {
};

/**
 * This functions changes the src of the image for the newSrc
 * @method FFAPI.responsive.changeImageSrc
 * @param {Object} node - Image object
 * @param {URL} newSrc - Image Url
 * @return true
 */
FFAPI.responsive.changeImageSrc = function (node, newSrc) {
    node.src = newSrc;
    return true;
};

/**
 * This functions caches the new image using another function, and it has a callback function
 * @method FFAPI.responsive.cacheAndLoadImage
 * @param {Object} node - Image Object
 * @param {URL} newSrc - Image URL
 * @param {function} callback
 * @return Callback function
 */
FFAPI.responsive.cacheAndLoadImage = function (node, newSrc, callback) {
    FFAPI.responsive.isImageCached(newSrc);
    callback(node, newSrc);
};

/**
 * Checks if image is cached and caches the image
 * @method FFAPI.responsive.isImageCached
 * @param {String} imgUrl
 * @return Boolean
 */
FFAPI.responsive.isImageCached = function (imgUrl) {
    /// console.log(imgUrl);
    if (imgUrl != null) {
        var imgEle = document.createElement("img");
        imgEle.src = imgUrl;
        return imgEle.complete || (imgEle.width + imgEle.height) > 0;
    } else {
        return false;
    }
};


/// Just make this if matchmedia is available
if (window.matchMedia && ffbrowser.isIE8 === false) {
    ///Bigger then the FFAPI.responsive.desktop
    FFAPI.responsive.mediaQuerieHuge = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.desktop + 1) + 'px)');

    ///Between tablet and desktop
    FFAPI.responsive.mediaQuerieXL = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.tablet + 1) + 'px) and (max-width:' + (FFAPI.responsive.desktop) + 'px)');

    ///Between fablet and tablet
    FFAPI.responsive.mediaQuerieMD = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.fablet + 1) + 'px) and (max-width:' + (FFAPI.responsive.tablet) + 'px)');

    /// Bigger than tablet - big devices responsive actions
    FFAPI.responsive.goneBigQuerie = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.tablet + 1) + 'px)');
    FFAPI.responsive.fromSmallToBig = FFAPI.responsive.goneBigQuerie;

    ///Between mobile and fablet
    FFAPI.responsive.mediaQuerieSM = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.mobile + 1) + 'px) and (max-width:' + (FFAPI.responsive.fablet) + 'px)');

    ///Between mobile and fablet - for the header
    FFAPI.responsive.mediaQuerieHeader = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.mobile + 1) + 'px) and (max-width:' + (FFAPI.responsive.fablet) + 'px)');

    /// Between mobile and tablet - for the responsive actions
    FFAPI.responsive.goneSmallQuerie = window.matchMedia('screen and ' + '(max-width:' + (FFAPI.responsive.tablet) + 'px)');
    FFAPI.responsive.fromBigToSmall = FFAPI.responsive.goneSmallQuerie;

    ///Smaller size for mobiles devices
    FFAPI.responsive.mediaQuerieXS = window.matchMedia('screen and ' + '(max-width: ' + (FFAPI.responsive.mobile) + 'px)');

    /**
     * Matches the mediaQuerie for Huge screens - Bigger then the FFAPI.responsive.desktop Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieHugeListener
     */
    FFAPI.responsive.mediaQuerieHugeListener = function () {
        /// <summary>
        ///     Matches the mediaQuerie for Huge screens
        ///     Bigger then the FFAPI.responsive.desktop Listener
        /// </summary>
        /// <returns type="undefined" />
        if (FFAPI.responsive.mediaQuerieHuge.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-large'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedHugeImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;
            FFAPI.responsive.biggerThanMD = true;
            FFAPI.responsive.biggerThanXL = true;
        }
    };

    /**
     *Matches the mediaQuerie for Extra Large screens - Between tablet and desktop Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieXLListener
     */
    FFAPI.responsive.mediaQuerieXLListener = function () {
        if (FFAPI.responsive.mediaQuerieXL.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-large'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedXLImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;
            FFAPI.responsive.biggerThanMD = true;
        }
    };

    /**
     *Matches the mediaQuerie for Medium screens - Between fablet and tablet screen Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieMDListener
     */
    FFAPI.responsive.mediaQuerieMDListener = function () {
        if (FFAPI.responsive.mediaQuerieMD.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-medium'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedMDImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;

        }
    };

    /**
     *Matches the mediaQuerie for Small screens -  Between mobile and fablet Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieSMListener
     */
    FFAPI.responsive.mediaQuerieSMListener = function () {
        if (FFAPI.responsive.mediaQuerieSM.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-small'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedSMImages = true;
            FFAPI.responsive.biggerThanXS = true;
        }
    };

    /**
     *Matches the mediaQuerie for Extra Small screens - For mobile screens Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieXSListener
     */
    FFAPI.responsive.mediaQuerieXSListener = function () {
        if (FFAPI.responsive.mediaQuerieXS.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-small'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedXSImages = true;
        }
    };

    /**
     * Loads the specific image on a matchMedia
     * @method FFAPI.responsive.mediaQuerieLoaderImage
     * @param {String} attribute - What data attribute to get from the image
     * @param {Boolean} querieMatches - If is on the match of the mediaquerie
     * @param {Boolean} imageSizeChecker - If it has to load these images
     * @param {String} imageLoaded - What image has just loaded to change the variables value
     * @return
     */
    FFAPI.responsive.mediaQuerieLoaderImage = function (attribute, querieMatches, imageSizeChecker, imageLoaded) {
        if (querieMatches === true) {
            var nodes = document.getElementsByClassName('responsive'),
                nodesLength = nodes.length - 1;
            var j;
            for (j = 0; j <= nodesLength; j++) {
                if (nodes[j].getAttribute("data-resize") === "false") {
                    FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute(attribute), FFAPI.responsive.changeImageSrc);
                } else {
                    if ((imageSizeChecker === false)) {
                        FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute(attribute), FFAPI.responsive.changeImageSrc);
                        switch (imageLoaded) {
                            case "huge":
                                FFAPI.responsive.loadedHugeImages = true;
                                FFAPI.responsive.loadedXLImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                FFAPI.responsive.biggerThanMD = true;
                                break;
                            case "xl":
                                FFAPI.responsive.loadedXLImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                FFAPI.responsive.biggerThanMD = true;
                                break;
                            case "md":
                                FFAPI.responsive.loadedMDImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                break;
                            case "sm":
                                FFAPI.responsive.loadedSMImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                break;
                            case "xs":
                                FFAPI.responsive.loadedXSImages = true;
                                break;
                        }
                    }
                }
            }
        }
    };

    /**
     * Starts the mediaQuerie add Listeners
     * @method FFAPI.responsive.mediaQuerieStartListeners
     */
    FFAPI.responsive.mediaQuerieStartListeners = function () {
        FFAPI.responsive.mediaQuerieHuge.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieHuge.matches, FFAPI.responsive.loadedHugeImages, "huge");
        });

        FFAPI.responsive.mediaQuerieXL.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieXL.matches, FFAPI.responsive.biggerThanXL, "xl");
        });

        FFAPI.responsive.mediaQuerieMD.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-medium", FFAPI.responsive.mediaQuerieMD.matches, FFAPI.responsive.biggerThanMD, "md");
        });

        FFAPI.responsive.mediaQuerieSM.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-small", FFAPI.responsive.mediaQuerieSM.matches, FFAPI.responsive.biggerThanSM, "sm");
        });

        FFAPI.responsive.mediaQuerieXS.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-xsmall", FFAPI.responsive.mediaQuerieXS.matches, FFAPI.responsive.biggerThanXS, "xs");
        });
    };

    /**
     * Starts the mediaQuerie chnage image on load
     * @method FFAPI.responsive.startImagesLoad
     */
    FFAPI.responsive.startImagesLoad = function () {
        "use strict";
        FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieHuge.matches, FFAPI.responsive.loadedHugeImages, "huge");
        FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieXL.matches, FFAPI.responsive.biggerThanXL, "xl");
        FFAPI.responsive.mediaQuerieLoaderImage("data-medium", FFAPI.responsive.mediaQuerieMD.matches, FFAPI.responsive.biggerThanMD, "md");
        FFAPI.responsive.mediaQuerieLoaderImage("data-small", FFAPI.responsive.mediaQuerieSM.matches, FFAPI.responsive.biggerThanSM, "sm");
        FFAPI.responsive.mediaQuerieLoaderImage("data-xsmall", FFAPI.responsive.mediaQuerieXS.matches, FFAPI.responsive.biggerThanXS, "xs");
    };

    /**
     * Setting initial Listeners for the media queries
     * @method FFAPI.responsive.mediaQuerieSetValues
     */
    FFAPI.responsive.mediaQuerieSetValues = function () {
        "use strict";
        FFAPI.responsive.startImagesLoad();
        FFAPI.responsive.mediaQuerieStartListeners();
    };


    /**
     * Start the Set values of mediaQueries and the mediaQueriesListeners
     * @method FFAPI.responsive.checkResponsiveImages
     */
    FFAPI.responsive.checkResponsiveImages = function () {
        FFAPI.responsive.mediaQuerieSetValues();
        FFAPI.responsive.mediaQuerieStartListeners();
    };

    /**
     * Hide the mobile menu when clicking on the wrapper.
     * @method FFAPI.responsive.closeNavDrawer
     * @param {Event} event
     */
    FFAPI.responsive.closeNavDrawer = function () {
        /// Prevent default the event
        /// event.preventDefault();
        /// Trigger click 
        FFAPI.responsive.hamburguerMenuClick(event);
    }

    /**
     * Click or tapping on the headerTrigger we chnage the class of headerUtilities and headerNav
     * @method FFAPI.responsive.hamburguerMenuClick
     * @param {Event} event
     */
    FFAPI.responsive.hamburguerMenuClick = function (event) {

        if (event != undefined) {
            /// Prevent Default event
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation()
            } else {
                event.returnValue = false;
            }
        }
        //alert("OPEN;");
        /// console.log("hamburguerMenuClick");
        var auxScroll = window.scrollY + 'px';
        /// Change the variable to indcate the ffmenu is not visible
        FFAPI.variables.ffmenu.menuVisible = true;

        if (!Modernizr.csstransitions) {
            /// Animate the bodyElement
            FFAPI.variables.bodyElement.animate({ left: 270 }, FFAPI.variables.animationSpeed, function () {
                /// Add the necessary classes to the bodyElement
                FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
                /// Remove the necessary classes to the bodyElement
                FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');

            });
        } else {
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');

        }

        FFAPI.variables.headerTrigger
        .off('click', FFAPI.responsive.hamburguerMenuClick)
        .on('click', FFAPI.responsive.hamburguerMenuClose);

        /*
        FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
        auxScroll = 0;
        document.querySelector('header').style.top = auxScroll;
        document.getElementsByClassName('header-action-wrapper')[0].style.top= auxScroll;
        document.getElementsByClassName('header-nav-wrapper')[0].style.top= auxScroll;
        document.getElementsByClassName('header-primary-nav-overlay')[0].style.top= auxScroll;
        document.getElementsByClassName('header-primary-nav-bg')[0].style.top= auxScroll;*/








        ///Show the closeMobile and add a height to it
        FFAPI.variables.closeMobileJS[0].style.height = FFAPI.methods.getDocHeight() + 'px';
        FFAPI.methods.removeClass(FFAPI.variables.closeMobileJS[0], 'hide');


        /*
        $('body').bind('touchmove', function(e){e.preventDefault()});*/
    };

    /**
     * Click or tapping on the headerTrigger again will close it
     * @method FFAPI.responsive.hamburguerMenuClose
     * @param {Event} event
     */
    FFAPI.responsive.hamburguerMenuClose = function (event) {

        if (event != undefined) {
            /// Prevent Default event
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation()
            } else {
                event.returnValue = false;
            }
        }
        //alert("CLOSE;");
        ///console.log("hamburguerMenuClose");

        //$('body').unbind('touchmove');

        /// Change the variable to indcate the ffmenu is not visible
        FFAPI.variables.ffmenu.menuVisible = false;

        if (!Modernizr.csstransitions) {
            /// Animate the bodyElement
            FFAPI.variables.bodyElement.animate({ left: 0 }, FFAPI.variables.animationSpeed, function () {
                var auxScroll = '';
                FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
                document.querySelector('header').style.top = auxScroll;
                document.getElementsByClassName('header-action-wrapper')[0].style.top = auxScroll;
                document.getElementsByClassName('header-nav-wrapper')[0].style.top = auxScroll;
                document.getElementsByClassName('header-primary-nav-overlay')[0].style.top = auxScroll;
                document.getElementsByClassName('header-primary-nav-bg')[0].style.top = auxScroll;
            });
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');


        } else {
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');

        }


        /// Remove the header-nav-drawer-close class from the bodyElement
        setTimeout(function () {
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
            var auxScroll = '';
            FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
            document.querySelector('header').style.top = auxScroll;
            document.getElementsByClassName('header-action-wrapper')[0].style.top = auxScroll;
            document.getElementsByClassName('header-nav-wrapper')[0].style.top = auxScroll;
            document.getElementsByClassName('header-primary-nav-overlay')[0].style.top = auxScroll;
            document.getElementsByClassName('header-primary-nav-bg')[0].style.top = auxScroll;
        }, FFAPI.variables.resizeWindowTime);

        /// Hide the js-close-mobile
        FFAPI.methods.addClass(FFAPI.variables.closeMobileJS[0], 'hide');

        /// Bind the headerTrigger events
        FFAPI.variables.headerTrigger
        .off('click', FFAPI.responsive.hamburguerMenuClose)
        .on('click', FFAPI.responsive.hamburguerMenuClick);




        /// Be sure the ffmenu searchHideEvent is hidden
        FFAPI.methods.ffmenu.searchHideEvent();
    };

    /**
     * Binds clicking on the tabs. To be used while tab is not animating. 
     * Has to prevent any action while animations are on course
     * @method FFAPI.responsive.bindHamburguerMenuClick
     */
    FFAPI.responsive.bindHamburguerMenuClick = function () {
        FFAPI.variables.headerTrigger = $('.header-trigger');
        FFAPI.variables.headerTrigger.on('click', FFAPI.responsive.hamburguerMenuClick);







    };



    $(document).ready(function () {
        /// CloseMobile bind element click with function to close
        FFAPI.methods.bindElemClick(FFAPI.variables.closeMobileJS, FFAPI.responsive.hamburguerMenuClose);

        if (FFAPI.variables.touchSupported === true) {
            FFAPI.variables.closeMobileJS[0].addEventListener('touchstart', FFAPI.responsive.hamburguerMenuClose, false);
        }


        /**
         * Click or tapping on the noticeErrorCloseButton close the alert element
         * @method FFAPI.variables.noticeErrorCloseButton.on('click tap', function)
         */
        FFAPI.variables.noticeErrorCloseButton.on('click', function () {
            $(this).closest(".notice_error").hide();
            globalPosWrapper = $(".globalposWrapper");
            if (globalPosWrapper.length > 0) {
                globalPosWrapper.removeClass('hide');
            }
        });
    });


    /**
     * On document ready load the mediaQuerieSetValues
     * @method $(document).ready(function($)
     */
    $(document).ready(function () {
        FFAPI.responsive.bindHamburguerMenuClick();
    });

}


/**
* Redirect to search resultss
* @method FFAPI.methods.redirectToSearchResults
* @param  {[type]} value    [description]
* @param  {[type]} genderID [description]
*/
FFAPI.methods.redirectToSearchResults = function (value, genderID) {

    var gender = "", designersPage = "";
    if (genderID === undefined || genderID === null || genderID === 0) {
        genderID = FFAPI.methods.getGenderId();
    }

    if (genderID == 248) {
        gender = "men";
        designersPage = "/designers-men.aspx";
    }
    else {
        gender = "women";
        designersPage = "/designers-women.aspx";
    }
    var homeUrl = location.protocol + "//" + location.host + window.universal_variable.page.subfolder;
    var valueHex = FFAPI.methods.stringToHex(value.replace(/</gi, "").replace(/>/gi, ""));
    var valueEncoded = encodeURIComponent(value);

    if (value) {
        var obj = { searchTerm: valueEncoded, gender: genderID };
        $.ajax({
            type: "POST",
            url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + window.universal_variable.page.subfolder + "/FFAPI/AsyncUtil.asmx/GetStopWords",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(obj),
            success: function (data) {
                if (data.hasOwnProperty("d") && data.d != null && data.d != "") {
                    window.location = homeUrl + "/shopping/" + gender + "/" + data.d;
                }
                else {
                    window.location = homeUrl + "/shopping/" + gender + "/search/schid-" + valueHex + "/items.aspx?q=" + valueEncoded;
                }
            },
            error: function () {
                window.location = homeUrl + "/shopping/" + gender + "/search/schid-" + valueHex + "/items.aspx?q=" + valueEncoded;
            }
        });


    }
    else {
        // redirects to designers page                
        window.location = homeUrl + designersPage;
    }
};


/**
 * Destroy the ffmenu and start it again width the touch event
 * @method FFAPI.responsive.startffmenuHover
 */
FFAPI.responsive.startffmenuHover = function () {
    FFAPI.variables.headerNavLi.ffmenu('destroy');

    if (FFAPI.variables.touchSupported === true) {
        FFAPI.variables.ffmenu.touchDesktopMenu();
    } else {
        FFAPI.variables.headerNavLi.ffmenu({});
    }
};

/**
 * Destroy the ffmenu and start it again width the click event
 * @method FFAPI.responsive.startffmenuClick
 */
FFAPI.responsive.startffmenuClick = function () {
    FFAPI.variables.headerNavLi.ffmenu('destroy');
    FFAPI.variables.headerNavLi.ffmenu({ eventAction: 'click' });
};


if (FFAPI.variables.touchSupported === true) {
    $('.meganav-mask').mouseup(function (e) {
        e.preventDefault();
        FFAPI.variables.headerNavLi.ffmenu();
    });
}


/*
} catch (e) {
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}*/


FFAPI.responsive.forceUserAuthentication = function() {
    /// <summary>
    ///     Checks whether a user's logged in or not
    /// </summary>
    /// <returns type="Boolean" />
    var isLogged = window.universal_variable.user.isLogged;
    if (!isLogged) {
        if (Modernizr.touch || FFAPI.responsive.goneSmallQuerie.matches) {
            var url = document.URL;
            $('#loginMobileHeader')[0].click();
            //TODO: link for signIn
        } else {
            if (FFAPI.responsive.goneSmallQuerie.matches) {
                var url = document.URL;
                $('#loginMobileHeader')[0].click();
            } else {
                $('a[data-tab="header-tabs-1"]').trigger('click');
            }
        }
        return isLogged;
    }
}
