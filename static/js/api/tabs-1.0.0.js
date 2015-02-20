/**
 Tabs javaScript file. It contains the functions for control page tabs.
 @class tabs-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive tabs
     */
    FFAPI.plugins.tabs = {

        /**
         * The default class of the tab
         * @type {String}
         */
        defaultClass: 'tabs',

        /**
         * The processed class of the tab
         * @type {String}
         */
        processedClass: 'js-tabs',

        /**
         * The active class of the item
         * @type {String}
         */
        activeClass: 'active',

        /**
         * The class of the trigger button
         * @type {String}
         */
        itemTitleClass: 'tabs-title',

        /**
         * The class of the content
         * @type {String}
         */
        itemContentClass: 'tabs-content',

        dataIndex: 'data-index',

        // Tabs list
        list: {
            'xs': [],
            'sm': [],
            'md': [],
            'xl': [],
            'only-xl': []
        },

        // Initialize registered tabs
        init: function() {

            // Default suffix
            var defaultSuffix = 'xl';

            var tabs = document.getElementsByClassName(FFAPI.plugins.tabs.defaultClass);

            for (var i = 0; i < tabs.length; i++) {

                // Set tabs suffix
                var tabsSuffix = FFAPI.plugins.tabs._suffix(tabs[i].className);
                if(!tabsSuffix) tabsSuffix = defaultSuffix;

                // Tries to bind a new tabs
                FFAPI.plugins.tabs.bind(tabs[i], tabsSuffix);
            }

            if (ffbrowser.isIE8 === false) {
            
                // Mobile devices - on load check
                FFAPI.plugins.tabs._goneXS();
                
                // Mobile devices - when something changes
                FFAPI.responsive.mediaQuerieXS.addListener(FFAPI.plugins.tabs._goneXS);
                
                // Fablet devices - on load check
                FFAPI.plugins.tabs._goneSM();

                // Fablet devices - when something changes
                FFAPI.responsive.mediaQuerieSM.addListener(FFAPI.plugins.tabs._goneSM);
                
                // Tablet devices - on load check
                FFAPI.plugins.tabs._goneMD();

                // Tablet devices - when something changes
                FFAPI.responsive.mediaQuerieMD.addListener(FFAPI.plugins.tabs._goneMD);

                // Desktop devices - on load check
                FFAPI.plugins.tabs._goneXL();

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.tabs._goneXL);
            } else {
                // IE8 browser - on load check
                FFAPI.plugins.tabs._goneIE8();
            }

            // On hash change
            window.onhashchange = function () {
                FFAPI.plugins.tabs.hashHandler(FFAPI.methods.urlHash());
            };

        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            var suffix = FFAPI.plugins.tabs._suffix(element.className);
            if(suffix && FFAPI.plugins.tabs.list.hasOwnProperty(suffix) && FFAPI.plugins.tabs._processed(element)) {
                if(element.hasAttribute(FFAPI.plugins.tabs.dataIndex)) {
                    return FFAPI.plugins.tabs.list[suffix][parseInt(element.getAttribute(FFAPI.plugins.tabs.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element, suffix) {
            // Check if element processed
            if(!FFAPI.plugins.tabs._processed(element)) {

                // Add index attribute to tabs
                element.setAttribute(FFAPI.plugins.tabs.dataIndex, FFAPI.plugins.tabs.list[suffix].length);

                // Push new tabs
                FFAPI.plugins.tabs.list[suffix].push(new Tabs(element));
            }
        },

        hashHandler: function(refName) {
            
            var tabsEl = refName.split('-')[0];

            var tabs = FFAPI.plugins.tabs.get(document.getElementById(tabsEl));

            if(!tabs || !tabs.built) return;

            // Show tab
            tabs.show(document.getElementById(refName));
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, FFAPI.plugins.tabs.processedClass);
        },

        _suffix: function(className) {
            // Detect suffix
            var matches = className.match(""+FFAPI.plugins.tabs.defaultClass+"-[a-z\-]+");
            if(matches) {
                return matches[0].replace(FFAPI.plugins.tabs.defaultClass + '-', '');
            }

            return null;
        },

        // When IE8 Browser
        _goneIE8: function () {

            // Build 'xl' tabs
            FFAPI.plugins.tabs._build('xl');
            FFAPI.plugins.tabs._destroy('md');
            FFAPI.plugins.tabs._destroy('sm');
            FFAPI.plugins.tabs._destroy('xs');
            FFAPI.plugins.tabs._build('only-xl');

        },

        // When Desktop
        _goneXL: function() {

            if (FFAPI.responsive.goneBigQuerie.matches) {
                
                // Build 'xl' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._destroy('md');
                FFAPI.plugins.tabs._destroy('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._build('only-xl');

            }

        },

        // When Tablet
        _goneMD: function() {

            if (FFAPI.responsive.mediaQuerieMD.matches) {
                
                // Build 'md' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._destroy('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // When Fablet
        _goneSM: function() {

            if (FFAPI.responsive.mediaQuerieSM.matches) {
                
                // Build 'sm' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._build('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // When Mobile
        _goneXS: function() {

            if (FFAPI.responsive.mediaQuerieXS.matches) {
                
                // Build 'xs' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._build('sm');
                FFAPI.plugins.tabs._build('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // Build all tabss of a given suffix
        _build: function(suffix) {

            // Build 'suffix' tabs
            for (var i = 0; i < FFAPI.plugins.tabs.list[suffix].length; i++) {
                FFAPI.plugins.tabs.list[suffix][i].build();
            }

        },

        // Destroy all tabss of a given suffix
        _destroy: function(suffix) {

            // Destroy 'suffix' tabs
            for (var i = 0; i < FFAPI.plugins.tabs.list[suffix].length; i++) {
                FFAPI.plugins.tabs.list[suffix][i].destroy();
            }

        }
    };

    /**
     * [Tabs] In order we have a single tabs plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the tabs element]
     */
    function Tabs(element) {

        // Tabs element
        this.el = element;

        // Active item
        this.activeItem = null;
        
        // Tabs items
        this.items = [];

        // Built flag
        this.built = false;

        // Opening state
        this.opening = false;

        // URL hash
        this.urlHash = FFAPI.methods.urlHash();

        // Callbacks
        this.callbacks = {
            'show': [],
            'hide': []
        };

        // Process tabs items
        this._processItems();

        // Add processed class to tabs
        FFAPI.methods.addClass(this.el, FFAPI.plugins.tabs.processedClass);

        return this;
    }

    /**
     * Tabs public methods
     * 
     */
     Tabs.prototype = {

        show: function(el) {
            if(el !== null && typeof(el) !== 'object') {
                this._show(this.items[parseInt(el)]);
            }

            if(!el || !el.hasAttribute(FFAPI.plugins.tabs.dataIndex)) return;

            // Tries to parse index attribute
            var idx = parseInt(el.getAttribute(FFAPI.plugins.tabs.dataIndex));
            if(idx >= this.items.length) return;

            this._show(this.items[idx]);
        },

        bindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._bindClick(this.items[idx]);
        },

        build: function() {

            if(this.built) return;

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Bind click event
                this._bindClick(this.items[i]);

                if((!this.urlHash && this.items[i].el.getAttribute('data-active')) || this.urlHash === this.items[i].hash) {
                    this._show(this.items[i], true);
                }
            }

            this.built = true;

        },

        unbindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._unbindClick(this.items[idx]);
        },

        destroy: function() {

            if(!this.built) return;

            // Hide active item
            if(this.activeItem) {
                this._hide(this.activeItem);
            }

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Unbind click event
                this._unbindClick(this.items[i]);
            }

            this.built = false;

        },

        setCallback: function(event, fn) {
            this.callbacks[event].push(fn);
        },

        _processItems: function() {

            var items = this.el.getElementsByClassName(FFAPI.plugins.tabs.itemTitleClass);
            
            // Loop through items
            for (var i = 0; i < items.length; i++) {

                var hash = items[i].href;
                if(!hash) {
                    hash = items[i].getElementsByTagName('a')[0].href;
                }
                hash = FFAPI.methods.urlHash(hash);
                
                var item = {
                    el: items[i],
                    idx: i,
                    hash: hash,
                    content: document.getElementById(hash)
                };

                // Add index attribute
                item.el.setAttribute(FFAPI.plugins.tabs.dataIndex, i);
                item.content.setAttribute(FFAPI.plugins.tabs.dataIndex, i);

                // Push item to items array
                this.items.push(item);
                
                if((!this.urlHash && item.el.getAttribute('data-active')) || this.urlHash === item.hash) {
                    this._show(item, true);
                }
            }
        },

        _toggle: function(item, e) {
            if(!FFAPI.methods.hasClass(item.el, FFAPI.plugins.tabs.activeClass)) {
                this._show(item);
            }

            // Prvents default action
            var evt = e ? e:window.event;
            if (evt.preventDefault) evt.preventDefault();
            evt.returnValue = false;
            return false;
        },

        _hide: function(item) {
            var instance = this;

            $.Velocity(item.content, { opacity: 0 }, { 
                duration: 0,
                display: 'none',
                complete: function() {
                    // Remove active class from the title
                    FFAPI.methods.removeClass(item.el, FFAPI.plugins.tabs.activeClass);

                    // Remove active class from the content
                    FFAPI.methods.removeClass(item.content, FFAPI.plugins.tabs.activeClass);

                    // Remove display: none
                    item.content.removeAttribute('style');

                    for (var i = 0; i < instance.callbacks['hide'].length; i++) {
                        instance.callbacks['hide'][i]('hide', item);
                    }
                } 
            });
        },

        _show: function(item, onload) {
            var instance = this;

            // Avoid opening multiple items
            if(instance.opening) return;

            // Hide active item before animation starts
            if(instance.activeItem) {
                instance._hide(instance.activeItem);
            }

            // Start opening state
            instance.opening = true;

            // Expand selected item
            $.Velocity(item.content, { opacity: 1 }, { 
                duration: 0,
                display: 'inline-block',
                complete: function() {
                    // Add active class to title
                    FFAPI.methods.addClass(item.el, FFAPI.plugins.tabs.activeClass);

                    // Add active class to content
                    FFAPI.methods.addClass(item.content, FFAPI.plugins.tabs.activeClass);

                    // Remove display: block
                    item.content.removeAttribute('style');

                    // Set active item
                    instance.activeItem = item;

                    // Opening state finished
                    instance.opening = false;

                    for (var i = 0; i < instance.callbacks['show'].length; i++) {
                        instance.callbacks['show'][i]('show', item);
                    }
                }
            });
        },

        _bindClick: function(item) {

            if(!item.toggleHandler) {
                item.toggleHandler = this._toggle.bind(this, item);
            }

            if(document.addEventListener) {
                item.el.addEventListener('click', item.toggleHandler);
            } else {
                item.el.attachEvent('onclick', item.toggleHandler);
            }
        },

        _unbindClick: function(item) {

            if(document.removeEventListener) {
                item.el.removeEventListener('click', item.toggleHandler);
            } else {
                item.el.detachEvent('onclick', item.toggleHandler);
            }
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