/*global require, define, z, $, FFAPI, ffbrowser, console, Modernizr */
/*jslint browser: true*/
/*jslint plusplus: true */

//try {
/**
 * FFAPI Video Variables object.
 * @property FFAPI.variables.video
 * @type {Object}
 */
FFAPI.variables.video = {};
/**
 * FFAPI Video Methods object.
 * @property FFAPI.methods.video
 * @type {Object}
 */
FFAPI.methods.video = {};
/**
 * FFAPI Video mediaPlayer array.
 * @property FFAPI.variables.video.mediaPlayer =[];
 * @type {Array}
 */
FFAPI.variables.video.mediaPlayer = [];
/**
 * FFAPI Video play buttons array.
 * @property FFAPI.variables.video.play =[];
 * @type {Array}
 */
FFAPI.variables.video.play = [];
/**
 * FFAPI Video play buttons array Length variable.
 * @property FFAPI.variables.video.playLength = 0;
 * @type {Number}
 */
FFAPI.variables.video.mediaPlayerLength = 0;
/**
 * FFAPI Video play buttons array Length variable.
 * @property FFAPI.variables.video.playLength = 0;
 * @type {Number}
 */
FFAPI.variables.video.playLength = 0;
/**
 * FFAPI Video variable to check if the video is playing
 * @property FFAPI.variables.video.playing = false;
 * @type {Boolean}
 */
FFAPI.variables.video.playing = false;
/**
 * FFAPI Video variable to check if the video behavior is loaded
 * @property FFAPI.variables.video.loaded = false;
 * @type {Boolean}
 */
FFAPI.variables.video.loaded = false;
/**
 * FFAPI variable video with originalHtml for unloading the video from the slider
 * @property FFAPI.variables.video.originalHtml = false;
 * @type {String}
 */
FFAPI.variables.video.originalHtml = '';

/**
 * Video Preloading has some issues on Chrome
 * https://code.google.com/p/chromium/issues/detail?id=234779
 * We detected this and we don't use preloading at his best so we don't have issues on Chrome
 * 
 */

FFAPI.methods.video.checkVideoSupport = function () {
    'use strict';
    /// If it has a video element and support to video
    if (document.getElementsByClassName('js-video-element') && Modernizr.video) {
        FFAPI.methods.video.getVideoFromCaroussel();
    }
    return true;
};

/**
* Reset the video on mobile. We should use this for touch devices only for exitFullScreen if it has support and set the current time to frame 4
* @param  {[type]} idVideo [description]
*/
FFAPI.methods.video.resetVideo = function () {
    var idVideo = this.getAttribute('clickedID');
    FFAPI.methods.video.exitFullScreen(idVideo);
    FFAPI.methods.video.setCurrentTime(idVideo);
}
/**
* Exit the fullscreen video
* @param  {[type]} idVideo [description]
*/
FFAPI.methods.video.exitFullScreen = function (idVideo) {

    FFAPI.variables.video.mediaVideoElements[idVideo].webkitExitFullscreen();

}
/**
* Set the current time to second 4 in order we can see the poster for the video
* @param {[type]} idVideo [description]
*/
FFAPI.methods.video.setCurrentTime = function (idVideo) {
    setTimeout(function () {
        FFAPI.variables.video.mediaVideoElements[idVideo].currentTime = 4;
    }, 2000);
}

