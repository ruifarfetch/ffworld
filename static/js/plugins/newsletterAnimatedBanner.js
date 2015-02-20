try {


    require(['loads'], function () {
        require(['essentials'], function () {
            $(document).ready(function ($) {
                if (document.getElementsByClassName('animation-br-one') && document.getElementsByClassName('animation-br-one')[1]) {
                    /*Newsletter BR animation variables*/
                    FFAPI.variables.animationBanner = document.getElementsByClassName('animation-br-one');
                    FFAPI.variables.animationBannerLength = FFAPI.variables.animationBanner.length;
                    FFAPI.variables.animationBannerAux = 0;
                    FFAPI.variables.intervalAnimated = '';
                    FFAPI.variables.animationBannerNewsletterClose = document.getElementsByClassName('newsletter-close');

                    //Close function for the x on the newsletter
                    FFAPI.methods.animationBannerNewsletterClose = function () {
                        ///Fade in this element and add the zIndex to the animated banner 0
                        FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0], 0);
                        FFAPI.variables.animationBanner[0].style.zIndex = 10;
                        FFAPI.variables.animationBanner[1].style.zIndex = 1;
                        FFAPI.variables.animationBanner[1].style.display = 'none';
                        FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                        ///Clear the interval function
                        window.clearInterval(FFAPI.variables.intervalAnimated);
                        /// Create a cookie so we know to don't shpw it again
                        FFAPI.methods.createCookieNewsletter('newsletterbrcookie', 'visible', 7000);
                        FFAPI.variables.readCookieNewsletterBr = FFAPI.methods.readCookie('newsletterbrcookie');
                    };

                    /**
                     * Animation Banner function to fade in between elements.
                     */
                    FFAPI.methods.animationBanner = function () {
                        if (FFAPI.variables.animationBanner.length === 1) {
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            return;
                        }
                        if (FFAPI.variables.animationBannerAux === 0) {
                            FFAPI.methods.fadeOut(FFAPI.variables.animationBanner[0]);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1]);
                            FFAPI.variables.animationBanner[0].style.zIndex = 1;
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.variables.animationBannerAux = 1;
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(5000);

                        } else {
                            FFAPI.methods.fadeOut(FFAPI.variables.animationBanner[1]);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            FFAPI.variables.animationBanner[1].style.zIndex = 1;
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            FFAPI.variables.animationBannerAux = 0;
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);
                        }
                    };
                    /**
                     * Interval trigger animation newsletter
                     */
                    FFAPI.methods.intervalTriggerNewsletter = function (time) {
                        return window.setInterval(FFAPI.methods.animationBanner, time);
                    };


                    FFAPI.methods.createCookieNewsletter = function (name, value, days) {
                        if (days) {
                            var date = new Date();
                            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                            var expires = "; expires=" + date.toGMTString();
                        }
                        else var expires = "";
                        document.cookie = name + "=" + value + expires + "; path=/";
                    };

                    FFAPI.methods.readCookie = function (name) {
                        var nameEQ = name + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                        }
                        return null;
                    };

                    FFAPI.methods.eraseCookie = function (name) {
                        FFAPI.methods.createCookieNewsletter(name, "", -1);
                    }

                    FFAPI.variables.readCookieNewsletterBr = FFAPI.methods.readCookie('newsletterbrcookie');

                    /**END BANNER ANIMATION**/
                    FFAPI.methods.endBannerAnimation = function () {
                        if (!FFAPI.variables.readCookieNewsletterBr) {
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1]);
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            /// Bind the click to the close button
                            FFAPI.methods.bindElemClick(FFAPI.variables.animationBannerNewsletterClose, FFAPI.methods.animationBannerNewsletterClose);
                        } else {
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                        }

                        return;
                    };

                    /**START BANNER ANIMATION**/
                    FFAPI.methods.startBannerHomeAnimation = function () {
                        ///If the cookie doesn't exist
                        if (!FFAPI.variables.readCookieNewsletterBr) {
                            FFAPI.methods.addClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);
                            /// Bind the click to the close button
                            FFAPI.methods.bindElemClick(FFAPI.variables.animationBannerNewsletterClose, FFAPI.methods.animationBannerNewsletterClose);
                        }
                        else {
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            return;
                        }
                    };
                    /**
                     * Document ready for the newsletter br animatiob
                     */

                    FFAPI.methods.startBannerHomeAnimation();


                    /**
                     * On Showing the modal we control the animation to stop
                     */
                    $(document)
                        /// On showing modal
                        .on('show.bs.modal', '.modal', function () {
                            ///Clear the interval function
                            ///Fade in this element and add the zIndex to the animated banner 0
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1], 0);
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[1], 'animation-newsletter-signup');
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);

                        })
                        /// On hidding modal
                        .on('hidden.bs.modal', '.modal', function () {
                            ///Start the animation again
                            ///FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);

                        });
                }
            });
        });
    });
} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}
