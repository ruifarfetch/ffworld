/*=====================================================
 =        ROLLOVER MENU PLUGIN V1.0.0 - 2013/08/31          =
 = Copyright Farfetch 2013
 = Dual licensed under the MIT
 (http://www.opensource.org/licenses/mit-license.php)
 = and GPL
 (http://www.opensource.org/licenses/gpl-license.php) licenses.
 V1.1.0 - added the crossfade animation
 =====================================================*/
(function ($) {
    var defaults = {
        switchImages: true,
        mouseenter: null,
        mouseleave: null,
        image: "data-img",
        image_alt: "data-img-alt",
        show: "",
        animate: false,
        crossfade: false,
        hide: ""
    };
    // Methods object
    var methods = {
        bindEvents: function (jQThis, settings, jQShow, jQHide, jQImage) {
            /// <summary>
            ///     Toggle animation when over a image
            /// </summary>
            /// <param name="jQThis" type="jQObject">
            ///     Element where it's being applied the animation (this)
            /// </param>
            /// <param name="settings" type="Object">
            ///     settings of the plugin
            /// </param>
            /// <param name="jQShow" type="jQObject">
            ///     Elements to show if not empty
            /// </param>
            /// <param name="jQHide" type="jQObject">
            ///     Elements to hide if not empty
            /// </param>
            /// <param name="jQImage" type="jQObject">
            ///     The Image element to get the source and the second source
            /// </param>
            jQThis.on("mouseenter", function (e) {
                if (jQHide != null) jQHide.hide();
                if (jQShow != null) jQShow.show();
                if (settings.switchImages) {
                    var altsrc = jQThis.find(".imageRollover").attr(settings.image_alt);
                    if (altsrc) {
                        /*CROSSFADE ANIMATION
                         IT CREATES A IMG ELEMENT
                         IF THE BROWSER SUPPORTS CSS3 ANIMATIONS
                         IT WILL ADD A CLASS ELSE
                         ANIMATES WITH JQUERY
                         */
                        if (settings.crossfade === true) {
                            jQImage.addClass('absolute');
                            if (jQImage.next(".absolute").length > 0) {
                                var newimg = jQImage.next("img");
                            }
                            else {
                                var newimg = $('<img class="absolute hide">');
                                newimg.attr('src', altsrc);
                                newimg.insertAfter(jQImage);
                            }

                            if (!Modernizr.csstransitions) {
                                newimg.fadeIn(300);
                                jQImage.fadeOut(300);
                            }
                            else {
                                jQImage.addClass('absolute').addClass('crossfade').addClass('opacity-crossfade');
                                newimg.removeClass('hide');
                            }
                            if (settings.animate === true)
                                newimg.addClass('rolloverActive');
                        }
                        else {
                            jQImage.attr("src", altsrc);
                            /*SIMPLE ANIMATION*/
                            if (settings.animate === true)
                                jQImage.removeClass('rollover').addClass('rolloverActive');
                        }
                    }
                }
                if (typeof (settings.mouseenter) === "function") {
                    settings.mouseenter(jQThis);
                }
            }).on("mouseleave", function (e) {
                if (jQHide != null) jQHide.show();
                if (jQShow != null) jQShow.hide();
                if (settings.switchImages) {
                    var src = jQThis.find(".imageRollover").attr(settings.image);
                    if (src) {
                        /*CROSSFADE*/
                        if (settings.crossfade === true) {
                            if (jQImage.next("img").length > 0) {
                                var newimg = jQImage.next(".absolute");
                            }
                            else {
                                var newimg = $('<img class="absolute hide">');
                            }
                            if (!Modernizr.csstransitions) {
                                newimg.fadeOut(300);
                                jQImage.fadeIn(300);
                            }
                            else {
                                jQImage.removeClass('opacity-crossfade ');
                            }
                        }
                        else {
                            jQImage.attr("src", src);
                            if (settings.animate === true)
                                jQImage.removeClass('rolloverActive').addClass('rollover');
                        }
                    }
                }
                if (typeof (settings.mouseleave) === "function") {
                    settings.mouseleave(jQThis);
                }
            });
        },
        init: function (options) {
            /// <summary>
            ///     Initializes Rollover objects
            /// </summary>
            /// <param name="options" type="object">
            ///     Object with initial parameters
            /// </param>
            /// <returns type="this" />
            if (this.length) {
                // extend options, set defaults for options not set
                var settings = {};
                if (options) {
                    settings = $.extend(settings, defaults, options);
                }
                var jQShow = null,
                    jQHide = null;
                //Checks if element is already a image or if it's inside a DIV
                if (this.is('img'))
                    jQImage = this;
                else
                    jQImage = this.find("img:first");
                //Check if there are plus elements to show
                if (settings.show != "") {
                    jQShow = $(settings.show, this);
                    if (!jQShow.length) {
                        jQShow = null;
                    }
                }
                //Check if there are plus elements to hide
                if (settings.hide != "") {
                    jQHide = $(settings.hide, this);
                    if (!jQHide.length) {
                        jQHide = null;
                    }
                }
                methods.bindEvents(this, settings, jQShow, jQHide, jQImage);
            }
            return this;
        }
    };
    // Method caller. Will call "init" with given parameters if no methods are called
    $.fn.rollover = function (method, args) {
        return this.each(function () {
            if (methods[method]) {
                if (args) {
                    return methods[method].apply($(this), args);
                } else {
                    return methods[method]();
                }
            } else if (typeof method === 'object' || !method) {
                return methods.init.call($(this), method);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.rollover');
            }
        });
    };
})(jQuery);

