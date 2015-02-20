/**
* This module contains global methods for the dropdowns
* @module Plugins

 Dropdown javaScript file. It contains the functions for the dropdown plugin
 @deprecated plugins/
 @class dropdown.js
 **/
/*===============================================================
 =      DROPDOWN VANILLAJS / JQUERY PLUGIN 						=
 ================================================================*/

try {
	 /**
	 * Accordion variables definition
	 * <b><i>FFAPI.variables.dropdown = FFAPI.variables.dropdown || {};<br /></i></b>
	 * @property FFAPI.variables.dropdown
	 * @type Object
	 */
	FFAPI.variables.dropdown = FFAPI.variables.dropdown || {};
	/**
	 * dropdown methods definition
	 * <b><i>FFAPI.methods.dropdown = FFAPI.methods.dropdown || {};<br /></i></b>
	 * @property FFAPI.methods.dropdown
	 * @type Object
	 */
	FFAPI.methods.dropdown = FFAPI.methods.dropdown || {};
	/**
	 * FFAPI Variables Accordion titleClass. The title class of the dropdown
	 * <b><i>FFAPI.variables.dropdown.titleClass = '.js-dropdown-title';<br /></i></b>
	 * @property FFAPI.variables.dropdown.titleClass
	 * @type String
	 */
	FFAPI.variables.dropdown.titleClass = '.js-dropdown-title';
	/**
	 * FFAPI Variables dropdown contentClass. The title class of the dropdown
	 * <b><i>FFAPI.variables.dropdown.contentClass = '.js-dropdown-content';<br /></i></b>
	 * @property FFAPI.variables.dropdown.contentClass
	 * @type String
	 */
	FFAPI.variables.dropdown.contentClass = '.js-dropdown-content';
	/**
	 * FFAPI Variables dropdown titleClassActive. The title class of the dropdown
	 * <b><i>FFAPI.variables.dropdown.titleClassActive = 'dropdown-title';<br /></i></b>
	 * @property FFAPI.variables.dropdown.titleClassActive
	 * @type String
	 */
	FFAPI.variables.dropdown.titleClassActive = 'dropdown-title-opened';
	/**
	 * FFAPI Variables dropdown contentClassActive. The title class of the dropdown
	 * <b><i>FFAPI.variables.dropdown.contentClassActive = 'dropdown-content';<br /></i></b>
	 * @property FFAPI.variables.dropdown.contentClassActive
	 * @type String
	 */
	FFAPI.variables.dropdown.contentClassActive = 'dropdown-content-opened';
	

	function PluginDropdown(object,toggle,activeTitleClass,activeContentClass) {
		///console.log('PluginDropdown start function');
	    /// Check if data-attributes are defined 
	    /// toggle and active class to be opened
	    /// Get the data-attributes from the HTML or from the start of the function
	 
	    var dataObject = $('.'+object),
	    	dataToggle = dataObject.attr('data-toggle'),
	    	dataTitleActiveClass = ((dataObject.attr('data-titleActive-class')!==undefined)?dataObject.attr('data-titleActive-class') : activeTitleClass),
	    	dataContentActiveClass = ((dataObject.attr('data-contentActive-class')!==undefined)?dataObject.attr('data-contentActive-class') : activeContentClass);

	    /// Get the settings 
	    /// from the data attribute or function parameters
	    /// and from the initializations or default classes
		this.toggleAnim 	= (dataToggle!==undefined) ? dataToggle : 'true';
		this.titleActiveClass 	= (dataTitleActiveClass!==undefined) ? dataTitleActiveClass : FFAPI.variables.dropdown.titleClassActive;
		this.contentActiveClass 	= (dataContentActiveClass!==undefined) ? dataContentActiveClass : FFAPI.variables.dropdown.contentClassActive;
		/// Helper variables for the click function
		dataTitleActiveClass 	= this.titleActiveClass;
		dataContentActiveClass 	= this.contentActiveClass;
		
		// Constructor here
		this.parentClass	= object;
		this.toggleAnim 	= (toggle!==undefined) ? toggle : 'true';
		this.ele 			= object;

		
		/// For each accordion title we add the click event
		$('.'+object+' '+FFAPI.variables.dropdown.titleClass).each(function(index) {
			$(this).on('click', function(event) {
				/// Prevent default
				event.preventDefault();
				/// Add the clickDropdown behaviour
				PluginDropdown.prototype.clickDropdown(object, this, toggle, dataTitleActiveClass, dataContentActiveClass);	
			});
		});

		/// For each accordion title we add the click event
		$('.'+object+' '+FFAPI.variables.dropdown.titleClass+' a').each(function(index) {
			$(this).on('click', function(event) {
				/// Prevent default
				event.preventDefault();
				/// Add the clickDropdown behaviour
				///console.log($(this).find('li').html());
				///console.log($(this).parents('.'+object).find(FFAPI.variables.dropdown.titleClass+' span').html($(this).find('li').html()));

			});
		});
		
	}



	/**
	 * PluginDropdown.prototype.clickDropdown = function(parent,element,toggle){
	 * 
	 */

	PluginDropdown.prototype.clickDropdown = function(parent,element,toggle,dataTitleActiveClass, dataContentActiveClass){
		///console.log('clickDropdown function');
		/// Check if there is a opened content
		/// Get the next accordion content to open
		var openedContent = $('.'+parent).find(FFAPI.variables.dropdown.contentClass+'.'+dataContentActiveClass),
			accordionToOpen = $(element).parents('.'+parent).find(FFAPI.variables.dropdown.contentClass);
		/// console.log(element);
		/// console.log(parent);
	    /// console.log(accordionToOpen);
		/// Slides up the opened content
		/// Removes the class of opened class
		
		/// If it has the opened class
		if(accordionToOpen.hasClass(dataContentActiveClass)){
			accordionToOpen.slideUp(FFAPI.variables.animationSpeed, function(){
				$(this).removeClass(dataContentActiveClass);
				$(element).removeClass(dataTitleActiveClass);
				$(element).parents('.'+parent).find(FFAPI.variables.dropdown.titleClass).removeClass(dataTitleActiveClass);
			});
		}else{
			/// If it's not supposed to toggle
			if(toggle!==true){
				/// console.log(openedContent);
				openedContent.slideUp(FFAPI.variables.animationSpeed, function(){
					$(this).removeClass(dataContentActiveClass);
					$(this).prev(FFAPI.variables.dropdown.titleClass).removeClass(dataTitleActiveClass);
					$(this).parents('.'+parent).find(FFAPI.variables.dropdown.titleClass).removeClass(dataTitleActiveClass);

				});
			}
			/// Always slidesDown the contentClass
			accordionToOpen.slideDown(FFAPI.variables.animationSpeed, function(){
				$(this).addClass(dataContentActiveClass);
				/// console.log(element);
				$(this).prev(FFAPI.variables.dropdown.titleClass).addClass(dataTitleActiveClass);
				$(element).addClass(dataTitleActiveClass);
				$(element).parents('.'+parent).find(FFAPI.variables.dropdown.titleClass);
			});
		}

	};

	/**
	 * PluginAccordion.prototype.destroy = function(){
	 * Destroy the Accoridion element
	 */

	PluginDropdown.prototype.destroy= function(){
		/// console.log('destroy the Dropdown');
		var dataTitleActiveClass = this.titleActiveClass,
			dataContentActiveClass = this.contentActiveClass;


		/// For each element
		/// Removes the classes
		/// and removes the click event
		$('.'+this.ele+' '+FFAPI.variables.dropdown.titleClass).each(function(index) {
			$(this).next(FFAPI.variables.dropdown.contentClass).css('display', 'none').removeClass(dataContentActiveClass);
			$(this).off('click').removeClass(dataTitleActiveClass);	
		});

		$('.'+this.parentClass).find(FFAPI.variables.dropdown.contentClass).css('display', 'none').removeClass(dataContentActiveClass);
		$('.'+this.parentClass).find(FFAPI.variables.dropdown.titleClass).removeClass(dataTitleActiveClass);
	}
	/**
	 * PluginDropdown.prototype.startOver = function(){
	 * Restart the Accordion
	 */

	PluginDropdown.prototype.startOver= function(){
		///console.log('startOver the accordion');
		var parentClass			= this.parentClass,
			toggleAnim 			= this.toggleAnim,
			dataTitleActiveClass = this.titleActiveClass,
			dataContentActiveClass = this.contentActiveClass;

		/// For each element
		/// Display's none
		/// and add the click event
		
		$('.'+this.ele+' '+FFAPI.variables.dropdown.titleClass).each(function(index) {
			$(this).next(FFAPI.variables.dropdown.contentClass).css('display', 'none');
			$(this).on('click', function(event) {
				PluginDropdown.prototype.clickDropdown(parentClass, this, toggleAnim, dataTitleActiveClass,dataContentActiveClass);
			});
		});

	}
	/**
	 * PluginDropdown.prototype.destroy = function(){
	 * Destroy the Dropdown element
	 */

	PluginDropdown.prototype.open= function(indexOpen){
		//// console.log('open Index on the Dropdown');
		/// Gets ths full object and then triggers click event
		var aux = $('.'+this.ele+' '+FFAPI.variables.dropdown.titleClass),
			aux2 = aux[indexOpen];
			
		$(aux2).trigger('click');
	}

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}



