/**

A polyfill used for IE8 and IE9. It is loaded conditionally by Require.js and Modernizr<br><br>
A fast & lightweight polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)<br>
https://github.com/scottjehl/Respond<br><br>
Test whether a CSS media type or media query applies<br>
https://github.com/paulirish/matchMedia.js/<br>
@deprecated plugins/
@class respond-match-media-addListener.js
**/

/**
* This module contains global methods for matchMedia and respond
* @module Polyfills
*/


/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */




// Paul Irish's match media: https://github.com/paulirish/matchMedia.js/blob/master/matchMedia.js
window.matchMedia || (window.matchMedia = function () {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style = document.createElement('style'),
            script = document.getElementsByTagName('script')[0],
            info = null;

        style.type = 'text/css';
        style.id = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style) || style.currentStyle;

        styleMedia = {
            /**
             * Description
             * @method matchMedium
             * @param {} media
             * @return BinaryExpression
             */
            matchMedium: function (media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function (media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());







// Paul Irish's addListener polyfill: https://github.com/paulirish/matchMedia.js/blob/master/matchMedia.addListener.js

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */

(function () {
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }


    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening = false,
        timeoutID = 0,    // setTimeout for debouncing 'handleChange'
        queries = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange = function (evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function () {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql = queries[i].mql,
                        listeners = queries[i].listeners || [],
                        matches = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            if (typeof listeners[j] !== 'undefined') {
                                if (typeof listeners[j].call(window, mql) !== 'undefined') {
                                    ///console.log('DONE -'.listeners[j]);
                                    listeners[j].call(window, mql);
                                }
                            }
                        }
                    }
                }
            }, 30);
        };


    window.matchMedia = function (media) {
        var mql = localMatchMedia(media),
            listeners = [],
            index = 0;

        mql.addListener = function (listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql: mql,
                    listeners: listeners
                });
            }

            listeners.push(listener);
        };


        mql.removeListener = function (listener) {
            for (var i = 0, il = listeners.length; i < il; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };

}());




