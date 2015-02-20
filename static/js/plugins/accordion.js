/**
* This module contains global methods for the accordions
* @module Plugins

 Accordion javaScript file. It contains the functions for the accordion plugin
 @deprecated plugins/
 @class accordion.js
 **/
/*===============================================================
 =      ACCORDION VANILLAJS / JQUERY PLUGIN 							    =
 ================================================================*/

try {

	/**
	 * FFAPI Variables Accordion defaultClass. The default class of the accordion
	 * <b><i>FFAPI.variables.accordion.defaultClass = 'accordion';<br /></i></b>
	 * @property FFAPI.variables.accordion.defaultClass
	 * @type String
	 */
	FFAPI.variables.accordion.defaultClass = 'accordion';
	/**
	 * FFAPI Variables Accordion defaultClass. The default class of the accordion
	 * <b><i>FFAPI.variables.accordion.defaultClass = 'accordion';<br /></i></b>
	 * @property FFAPI.variables.accordion.defaultClass
	 * @type String
	 */
	FFAPI.variables.accordion.processedClass = 'js-accordion';
	/**
	 * FFAPI Variables Accordion itemClass. The item class of the accordion
	 * <b><i>FFAPI.variables.accordion.itemClass = 'accordion-title';<br /></i></b>
	 * @property FFAPI.variables.accordion.itemClass
	 * @type String
	 */
	FFAPI.variables.accordion.itemClass = 'accordion-item';
	/**
	 * FFAPI Variables Accordion itemActiveClass. The active class of the item
	 * <b><i>FFAPI.variables.accordion.itemActiveClass = 'active';<br /></i></b>
	 * @property FFAPI.variables.accordion.itemActiveClass
	 * @type String
	 */
	FFAPI.variables.accordion.itemActiveClass = 'active';
	/**
	 * FFAPI Variables Accordion titleClass. The title class of the accordion
	 * <b><i>FFAPI.variables.accordion.titleClass = 'accordion-title';<br /></i></b>
	 * @property FFAPI.variables.accordion.titleClass
	 * @type String
	 */
	FFAPI.variables.accordion.itemTitleClass = 'accordion-title';
	/**
	 * FFAPI Variables Accordion contentClass. The content class of the accordion
	 * <b><i>FFAPI.variables.accordion.contentClass = 'accordion-content';<br /></i></b>
	 * @property FFAPI.variables.accordion.contentClass
	 * @type String
	 */
	FFAPI.variables.accordion.itemContentClass = 'accordion-content';

	/**
	 * [Accordion] In order we have a single accordion plugin for our website, we've developed this one that makes all possible combinations in one.
	 * @param {[type]} element           	[the accordion element]
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
	    FFAPI.methods.addClass(this.el, FFAPI.variables.accordion.processedClass);

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

	 	slideDown: function(idx) {
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
	 		var items = this.el.getElementsByClassName(FFAPI.variables.accordion.itemClass);

	 		// Loop through items
	 		for (var i = 0; i < items.length; i++) {

	    		var item = {
	    			el: items[i],
	    			idx: i,
	    			title: items[i].getElementsByClassName(FFAPI.variables.accordion.itemTitleClass),
	    			content: items[i].getElementsByClassName(FFAPI.variables.accordion.itemContentClass)[0]
	    		};

	    		// Push item to items array
	    		this.items.push(item);

	    		if(item.el.getAttribute('data-active')) {
	    			this._slideDown(item);
	    		}
	    	}
	 	},

	 	_toggle: function(item) {
	 		if(FFAPI.methods.hasClass(item.el, FFAPI.variables.accordion.itemActiveClass)) {
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
	 				FFAPI.methods.removeClass(item.el, FFAPI.variables.accordion.itemActiveClass);

	 				// Remove display: none
	 				item.content.removeAttribute('style');
 				} 
 			});

 			if(this.activeItem && item.idx == this.activeItem.idx) {
 				this.activeItem = null;
 			}
	 	},

	 	_slideDown: function(item) {
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
	 				FFAPI.methods.addClass(item.el, FFAPI.variables.accordion.itemActiveClass);

 					// Remove display: block
	 				item.content.removeAttribute('style');

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

	 		if(!item.title.attachEvent) {
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

	 		if(!item.title.detachEvent) {
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



