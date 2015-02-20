
/**
Responsive IE 8 javaScript file. It contains functions for the responsiveIEness of the site work on IE8
@deprecated api/
@class responsiveIE-IE8-1.0.0.js
**/

/**
* This module contains global methods of our API
* @module  responsieIE   */
///try {

if (ffbrowser.isIE8 === true) {

    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }

    if (!window.console) console = { log: function () { } };
    /**
     * IndeOF E8 polyfill
     * @return {-1}
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }

    /**
     * Inner width IE8 polyfill
     * @return {[window innerWidth]}
     */
    if (!window.innerWidth) {
        window.innerWidth = document.documentElement.clientWidth || document.body.clientWidth;
    };

    /**
     * Inner Height IE8 polyfill
     * @return {[window innerHeight]}
     */
    if (!window.innerHeight) {
        window.innerHeight = document.documentElement.clientHeight || document.body.clientHeight;
    };

    /**
     * This functions makes the document.getElementsByClassName to work on IE8. This is a crucial fast performance enhancement. It uses the querySelectorAll method that is slower but works on IE8.
     * @method document.getElementsByClassName
     */
    document.getElementsByClassName = Element.prototype.getElementsByClassName = function (class_names) {
        // Turn input in a string, prefix space for later space-dot substitution
        class_names = ('.' + class_names);
        return this.querySelectorAll(class_names);
    };
    var responsiveIE = {};

    //Just check if the variable is initialized
    /**
    * Responsive Window Inner Width. Get the window width for IE8.<br />
    * <b><i> responsiveIE.WindowInnerwidth = 0;<br /></i></b>
    * @property responsiveIE.WindowInnerwidth
    * @type Number
    */
    responsiveIE.WindowInnerwidth = 0; //Get the window innerWidth on IE8
    /**
    * Responsive Resizing. Check if the window is resizing<br />
    * <b><i> responsiveIE.resizing = "";<br /></i></b>
    * @property responsiveIE.resizing
    * @type Function
    */
    responsiveIE.resizing = "";  //Resizing for IE8

    responsiveIE.resizeWindowTime = 100;

    responsiveIE.mobile = 480;
    /**
     * FFAPI Responsive Fablet Width. The media querie size for fablets <br /> We use 768 by default.
     * <b><i> responsiveIE.fablet = 768;<br /></i></b>
     * @property responsiveIE.fablet
     * @type Number
     */
    responsiveIE.fablet = 767;
    /**
     * FFAPI Responsive Tablet Width. The media querie size for tablets <br /> We use 1024 by default.
     * <b><i> responsiveIE.tablet = 1024;<br /></i></b>
     * @property responsiveIE.tablet
     * @type Number
     */
    responsiveIE.tablet = 1024;
    /**
     * FFAPI Responsive Desktops Width. The media querie size for desktops <br /> We use 1440 by default.
     * <b><i> responsiveIE.desktop = 1440;<br /></i></b>
     * @property responsiveIE.desktop
     * @type Number
     */
    responsiveIE.desktop = 1440;

    /// Check what responsive images we have loaded
    /**
     * FFAPI Responsive Loaded Huge Images. Variable to check if Huge Images are loaded <br />
     * <b><i> responsiveIE.loadedHugeImages = false;<br /></i></b>
     * @property responsiveIE.loadedHugeImages
     * @type Boolean
     */
    responsiveIE.loadedHugeImages = false;
    /**
     * FFAPI Responsive Loaded Large Images. Variable to check if Large Images are loaded <br />
     * <b><i> responsiveIE.loadedXLImages = false;<br /></i></b>
     * @property responsiveIE.loadedXLImages
     * @type Boolean
     */
    responsiveIE.loadedXLImages = false;
    /**
     * FFAPI Responsive Loaded Medium Images. Variable to check if Medium Images are loaded <br />
     * <b><i> responsiveIE.loadedMDImages = false;<br /></i></b>
     * @property responsiveIE.loadedMDImages
     * @type Boolean
     */
    responsiveIE.loadedMDImages = false;
    /**
     * FFAPI Responsive Loaded Small Images. Variable to check if Small Images are loaded <br />
     * <b><i> responsiveIE.loadedSMImages = false;<br /></i></b>
     * @property responsiveIE.loadedSMImages
     * @type Boolean
     */
    responsiveIE.loadedSMImages = false;
    /**
     * FFAPI Responsive Loaded Extra Small Images. Variable to check if Extra Small Images are loaded <br />
     * <b><i> responsiveIE.loadedXSImages = false;<br /></i></b>
     * @property responsiveIE.loadedXSImages
     * @type Boolean
     */
    responsiveIE.loadedXSImages = false;
    /**
     * FFAPI Responsive is bigger than Large. Variable to check if images loaded are bigger than Large <br />
     * <b><i> responsiveIE.biggerThanXL = false;<br /></i></b>
     * @property responsiveIE.biggerThanXL
     * @type Boolean
     */
    responsiveIE.biggerThanXL = false;
    /**
     * FFAPI Responsive is bigger than Medium. Variable to check if images loaded are bigger than Medium <br />
     * <b><i> responsiveIE.biggerThanMD = false;<br /></i></b>
     * @property responsiveIE.biggerThanMD
     * @type Boolean
     */
    responsiveIE.biggerThanMD = false;
    /**
     * FFAPI Responsive is bigger than Small. Variable to check if images loaded are bigger than Small <br />
     * <b><i> responsiveIE.biggerThanSM = false;<br /></i></b>
     * @property responsiveIE.biggerThanSM
     * @type Boolean
     */
    responsiveIE.biggerThanSM = false;
    /**
     * FFAPI Responsive is bigger than Extra Small. Variable to check if images loaded are bigger than Extra Small <br />
     * <b><i> responsiveIE.biggerThanXS = false;<br /></i></b>
     * @property responsiveIE.biggerThanXS
     * @type Boolean
     */
    responsiveIE.biggerThanXS = false;

    /// Responsive images names
    /**
     * FFAPI Responsive Large Image Name end. Variable that tells us the end name of the Large images <br />
     * <b><i> responsiveIE.imageXL = "1000";<br /></i></b>
     * @property responsiveIE.imageXL
     * @type String
     */
    responsiveIE.imageXL = "1000";
    /**
     * FFAPI Responsive Medium Image Name end. Variable that tells us the end name of the Medium images <br />
     * <b><i> responsiveIE.imageMD = "800";<br /></i></b>
     * @property responsiveIE.imageMD
     * @type String
     */
    responsiveIE.imageMD = "800";
    /**
     * FFAPI Responsive Small Image Name end. Variable that tells us the end name of the Small images <br />
     * <b><i> responsiveIE.imageSM = "400";<br /></i></b>
     * @property responsiveIE.imageSM
     * @type String
     */
    responsiveIE.imageSM = "400";

    /// Responsive MediaQueries
    /**
     * FFAPI Responsive Media Querie Huge. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
     * <b><i> responsiveIE.mediaQuerieHuge = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieHuge
     * @type Boolean
     */
    responsiveIE.mediaQuerieHuge = false;
    /**
     * FFAPI Responsive Media Querie Large. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
     * <b><i> responsiveIE.mediaQuerieXL = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieXL
     * @type Boolean
     */
    responsiveIE.mediaQuerieXL = false;
    /**
     * FFAPI Responsive Media Querie Medium. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
     * <b><i> responsiveIE.mediaQuerieMD = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieMD
     * @type Boolean
     */
    responsiveIE.mediaQuerieMD = false;
    /**
     * FFAPI Responsive Media Querie Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
     * <b><i> responsiveIE.mediaQuerieSM = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieSM
     * @type Boolean
     */
    responsiveIE.mediaQuerieSM = false;
    /**
     * FFAPI Responsive Media Querie Extra Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
     * <b><i> responsiveIE.mediaQuerieXS = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieXS
     * @type Boolean
     */
    responsiveIE.mediaQuerieXS = false;
    /**
     * FFAPI Responsive Media Querie Header. Variable will be a Window matchMedia. It will helps us to check when the user needs to load the header-2.0.0.js and the event Listeners on this file..
     * <b><i> responsiveIE.mediaQuerieHeader = false;<br /></i></b>
     * @property responsiveIE.mediaQuerieHeader
     * @type Boolean
     */
    responsiveIE.mediaQuerieHeader = false;
    /**
     * FFAPI Responsive Media Querie Gone Small. Variable will be a Window matchMedia. It will helps us to check when the screen goes small and the behaviours we need
     * <b><i> responsiveIE.goneSmallQuerie = false;<br /></i></b>
     * @property responsiveIE.goneSmallQuerie
     * @type Boolean
     */
    responsiveIE.goneSmallQuerie = false;
    /**
     * FFAPI Responsive Media Querie Gone Big. Variable will be a Window matchMedia. It will helps us to check when the screen goes big and the behaviours we need
     * <b><i> responsiveIE.goneBigQuerie = false;<br /></i></b>
     * @property responsiveIE.goneBigQuerie
     * @type Boolean
     */
    responsiveIE.goneBigQuerie = false;



    /**
 * This functions changes the src of the image for the newSrc
 * @method responsiveIE.changeImageSrc
 * @param {Object} node - Image object
 * @param {URL} newSrc - Image Url
 * @return true
 */
    responsiveIE.changeImageSrc = function (node, newSrc) {
        node.src = newSrc;
        return true;
    };

    /**
     * This functions caches the new image using another function, and it has a callback function
     * @method responsiveIE.cacheAndLoadImage
     * @param {Object} node - Image Object
     * @param {URL} newSrc - Image URL
     * @param {function} callback
     * @return Callback function
     */
    responsiveIE.cacheAndLoadImage = function (node, newSrc, callback) {
        responsiveIE.isImageCached(newSrc);
        callback(node, newSrc);
    };

    /**
     * Checks if image is cached and caches the image
     * @method responsiveIE.isImageCached
     * @param {String} imgUrl
     * @return Boolean
     */
    responsiveIE.isImageCached = function (imgUrl) {
        ///console.log(imgUrl);
        if (imgUrl != null) {
            var imgEle = document.createElement("img");
            imgEle.src = imgUrl;
            return imgEle.complete || (imgEle.width + imgEle.height) > 0;
        } else {
            return false;
        }
    };


    /**
     * This functions checks what image to load on the images with responsiveIE class. It changes for some large, medium and small sizes After checking the window width it checks what image to load. Doesn't load smaller images if already loaded the a bigger size
     * @method responsiveIE.matchMediaImagesIE8
     */
    responsiveIE.matchMediaImagesIE8 = function () {
        responsiveIE.WindowInnerwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var nodes = document.getElementsByClassName('responsive'),
            i = 0;


        /*FORCE THE WINDOW TO BE ALWAYS ONE SIZE ON IE8*/
        if (document.documentElement.clientWidth < 1024) {
            window.resizeTo(1064, 768);
        }

        ///Bigger then the responsiveIE.desktop
        if (responsiveIE.WindowInnerwidth > responsiveIE.desktop) {
            if ((responsiveIE.loadedHugeImages === false)) {
                ///Cache the images first and then change the src with callback function
                for (i = 0; i <= nodes.length - 1; i++) {
                    responsiveIE.cacheAndLoadImage(nodes[i], nodes[i].getAttribute('data-large'), responsiveIE.changeImageSrc);
                }
                responsiveIE.loadedHugeImages = true;
                responsiveIE.biggerThanXS = true;
                responsiveIE.biggerThanSM = true;
                responsiveIE.biggerThanMD = true;
                responsiveIE.biggerThanXL = true;
            }
            ///Between tablet and desktop
        } else if ((responsiveIE.WindowInnerwidth > responsiveIE.tablet) && (responsiveIE.WindowInnerwidth < responsiveIE.desktop)) {
            if ((responsiveIE.biggerThanXL === false)) {
                for (i = 0; i <= nodes.length - 1; i++) {
                    responsiveIE.cacheAndLoadImage(nodes[i], nodes[i].getAttribute('data-large'), responsiveIE.changeImageSrc);
                }
                responsiveIE.loadedXLImages = true;
                responsiveIE.biggerThanXS = true;
                responsiveIE.biggerThanSM = true;
                responsiveIE.biggerThanMD = true;
                responsiveIE.biggerThanXL = true;
            }
            ///Between fablet and tablet
        } else if ((responsiveIE.WindowInnerwidth > responsiveIE.fablet) && (responsiveIE.WindowInnerwidth < responsiveIE.tablet)) {
            if ((responsiveIE.biggerThanMD === false)) {
                for (i = 0; i <= nodes.length - 1; i++) {
                    responsiveIE.cacheAndLoadImage(nodes[i], nodes[i].getAttribute('data-medium'), responsiveIE.changeImageSrc);
                }
                responsiveIE.loadedMDImages = true;
                responsiveIE.biggerThanXS = true;
                responsiveIE.biggerThanSM = true;
                responsiveIE.biggerThanMD = true;
            }
            ///Between mobile and fablet
        } else if ((responsiveIE.WindowInnerwidth > responsiveIE.mobile) && (responsiveIE.WindowInnerwidth < responsiveIE.fablet)) {
            if ((responsiveIE.biggerThanSM === false)) {
                for (i = 0; i <= nodes.length - 1; i++) {
                    responsiveIE.cacheAndLoadImage(nodes[i], nodes[i].getAttribute('data-small'), responsiveIE.changeImageSrc);
                }
                responsiveIE.loadedSMImages = true;
                responsiveIE.biggerThanXS = true;
                responsiveIE.biggerThanSM = true;
            }
            ///Smaller size for mobiles devices
        } else {
            if ((responsiveIE.biggerThanXS === false)) {
                for (i = 0; i <= nodes.length - 1; i++) {
                    responsiveIE.cacheAndLoadImage(nodes[i], nodes[i].getAttribute('data-small'), responsiveIE.changeImageSrc);
                }
                responsiveIE.loadedXSImages = true;
                responsiveIE.biggerThanXS = true;
            }
        }
    };

    /**
         * Send the user to the buttons page url link
         * @param  {[type]} urlAddress url address
         * @method responsiveIE.buttonsSend = function(urlAddress){
         */
    responsiveIE.buttonsSend = function (urlAddress) {
        window.location.href = urlAddress;
    }
    /**
     * Get all the buttons that have a link as parent
     * @method responsiveIE.linkButtons = function(){
     */
    responsiveIE.linkButtons = function () {
        responsiveIE.buttons = document.getElementsByTagName('button');
        responsiveIE.buttonsLength = responsiveIE.buttons.length;
        var aux = 0, dataAjax = "";
        for (aux; aux < responsiveIE.buttonsLength; aux++) {
            responsiveIE.buttonsLink = responsiveIE.buttons[aux].parentNode;
            dataAjax = responsiveIE.buttonsLink.getAttribute("data-ajax");
            if (dataAjax != true && dataAjax != 'true') {
                if (typeof responsiveIE.buttonsLink.href != "undefined") {
                    var auxThis = responsiveIE.buttonsLink.href;
                    responsiveIE.buttons[aux].onclick = function () {
                        responsiveIE.buttonsSend(this.parentNode.href);
                    }
                }
            }
        }
    }

    /**
    * On resizing the window after variables.resizeWindowTime it updates the Images on IE8 width responsiveIE.matchMediaImagesIE8 method.
    * @method $(window).resize(function($)
    */

    $(window).resize(function () {
        clearTimeout(responsiveIE.resizing);
        responsiveIE.resizing = setTimeout(responsiveIE.matchMediaImagesIE8, responsiveIE.resizeWindowTime);
    });

    $(document).ready(function ($) {
        setTimeout(responsiveIE.matchMediaImagesIE8, responsiveIE.resizeWindowTime);
        responsiveIE.linkButtons();
    });

}


///} catch (e) {
///    try {
///        if (window.debug) {
///            console.log(e);
///        }
///    } catch (ex) {
///    }
///}