/**
 * FFAPI.methods.video.getVideoFromCaroussel function to get the video info and elements from the Caroussel. We load the elements from a slider and if it has support we load the video.
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.getVideoFromCaroussel = function () {
    'use strict';
    /// Get all the variablaes and attributes
    /// Prepare a template to add the video to the HTML
    var i = 0,
        sliderVideo = document.getElementsByClassName('js-video-element'),
        sliderVideoPoster = sliderVideo[0].getAttribute('src'),
        sliderVideoId = sliderVideo[0].getAttribute('data-video-id'),
        sliderVideoControls = sliderVideo[0].getAttribute('data-video-controls'),
        sliderVideoMp4 = sliderVideo[0].getAttribute('data-video-mp4'),
        sliderVideoWebm = sliderVideo[0].getAttribute('data-video-webm'),
        sliderVideoOgg = sliderVideo[0].getAttribute('data-video-ogg'),
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length,
        template = '';
    if (FFAPI.variables.touchSupported) {
        template = '<video class="' + sliderVideoId + '" width="100%" height="100%" poster="' + sliderVideoPoster + '" controls="controls" preload="auto">';
    } else {
        template = '<video class="' + sliderVideoId + '" width="100%" height="100%" poster="' + sliderVideoPoster + '" controls="false" preload="auto">';
    }
    /// Get the original html
    if (sliderVideoContainer) {
        FFAPI.variables.video.originalHtml = sliderVideoContainer[0].innerHTML;
    }
    ///Check what video formats are available
    if (sliderVideoMp4) {
        template += '<source src="' + sliderVideoMp4 + '" type="video/mp4">';
    }
    if (sliderVideoWebm) {
        template += '<source src="' + sliderVideoWebm + '" type="video/wbm">';
    }
    if (sliderVideoOgg) {
        template += '<source src="' + sliderVideoOgg + '" type="video/ogg">';
    }
    template += '</video><div class="media-controls"><div id="play-pause-button" class="play"><span class="icon-play glyphs"></span></div></div>';


    if (sliderVideoContainerLength) {
        /// Change the slider HTML to this new content from template
        for (i; i < sliderVideoContainerLength; i++) {
            sliderVideoContainer[i].innerHTML = template;
        }
        FFAPI.variables.video.loaded = true;

        if (FFAPI.variables.touchSupported) {
            /**
         * FOR WHEN VIDEO ENDED ON MOBILE
         * TEST THIS WELL
         */

            FFAPI.variables.video.mediaVideoElements = document.getElementsByClassName('media-video'),
            FFAPI.variables.video.mediaVideoElementsLength = FFAPI.variables.video.mediaVideoElements.length;

            /**
         * Add the event Listener
         * @type {Number}
         */
            for (var i = 0; i < FFAPI.variables.video.mediaVideoElementsLength; i++) {
                FFAPI.variables.video.mediaVideoElements[i].setAttribute("clickedId", i);
                if (FFAPI.variables.touchSupported) {
                    FFAPI.variables.video.mediaVideoElements[i].setAttribute("controls", "");
                }
                FFAPI.variables.video.mediaVideoElements[i].addEventListener("ended", FFAPI.methods.video.resetVideo);
            }

            /**
         * END OF WHEN VIDEO ENDED
         */
        }
    }

    /// Define the globals media Players
    /// Get it's length
    if (sliderVideoId) {
        FFAPI.variables.video.mediaPlayer = document.getElementsByClassName(sliderVideoId);
        FFAPI.variables.video.mediaPlayerLength = FFAPI.variables.video.mediaPlayer.length;
        ///Bind click on the video to play the video
        FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideoBind);
        /// Remove controls from all mediaControls
        /// Add an event when video ended
        for (i = 0; i < FFAPI.variables.video.mediaPlayerLength; i++) {
            if (FFAPI.variables.touchSupported) {
                FFAPI.variables.video.mediaPlayer[i].setAttribute("controls", "");
            } else {
                FFAPI.variables.video.mediaPlayer[i].controls = false;
            }
            /// Add an event when video ended
            FFAPI.variables.video.mediaPlayer[i].addEventListener('ended', FFAPI.methods.video.endedCarousselVideo);
        }
    }
    /// Define the globals player controls
    /// Get their length
    if (sliderVideoControls) {
        FFAPI.variables.video.play = document.getElementsByClassName(sliderVideoControls);
        FFAPI.variables.video.playLength = FFAPI.variables.video.play.length;
        ///Bind click on the Button play to play the video
        FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideoBind);
    }

    return true;
};

/**
 * [playCarousselVideoBind description]
 * @return {Boolean} Just return true when end.
 * REDO THE PREVENDEFAULT - TEST IE / CHROME AND MOBILE
 */
FFAPI.methods.video.playCarousselVideoBind = function (event) {
    'use strict';
    if (window.event) {
        var e = window.event;
        if (!e.preventDefault) {
            e.returnValue = false;
            e.cancelBubble = true;
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    } else {
        var e = event;
        e.preventDefault();
        e.stopPropagation();
    }
    FFAPI.methods.video.playCarousselVideo();
    ///Unbind click on the video to play the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideo);
    ///Unbind click on the Button play to play the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideo);
    ///Bind click on the video to stop the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the Button stop to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);

    return false;
};
/**
 * [stopCarousselVideoBind description]
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.stopCarousselVideoBind = function () {
    'use strict';
    FFAPI.methods.video.stopCarousselVideo();
    ///Unbind click on the video to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Unbind click on the Button play to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the video to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideo);
    ///Bind click on the Button play to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideo);

    return true;
};


/**
 * [unloadVideoFromSlider description]
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.unloadVideoFromSlider = function () {
    'use strict';
    ///Just to be sure the video has stopped
    FFAPI.methods.video.stopCarousselVideoBind();
    var i = 0,
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length;

    if (sliderVideoContainerLength) {
        /// Change the slider HTML to this new content from template
        for (i; i < sliderVideoContainerLength; i++) {
            sliderVideoContainer[i].innerHTML = FFAPI.variables.video.originalHtml;
        }
        FFAPI.variables.video.loaded = false;
    }

    return true;
};

/**
 * FFAPI.methods.video.playCarousselVideo function to play video on the product caroussel
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.playCarousselVideo = function () {
    'use strict';
    /// Declare variable i for auliary methods
    var i = 0;

    /*Clickstream*/
    if (FFAPI.variables.video.mediaPlayer != undefined) {
        if (FFAPI.variables.video.mediaPlayer[0].currentTime === 0) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.parse("59"); //Play Video
            }
        } else if (FFAPI.variables.video.mediaPlayer[0].paused === true) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.parse("61"); //Resume Video
            }
        }
    }

    /// We make the play for all videos on the slideshow
    /// So they are syncronized
    for (i; i < FFAPI.variables.video.mediaPlayerLength; i++) {
        FFAPI.variables.video.mediaPlayer[i].play();
    }

    /// Change the video variable playing to true
    /// This way we know video is playing
    FFAPI.variables.video.playing = true;

    /// Change the class for the video control button
    /// We remove the class play-stop
    /// We add the class play-start
    for (i = 0; i < FFAPI.variables.video.playLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[i], 'play-stop');
        FFAPI.methods.addClass(FFAPI.variables.video.play[i], 'play-start');
    }

    return true;

};



