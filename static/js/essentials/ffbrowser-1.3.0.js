/*jslint browser: true, white: false, indent: 4 */
/*global navigator */

/**
* This class contains global properties related to the Browser User Agent. We analyse this and save properties related to the Operating System, browser name and version and if it's a mobile device or not. We also add classes to the HTML element at the end.<br><br>
* This script sets OSName variable as follows:<br>
* <br> "win"        for all versions of Windows
* <br> "win-mobile" for all versions of Windows Mobile
* <br> "mac"        for all versions of Macintosh OS
* <br> "linux"      for all versions of Linux
* <br> "unix"       for all other UNIX flavors
* <br> "ipad"       for all ipad
* <br> "ipod"       for all ipods
* <br> "iphone"     for all iphones
* <br> "android"    for all Android
* <br> "unknown-os" indicates failure to detect the OS
* <br> "mobile-device" if it is ipad, ipod, iphone or android <br><br>
This script will add classes to the html element<br><br>
document.documentElement.className += ' ' + ffbrowser.isIE + ' ' + ffbrowser.os + ' ' + ffbrowser.browserName + ' ' + ffbrowser.browserClass + ' ' + ffbrowser.isMobile + ' ' + ffbrowser.uniqueClassName;<br>
* <br> Generates classes like: <b>lt-ie10 lt-ie9 lt-ie8 ie10 gt-ie10 msie chrome opera</b>
* <br><br> It has a <a href="http://github.com/farfetch/ffbrowser" target="_blank">Github page</a></b>
* 
* @class ffbrowser
*/
try {
    /**
     * ffbrowser - the find first browser object.
     * <br><b><i>ffbrowser = {};<br /></i></b>
     * @property ffbrowser
     * @type Object
     */
    var ffbrowser = {
        /**
         * ffbrowser.nVer - browser version.
         * <br><b><i>ffbrowser.nVer=navigator.appVersion;<br /></i></b>
         * @property ffbrowser.nVer
         * @type String
         */
        nVer: navigator.appVersion,
        /**
         * ffbrowser.nAgt - the browser user agent .
         * <br><b><i>ffbrowser.nAgt = navigator.userAgent;<br /></i></b>
         * @property ffbrowser.nAgt
         * @type String
         */
        nAgt: navigator.userAgent,
        /**
         * ffbrowser.browserName - the browser Name .
         * <br><b><i>ffbrowser.browserName = navigator.appName;<br /></i></b>
         * @property ffbrowser.browserName
         * @type String
         */
        browserName: navigator.appName,
        /**
         * ffbrowser.browserClass - the browsers Class to add - it will add something like chrome, or firefox .
         * <br><b><i>ffbrowser.browserClass = '';<br /></i></b>
         * @property ffbrowser.browserClass
         * @type String
         */
        browserClass: '',
        /**
         * ffbrowser.fullVersion - the browsers full version.
         * <br><i>ffbrowser.fullVersion = parseFloat(navigator.appVersion);<br /></i></b>
         * @property ffbrowser.fullVersion
         * @type String
         */
        fullVersion: parseFloat(navigator.appVersion),
        /**
         * ffbrowser.majorVersion - the browser main version, it will be a Number like 31, or 21.
         * <br><b><i>ffbrowser.majorVersion= parseInt(navigator.appVersion,10);<br /></i></b>
         * @property ffbrowser.majorVersion
         * @type String
         */
        majorVersion: parseInt(navigator.appVersion, 10),
        /**
         * ffbrowser.verOffset - the browser version name.
         * <br><b><i>ffbrowser.verOffset = '';<br /></i></b>
         * @property ffbrowser.verOffset
         * @type String
         */
        verOffset: '',
        /**
         * ffbrowser.ix - the browser main version.
         * <br><b><i>ffbrowser.ix = '';<br /></i></b>
         * @property ffbrowser.ix
         * @type String
         */
        ix: '',
        /**
         * ffbrowser.isIE8 - if the browser is IE8 this variable will be true.
         * <br><b><i>ffbrowser.isIE8 = false;<br /></i></b>
         * @property ffbrowser.isIE8
         * @type Boolean
         */
        isIE8: false,
        /**
         * ffbrowser.isIE - if the browser is an Internet Explorer or not.
         * <br><b><i>ffbrowser.isIE = 'not-ie';<br /></i></b>
         * @property ffbrowser.isIE
         * @type String
         */
        isIE: 'not-ie',
        /**
         * ffbrowser.os - the client operating system. If unknown adds the class unknown-os, if Windown adds win class, if Linux adds linux class, if Macintosh adds class mac
         * <br><b><i>ffbrowser.os = 'unknown-os';<br /></i></b>
         * @property ffbrowser.os
         * @type String
         */
        os: 'unknown-os',
        /**
         * ffbrowser.isMobile - if the client is on a mobile device it will add the class mobile-device, if not adds the class no-mobile-device.
         * <br><b><i>ffbrowser.isMobile = 'no-mobile-device';<br /></i></b>
         * @property ffbrowser.isMobile
         * @type String
         */
        isMobile: 'no-mobile-device',
        /**
         * ffbrowser.usingApp - Check if user is on the farfetch discover app.
         * <br><b><i>ffbrowser.usingApp = false;<br /></i></b>
         * @property ffbrowser.usingApp
         * @type Boolean
         */
        usingApp: false,
        /**
         * ffbrowser.usingAppClass - Using app ClassName.
         * <br><b><i>ffbrowser.usingAppClass = 'farfetch-discover';<br /></i></b>
         * @property ffbrowser.usingAppClass
         * @type Boolean
         */
        usingAppClass: 'farfetch-discover',
        /**
         * ffbrowser.uniqueClassName - An unique class name with the operating system and browser class name.
         * <br><b><i>ffbrowser.uniqueClassName = '';<br /></i></b>
         * @property ffbrowser.uniqueClassName
         * @type String
         */
        uniqueClassName: '',
        /**
         * ffbrowser.checkBrowser - The function that makes all the necessary operations to get the variables.
         * <br><b><i>ffbrowser.checkBrowser = function() <br /></i></b>
         * @property ffbrowser.checkBrowser
         * @type Function
         */
        checkBrowser: function () {

            //GET THE OS
            if (navigator.appVersion.indexOf('Win') !== -1) {
                ffbrowser.os = 'win';
            }
            if (navigator.userAgent.match('IEMobile/') !== null) {
                ffbrowser.os = 'win-mobile';
            }
            if (navigator.appVersion.indexOf('Mac') !== -1) {
                ffbrowser.os = 'mac';
            }
            if (navigator.appVersion.indexOf('X11') !== -1) {
                ffbrowser.os = 'unix';
            }
            if (navigator.appVersion.indexOf('Linux') !== -1) {
                ffbrowser.os = 'linux';
            }
            if (navigator.userAgent.match(/iPad/i) !== null) {
                ffbrowser.os = 'ipad';
            }
            if (navigator.userAgent.match(/iPod/i) !== null) {
                ffbrowser.os = 'ipod';
            }
            if (navigator.userAgent.match(/iPhone/i) !== null) {
                ffbrowser.os = 'iphone';
            }
            if (navigator.userAgent.match(/Android/i) !== null) {
                ffbrowser.os = 'android';
            }

            //Check if is mobile os
            if (ffbrowser.os === 'ipad' || ffbrowser.os === 'ipod' || ffbrowser.os === 'iphone' || ffbrowser.os === 'android' || ffbrowser.os === 'win-mobile') {
                ffbrowser.isMobile = 'mobile-device';
            }

            // In Opera, the true version is after 'Opera' or after 'Version'
            if ((ffbrowser.nAgt.indexOf('Opera')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Opera');
                ffbrowser.browserName = 'opera';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 6);
                if ((ffbrowser.nAgt.indexOf('Version')) !== -1) {
                    ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Version');
                    ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 8);
                }
                // In Opera the newest versions only detect OPR
            } else if ((ffbrowser.nAgt.indexOf('OPR')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('OPR');
                ffbrowser.browserName = 'opera';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 4);
                // In MSIE, the true version is after 'MSIE' in userAgent
            } else if ((ffbrowser.nAgt.indexOf('MSIE')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('MSIE');
                ffbrowser.browserName = 'msie';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 5);
                // IN IE11 we have Trident as user agent
            } else if ((ffbrowser.nAgt.indexOf('Trident')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Trident');
                ffbrowser.browserName = 'msie';
                ffbrowser.isIE = 'is-ie';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 5);
                ffbrowser.majorVersion = 11;
                ffbrowser.fullVersion = 11;
                // In Chrome, the true version is after 'Chrome'
            } else if ((ffbrowser.nAgt.indexOf('Chrome')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Chrome');
                ffbrowser.browserName = 'chrome';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 7);
                // In Safari, the true version is after 'Safari' or after 'Version'
            } else if ((ffbrowser.nAgt.indexOf('Safari')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Safari');
                ffbrowser.browserName = 'safari';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 7);
                if ((ffbrowser.nAgt.indexOf('Version')) !== -1) {
                    ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Version');
                    ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 8);
                }
                // In Firefox, the true version is after 'Firefox'
            } else if ((ffbrowser.nAgt.indexOf('Firefox')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('Firefox');
                ffbrowser.browserName = 'firefox';
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 8);
                // Just to be sure iPhone's apps gets recognized
            } else if ((ffbrowser.nAgt.indexOf('iPhone')) !== -1 && (ffbrowser.nAgt.indexOf('tablet')) === -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('iPhone');
                ffbrowser.browserName = 'safari';
                ffbrowser.fullVersion = 1000;
                ffbrowser.ix = 'app';
                // Just to be sure iPad's apps gets recognized
            } else if ((ffbrowser.nAgt.indexOf('iPad')) !== -1) {
                ffbrowser.verOffset = ffbrowser.nAgt.indexOf('iPad');
                ffbrowser.browserName = 'safari';
                ffbrowser.fullVersion = 2000;
                ffbrowser.os = 'ipad';
                ffbrowser.ix = 'app';
                // In most other browsers, 'name/version' is at the end of userAgent
            } else if ((ffbrowser.nAgt.lastIndexOf(' ') + 1) < (ffbrowser.nAgt.lastIndexOf('/'))) {
                ffbrowser.verOffset = ffbrowser.nAgt.lastIndexOf('/');
                ffbrowser.browserName = ffbrowser.nAgt.substring(ffbrowser.nAgt.lastIndexOf(' '), ffbrowser.verOffset);
                ffbrowser.fullVersion = ffbrowser.nAgt.substring(ffbrowser.verOffset + 1);
                if (ffbrowser.browserName.toLowerCase() === ffbrowser.browserName.toUpperCase()) {
                    ffbrowser.browserName = navigator.appName;
                }
            }

            // Check if you're using farfetch.discover
            if ((ffbrowser.nAgt.indexOf('com.farfetch.discover')) !== -1) {
                ffbrowser.usingApp = true;
            }

            var aux = '' + ffbrowser.fullVersion;
            if ((aux.indexOf(';')) != -1) {
                ffbrowser.ix = aux.indexOf(';');
                ffbrowser.fullVersion = aux.substring(0, ffbrowser.ix);
            }
            if ((aux.indexOf(' ')) != -1) {
                ffbrowser.ix = aux.indexOf(' ');
                ffbrowser.fullVersion = aux.substring(0, ffbrowser.ix);
            }

            ffbrowser.majorVersion = parseInt(ffbrowser.fullVersion, 10);


            if (isNaN(ffbrowser.majorVersion)) {
                ffbrowser.fullVersion = parseFloat(navigator.appVersion);
                ffbrowser.majorVersion = parseInt(navigator.appVersion, 10);
            }

            //If the browser is IE we add some special classes like HTML5 boilerplate does
            if (ffbrowser.browserName === 'msie') {
                ffbrowser.browserClass = 'msie';
                ffbrowser.isIE = 'is-ie';
                if (ffbrowser.majorVersion === 7) {
                    ffbrowser.browserClass = 'lt-ie10 lt-ie9 lt-ie8';
                } else {
                    if (ffbrowser.majorVersion === 8) {
                        ffbrowser.isIE8 = true;
                        ffbrowser.browserClass = 'lt-ie10 lt-ie9';
                    } else {
                        if (ffbrowser.majorVersion === 9) {
                            ffbrowser.browserClass = 'lt-ie10';
                        } else {
                            if (ffbrowser.majorVersion === 10) {
                                ffbrowser.browserClass = 'ie10';
                            } else {
                                ffbrowser.browserClass = 'gt-ie10';
                            }
                        }
                    }
                }
            } else {
                ffbrowser.browserClass = ffbrowser.browserName + ffbrowser.majorVersion;
            }

            //And finally we add an unique class for each [A-Za-z0-9_]
            ffbrowser.uniqueClassName = ffbrowser.os + '-' + ffbrowser.browserClass.replace(/[^a-zA-Z0-9_.\-\s]/g, "").replace(/\s/g, '-');

            if (ffbrowser.ix === 'app') {
                ffbrowser.uniqueClassName += '-app';
            }

            ffbrowser.browserName = ffbrowser.browserName.replace(/[^a-zA-Z0-9_.\-\s]/g, "").replace(/\s/g, '-');
            ffbrowser.browserClass = ffbrowser.browserClass.replace(/[^a-zA-Z0-9_.\-\s]/g, "");

            // Add class when usingApp
            if (ffbrowser.usingApp) {
                ffbrowser.browserClass += ' ' + ffbrowser.usingAppClass;
            }

            //And we add those classes to the HTML element
            document.documentElement.className += ' ' + ffbrowser.isIE + ' ' + ffbrowser.os + ' ' + ffbrowser.browserName + ' ' + ffbrowser.browserClass + ' ' + ffbrowser.isMobile + ' ' + ffbrowser.uniqueClassName;
        }
    };
    /// Start the Functions to get the browser info
    ffbrowser.checkBrowser();

} catch (e) {
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}