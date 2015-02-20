/**
 Scroll javaScript file. It contains the functions to scroll to anchors.
 @class scroll-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive scroll
     */
    FFAPI.plugins.scroll = {

        /**
         * Trigger default class name
         * @type {String}
         */
        defaultClass: 'scroll-to',

        /**
         * Control class to tell that trigger was processed
         * @type {String}
         */
        processedClass: 'js-scroll-to',

        /**
         * Data attribute that indicates the ID of target element
         * @type {String}
         */
        dataTarget: 'data-target',

        /**
         * Data attribute to increment target top offset
         * @type {String}
         */
        dataOffset: 'data-offset',

        /**
         * Offset of the header nav for responsive purposes
         * @type {Number}
         * @default 0
         */
        headerOffset: 0,

        /**
         * Extra offset to incremenet header
         * @type {Number}
         * @default 20
         */
        extraOffset: 20,

        /**
         * Animating state
         * @type {Boolean}
         * @default false
         */
        animating: false,

        /**
         * List of processed triggers
         * @type {Array}
         */
        list: [],

        /**
         * Find trigger elements and processes them
         * Also checks header offset depends on responsive media
         * @return {void}
         */
        init: function() {

            var triggers = document.getElementsByClassName(FFAPI.plugins.scroll.defaultClass);

            for (var i = 0; i < triggers.length; i++) {
                FFAPI.plugins.scroll.bind(triggers[i]);
            }
            
            if (ffbrowser.isIE8 === false) {
                // Device - on load check
                FFAPI.plugins.scroll._responsive();

                // Tablet devices - when something changes
                FFAPI.responsive.goneSmallQuerie.addListener(FFAPI.plugins.scroll._responsive);

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.scroll._responsive);
            } else {
                // IE8 Browser - on load check
                FFAPI.plugins.scroll.headerOffset = (document.getElementsByTagName('header').length > 0 ? document.getElementsByTagName('header')[0].offsetHeight : 0) + FFAPI.plugins.scroll.extraOffset;
            }

        },

        /**
         * Scrolls the page to target element and calls a callback function
         * @param  {Element}   target
         * @param  {Number}   offset
         * @param  {Function} callback
         * @return {void}
         */
        to: function(target, offset, callback) {

            // Avoid scroll page twice
            if(FFAPI.plugins.scroll.animating) return;

            // If target element is on right position, just call the callback function
            if(FFAPI.plugins.scroll._top(target) + offset - FFAPI.plugins.scroll.headerOffset == 0) {
                if(callback) callback.call(); else return;
            }

            // Scroll start
            FFAPI.plugins.scroll.animating = true;

            // Scroll page to target
            $.Velocity(target, 'scroll', {
                duration: 750,
                offset: offset - FFAPI.plugins.scroll.headerOffset,
                complete: function() {
                    // Scroll stop
                    FFAPI.plugins.scroll.animating = false;

                    if(callback) callback.call(); else return;
                }
            });
        },

        /**
         * Tries to bind a new scroll trigger
         * @param  {Element} trigger
         * @return {boolean}
         */
        bind: function(trigger) {
            // Check if trigger processed
            if(!FFAPI.methods.hasClass(trigger, FFAPI.plugins.scroll.processedClass)) {
                FFAPI.plugins.scroll.list.push(new Scroll(trigger));

                return true;
            }

            return false;
        },

        /**
         * Updates the header offset when media query matches
         * @return {void}
         */
        _responsive: function() {

            if(FFAPI.responsive.goneSmallQuerie.matches || FFAPI.responsive.goneBigQuerie.matches) {
                FFAPI.plugins.scroll.headerOffset = (document.getElementsByTagName('header').length > 0 ? document.getElementsByTagName('header')[0].offsetHeight : 0) + FFAPI.plugins.scroll.extraOffset;
            }

        },

        /**
         * Returns the top position of an element
         * @param  {[type]} el
         * @return {[type]}
         */
        _top: function(el) {
            return el.getBoundingClientRect().top;
        }
    };

    /**
     * In order we have a single scroll system for our website, Scroll class makes all needed requirements.
     * @param {Element} element
     * @return {Scroll} Scroll object
     */
    function Scroll(element) {

        /**
         * Trigger element
         * @type {Element}
         */
        this.el = element;

        /**
         * Target element
         * @type {Element}
         * @default null
         */
        this.target = null;

        /**
         * Offset value
         * @type {Number}
         * @default 0
         */
        this.offset = 0;

        // Sets data attributes
        this._dataAttr();
        
        // Adds the processed class on trigger element
        FFAPI.methods.addClass(this.el, FFAPI.plugins.scroll.processedClass);

        // Binds click event on trigger element
        FFAPI.methods.on(this.el, 'click', this, false);

        return this;
    }

    /**
     * Methods for Scroll object
     * @type {Object}
     */
    Scroll.prototype = {

        /**
         * Finds and sets data attributes
         * @return {void}
         */
        _dataAttr: function() {

            // Try to set target attribute
            if(this.el.hasAttribute(FFAPI.plugins.scroll.dataTarget)) {
                this.target = document.getElementById(this.el.getAttribute(FFAPI.plugins.scroll.dataTarget));
            } else {
                this.target = document.getElementsByTagName('html')[0];
            }

            // Try to set offset attribute
            if(this.el.hasAttribute(FFAPI.plugins.scroll.dataOffset)) {
                this.offset = parseInt(this.el.getAttribute(FFAPI.plugins.scroll.dataOffset));
            }
        },

        /**
         * Handles click event
         * @param  {Event} e
         * @return {boolean}
         */
        handleEvent: function(e) {
            // Scrolls page to target element
            FFAPI.plugins.scroll.to(this.target, this.offset);

            // Prvents default action
            var evt = e ? e:window.event;
            if (evt.preventDefault) evt.preventDefault();
            evt.returnValue = false;
            return false;
        }

    };

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}