/**
 * FFAPI.methods.video.playCarousselVideo function to play video on the product caroussel
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.stopCarousselVideo = function () {
    'use strict';
    /// Declare variable i for auliary methods
    var i = 0;

    /// We make the stop for all videos on the slideshow
    /// So they are syncronized
    for (i; i < FFAPI.variables.video.mediaPlayerLength; i++) {
        FFAPI.variables.video.mediaPlayer[i].pause();
    }

    /// Change the video variable playing to true
    /// This way we know video is playing
    FFAPI.variables.video.playing = false;

    /// Change the class for the video control button
    /// We remove the class play-stop
    /// We add the class play-start
    for (i = 0; i < FFAPI.variables.video.playLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[i], 'play-start');
        FFAPI.methods.addClass(FFAPI.variables.video.play[i], 'play-stop');
    }

    /*Clickstream*/
    if (typeof (_fftrkobj) !== "undefined") {
        _fftrkobj.parse("60"); //Pause Video
    }

    return true;
};


/**
 * FFAPI.methods.video.endedCarousselVideo function for when the video is over
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.endedCarousselVideo = function () {
    'use strict';
    var j = 0;
    ///Load the video in order to make it available
    this.load();
    for (j; j < FFAPI.variables.video.playLength; j++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[j], 'play-start');
        FFAPI.methods.addClass(FFAPI.variables.video.play[j], 'play-stop');
    }
    ///Unbind click on the video to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Unbind click on the Button play to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the video to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideoBind);
    ///Bind click on the Button play to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideoBind);

    /// Change the video variable playing to false
    /// This way we know video is stopped
    FFAPI.variables.video.playing = false;

    /*Clickstream*/
    if (typeof (_fftrkobj) !== "undefined") {
        _fftrkobj.parse("62"); //Video End
    }

    return true;

};



/**
 * If the browser doesn't support video we remove all the elements from the DOM if they exist
 * @return {Boolean} Just return true when end.
 */

FFAPI.methods.video.removeVideoSliderElements = function () {
    'use strict';
    /// Get all the variables and attributes
    /// Prepare to change the data-slide-index of the links on the bx-pager-thumb
    var i = 0,
        sliderProductModule = document.getElementsByClassName('js-sliderProductPage'),
        sliderThumbs = document.getElementsByClassName('bx-pager-thumb'),
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length,
        sliderVideoThumb = document.getElementsByClassName('js-video-thumb'),
        sliderVideoThumbLength = sliderVideoContainer.length,
        sliderVideoThumbsLinks = '',
        sliderVideoThumbsLinksLength = '';

    ///Remove the sliderVideoContainer on the slider
    if (sliderVideoContainer && sliderProductModule) {
        for (i; i < sliderVideoContainerLength; i++) {
            sliderProductModule[0].removeChild(sliderVideoContainer[i]);
        }
    }

    ///Remove the sliderVideoThumb on the slider
    if (sliderVideoThumb && sliderThumbs) {
        for (i = 0; i < sliderVideoThumbLength; i++) {
            sliderThumbs[0].removeChild(sliderVideoThumb[i]);
        }
    }

    ///Re-organize the sliderVideoThumbLinks
    if (sliderVideoThumb) {
        sliderVideoThumbsLinks = sliderThumbs[0].getElementsByTagName('a');
        sliderVideoThumbsLinksLength = sliderVideoThumbsLinks.length;

        for (i = 0; i < sliderVideoThumbsLinksLength; i++) {
            sliderVideoThumbsLinks[i].setAttribute('data-slide-index', i);
        }
    }
    return true;
};
/**
 * Document ready for Video - we check if the browser has video execute FFAPI.methods.video.removeVideoSliderElements
 */
$(document).ready(function () {
    'use strict';
    if (!Modernizr.video) {
        FFAPI.methods.video.removeVideoSliderElements();
    }
});

/*} catch (e) {
 try {
     if (window.debug) {
         console.log(e);
     }
 } catch (ignore) {
 }
}*/