/**
 Chooser javaScript file. It contains the functions for control page choosers.
 @class chooser-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive choosers
     */
    FFAPI.plugins.chooser = {

        win: typeof window != 'undefined' && window,
        doc: typeof document != 'undefined' && document,

        /**
         * Default class of the target element
         * @type {String}
         */
        selectClass: 'chooser-select',

        /**
         * Class to append to a processed item
         * @type {String}
         */
        processedClass: 'js-chooser',

        /**
         * Class of the chooser container
         * @type {String}
         */
        chooserClass: 'chooser',

        /**
         * Class of the chooser container
         * @type {String}
         */
        chooserOpenClass: 'chooser-open',

        /**
         * Class of the placeholder
         * @type {String}
         */
        placeholderClass: 'chooser-placeholder',

        /**
         * Class of the chooser container
         * @type {String}
         */
        contentClass: 'chooser-content',

        /**
         * Class of the list container
         * @type {String}
         */
        listClass: 'chooser-list',

        /**
         * Class of the chooser search container
         * @type {String}
         */
        searchClass: 'chooser-search',

        /**
         * Class of the chooser search input
         * @type {String}
         */
        searchInputClass: 'chooser-search-input input_black',

        /**
         * Class of the no results element
         * @type {String}
         */
        noResultsClass: 'chooser-no-results hide',

        /**
         * Class of the list item
         * @type {String}
         */
        itemClass: 'chooser-item',

        /**
         * Class of the list item selected
         * @type {String}
         */
        itemSelectedClass: 'chooser-item-selected',

        dataPlaceholder: 'data-placeholder',

        dataSearch: 'data-search',

        dataTpl: 'data-tpl',

        dataItemIndex: 'data-item-index',

        dataIndex: 'data-index',

        noResultsText: 'No results match "%s"',

        /**
         * Glyph HTML to append to the placeholder
         * @type {String}
         */
        placeholderTpl: '<span></span><span class="glyphs icon-down"></span>',

        threshold: 34,

        list: [],

        // Initialize registered choosers
        init: function () {

            this.docElem = this.doc && this.doc.documentElement;
            
            var choosers = document.getElementsByClassName(this.selectClass);

            for (var i = 0; i < choosers.length; i++) {
                // Tries to bind a new chooser
                this.bind(choosers[i]);
            }

        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            if(FFAPI.plugins.chooser._processed(element)) {
                if(element.hasAttribute(this.dataIndex)) {
                    return this.list[parseInt(element.getAttribute(this.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element) {
            // Check if element processed
            if(!this._processed(element)) {

                // Add index attribute to chooser
                element.setAttribute(this.dataIndex, this.list.length);

                // Push new chooser
                FFAPI.plugins.chooser.list.push(new Chooser(element));
            }
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, this.processedClass);
        },

        rectangle: function (el) {
            el = el && !el.nodeType ? el[0] : el;
            if (!el || 1 !== el.nodeType) return false;
            var rect = el.getBoundingClientRect();
            var t = rect['top'] + this.scrolly();
            var b = t + rect['height'];
            return { t: t, b: b };
        },

        viewport: function () {
            return { t: FFAPI.plugins.chooser.vt(), b: FFAPI.plugins.chooser.vb(), th: FFAPI.plugins.chooser.threshold };
        },

        vb: function () {
            return (Math.max(this.docElem['clientHeight'], this.win['innerHeight'] || 0) + this.scrolly());
        },

        vt: function () {
            return this.win.pageYOffset || this.docElem.scrollTop;
        },

        scrolly: function () {
            return this.win.pageYOffset || this.docElem.scrollTop;
        }
    };

    /**
     * [Chooser] In order we have a single chooser plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the chooser element]
     */
    function Chooser(select) {

        // Select element
        this.select = select;

        // Default size
        this.size = 10;

        // Chooser element
        this.chooser = null;

        // Placeholder
        this.placeholder = null;

        // Chooser container
        this.content = null;

        // Chooser list
        this.list = null;

        // Chooser list max-height
        this.listHeight = 0;

        // Items array
        this.items = [];

        // Item HTML template
        this.tpl = null;

        // Selected item
        this.itemSelected = null;

        // Open state
        this.opened = false;

        // Orientation
        this.orientation = 'down';

        // Initialize chooser
        this.layout();

        // Add processed class to chooser
        FFAPI.methods.addClass(this.select, FFAPI.plugins.chooser.processedClass);

        return this;
    }

    /**
     * Chooser public methods
     * 
     */
     Chooser.prototype = {

        layout: function() {
            // Transform select
            this.transform();

            // Bind events
            this.bindEvents();
        },

        transform: function() {

            // Create placeholder
            this.placeholder = document.createElement('SPAN');
            FFAPI.methods.addClass(this.placeholder, FFAPI.plugins.chooser.placeholderClass);
            this.placeholder.innerHTML = FFAPI.plugins.chooser.placeholderTpl;
            this.setPlaceholder();

            // Create content element
            this.content = document.createElement('DIV');
            FFAPI.methods.addClass(this.content, FFAPI.plugins.chooser.contentClass);

            // Create list container
            this.list = document.createElement('UL');
            FFAPI.methods.addClass(this.list, FFAPI.plugins.chooser.listClass);

            // Set search
            this.setSearch();

            // Set template
            this.setTemplate();

            var opts = this.select.options;
            for (var i = 0; i < opts.length; i++) {
                var classes = opts[i].getAttribute('class');

                // Create item
                var li = document.createElement('LI');
                FFAPI.methods.addClass(li, FFAPI.plugins.chooser.itemClass);

                // Copy classes
                if(classes) {
                    FFAPI.methods.addClass(li, classes);
                }

                // Fill element
                li.setAttribute(FFAPI.plugins.chooser.dataItemIndex, opts[i].index);
                this.parseTpl(li, opts[i].text, opts[i].getAttribute(FFAPI.plugins.chooser.dataTpl));

                // Append to content
                this.list.appendChild(li);

                // Push new item to array
                this.items.push(li);

                // Selected option?
                if(opts[i].getAttribute('selected')) {
                    this.setSelected(li);
                }
            }

            // Append list to container
            this.content.appendChild(this.list);

            // Create chooser
            this.chooser = document.createElement('DIV');
            FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass);

            // Append placeholder and items container
            this.chooser.appendChild(this.placeholder);
            this.chooser.appendChild(this.content);

            // Insert chooser after select element
            this.insertAfter(this.chooser, this.select);

            // Hide select element
            this.select.style.display = 'none';

            // Set size of dropdown
            this.setSize();

            // Set orientation
            this.setOrientation();
        },

        bindEvents: function() {
            var self = this;

            this.placeholder.onmousedown = this.toggle.bind(this);

            for (var i = 0; i < this.items.length; i++) {
                FFAPI.methods.on(this.items[i], 'click', function() {
                    if(self.opened) {
                        self.setSelected(this);
                        self.close();
                    }
                }, false);
            }

            FFAPI.methods.on(document, 'click', function(e) {
                if(!self.opened) {
                    return;
                }
                for (var el = e.target; el; el = el.parentNode) {
                    if (el == self.chooser) {
                        return;
                    }
                }
                self.close();
            }, false);

            if(this.search) {
                this.searchInput.onkeyup = this.filter.bind(this);
            }
        },

        setSelected: function(item) {
            if(this.itemSelected) {
                // Remove class from active item
                FFAPI.methods.removeClass(this.itemSelected, FFAPI.plugins.chooser.itemSelectedClass);
            }

            // Set option selected
            this.select.selectedIndex = parseInt(item.getAttribute(FFAPI.plugins.chooser.dataItemIndex));

            // Change placeholder text
            this.setPlaceholder(item.innerHTML);
            
            // Add class to selected item
            FFAPI.methods.addClass(item, FFAPI.plugins.chooser.itemSelectedClass);

            // Clear search input
            if(this.search && this.searchInput.value !== '') {
                this.searchInput.value = '';
                this.filter();
            }

            // Set active item
            this.itemSelected = item;
        },

        filter: function() {
            var term = this.searchInput.value.toString().toLowerCase();

            FFAPI.methods.addClass(this.noResults, 'hide');

            var hidden = 0;
            for (var i = 0; i < this.items.length; i++) {
                
                var str = this.items[i].textContent || this.items[i].innerText;
                    str = str.toString().toLowerCase();
                    console.log(str);
                if(str.indexOf(term) > -1) {
                    FFAPI.methods.removeClass(this.items[i], 'hide');
                } else {
                    FFAPI.methods.addClass(this.items[i], 'hide');
                    hidden++;
                }
            }

            if(hidden == this.items.length) {
                this.noResults.textContent = FFAPI.plugins.chooser.noResultsText.replace('%s', term);
                FFAPI.methods.removeClass(this.noResults, 'hide');
            }
        },

        toggle: function() {
            this.opened ? this.close() : this.open();
        },

        open: function() {
            var self = this;

            this.checkOrientation();

            $.Velocity(self.content, 'slideDown', { 
                duration: 400,
                display: 'block',
                complete: function() {
                    if(self.search) {
                        self.searchInput.focus();
                    }

                    // Add opened class
                    FFAPI.methods.addClass(self.chooser, FFAPI.plugins.chooser.chooserOpenClass);

                    // Remove inline styles
                    self.content.removeAttribute('style');

                    self.opened = true;
                } 
            });
        },

        close: function() {
            var self = this;
            $.Velocity(self.content, 'slideUp', { 
                duration: 400,
                display: 'none',
                complete: function() {
                    // Add opened class
                    FFAPI.methods.removeClass(self.chooser, FFAPI.plugins.chooser.chooserOpenClass);

                    // Remove inline styles
                    self.content.removeAttribute('style');

                    self.opened = false;
                } 
            });
        },

        checkOrientation: function() {
            FFAPI.methods.removeClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-up');
            switch(this.orientation) {
                case 'auto':
                    var v = FFAPI.plugins.chooser.viewport();
                    var e = FFAPI.plugins.chooser.rectangle(this.chooser);
                    if(v.b - v.th < e.b + this.listHeight) {
                        if(e.t - v.t + v.th > v.b - v.th - e.b) {
                            FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-up');
                        }
                    }
                    break;
                case 'up':
                    FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-' + this.orientation);
                    break;
            }
        },

        parseTpl: function(item, optText, data) {
            if(data) {
                var parsed = JSON.parse(data);
                var itemTpl = null;
                for(var key in parsed) {
                    itemTpl = (itemTpl ? itemTpl : this.tpl).replace('%' + key + '%', parsed[key]);
                }
                item.innerHTML = itemTpl;
            } else {
                item.innerHTML = optText;
            }
        },

        setTemplate: function() {
            var tplAttr = this.select.getAttribute(FFAPI.plugins.chooser.dataTpl);
            if(!tplAttr || tplAttr === '') {
                return;
            }

            var tags = JSON.parse(tplAttr);
            if(tags instanceof Array) {
                var parent = document.createElement('DIV');
                for (var i = 0; i < tags.length; i++) {
                    var el = document.createElement(tags[i].tag.toUpperCase());
                    if(tags[i].attr) {
                        for(var attr in tags[i].attr) {
                            el.setAttribute(attr, tags[i].attr[attr]);
                        }
                    }

                    if(tags[i].text) {
                        el.textContent = tags[i].text;
                    }

                    parent.appendChild(el);
                }
                this.tpl = parent.innerHTML;
            }
        },

        setSearch: function() {
            var search = this.select.getAttribute(FFAPI.plugins.chooser.dataSearch);
            if(search === 'true') {
                // Create search container
                this.search = document.createElement('DIV');
                FFAPI.methods.addClass(this.search, FFAPI.plugins.chooser.searchClass);

                // Create search input
                this.searchInput = document.createElement('INPUT');
                this.searchInput.type = 'text';
                FFAPI.methods.addClass(this.searchInput, FFAPI.plugins.chooser.searchInputClass);

                this.search.appendChild(this.searchInput);
                this.content.appendChild(this.search);

                // Create no results
                this.noResults = document.createElement('LI');
                FFAPI.methods.addClass(this.noResults, FFAPI.plugins.chooser.noResultsClass);

                this.list.appendChild(this.noResults);
            }
        },

        setPlaceholder: function(html) {
            this.placeholder.childNodes[0].innerHTML = html || this.select.getAttribute(FFAPI.plugins.chooser.dataPlaceholder);
        },

        setSize: function() {
            var sizeAttr = this.select.getAttribute('size');
            if(sizeAttr && parseInt(sizeAttr) < this.size) {
                this.size = parseInt(sizeAttr);
            }

            // Set styles to accurate items height
            this.content.style.position = 'absolute';
            this.content.style.visibility = 'hidden';
            this.content.style.display = 'block';

            var height = 0;
            for (var i = 0; i < this.size; i++) {
                height += this.items[i].offsetHeight;
            }

            // Remove inline styles
            this.content.removeAttribute('style');

            // Set max-height of the list container
            this.listHeight = height;
            this.list.style.maxHeight = height + 'px';
        },

        setOrientation: function() {
            var orAttr = this.select.getAttribute('data-orientation');
            if(orAttr) {
                this.orientation = orAttr;
            }
        },

        insertAfter: function(node, ref) {
            ref.parentNode.insertBefore(node, ref.nextSibling);
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