/**
 Accordion javaScript file. It contains the functions for control page accordions.
 @class accordion-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive accordions
     */
    FFAPI.plugins.accordion = {

        /**
         * FFAPI Accordion defaultClass. The default class of the accordion
         * <b><i>FFAPI.plugins.accordion.defaultClass = 'accordion';<br /></i></b>
         * @property FFAPI.plugins.accordion.defaultClass
         * @type String
         */
        defaultClass: 'accordion',

        /**
         * FFAPI Accordion defaultClass. The default class of the accordion
         * <b><i>FFAPI.plugins.accordion.defaultClass = 'accordion';<br /></i></b>
         * @property FFAPIs.accordion.defaultClass
         * @type String
         */
        processedClass: 'js-accordion',

        /**
         * FFAPI Accordion itemClass. The item class of the accordion
         * <b><i>FFAPI.plugins.accordion.itemClass = 'accordion-title';<br /></i></b>
         * @property FFAPI.plugins.accordion.itemClass
         * @type String
         */
        itemClass: 'accordion-item',

        /**
         * FFAPI Accordion itemActiveClass. The active class of the item
         * <b><i>FFAPI.plugins.accordion.itemActiveClass = 'active';<br /></i></b>
         * @property FFAPI.plugins.accordion.itemActiveClass
         * @type String
         */
        itemActiveClass: 'active',

        /**
         * FFAPI Accordion titleClass. The title class of the accordion
         * <b><i>FFAPI.plugins.accordion.titleClass = 'accordion-title';<br /></i></b>
         * @property FFAPI.plugins.accordion.titleClass
         * @type String
         */
        itemTitleClass: 'accordion-title',

        /**
         * FFAPI Accordion contentClass. The content class of the accordion
         * <b><i>FFAPI.plugins.accordion.contentClass = 'accordion-content';<br /></i></b>
         * @property FFAPI.plugins.accordion.contentClass
         * @type String
         */
        itemContentClass: 'accordion-content',

        dataIndex: 'data-index',

        // Accordions list
        list: {
            'xs': [],
            'sm': [],
            'md': [],
            'xl': [],
            'only-xl': []
        },

        // Initialize registered accordions
        init: function () {
            
            if (ffbrowser.isIE8 === false) {

                // Mobile devices - on load check
                FFAPI.plugins.accordion._goneXS();

                // Mobile devices - when something changes
                FFAPI.responsive.mediaQuerieXS.addListener(FFAPI.plugins.accordion._goneXS);

                // Fablet devices - on load check
                FFAPI.plugins.accordion._goneSM();

                // Fablet devices - when something changes
                FFAPI.responsive.mediaQuerieSM.addListener(FFAPI.plugins.accordion._goneSM);

                // Tablet devices - on load check
                FFAPI.plugins.accordion._goneMD();

                // Tablet devices - when something changes
                FFAPI.responsive.mediaQuerieMD.addListener(FFAPI.plugins.accordion._goneMD);

                // Desktop devices - on load check
                FFAPI.plugins.accordion._goneXL();

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.accordion._goneXL);
            } else {
                // IE8 browser - on load check
                FFAPI.plugins.accordion._goneIE8();
            }

        },

        // Register accordions by a container element
        register: function(container) {

            // Default suffix
            var defaultSuffix = 'xl';

            // Nothing to do here if container not valid
            if(!container) return;

            var accordions = container.getElementsByClassName(FFAPI.plugins.accordion.defaultClass);

            for (var i = 0; i < accordions.length; i++) {

                // Set accordion suffix
                var accordionSuffix = FFAPI.plugins.accordion._suffix(accordions[i].className);
                if(!accordionSuffix) accordionSuffix = defaultSuffix;

                // Tries to bind a new accordion
                FFAPI.plugins.accordion.bind(accordions[i], accordionSuffix);
            }
        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            var suffix = FFAPI.plugins.accordion._suffix(element.className);
            if(suffix && FFAPI.plugins.accordion.list.hasOwnProperty(suffix) && FFAPI.plugins.accordion._processed(element)) {
                if(element.hasAttribute(FFAPI.plugins.accordion.dataIndex)) {
                    return FFAPI.plugins.accordion.list[suffix][parseInt(element.getAttribute(FFAPI.plugins.accordion.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element, suffix) {
            // Check if element processed
            if(!FFAPI.plugins.accordion._processed(element)) {

                // Add index attribute to accordion
                element.setAttribute(FFAPI.plugins.accordion.dataIndex, FFAPI.plugins.accordion.list[suffix].length);

                // Push new accordion
                FFAPI.plugins.accordion.list[suffix].push(new Accordion(element));
            }
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, FFAPI.plugins.accordion.processedClass);
        },

        _suffix: function(className) {
            // Detect suffix
            var matches = className.match(""+FFAPI.plugins.accordion.defaultClass+"-[a-z\-]+");
            if(matches) {
                return matches[0].replace(FFAPI.plugins.accordion.defaultClass + '-', '');
            }

            return null;
        },

        // When IE8 Browser
        _goneIE8: function () {

            // Build 'xl' accordions
            FFAPI.plugins.accordion._build('xl');
            FFAPI.plugins.accordion._destroy('md');
            FFAPI.plugins.accordion._destroy('sm');
            FFAPI.plugins.accordion._destroy('xs');
            FFAPI.plugins.accordion._build('only-xl');

        },

        // When Desktop
        _goneXL: function() {

            if (FFAPI.responsive.goneBigQuerie.matches) {
                
                // Build 'xl' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._destroy('md');
                FFAPI.plugins.accordion._destroy('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._build('only-xl');

            }

        },

        // When Tablet
        _goneMD: function() {

            if (FFAPI.responsive.mediaQuerieMD.matches) {
                
                // Build 'md' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._destroy('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // When Fablet
        _goneSM: function() {

            if (FFAPI.responsive.mediaQuerieSM.matches) {
                
                // Build 'sm' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._build('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // When Mobile
        _goneXS: function() {

            if (FFAPI.responsive.mediaQuerieXS.matches) {
                
                // Build 'xs' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._build('sm');
                FFAPI.plugins.accordion._build('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // Build all accordions of a given suffix
        _build: function(suffix) {

            // Build 'suffix' accordions
            for (var i = 0; i < FFAPI.plugins.accordion.list[suffix].length; i++) {
                FFAPI.plugins.accordion.list[suffix][i].build();
            }

        },

        // Destroy all accordions of a given suffix
        _destroy: function(suffix) {

            // Destroy 'suffix' accordions
            for (var i = 0; i < FFAPI.plugins.accordion.list[suffix].length; i++) {
                FFAPI.plugins.accordion.list[suffix][i].destroy();
            }

        }
    };

    /**
     * [Accordion] In order we have a single accordion plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the accordion element]
     */
    function Accordion(element) {

        // Accordion element
        this.el = element;

        // Active item
        this.activeItem = null;
        
        // Accordion items
        this.items = [];

        // Collapse active item
        this.collapseActiveItem = (this.el.getAttribute('data-collapse') == 'false' ? false : true);

        // Built flag
        this.built = false;

        // Opening state
        this.opening = false;

        // Process accordion items
        this._processItems();

        // Add processed class to accordion
        FFAPI.methods.addClass(this.el, FFAPI.plugins.accordion.processedClass);

        return this;
    }

    /**
     * Accordion public methods
     * 
     */
     Accordion.prototype = {

        toggle: function(idx) {
            if(idx >= this.items.length) return;

            this._toggle(this.items[idx]);
        },

        slideUp: function(idx) {
            if(idx >= this.items.length) return;

            this._slideUp(this.items[idx]);
        },

        slideDown: function(el) {
            if(!el || !el.hasAttribute(FFAPI.plugins.accordion.dataIndex)) return;

            // Tries to parse index attribute
            var idx = parseInt(el.getAttribute(FFAPI.plugins.accordion.dataIndex));
            if(idx >= this.items.length) return;

            this._slideDown(this.items[idx]);
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
            }

            this.built = true;

        },

        unbindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._unbindClick(this.items[idx]);
        },

        destroy: function() {

            if(!this.built) return;

            // Slide up active item
            if(this.activeItem) {
                this._slideUp(this.activeItem);
            }

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Unbind click event
                this._unbindClick(this.items[i]);
            }

            this.built = false;

        },

        _processItems: function() {
            var items = this.el.getElementsByClassName(FFAPI.plugins.accordion.itemClass);

            // Loop through items
            for (var i = 0; i < items.length; i++) {

                var item = {
                    el: items[i],
                    idx: i,
                    title: items[i].getElementsByClassName(FFAPI.plugins.accordion.itemTitleClass),
                    content: items[i].getElementsByClassName(FFAPI.plugins.accordion.itemContentClass)[0]
                };

                // Add index attribute
                item.el.setAttribute(FFAPI.plugins.accordion.dataIndex, i);

                // Push item to items array
                this.items.push(item);

                if(item.el.getAttribute('data-active')) {
                    this._slideDown(item, true);
                }
            }
        },

        _toggle: function(item) {
            if(FFAPI.methods.hasClass(item.el, FFAPI.plugins.accordion.itemActiveClass)) {
                this._slideUp(item);
            } else {
                this._slideDown(item);
            }

        },

        _slideUp: function(item) {
            var instance = this;

            $.Velocity(item.content, 'slideUp', { 
                duration: 400,
                display: 'none',
                complete: function() {
                    // Remove active class
                    FFAPI.methods.removeClass(item.el, FFAPI.plugins.accordion.itemActiveClass);

                    // Remove display: none
                    item.content.removeAttribute('style');
                } 
            });

            if(this.activeItem && item.idx == this.activeItem.idx) {
                this.activeItem = null;
            }
        },

        _slideDown: function(item, onload) {
            var instance = this;

            // Avoid opening multiple items when accordion collapse active item
            if(instance.collapseActiveItem && instance.opening) return;

            // Collapse active item before animation starts
            if(instance.collapseActiveItem && instance.activeItem) {
                instance._slideUp(instance.activeItem);
            }

            // Start opening state
            instance.opening = true;

            // Expand selected item
            $.Velocity(item.content, 'slideDown', { 
                duration: 400,
                display: 'inline-block',
                complete: function() {
                    // Add active class to item element
                    FFAPI.methods.addClass(item.el, FFAPI.plugins.accordion.itemActiveClass);

                    // Remove display: block
                    item.content.removeAttribute('style');

                    // Scroll plugin is active?
                    // Lets animate window when item title is above header
                    if(!onload && instance.collapseActiveItem && FFAPI.plugins.scroll && FFAPI.plugins.scroll._top(item.title[0]) < FFAPI.plugins.scroll.headerOffset) {
                        FFAPI.plugins.scroll.to(item.title[0], 0);
                    }

                    // Set active item
                    instance.activeItem = item;

                    // Opening state finished
                    instance.opening = false;
                }
            });
        },

        _bindClick: function(item) {
            var instance = this;

            if(!item.toggleHandler) {
                item.toggleHandler = this._toggle.bind(this, item);
            }

            if(document.addEventListener) {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].addEventListener('click', item.toggleHandler);
                }
            } else {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].attachEvent('onclick', item.toggleHandler);
                }
            }
        },

        _unbindClick: function(item) {
            var instance = this;

            if(document.removeEventListener) {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].removeEventListener('click', item.toggleHandler);
                }
            } else {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].detachEvent('onclick', item.toggleHandler);
                }
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