if (ffbrowser.isIE8 === true) {
    /*! Respond.js v1.3.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
    (function (win) {

        "use strict";

        //exposed namespace
        var respond = {};
        win.respond = respond;

        //define update even in native-mq-supporting browsers, to avoid errors
        /**
         * Description
         * @method update
         * @return 
         */
        respond.update = function () { };

        //expose media query support flag for external use
        respond.mediaQueriesSupported = win.matchMedia && win.matchMedia("only all").matches;

        //if media queries are supported, exit here
        if (respond.mediaQueriesSupported) {
            return;
        }

        //define vars
        /**
         * Description
         * @method ajax
         * @param {} url
         * @param {} callback
         * @return 
         */
        var doc = win.document,
            docElem = doc.documentElement,
            mediastyles = [],
            rules = [],
            appendedEls = [],
            parsedSheets = {},
            resizeThrottle = 30,
            head = doc.getElementsByTagName("head")[0] || docElem,
            base = doc.getElementsByTagName("base")[0],
            links = head.getElementsByTagName("link"),
            requestQueue = [],

            //loop stylesheets, send text content to translate
            ripCSS = function () {

                for (var i = 0; i < links.length; i++) {
                    var sheet = links[i],
                    href = sheet.href,
                    media = sheet.media,
                    isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

                    //only links plz and prevent re-parsing
                    if (!!href && isCSS && !parsedSheets[href]) {
                        // selectivizr exposes css through the rawCssText expando
                        if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
                            translate(sheet.styleSheet.rawCssText, href, media);
                            parsedSheets[href] = true;
                        } else {
                            if ((!/^([a-zA-Z:]*\/\/)/.test(href) && !base) ||
                                href.replace(RegExp.$1, "").split("/")[0] === win.location.host) {
                                requestQueue.push({
                                    href: href,
                                    media: media
                                });
                            }
                        }
                    }
                }
                makeRequests();
            },

            //recurse through request queue, get css text
            makeRequests = function () {
                if (requestQueue.length) {
                    var thisRequest = requestQueue.shift();

                    ajax(thisRequest.href, function (styles) {
                        translate(styles, thisRequest.href, thisRequest.media);
                        parsedSheets[thisRequest.href] = true;

                        // by wrapping recursive function call in setTimeout 
                        // we prevent "Stack overflow" error in IE7
                        win.setTimeout(function () { makeRequests(); }, 0);
                    });
                }
            },

            //find media blocks in css text, convert to style blocks
            translate = function (styles, href, media) {
                var qs = styles.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),
                    ql = qs && qs.length || 0;

                //try to get CSS path
                href = href.substring(0, href.lastIndexOf("/"));

                /**
                 * Description
                 * @method repUrls
                 * @param {} css
                 * @return CallExpression
                 */
                var repUrls = function (css) {
                    return css.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3");
                },
                    useMedia = !ql && media;

                //if path exists, tack on trailing slash
                if (href.length) { href += "/"; }

                //if no internal queries exist, but media attr does, use that	
                //note: this currently lacks support for situations where a media attr is specified on a link AND
                //its associated stylesheet has internal CSS media queries.
                //In those cases, the media attribute will currently be ignored.
                if (useMedia) {
                    ql = 1;
                }

                for (var i = 0; i < ql; i++) {
                    var fullq, thisq, eachq, eql;

                    //media attr
                    if (useMedia) {
                        fullq = media;
                        rules.push(repUrls(styles));
                    }
                        //parse for styles
                    else {
                        fullq = qs[i].match(/@media *([^\{]+)\{([\S\s]+?)$/) && RegExp.$1;
                        rules.push(RegExp.$2 && repUrls(RegExp.$2));
                    }

                    eachq = fullq.split(",");
                    eql = eachq.length;

                    for (var j = 0; j < eql; j++) {
                        thisq = eachq[j];
                        mediastyles.push({
                            media: thisq.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/) && RegExp.$2 || "all",
                            rules: rules.length - 1,
                            hasquery: thisq.indexOf("(") > -1,
                            minw: thisq.match(/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                            maxw: thisq.match(/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                        });
                    }
                }

                applyMedia();
            },

            lastCall,

            resizeDefer,

            // returns the value of 1em in pixels
            getEmValue = function () {
                var ret,
                    div = doc.createElement('div'),
                    body = doc.body,
                    fakeUsed = false;

                div.style.cssText = "position:absolute;font-size:1em;width:1em";

                if (!body) {
                    body = fakeUsed = doc.createElement("body");
                    body.style.background = "none";
                }

                body.appendChild(div);

                docElem.insertBefore(body, docElem.firstChild);

                ret = div.offsetWidth;

                if (fakeUsed) {
                    docElem.removeChild(body);
                }
                else {
                    body.removeChild(div);
                }

                //also update eminpx before returning
                ret = eminpx = parseFloat(ret);

                return ret;
            },

            //cached container for 1em value, populated the first time it's needed 
            eminpx,

            //enable/disable styles
            applyMedia = function (fromResize) {
                var name = "clientWidth",
                    docElemProp = docElem[name],
                    currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp,
                    styleBlocks = {},
                    lastLink = links[links.length - 1],
                    now = (new Date()).getTime();

                //throttle resize calls	
                if (fromResize && lastCall && now - lastCall < resizeThrottle) {
                    win.clearTimeout(resizeDefer);
                    resizeDefer = win.setTimeout(applyMedia, resizeThrottle);
                    return;
                }
                else {
                    lastCall = now;
                }

                for (var i in mediastyles) {
                    if (mediastyles.hasOwnProperty(i)) {
                        var thisstyle = mediastyles[i],
                            min = thisstyle.minw,
                            max = thisstyle.maxw,
                            minnull = min === null,
                            maxnull = max === null,
                            em = "em";

                        if (!!min) {
                            min = parseFloat(min) * (min.indexOf(em) > -1 ? (eminpx || getEmValue()) : 1);
                        }
                        if (!!max) {
                            max = parseFloat(max) * (max.indexOf(em) > -1 ? (eminpx || getEmValue()) : 1);
                        }

                        // if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
                        if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
                            if (!styleBlocks[thisstyle.media]) {
                                styleBlocks[thisstyle.media] = [];
                            }
                            styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
                        }
                    }
                }

                //remove any existing respond style element(s)
                for (var j in appendedEls) {
                    if (appendedEls.hasOwnProperty(j)) {
                        if (appendedEls[j] && appendedEls[j].parentNode === head) {
                            head.removeChild(appendedEls[j]);
                        }
                    }
                }

                //inject active styles, grouped by media type
                for (var k in styleBlocks) {
                    if (styleBlocks.hasOwnProperty(k)) {
                        var ss = doc.createElement("style"),
                            css = styleBlocks[k].join("\n");

                        ss.type = "text/css";
                        ss.media = k;

                        //originally, ss was appended to a documentFragment and sheets were appended in bulk.
                        //this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
                        head.insertBefore(ss, lastLink.nextSibling);

                        //if ( ss.styleSheet ){ 
                        //ss.styleSheet.cssText = css;
                        //}

                        if (ss.styleSheet) {// IE 
                            var setFunc = function () {
                                try {
                                    ss.styleSheet.cssText = css;
                                } catch (e) {

                                }
                            }
                        }
                        else {
                            ss.appendChild(doc.createTextNode(css));
                        }

                        //push to appendedEls to track for later removal
                        appendedEls.push(ss);
                    }
                }
            },
            //tweaked Ajax functions from Quirksmode
            ajax = function (url, callback) {
                var req = xmlHttp();
                if (!req) {
                    return;
                }
                req.open("GET", url, true);
                /**
                 * Description
                 * @method onreadystatechange
                 * @return 
                 */
                req.onreadystatechange = function () {
                    if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
                        return;
                    }
                    callback(req.responseText);
                };
                if (req.readyState === 4) {
                    return;
                }
                req.send(null);
            },
            //define ajax obj 
            xmlHttp = (function () {
                var xmlhttpmethod = false;
                try {
                    xmlhttpmethod = new win.XMLHttpRequest();
                }
                catch (e) {
                    xmlhttpmethod = new win.ActiveXObject("Microsoft.XMLHTTP");
                }
                return function () {
                    return xmlhttpmethod;
                };
            })();

        //translate CSS
        ripCSS();

        //expose update for re-running respond later on
        respond.update = ripCSS;

        //adjust on resize
        /**
         * Description
         * @method callMedia
         * @return 
         */
        function callMedia() {
            applyMedia(true);
        }
        if (win.addEventListener) {
            win.addEventListener("resize", callMedia, false);
        }
        else if (win.attachEvent) {
            win.attachEvent("onresize", callMedia);
        }
    })(this);
}