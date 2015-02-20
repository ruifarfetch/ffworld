var form_search = $('.form-search'),
	form_search_input = $('.form-search').find('input'),
	form_search_clear = $('.input-text-clear');

form_search.on('input', function (){
	var checkinput_hasvalue = false,
		form_clear = $(this).find('.input-text-clear');

    $(this).find('input').each(function(i,e){
        if(e.value){
            checkinput_hasvalue = true;
            return false;
        }
    });
    if(checkinput_hasvalue) {
	    form_clear.removeClass('hide');
	} else {
	    form_clear.addClass('hide');
	}			
});

form_search_clear.on('click', function() {
    $(this).addClass('hide').parent().find('input').val("").focus();
    $(this).trigger("clearsearch");
});

form_search_input.focus(function() {
	$(this).parent().addClass('form-search_focus');
});

form_search_input.focusout(function(){
	$(this).parent().removeClass('form-search_focus');
}); 

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



/*=====================================================
=        DROPDOWN PLUGIN V1.1.0 - 2013/08/31          =
= Copyright Farfetch 2013
= Dual licensed under the MIT 
(http://www.opensource.org/licenses/mit-license.php)
= and GPL 
(http://www.opensource.org/licenses/gpl-license.php) licenses.
V1.1.0 - added the JQinput var
=====================================================*/
(function ($) {
    // Default Options
    var defaults = {
        listSelector: "ul",
        menuClass: "menuOpen",
        scrollSelector: "ul",
        dragSelector: "",
        itemsVisible: "7",
        menuOpen: false,
        closeOthers: false,
        onItemClick: function (event) {
            ///Just do External Link if Necessary
            event.preventDefault();
            if ($(this).attr('href')) {
                var OptionRef = $(this).attr('href');
                if (OptionRef != "") {
                    if (OptionRef.indexOf('#') == -1) {
                        window.location = OptionRef;
                    }
                }
            }
        }
    };

    // Methods object
    var methods = {
        bindHeader: function (jQObj, jQList, jQHeader, menuClass, closeOthers) {
            /// <summary>
            ///     Toggle dropdown when clicking on dropdown header
            /// </summary>
            /// <param name="jQObj" type="jQObject">
            ///     Element where it's being applied the dropdown (this) 
            /// </param>
            /// <param name="jQList" type="jQObject">
            ///     Dropdown itself. Probably a UL element.
            /// </param>
            /// <param name="jQHeader" type="jQObject">
            ///     Dropdown header i.e.: where the user clicks to open the dropdown.
            /// </param>
            /// <param name="menuClass" type="String">
            ///     Class to be added/removed on dropdown open/close
            /// </param>
            /// <returns type="this" />
            jQObj.off('mouseup').on("mouseup", function (e) {
                var justScrolled = $.data(jQObj, "dropdown-scroll");
                //check if dropdown has attr select - this force the dropdown not closing (use for multiple choices)
                if (jQObj.data("select")) {
                }
                else {
                    if (!justScrolled) {
                        if (closeOthers) {
                            var spanClicked = jQObj[0].getElementsByTagName('span')[0];
                            if (FFAPI.methods.hasClass(spanClicked, 'menuOpen')) {
                                //does nothing - opens and closes normaly the dropdown
                            } else {
                                //resets all elements
                                $(".dropdown:not(.dropdown-accordion)").find("span").removeClass("menuOpen");
                                $(".dropdown:not(.dropdown-accordion)").find("ul").hide();
                            }
                        }
                        jQList.toggle();
                        jQHeader.toggleClass(menuClass);
                    } else {
                        $.data(jQObj, "dropdown-scroll", false);
                    }
                }
            });
            return this;
        },
        bindItems: function (jQLinks, jQList, jQHeader, menuClass, jQinput) {
            /// <summary>
            ///     Closes dropdown when clicking an item
            /// </summary>
            /// <param name="jQObj" type="jQObject">
            ///     Element where it's being applied the dropdown (this) 
            /// </param>
            /// <param name="jQList" type="jQObject">
            ///     Dropdown itself. Probably a UL element.
            /// </param>
            /// <param name="jQHeader" type="jQObject">
            ///     Dropdown header i.e.: where the user clicks to open the dropdown.
            /// </param>
            /// <param name="menuClass" type="String">
            ///     Class to be added/removed on dropdown open/close
            /// </param>
            /// <param name="jQinput" type="jQObject">
            ///     Input Element to save the values of the dropdown selected
            /// </param>
            /// <returns type="this" />			
            jQLinks.bind("mouseup", function (e) {
                var jQThis = $(this);
                // We should ignore multiselect items (that have a filter data attribute), as for those this is not the desired behavior
                if (!jQThis.is('[data-filter], [data-dropdown-ignore]')) {
                    jQHeader.first().text(jQThis.text());
                    jQinput.val(jQThis.text());
                    var valuesData = $(this).data();
                    jQInput.data(valuesData);
                    jQList.hide();
                    jQHeader.removeClass(menuClass);
                    return false;
                }
            });
            return this;
        },
        bindDocument: function (jQThis, jQHeader, jQList, id, menuClass) {
            /// <summary>
            ///     Checks if click ocurred inside of dropdown. In case it didn't, it'll close the dropdown.
            /// </summary>
            /// <param name="jQObj" type="jQObject">
            ///     Element where it's being applied the dropdown (this) 
            /// </param>
            /// <param name="jQHeader" type="jQObject">
            ///     Dropdown header i.e.: where the user clicks to open the dropdown.
            /// </param>
            /// <param name="jQList" type="jQObject">
            ///     Dropdown itself. Probably a UL element.
            /// </param>
            /// <param name="id" type="String">
            ///     Dropdown ID, must be unique so that the event knows which dropdown to close
            /// </param>
            /// <param name="menuClass" type="String">
            ///     Class to be added/removed on dropdown open/close
            /// </param>
            /// <returns type="this" />
            $(document).click(function () {
                $(".dropdown:not(.dropdown-accordion)").find("span").removeClass("menuOpen");
                $(".dropdown:not(.dropdown-accordion)").find("ul").hide();
            });

            if (!jQThis.data("select")) {
                jQThis.bind("mouseup", function (e) {

                    var justScrolled = $.data(jQThis, "dropdown-scroll");
                    var childrenNum = jQList.children(":not(.hide)").length;
                    var childrenHeight = jQList.children().outerHeight() || 35;
                    var childrenHeightItemsTotal = childrenHeight * jQItemsVisible;
                    if (childrenNum > jQItemsVisible) {
                        jQList.css({
                            "overflow-y": "scroll", "height": childrenHeightItemsTotal
                        });
                    }

                    if (!justScrolled) {
                        if (id != "" && $(e.target).closest("#" + id).length === 0) {
                            jQHeader.removeClass(menuClass);
                            jQList.hide();
                        }
                    }
                    else {
                        $.data(jQThis, "dropdown-scroll", false);
                    }
                });
            }
            return this;
        },
        onStopScroll: function (jQThis, jQScroll) {
            /// <summary>
            ///     Prevent dropdown from closing in case user scrolls and mouse leaves the dropdown
            /// </summary>
            /// <param name="jQThis" type="jQObject">
            ///     Element where it's being applied the dropdown (this) 
            /// </param>
            /// <param name="jQScroll" type="jQObject">
            ///     Scroll element
            /// </param>
            jQThis.find("ul").bind('scroll', function () {
                $.data(jQThis, "dropdown-scroll", true);
            });
            return this;
        },
        bindOnItemClick: function (jQLinks, callback) {
            /// <summary>
            ///     Binds callback whenever a user selects something from the dropdown
            /// </summary>
            /// <param name="jQLinks" type="jQObject">
            ///     List elements
            /// </param>
            /// <param name="callback" type="function">
            ///     Function called whenever a user clicks on an item
            /// </param>
            /// <returns type="this" />
            jQLinks.bind("click", callback);
        },
        // Initialize dropdown
        init: function (options) {
            /// <summary>
            ///     Initializes dropdown objects
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
                // local variables
                var jQList = this.find(settings.listSelector),
                    jQHeader = this.find("span.glyphs"),
                    jQLinks = jQList.find("a");
                id = this[0].id;
                jQItemsVisible = settings.itemsVisible;
                jQLayer = 1001;

                if ($("#" + id).find('input').length == 0)
                    $("#" + id).append('<input type="hidden" id="' + id + 'Input">')
                jQInput = $("#" + id).find('input');
                // Styling
                this.css("cursor", "pointer");
                $(".dropdown").each(function () {
                    $(this).css("z-index", jQLayer);
                    jQLayer = jQLayer - 1;
                });
                // Hide dropdown initially
                if (settings.menuOpen === true) {
                    jQList.show();
                    jQHeader.addClass(settings.menuClass);
                } else {
                    jQList.hide();
                }

                // Bind dropdown click
                methods.bindHeader(this, jQList, jQHeader, settings.menuClass, settings.closeOthers);
                // Close dropdown when clicking on items
                methods.bindItems(jQLinks, jQList, jQHeader, settings.menuClass, jQInput);
                // Close dropdown if clicked on anywhere else of the document
                methods.bindDocument(this, jQHeader, jQList, id, settings.menuClass);
                if (settings.scrollSelector) {
                    var jQScroll = (this).find(settings.scrollSelector);
                    methods.onStopScroll(this, jQScroll);
                }

                if (settings.onItemClick && typeof (settings.onItemClick) === "function") {
                    methods.bindOnItemClick(jQLinks.not('[data-ignore]').not('[data-ajax]'), settings.onItemClick);
                }
            }
            return this;
        }
    };

    // Method caller. Will call "init" with given parameters if no methods are called
    $.fn.dropdown = function (method, args) {
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
                $.error('Method ' + method + ' does not exist on jQuery.dropDown');
            }
        });
    };
})(jQuery);


require(['essentials'], function () {
    $(document).ready(function ($) {
        FFAPI.plugins = FFAPI.plugins || {};
        FFAPI.plugins.methods = FFAPI.plugins.methods || {};
        FFAPI.plugins.methods.initJQueryDropdowns = function (selector, closeOthers) {
            // Setup dropdown
            selector.find('.dropdown').dropdown({ closeOthers: closeOthers });

            // Setup dropdown open by default
            selector.find('.dropdown_open').dropdown({
                menuOpen: true,
            });

            // Prevent events from getting pass .dropdown
            selector.find(".dropdown:not(.dropdown-accordion)").off('click').on('click', function (e) {
                if ($(e.target).is('a') != true) {
                    e.stopPropagation();
                }
            });

            // Close dropdown data-attr multiple choices when click on the drawer
            selector.find(".dropdown span.glyphs").off('click').on('click', function (e) {
                if ($(this).parent().data("select")) {
                    selector.find(".dropdown span.glyphs").find("ul").first().slideUp();
                    $(this).parent().find("ul").first().slideToggle();
                    selector.find(".dropdown span.glyphs").removeClass('menuOpen');
                    $(this).toggleClass("menuOpen");
                }
            });

            // Add and Remove Clear Funtion
            $.each($('[data-select="multiple"] li'), function (index, val) {
                $(this).on('click', function (event) {
                    var target = $(event.target);
                    var aux = $(this).parent('ul'),
                    aux2 = aux.find('input:checked').length;
                    if (aux2 > 0) {
                        aux.find('.dropdown-clear-all').removeClass('hide');
                    } else {
                        aux.find('.dropdown-clear-all, .listing-filters-clearAll').addClass('hide');
                    }
                    if (target.is('label')) {
                        target.find('a').trigger('click');
                    }
                });
            });

            // Clear each filter function
            $.each($('.dropdown-clear-all'), function (index, val) {
                $(this).on('click', function (event) {
                    var aux = $(this).parent('ul'),
                    aux2 = aux.find('input:checked');
                    aux3 = aux.find('span');
                    aux4 = aux.find('label');
                    
                    aux2.prop('checked', false);
                    $(this).addClass('hide');
                });
            });

            // Add Clear to input
            selector.find('.dropdown-accordion input').on('input', function (e) {
                var checkinput_hasvalue = false;
                $(this).closest('form').find('input').each(function (i, e) {
                    if (e.value) {
                        checkinput_hasvalue = true;
                        return false;
                    }
                });

                if (checkinput_hasvalue) {
                    $(this).closest('ul').find(".dropdown-input-clear").removeClass('hide');
                } else {
                    $(this).closest('ul').find(".dropdown-input-clear").addClass('hide');
                }
            });
        };

        FFAPI.plugins.methods.initJQueryDropdowns($(document), false);
    });
});// Chosen, a Select Box Enhancer for jQuery and Prototype
// by Patrick Filler for Harvest, http://getharvest.com
//
// Version 1.0.0
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `grunt build`, do not edit it by hand.
(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;

      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;

      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;

    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
	  this.is_top_style();
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
    }
	
	AbstractChosen.prototype.is_top_style = function() {
	  var _this = this;
	  var data_top = _this.form_field.getAttribute("data-top")	  
	  if (data_top) {
		_this.options.top = data_top;
      }
	}

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;

      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
	  this.should_close_results = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.farfetch_mode = this.options.farfetch_mode != null ? this.options.farfetch_mode : false;
      return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
	  
	  this.clear_text = this.form_field.getAttribute("data-clear_text") || this.options.clear_text || AbstractChosen.default_clear_text;
	  
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;

      if (this.is_multiple) {
        if (!this.active_field) {
          // return setTimeout((function() {
            // return _this.container_mousedown();
          // }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;

      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;

      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(data);
          }
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, style;

      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
      return "<li class=\"" + (classes.join(' ')) + "\"" + style + " data-option-array-index=\"" + option.array_index + "\"><i></i>" + option.search_text + "</li>";
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      return "<li class=\"group-result\">" + group.search_text + "</li>";
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.result_single_selected = null;
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;

      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + escapedSearchText, 'i');
      zregex = new RegExp(escapedSearchText, 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          if (!(option.group && !this.group_search)) {
            option.search_text = option.group ? option.label : option.html;
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;

      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;

      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
	  if (evt && $(evt.target).hasClass("chosen-clear-field_link")) {
		this.container.find(".search-choice-close").trigger("click.chosen");
	    return;
	  }
	  
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      } else if (this.farfetch_mode && this.should_close_results) {
	     this.should_close_results = false;
		 this.results_hide();
	  }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;

      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";
	
	AbstractChosen.default_clear_text = "Clear";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;

        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen) {
          chosen.destroy();
        } else if (!chosen) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;

      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        //this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
		
		var html = '<ul class="chosen-choices"><li class="search-field"></li><li><a class="chosen-default" tabindex="-1"><span class="multiselect-itemscheckbox">' + this.default_text + '</span><div><b></b></div></a></li>';
		
		if (this.farfetch_mode) {
		   html += '<li class="chosen-clear-field" style="display: none;"><a href="#" class="chosen-clear-field_link">' + this.clear_text + '</a></li>';
		}
		
		html += '</ul><div class="chosen-drop"><div class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></div><ul class="chosen-results"></ul></div>'
		
		this.container.html(html);
		
      } else {
		if(this.options.top == "true") {
			this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop chosen-top"><ul class="chosen-results"></ul><div class="chosen-search"><input type="text" autocomplete="off" /></div></div>');
		} else {
			this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
		}
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      this.set_label_behavior();
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;

      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }

        if (evt != null) {
			if (this.farfetch_mode && ($(evt.target)).hasClass("result-selected")) {
			   var index = $(evt.target).attr("data-option-array-index");
               this.container.find(".search-choice-close[data-option-array-index=" + index + "]").trigger("click.chosen");
               this.results_hide();
            }
	    }
		
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(document).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (this.results_showing && this.farfetch_mode) {
			this.should_close_results = true;
		  } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta, _ref1, _ref2;

      delta = -((_ref1 = evt.originalEvent) != null ? _ref1.wheelDelta : void 0) || ((_ref2 = evt.originialEvent) != null ? _ref2.detail : void 0);
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      if (this.container.is($(evt.target).closest('.chosen-container'))) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;

      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
	  this.container.addClass("chosen-with-drop");
	  if(this.options.top == "true") {
		this.container.addClass("chosen-with-drop-top");
	  }
      this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
		if (this.options.top == "true") { 
			this.container.removeClass("chosen-with-drop-top"); 
		}
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;

      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;

      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;

      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;

      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;

      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + item.html + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
	  
	  this.container.find("li.chosen-clear-field").show();
	  
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
	  
	  var result;
      if (!this.is_disabled) {
        result = this.choice_destroy($(evt.target));
      }
	  
	  if (this.container.find("li.search-choice").length == 0) {
	    this.container.find("li.chosen-clear-field").hide();
	  }
	  
	  return result;
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.form_field.options[0].selected = true;
      this.selected_option_count = null;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item, selected_index;

      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          if (this.result_single_selected) {
            this.result_single_selected.removeClass("result-selected");
            selected_index = this.result_single_selected[0].getAttribute('data-option-array-index');
            this.results_data[selected_index].selected = false;
          }
          this.result_single_selected = high;
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(item);
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(item) {
	  var text = this.default_text;
	  var _selected_item = this.selected_item;
	  if(item){
		text = item.text;
	  }
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        _selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        _selected_item.removeClass("chosen-default");
      }
	  _selected_item.find("span").removeClass();
	  if(item && item.classes){
	    _selected_item.find("span").addClass(item.classes);
	  }
      return _selected_item.find("span").text(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;

      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      if (this.search_field.val() === this.default_text) {
        return "";
      } else {
        return $('<div/>').text($.trim(this.search_field.val())).html();
      }
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;

      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
	  if(this.options.top == "true") { 
		$('.chosen-top', this.container).css('top', (-($('.chosen-drop', this.container).height() - 2))); 
	  } 
      if (do_high != null) 
	  {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;

      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
	  this.search_results.append(no_results_html);
	  if(this.options.top == "true") { 
		$('.chosen-top', this.container).css('top', (-($('.chosen-drop', this.container).height() - 2))); 
	  } 
      return this.search_results;
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;

      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;

      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;

      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;

      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;

      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);
/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 1.0.7
 * 
 * http://wenzhixin.net.cn/p/multiple-select/
 */

(function ($) {

    'use strict';

    function MultipleSelect($el, options) {
        var that = this,
            elWidth = $el.width();
        this.$el = $el.hide();
        this.options = options;

        this.$parent = $('<div class="ms-parent"></div>');
        this.$drop = $('<div class="ms-drop ' + options.position + '"></div>');
        // Farfetch - Customizations
        this.copyAttributes = false;
        if ($el.data('copyAttributes') === true) {
            this.copyAttributes = true;
            this.$parent.data(this.$el.data());
        }
        //
        this.$el.after(this.$parent);
        this.$parent.append(this.$drop);

        // Change placeholder behaviour to accept boolean false
        if(options.placeholder !== false) {
            this.$choice = $('<button type="button" class="ms-choice"><span class="placeholder">' +
            options.placeholder + '</span><div></div></button>');

            this.$parent.append(this.$choice);

            if (this.$el.prop('disabled')) {
                this.$choice.addClass('disabled');
            }
            this.$choice.css('width', elWidth + 'px');
        }

        this.$drop.css({
            width: (options.width || elWidth) + 'px'
        });
        
        if (this.options.isopen) {
            if(this.$choice) {
                this.$choice.find('>div').addClass('open');
            }
            this.$parent.addClass('ms-parent-open');
            this.$drop.addClass('ms-drop-open').slideDown();
            if (this.options.focusInput) {
                setTimeout(function () { 
                    that.options.onOpen();
                    $('.ms-search .input_black').focus() 
                }, 400);
            }
        }
    }

    MultipleSelect.prototype = {
        constructor: MultipleSelect,

        init: function () {
            var that = this,
                html = [];

            if (this.options.showClearAll) {
                html.push(
                    '<div class="ms-clear hide"><span>' + this.options.clearAllText + '</span></div>'
                );
            }

            if (this.options.single) {
                this.$parent.addClass("ms-parent-single");
            }

            if (this.options.filter) {
                var placeholderText = this.options.placeholderText;
                var noresultsText = this.options.noresultsText;

                if (!placeholderText) {
                    placeholderText = 'Type your search here';
                }
                if (!noresultsText) {
                    noresultsText = 'No results found';
                }

                /*RES-345*/
                html.push(
                    '<div class="ms-search">',
                        '<input type="text" class="input_black" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false" placeholder="' + placeholderText + '">',
                        '<span class="glyphs icon-close ms-drop-text-clear js-input-text-clear hide"></span>'

                );

                if (this.options.showNoResults) {
                    html.push('<div class="ms-no-results hide">' + noresultsText + '</div>');
                }

                html.push('</div>');
            }

            html.push('<ul>');
            if (this.options.selectAll && !this.options.single) {
                html.push(
                    '<li>',
                        '<label class="fancy-checkbox">',
                            '<input type="checkbox" name="selectAll" /> ',
                            '[' + this.options.selectAllText + ']',
                        '</label>',
                    '</li>'
                );
            }

            $.each(this.$el.children(), function (i, elm) {
                html.push(that.optionToHtml(i, elm));
            });

            html.push('</ul>');
            this.$drop.html(html.join(''));
            this.$drop.find('ul').css('max-height', this.options.maxHeight + 'px');
            // Farfetch customization
            this.$drop.find('ul').attr('id', this.$el.attr('data-ul-id'));
            this.$drop.find('ul').addClass(this.$el.attr('data-ul-class'));
            // end Farfetch customization
            this.$drop.find('.multiple').css('width', this.options.multipleWidth + 'px');
            this.$searchInput = this.$drop.find('.ms-search input');
            this.$selectAll = this.$drop.find('input[name="selectAll"]');
            this.$selectGroups = this.$drop.find('input[name="selectGroup"]');
            this.$selectItems = this.$drop.find('input[name="selectItem"]:enabled');
            this.$disableItems = this.$drop.find('input[name="selectItem"]:disabled');
            this.$clearAll = this.$drop.find('div.ms-clear');
            // Farfetch customization
            this.$clearAll.attr('id', this.$el.attr('data-clear-id'));
            this.$clearAll.addClass(this.$el.attr('data-clear-class'));
            this.$clearAllSpan = this.$clearAll.find('span');
            this.$clearAllSpan.attr('id', this.$el.attr('data-clear-span-id'));
            this.$clearAllSpan.addClass(this.$el.attr('data-clear-span-class'));
            this.$clearAllSpan.attr('data-filter', this.$el.attr('data-clear-filter'));
            // end Farfetch customization
            this.$noResults = this.$drop.find('.ms-no-results');
            this.$clearInputVal = this.$drop.find('.ms-drop-text-clear');
            this.events();
            this.update();
        },
        moveAttribute: function (orig, dest, attributeName, destAttributeName) {
            var attrValue = orig.attr(attributeName);
            if (destAttributeName == undefined) {
                destAttributeName = attributeName;
            }
            if (attrValue == undefined) {
                return;
            } else {
                dest.attr(destAttributeName, attrValue);
                orig.removeAttr(attributeName);
                return;
            }
        },
        optionToHtml: function (i, elm, group, groupDisabled) {
            var that = this,
                $elm = $(elm),
                html = [],
                multiple = this.options.multiple,
                disabled,
                type = this.options.single ? 'radio' : 'checkbox';

            if ($elm.is('option') && $elm.attr("data-loaded") === undefined) {
                var value = $elm.val(),
                    text = $elm.text(),
                    selected = $elm.prop('selected');

                disabled = groupDisabled || $elm.prop('disabled');
                // Farfetch Customizations (required for multiselect)
                if (this.copyAttributes) {
                    var li = $('<li' + (multiple ? ' class="multiple"' : '') + '></li>');
                    var label = $('<label' + 'class="cenas"' + (disabled ? ' class="disabled"' : '') + '></label>');

                    var anchor = $('<a' + (group ? ' data-group="' + group + '"' : '') + '></a>');
                    var input = $('<input type="' + type + '" name="selectItem" value="' + value + '"' + (selected ? ' checked="checked"' : '') + (disabled ? ' disabled="disabled"' : '') + (group ? ' data-group="' + group + '"' : '') + '/> ');
                    // li attributes
                    li.addClass($elm.attr('data-li-class'));
                    // Input attributes
                    that.moveAttribute($elm, anchor, 'id');
                    that.moveAttribute($elm, anchor, 'class');
                    that.moveAttribute($elm, anchor, 'data-ignore');
                    that.moveAttribute($elm, anchor, 'data-filter');
                    that.moveAttribute($elm, anchor, 'data-filter-relative-deep');
                    that.moveAttribute($elm, anchor, 'data-parent-filter');
                    that.moveAttribute($elm, anchor, 'data-parent-top-filter');
                    that.moveAttribute($elm, anchor, 'order');
                    that.moveAttribute($elm, anchor, 'trk');
                    that.moveAttribute($elm, anchor, 'href');
                    that.moveAttribute($elm, anchor, 'rel');
                    $elm.attr("data-loaded", true);

                    // build the HTML elements hierarchy					
                    anchor.append('<div class="float-left"><i></i></div>').append(input);
                    anchor.append('<p class="ms-drop-option">' + text + '</p>');
                    label.append(anchor);
                    li.append(label);
                    html.push(li[0].outerHTML);
                }
                else {
                    html.push(
                        '<li' + (multiple ? ' class="multiple"' : '') + '>',
                            '<label' + (disabled ? ' class="disabled"' : '') + '>',
                                '<div class="float-left"><i></i></div>',
                                '<input type="' + type + '" name="selectItem" value="' + value + '"' +
                                    (selected ? ' checked="checked"' : '') +
                                    (disabled ? ' disabled="disabled"' : '') +
                                    (group ? ' data-group="' + group + '"' : '') +
                                    '/> ',
                                '<p class="ms-drop-option">' + text + '</p>',
                            '</label>',
                        '</li>'
                    );
                }
                // End of Farfetch Customizations
            } else if (!group && $elm.is('optgroup')) {
                var _group = 'group_' + i,
                    label = $elm.attr('label');

                disabled = $elm.prop('disabled');
                html.push(
                    '<li class="group">',
                        '<label class="optgroup' + (disabled ? ' disabled' : '') + '" data-group="' + _group + '">',
                            '<input type="checkbox" name="selectGroup"' + (disabled ? ' disabled="disabled"' : '') + ' /> ',
                            label,
                        '</label>',
                    '</li>');
                $.each($elm.children(), function (i, elm) {
                    html.push(that.optionToHtml(i, elm, _group, disabled));
                });
            }
            return html.join('');
        },

        events: function () {
            var that = this;
            if(this.$choice) {
                this.$choice.off('click').on('click', function () {
                    that[that.options.isopen ? 'close' : 'open']();
                });
            }
            this.$parent.off('keydown').on('keydown', function (e) {
                switch (e.which) {
                    case 27: // esc key
                        that.close();
                        if(that.$choice) that.$choice.focus();
                        break;
                }
            });
            this.$searchInput.off('keyup').on('keyup', function () {
                that.filter();
            });
            this.$selectAll.off('click').on('click', function () {
                var checked = $(this).prop('checked'),
                    $items = that.$selectItems.filter(':visible');
                if ($items.length === that.$selectItems.length) {
                    that[checked ? 'checkAll' : 'uncheckAll']();
                } else { // when the filter option is true
                    that.$selectGroups.prop('checked', checked);
                    $items.prop('checked', checked);
                    that.update();
                }
            });
            this.$clearAll.off('click').on('click', function () {
                that.uncheckAll();
            });
            this.$selectGroups.off('click').on('click', function () {
                var group = $(this).parent().attr('data-group'),
                    $items = that.$selectItems.filter(':visible'),
                    $children = $items.filter('[data-group="' + group + '"]'),
                    checked = $children.length !== $children.filter(':checked').length;
                $children.prop('checked', checked);
                that.updateSelectAll();
                that.update();
                that.options.onOptgroupClick({
                    label: $(this).parent().text(),
                    checked: checked,
                    children: $children.get()
                });
            });
            this.$selectItems.off('click').on('click', function () {
                that.updateSelectAll();
                that.update();
                that.updateOptGroupSelect();
                that.options.onClick({
                    label: $(this).parent().text(),
                    value: $(this).val(),
                    checked: $(this).prop('checked'),
                    li: $(this).closest("li").toggleClass("ms-drop-selected")
                });
            });

            this.$clearInputVal.off('click').on('click', function () {
                $(this).parent().find('input').val("").focus();
                $(this).parent().find('.js-input-text-clear').addClass('hide');
                $(this).parent().parent().find('.ms-no-results').hide();
                $(this).parent().parent().find('ul').removeClass('ms-list-no-results');
                $(this).parent().parent().find('ul li').show();
            });
        },

        open: function () {
            if (this.$choice && this.$choice.hasClass('disabled')) {
                return;
            }
            this.options.isopen = true;
            this.$choice.find('>div').addClass('open');
            this.$parent.addClass('ms-parent-open');
            this.$drop.addClass('ms-drop-open').slideDown();
            if (this.options.container) {
                var offset = this.$drop.offset();
                this.$drop.appendTo($(this.options.container));
                this.$drop.offset({ top: offset.top, left: offset.left });
            }
            if (this.options.filter) {
                this.$searchInput.val('');
                this.filter();
            }
            this.options.onOpen();
            /*this.$searchInput.focus();*/
        },

        close: function () {
            this.options.isopen = false;
            if (this.$choice) {
                this.$choice.find('>div').removeClass('open');
            }
            this.$parent.removeClass('ms-parent-open');
            this.$drop.removeClass('ms-drop-open').slideUp();
            if (this.options.container) {
                this.$parent.append(this.$drop);
                this.$drop.css({
                    'top': 'auto',
                    'left': 'auto'
                })
            }
            this.options.onClose();
            this.$searchInput.blur();
        },

        update: function () {
            var selects = this.getSelects('text');
            if (this.$choice && selects.length == this.$selectItems.length && this.options.overrideButtonText) {
                var $span = this.$choice.find('>span');
                $span.removeClass('placeholder').html(this.options.selectAllText);
            } else if (selects.length) {
                this.$clearAll.removeClass('hide').addClass('show');
            } else {
                this.$clearAll.addClass('hide').removeClass('show');
            }
            // set selects to select
            this.$el.val(this.getSelects());
        },

        updateSelectAll: function () {
            var $items = this.$selectItems.filter(':visible');
            this.$selectAll.prop('checked', $items.length &&
                $items.length === $items.filter(':checked').length);
        },

        updateOptGroupSelect: function () {
            var $items = this.$selectItems.filter(':visible');
            $.each(this.$selectGroups, function (i, val) {
                var group = $(val).parent().attr('data-group'),
                    $children = $items.filter('[data-group="' + group + '"]');
                $(val).prop('checked', $children.length &&
                    $children.length === $children.filter(':checked').length);
            });
        },

        //value or text, default: 'value'
        getSelects: function (type) {
            var that = this,
                texts = [],
                values = [];
            this.$drop.find('input[name="selectItem"]:checked').each(function () {
                texts.push($(this).parent().text());
                values.push($(this).val());
            });

            if (type === 'text' && this.$selectGroups.length) {
                texts = [];
                this.$selectGroups.each(function () {
                    var html = [],
                        text = $.trim($(this).parent().text()),
                        group = $(this).parent().data('group'),
                        $children = that.$drop.find('[name="selectItem"][data-group="' + group + '"]'),
                        $selected = $children.filter(':checked');

                    if ($selected.length === 0) {
                        return;
                    }

                    html.push('[');
                    html.push(text);
                    if ($children.length > $selected.length) {
                        var list = [];
                        $selected.each(function () {
                            list.push($(this).parent().text());
                        });
                        html.push(': ' + list.join(', '));
                    }
                    html.push(']');
                    texts.push(html.join(''));
                });
            }
            return type === 'text' ? texts : values;
        },

        setSelects: function (values) {
            var that = this;
            this.$selectItems.prop('checked', false);
            $.each(values, function (i, value) {
                that.$selectItems.filter('[value="' + value + '"]').prop('checked', true);
            });
            this.$selectAll.prop('checked', this.$selectItems.length ===
                this.$selectItems.filter(':checked').length);
            this.update();
        },

        enable: function () {
            if(!this.$choice) return;
            this.$choice.removeClass('disabled');
        },

        disable: function () {
            if(!this.$choice) return;
            this.$choice.addClass('disabled');
        },

        checkAll: function () {
            this.$selectItems.prop('checked', true);
            this.$selectGroups.prop('checked', true);
            this.$selectAll.prop('checked', true);
            this.update();
            this.options.onCheckAll();
        },

        uncheckAll: function () {
            this.$selectItems.prop('checked', false);
            this.$selectItems.closest("li").removeClass('ms-drop-selected');
            this.$selectGroups.prop('checked', false);
            this.$selectAll.prop('checked', false);
            this.update();
            this.options.onUncheckAll();
        },

        refresh: function () {
            this.init();
        },

        refilter: function () {

            for (var i = 0; i <= this.$el.children().length - 1; i++) {
                var elm = this.$el.children()[i];
                if ($(elm).attr("data-loaded") === undefined) {
                    this.$drop.children("ul").append(this.optionToHtml(i, elm));
                }
            }

            this.$selectItems = this.$drop.find('input[name="selectItem"]:enabled');

            this.filter();
            this.events();
        },

        filter: function () {
            var that = this,
                text = $.trim(this.$searchInput.val()).toLowerCase();
            if (text.length === 0) {
                // this.$selectItems.parent().show();
                this.$selectItems.closest('li').show();
                this.$disableItems.closest('li').show();
                this.$selectGroups.parent().show();
                this.$searchInput.parent().find('.ms-drop-text-clear').addClass('hide');
            } else {
                this.$searchInput.parent().find('.ms-drop-text-clear').removeClass('hide');
                this.$selectItems.each(function () {
                    var $parent = $(this).parent();
                    // $parent[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                    //$parent.parent()[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                    $parent.closest('li')[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                });
                this.$disableItems.parent().hide();
                this.$selectGroups.each(function () {
                    var $parent = $(this).parent();
                    var group = $parent.attr('data-group'),
                    $items = that.$selectItems.filter(':visible');
                    $parent.parent()[$items.filter('[data-group="' + group + '"]').length === 0 ? 'hide' : 'show']();
                });
            }

            //Check if no matches found
            if (this.$selectItems.parent().parent().filter(':visible').length) {
                this.$noResults.hide();
                this.$drop.find('ul').removeClass('ms-list-no-results');
            } else {
                this.$noResults.show();
                this.$drop.find('ul').addClass('ms-list-no-results');
            }

            this.options.onSearch();
            this.updateOptGroupSelect();
            this.updateSelectAll();
        }
    };

    $.fn.multipleSelect = function () {
        var option = arguments[0],
            args = arguments,

            value,
            allowedMethods = ['getSelects', 'setSelects', 'enable', 'disable', 'checkAll', 'uncheckAll', 'refresh', 'refilter'];

        this.each(function () {
            var $this = $(this),
                data = $this.data('multipleSelect'),
                options = $.extend({}, $.fn.multipleSelect.defaults, typeof option === 'object' && option);

            if (!data) {
                data = new MultipleSelect($this, options);
                $this.data('multipleSelect', data);
            }

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                data.init();
            }
        });

        return value ? value : this;
    };

    $.fn.multipleSelect.defaults = {
        isopen: false,
        placeholder: '',
        selectAll: true,
        selectAllText: 'Select all',
        multiple: false,
        multipleWidth: 80,
        single: false,
        filter: false,
        width: undefined,
        maxHeight: 250,
        container: null,
        position: 'bottom', // 'bottom' or 'top'
        clearAllText: 'Clear',
        showClearAll: true,
        focusInput: true,
        showNoResults: true,

        onOpen: function () { return false; },
        onClose: function () { return false; },
        onCheckAll: function () { return false; },
        onUncheckAll: function () { return false; },
        onOptgroupClick: function () { return false; },
        onClick: function () { return false; },
        onSearch: function () { return false; }
    };
})(jQuery);/*=====================================================
= CHECKRADIO PLUGIN V1.0 - 2013/10/31                 =
= Copyright laranjeira.pt 2013
= Dual licensed under the MIT 
  (http://www.opensource.org/licenses/mit-license.php)
  and GPL 
  (http://www.opensource.org/licenses/gpl-license.php) 
  licenses.
=====================================================*/
(function ($) {
    var methods = {
        // Method to initiate the plugin, it adds a span and the necessary classes and methods
        init: function (jQobj) {
            var $this = jQobj,
				$el = $this.find('input').first();//get the input inside the label
            if ($this.find('span').length > 0) {
                return;
            }
            var	$checked = $el.prop('checked'),//get the checked value 
				$disabled = $el.prop('disabled'),//get the disabled value 
				$elType = $el.is(':checkbox');//get if it is a checkbox
            $el.after('<span></span>');//add the span element
            var $span = $this.find('span');//get the span just added

            if ($elType === true) {
                //if it is a checkbox

                if ($checked === true) {
                    //if it is checked
                    $span.addClass('glyphs icon-box-checked');//adds the class checked to the span
                    jQobj.addClass('label-check_active');
                }
                else {
                    //if it is not checked
                    $span.addClass('icon-box-unchecked');//adds the class unchecked to the span
                    jQobj.removeClass('label-check_active');
                }

                if ($disabled == false) {
                    //if the checkbox is NOT Disabled adds the click method
                    methods.clickCheck($this, $span);
                }

            }

            else {
                if ($checked === true) {
                    //if it is checked
                    $span.addClass('glyphs icon-radio-checked');//adds the class checked to the span
                    jQobj.addClass('label-check_active');
                }
                else {
                    //if it is not checked
                    $span.addClass('icon-radio-unchecked');//adds the class unchecked to the span
                    jQobj.removeClass('label-check_active');
                }

                if ($disabled == false) {
                    //if the option is NOT Disabled adds the click method
                    methods.clickOption($this, $span);
                }

            }

            $this.attr('started', true);

        },
        // Method to check and uncheck the checkboxes
        clickCheck: function (jQobj, span) {

            jQobj.bind('click', function (e) {//binds the click
                var $el = jQobj.find('input'),//finds the input
					$checked = $el.prop('checked'); //Check if it is checked

                if (!jQobj.hasClass('label-check-disabled'))//If it is not disabled
                {
                    if ($checked === true) {
                        //Uncheck the checkbox and the attribute on the input
                        span.addClass('icon-box-unchecked');
                        span.removeClass('glyphs icon-box-checked');
                        jQobj.removeClass('label-check_active');
                        $el.prop('checked', false);
                        $el.attr('checked', false);
                    }
                    else {
                        //Check the checkbox and the attribute on the input
                        span.addClass('glyphs icon-box-checked');
                        jQobj.addClass('label-check_active');
                        span.removeClass('icon-box-unchecked');
                        $el.prop('checked', true);
                        $el.attr('checked', true);
                    }
                }

                e.preventDefault();//Prevent the default behaviour
            });

        },
        // Method to click on a option - unchecks all with same name
        clickOption: function (jQobj, span) {

            jQobj.bind('click', function (e) {

                var $el = jQobj.find('input'),
				$checked = $el.is(':checked');

                /*CLEAN UP OTHER RADIO BUTTONS WITH SAME NAME*/
                $elemGroup = $("body").find(':radio[name="' + $el.attr('name') + '"]');
                //looks for all elements and unchek them all
                $elemGroup.not($el).each(function () {
                    var $el = $(this);
                    var $label = $el.parent('label');
                    $label.find('span').addClass('icon-radio-unchecked');
                    $label.find('span').removeClass('glyphs icon-radio-checked');
                    $el.prop('checked', false);
                    $el.attr('checked', false);
                });



                if ($checked !== true) {
                    //Check the radio and the attribute on the input
                    span.addClass('glyphs icon-radio-checked');
                    span.removeClass('icon-radio-unchecked');
                    $el.prop('checked', true);
                    $el.attr('checked', true);
                }

                e.preventDefault();//Prevent the default behaviour

            });

        },
        // Method to activate the checkbox if we want to
        activateCheckbox: function (jQobj, span) {
            jQobj.removeClass('label-check-disabled');//remove the disabled class
            jQobj.unbind("click");//be sure there is no other click associated
            methods.clickCheck(jQobj, span);
        },

        // Method to activate the a radio button if we want to
        activateRadio: function (jQobj, span) {
            jQobj.removeClass('label-radio-disabled');//remove the disabled class
            jQobj.unbind("click");//be sure there is no other click associated
            methods.clickOption(jQobj, span);
        }

    }

    $.fn.checkradio = function (options) {

        /* Establish our default settings : 
		for now we just have some text and complete function*/
        var settings = $.extend({
            text: '',
            complete: function () {

            }
        }, options);



        return this.each(function () {
            /*initiate with method init*/
            if ($(this).attr('started') !== "true") {
                methods.init($(this));
            }
            /*Execute complete function at the very end*/
            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });

    };

}(jQuery));

/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[0], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[0] );
		$.data( this[0], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(event.target).hasClass("cancel") ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $(event.target).attr("formnovalidate") !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is("form")) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid = valid && validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function( index, value ) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function( command, argument ) {
		var element = this[0];

		if ( command ) {
			var settings = $.data(element.form, "validator").settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				// remove messages from rules, but allow them to be set separetely
				delete existingRules.messages;
				staticRules[element.name] = existingRules;
				if ( argument.messages ) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function( index, method ) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.dataRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if ( data.required ) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function( a ) { return !$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function( a ) { return !!$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function( a ) { return !$(a).prop("checked"); }
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function( i, n ) {
		source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
			return n;
		});
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "span",
		focusInvalid: true,
		errorContainer: $([]),
		errorLabelContainer: $([]),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element, event ) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function( element, event ) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue(element) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function( element, event ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if ( element.parentNode.name in this.submitted ) {
				this.element(element.parentNode);
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split(/\s/);
				}
				$.each(value, function( index, name ) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function( key, value ) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				if ( validator.settings[eventType] ) {
					validator.settings[eventType].call(validator, this[0], event);
				}
			}
			$(this.currentForm)
				.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if ( !this.valid() ) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !(element.name in errors);
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
			FFAPI.methods.header.updateTabTopHeight();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$(this.currentForm).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $(selector)[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(" ", ".");
			return $(this.settings.errorElement + "." + errorClass, this.errorContext);
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var type = $(element).attr("type"),
				val = $(element).val();

			if ( type === "radio" || type === "checkbox" ) {
				return $("input[name='" + $(element).attr("name") + "']:checked").val();
			}

			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		customDataMessage: function( element, method ) {
			return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if ( arguments[i] !== undefined ) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + ">")
					.attr("for", this.idOrName(element))
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
						label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label, element );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function( element ) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr("for") === name;
			});
		},

		idOrName: function( element ) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function( element ) {
			// if radio/checkbox, validate first element in group instead
			if ( this.checkable(element) ) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			return $(this.currentForm).find("[name='" + name + "']");
		},

		getLength: function( value, element ) {
			switch( element.nodeName.toLowerCase() ) {
			case "select":
				return $("option:selected", element).length;
			case "input":
				if ( this.checkable( element) ) {
					return this.findByName(element.name).filter(":checked").length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function( param, element ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$(param, element.form).length;
			},
			"function": function( param, element ) {
				return param(element);
			}
		},

		optional: function( element ) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[element.name] ) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function( element ) {
		var rules = {};
		var classes = $(element).attr("class");
		if ( classes ) {
			$.each(classes.split(" "), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {};
		var $element = $(element);
		var type = $element[0].getAttribute("type");

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number(value);
			}

			if ( value ) {
				rules[method] = value;
			} else if ( type === method && type !== 'range' ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $(element);
		for (method in $.validator.methods) {
			value = $element.data("rule-" + method.toLowerCase());
			if ( value !== undefined ) {
				rules[method] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {};
		var validator = $.data(element.form, "validator");
		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each(rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[prop];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch (typeof val.depends) {
				case "string":
					keepRule = !!$(val.depends, element.form).length;
					break;
				case "function":
					keepRule = val.depends.call(element, element);
					break;
				}
				if ( keepRule ) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function( rule, parameter ) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength'], function() {
			if ( rules[this] ) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			var parts;
			if ( rules[this] ) {
				if ( $.isArray(rules[this]) ) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				} else if ( typeof rules[this] === "string" ) {
					parts = rules[this].split(/[\s,]+/);
					rules[this] = [Number(parts[0]), Number(parts[1])];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min && rules.max ) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength && rules.maxlength ) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function( name, method, message ) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if ( method.length < 3 ) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function( value, element ) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function( value, element ) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function( value, element ) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function( value, element ) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function( value, element ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test(value) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if ( bEven ) {
					if ( (nDigit *= 2) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param);
			if ( this.settings.onfocusout ) {
				target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
			}
			return value === target.val();
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function( value, element, param ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param === "string" && {url:param} || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function( response ) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true || response === "true";
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						delete validator.invalid[element.name];
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.invalid[element.name] = true;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = ajax.apply(this, arguments);
				return pendingRequests[port];
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	$.extend($.fn, {
		validateDelegate: function( delegate, type, handler ) {
			return this.bind(type, function( event ) {
				var target = $(event.target);
				if ( target.is(delegate) ) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));




/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */
/*!
** Unobtrusive Ajax support library for jQuery
** Copyright (C) Microsoft Corporation. All rights reserved.
*/

/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global window: false, jQuery: false */

(function ($) {
    var data_click = "unobtrusiveAjaxClick",
        data_target = "unobtrusiveAjaxClickTarget"
        data_validation = "unobtrusiveValidation";

    function getFunction(code, argNames) {
        var fn = window, parts = (code || "").split(".");
        while (fn && parts.length) {
            fn = fn[parts.shift()];
        }
        if (typeof (fn) === "function") {
            return fn;
        }
        argNames.push(code);
        return Function.constructor.apply(null, argNames);
    }

    function isMethodProxySafe(method) {
        return method === "GET" || method === "POST";
    }

    function asyncOnBeforeSend(xhr, method) {
        if (!isMethodProxySafe(method)) {
            xhr.setRequestHeader("X-HTTP-Method-Override", method);
        }
    }

    function asyncOnSuccess(element, data, contentType) {
        var mode;

        if (contentType.indexOf("application/x-javascript") !== -1) {  // jQuery already executes JavaScript for us
            return;
        }

        mode = (element.getAttribute("data-ajax-mode") || "").toUpperCase();
        $(element.getAttribute("data-ajax-update")).each(function (i, update) {
            var top;

            switch (mode) {
            case "BEFORE":
                top = update.firstChild;
                $("<div />").html(data).contents().each(function () {
                    update.insertBefore(this, top);
                });
                break;
            case "AFTER":
                $("<div />").html(data).contents().each(function () {
                    update.appendChild(this);
                });
                break;
            default:
                $(update).html(data);
                break;
            }
        });
    }

    function asyncRequest(element, options) {
        var confirm, loading, method, duration;

        confirm = element.getAttribute("data-ajax-confirm");
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        loading = $(element.getAttribute("data-ajax-loading"));
        duration = parseInt(element.getAttribute("data-ajax-loading-duration"), 10) || 0;

        $.extend(options, {
            context: element,
            type: element.getAttribute("data-ajax-method") || undefined,
            url: element.getAttribute("data-ajax-url") || undefined,
            beforeSend: function (xhr) {
                var result;
                asyncOnBeforeSend(xhr, method);
                result = getFunction(element.getAttribute("data-ajax-begin"), ["xhr"]).apply(this, arguments);
                if (result !== false) {
                    loading.show(duration);
                }
                return result;
            },
            complete: function () {
                loading.hide(duration);
                getFunction(element.getAttribute("data-ajax-complete"), ["xhr", "status"]).apply(this, arguments);
            },
            success: function (data, status, xhr) {
                asyncOnSuccess(element, data, xhr.getResponseHeader("Content-Type") || "text/html");
                getFunction(element.getAttribute("data-ajax-success"), ["data", "status", "xhr"]).apply(this, arguments);
            },
            error: getFunction(element.getAttribute("data-ajax-failure"), ["xhr", "status", "error"])
        });

        options.data.push({ name: "X-Requested-With", value: "XMLHttpRequest" });

        method = options.type.toUpperCase();
        if (!isMethodProxySafe(method)) {
            options.type = "POST";
            options.data.push({ name: "X-HTTP-Method-Override", value: method });
        }

        $.ajax(options);
    }

    function validate(form) {
        var validationInfo = $(form).data(data_validation);
        return !validationInfo || !validationInfo.validate || validationInfo.validate();
    }

    $(document).on("click", "a[data-ajax=true]", function (evt) {
        evt.preventDefault();
        asyncRequest(this, {
            url: this.href,
            type: "GET",
            data: []
        });
    });

    $(document).on("click", "form[data-ajax=true] input[type=image]", function (evt) {
        var name = evt.target.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]),
            offset = target.offset();

        form.data(data_click, [
            { name: name + ".x", value: Math.round(evt.pageX - offset.left) },
            { name: name + ".y", value: Math.round(evt.pageY - offset.top) }
        ]);

        setTimeout(function () {
            form.removeData(data_click);
        }, 0);
    });

    $(document).on("click", "form[data-ajax=true] :submit", function (evt) {
        var name = evt.currentTarget.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]);

        form.data(data_click, name ? [{ name: name, value: evt.currentTarget.value }] : []);
        form.data(data_target, target);

        setTimeout(function () {
            form.removeData(data_click);
            form.removeData(data_target);
        }, 0);
    });

    $(document).on("submit", "form[data-ajax=true]", function (evt) {
        var clickInfo = $(this).data(data_click) || [],
            clickTarget = $(this).data(data_target),
            isCancel = clickTarget && clickTarget.hasClass("cancel");
        evt.preventDefault();
        if (!isCancel && !validate(this)) {
            return;
        }
        asyncRequest(this, {
            url: this.action,
            type: this.method || "GET",
            data: clickInfo.concat($(this).serializeArray())
        });
    });
}(jQuery));/* NUGET: BEGIN LICENSE TEXT
*
* Microsoft grants you the right to use these script files for the sole
* purpose of either: (i) interacting through your browser with the Microsoft
* website or online service, subject to the applicable licensing or use
* terms; or (ii) using the files as included with a Microsoft product subject
* to that product's license terms. Microsoft reserves all other rights to the
* files not expressly granted by Microsoft, whether by implication, estoppel
* or otherwise. Insofar as a script file is dual licensed under GPL,
* Microsoft neither took the code under GPL nor distributes it thereunder but
* under the terms set out in this paragraph. All notices and licenses
* below are for informational purposes only.
*
* NUGET: END LICENSE TEXT */
/*!
** Unobtrusive validation support library for jQuery and jQuery Validate
** Copyright (C) Microsoft Corporation. All rights reserved.
*/
/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global document: false, jQuery: false */
(function ($) {
var $jQval = $.validator,
adapters,
data_validation = "unobtrusiveValidation";
function setValidationValues(options, ruleName, value) {
options.rules[ruleName] = value;
if (options.message) {
options.messages[ruleName] = options.message;
}
}
function splitAndTrim(value) {
return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
}
function escapeAttributeValue(value) {
// As mentioned on http://api.jquery.com/category/selectors/
return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
}
function getModelPrefix(fieldName) {
return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
}
function appendModelPrefix(value, prefix) {
if (value.indexOf("*.") === 0) {
value = value.replace("*.", prefix);
}
return value;
}
function onError(error, inputElement) {  // 'this' is the form element
var container = $(this).find("[data-valmsg-for='" + escapeAttributeValue(inputElement[0].name) + "']"),
replaceAttrValue = container.attr("data-valmsg-replace"),
replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;
container.removeClass("field-validation-valid").addClass("field-validation-error");
error.data("unobtrusiveContainer", container);
if (replace) {
container.empty();
error.removeClass("input-validation-error").appendTo(container);
}
else {
error.hide();
}
}
function onErrors(event, validator) {  // 'this' is the form element
var container = $(this).find("[data-valmsg-summary=true]"),
list = container.find("ul");
if (list && list.length && validator.errorList.length) {
list.empty();
container.addClass("validation-summary-errors").removeClass("validation-summary-valid");
$.each(validator.errorList, function () {
$("<li />").html(this.message).appendTo(list);
});
}
}
function onSuccess(error) {  // 'this' is the form element
var container = error.data("unobtrusiveContainer"),
replaceAttrValue = container.attr("data-valmsg-replace"),
replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) : null;
if (container) {
container.addClass("field-validation-valid").removeClass("field-validation-error");
error.removeData("unobtrusiveContainer");
if (replace) {
container.empty();
}
}
}
function onReset(event) {  // 'this' is the form element
var $form = $(this);
$form.data("validator").resetForm();
$form.find(".validation-summary-errors")
.addClass("validation-summary-valid")
.removeClass("validation-summary-errors");
$form.find(".field-validation-error")
.addClass("field-validation-valid")
.removeClass("field-validation-error")
.removeData("unobtrusiveContainer")
.find(">*")  // If we were using valmsg-replace, get the underlying error
.removeData("unobtrusiveContainer");
}
function validationInfo(form) {
var $form = $(form),
result = $form.data(data_validation),
onResetProxy = $.proxy(onReset, form);
if (!result) {
result = {
options: {  // options structure passed to jQuery Validate's validate() method
errorClass: "input-validation-error",
errorElement: "span",
errorPlacement: $.proxy(onError, form),
invalidHandler: $.proxy(onErrors, form),
messages: {},
rules: {},
success: $.proxy(onSuccess, form)
},
attachValidation: function () {
$form
.unbind("reset." + data_validation, onResetProxy)
.bind("reset." + data_validation, onResetProxy)
.validate(this.options);
},
validate: function () {  // a validation function that is called by unobtrusive Ajax
$form.validate();
return $form.valid();
}
};
$form.data(data_validation, result);
}
return result;
}
$jQval.unobtrusive = {
adapters: [],
parseElement: function (element, skipAttach) {
/// <summary>
/// Parses a single HTML element for unobtrusive validation attributes.
/// </summary>
/// <param name="element" domElement="true">The HTML element to be parsed.</param>
/// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
/// validation to the form. If parsing just this single element, you should specify true.
/// If parsing several elements, you should specify false, and manually attach the validation
/// to the form when you are finished. The default is false.</param>
var $element = $(element),
form = $element.parents("form")[0],
valInfo, rules, messages;
if (!form) {  // Cannot do client-side validation without a form
return;
}
valInfo = validationInfo(form);
valInfo.options.rules[element.name] = rules = {};
valInfo.options.messages[element.name] = messages = {};
$.each(this.adapters, function () {
var prefix = "data-val-" + this.name,
message = $element.attr(prefix),
paramValues = {};
if (message !== undefined) {  // Compare against undefined, because an empty message is legal (and falsy)
prefix += "-";
$.each(this.params, function () {
paramValues[this] = $element.attr(prefix + this);
});
this.adapt({
element: element,
form: form,
message: message,
params: paramValues,
rules: rules,
messages: messages
});
}
});
$.extend(rules, { "__dummy__": true });
if (!skipAttach) {
valInfo.attachValidation();
}
},
parse: function (selector) {
/// <summary>
/// Parses all the HTML elements in the specified selector. It looks for input elements decorated
/// with the [data-val=true] attribute value and enables validation according to the data-val-*
/// attribute values.
/// </summary>
/// <param name="selector" type="String">Any valid jQuery selector.</param>
var $forms = $(selector)
.parents("form")
.andSelf()
.add($(selector).find("form"))
.filter("form");
// :input is a psuedoselector provided by jQuery which selects input and input-like elements
// combining :input with other selectors significantly decreases performance.
$(selector).find(":input").filter("[data-val=true]").each(function () {
$jQval.unobtrusive.parseElement(this, true);
});
$forms.each(function () {
var info = validationInfo(this);
if (info) {
info.attachValidation();
}
});
}
};
adapters = $jQval.unobtrusive.adapters;
adapters.add = function (adapterName, params, fn) {
/// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation.</summary>
/// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
/// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
/// <param name="params" type="Array" optional="true">[Optional] An array of parameter names (strings) that will
/// be extracted from the data-val-nnnn-mmmm HTML attributes (where nnnn is the adapter name, and
/// mmmm is the parameter name).</param>
/// <param name="fn" type="Function">The function to call, which adapts the values from the HTML
/// attributes into jQuery Validate rules and/or messages.</param>
/// <returns type="jQuery.validator.unobtrusive.adapters" />
if (!fn) {  // Called with no params, just a function
fn = params;
params = [];
}
this.push({ name: adapterName, params: params, adapt: fn });
return this;
};
adapters.addBool = function (adapterName, ruleName) {
/// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
/// the jQuery Validate validation rule has no parameter values.</summary>
/// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
/// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
/// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
/// of adapterName will be used instead.</param>
/// <returns type="jQuery.validator.unobtrusive.adapters" />
return this.add(adapterName, function (options) {
setValidationValues(options, ruleName || adapterName, true);
});
};
adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
/// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
/// the jQuery Validate validation has three potential rules (one for min-only, one for max-only, and
/// one for min-and-max). The HTML parameters are expected to be named -min and -max.</summary>
/// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
/// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
/// <param name="minRuleName" type="String">The name of the jQuery Validate rule to be used when you only
/// have a minimum value.</param>
/// <param name="maxRuleName" type="String">The name of the jQuery Validate rule to be used when you only
/// have a maximum value.</param>
/// <param name="minMaxRuleName" type="String">The name of the jQuery Validate rule to be used when you
/// have both a minimum and maximum value.</param>
/// <param name="minAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
/// contains the minimum value. The default is "min".</param>
/// <param name="maxAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
/// contains the maximum value. The default is "max".</param>
/// <returns type="jQuery.validator.unobtrusive.adapters" />
return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
var min = options.params.min,
max = options.params.max;
if (min && max) {
setValidationValues(options, minMaxRuleName, [min, max]);
}
else if (min) {
setValidationValues(options, minRuleName, min);
}
else if (max) {
setValidationValues(options, maxRuleName, max);
}
});
};
adapters.addSingleVal = function (adapterName, attribute, ruleName) {
/// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
/// the jQuery Validate validation rule has a single value.</summary>
/// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
/// in the data-val-nnnn HTML attribute(where nnnn is the adapter name).</param>
/// <param name="attribute" type="String">[Optional] The name of the HTML attribute that contains the value.
/// The default is "val".</param>
/// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
/// of adapterName will be used instead.</param>
/// <returns type="jQuery.validator.unobtrusive.adapters" />
return this.add(adapterName, [attribute || "val"], function (options) {
setValidationValues(options, ruleName || adapterName, options.params[attribute]);
});
};
$jQval.addMethod("__dummy__", function (value, element, params) {
return true;
});
$jQval.addMethod("regex", function (value, element, params) {
var match;
if (this.optional(element)) {
return true;
}
match = new RegExp(params).exec(value);
return (match && (match.index === 0) && (match[0].length === value.length));
});
$jQval.addMethod("nonalphamin", function (value, element, nonalphamin) {
var match;
if (nonalphamin) {
match = value.match(/\W/g);
match = match && match.length >= nonalphamin;
}
return match;
});
if ($jQval.methods.extension) {
adapters.addSingleVal("accept", "mimtype");
adapters.addSingleVal("extension", "extension");
} else {
// for backward compatibility, when the 'extension' validation method does not exist, such as with versions
// of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
// validating the extension, and ignore mime-type validations as they are not supported.
adapters.addSingleVal("extension", "extension", "accept");
}
adapters.addSingleVal("regex", "pattern");
adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
adapters.add("equalto", ["other"], function (options) {
var prefix = getModelPrefix(options.element.name),
other = options.params.other,
fullOtherName = appendModelPrefix(other, prefix),
element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];
setValidationValues(options, "equalTo", element);
});
adapters.add("required", function (options) {
// jQuery Validate equates "required" with "mandatory" for checkbox elements
if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
setValidationValues(options, "required", true);
}
});
adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
var value = {
url: options.params.url,
type: options.params.type || "GET",
data: {}
},
prefix = getModelPrefix(options.element.name);
$.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
var paramName = appendModelPrefix(fieldName, prefix);
value.data[paramName] = function () {
return $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']").val();
};
});
setValidationValues(options, "remote", value);
});
adapters.add("password", ["min", "nonalphamin", "regex"], function (options) {
if (options.params.min) {
setValidationValues(options, "minlength", options.params.min);
}
if (options.params.nonalphamin) {
setValidationValues(options, "nonalphamin", options.params.nonalphamin);
}
if (options.params.regex) {
setValidationValues(options, "regex", options.params.regex);
}
});
$(function () {
$jQval.unobtrusive.parse(document);
});
}(jQuery));
if ($.validator) {
  // Custom validator for br CPF address field
  $.validator.addMethod("validcpf", function (value, element, params) {
    var cpf = value.replace(/\.|-/ig, "");

    if (cpf == '') return false;

    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
      /*cpf == "11111111111" ||*/
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
      return false;

    // Valida 1o digito
    var add = 0;
    for (var i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;

    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;

    return true;
  });

  $.validator.unobtrusive.adapters.add("validcpf", [""], function (options) {
    options.messages["validcpf"] = options.message;
    options.rules['validcpf'] = true;
  });

  // Custom validator for credit card date
  $.validator.addMethod("creditcardmonth", function (value, element, params) {
    var year = parseInt($(params).val());
    var month = parseInt(value);
    if (isNaN(year) || isNaN(month))
      return false;
    return new Date(year, month, 0) >= new Date();
  });

  $.validator.unobtrusive.adapters.add("creditcardmonth", ["yearpropertyname"], function (options) {
    options.rules["creditcardmonth"] = "#" + options.params.yearpropertyname;
    options.messages["creditcardmonth"] = options.message;
  });

  $.validator.addMethod('numericlessthan', function (value, element, params) {
    var otherValue = $(params.element).val();

    return isNaN(value) && isNaN(otherValue) || (params.allowequality === 'True' ? parseFloat(value) <= parseFloat(otherValue) : parseFloat(value) < parseFloat(otherValue));
  }, '');

  $.validator.unobtrusive.adapters.add('numericlessthan', ['other', 'allowequality'], function (options) {
    other = options.params.other,
    element = $(options.form).find(':input[name=' + other + ']')[0];

    options.rules['numericlessthan'] = { allowequality: options.params.allowequality, element: element };
    if (options.message) {
      options.messages['numericlessthan'] = options.message;
    }
  });

  // Custom "RequiredIf" client-side validator
  $.validator.addMethod('requiredif',
       function (value, element, parameters) {
         var id = '#' + parameters['dependentproperty'];

         var form = $(element).closest("form");

         // get the target value (as a string, 
         // as that's what actual value will be)
         var targetvalue = parameters['targetvalue'];
         targetvalue =
             (targetvalue == null ? '' : targetvalue).toString();

         // get the actual value of the target control
         // note - this probably needs to cater for more 
         // control types, e.g. radios
         var control = form.find(id);
         var controltype = control.attr('type');
         var actualvalue =
             controltype === 'checkbox' ?
             (control.attr('checked') != null ? "true" : "false") :
             control.val();

         // if the condition is true, reuse the existing 
         // required field validator functionality
         if (targetvalue === actualvalue)
           return $.validator.methods.required.call(
             this, value, element, parameters);

         // This element is not required because the required target element is not required
         return "requiredif-ok";
       }
   );

  $.validator.unobtrusive.adapters.add(
     'requiredif',
     ['dependentproperty', 'targetvalue'],
     function (options) {
       options.rules['requiredif'] = {
         dependentproperty: options.params['dependentproperty'],
         targetvalue: options.params['targetvalue']
       };
       options.messages['requiredif'] = options.message;
     });


  // Validator extension for custom dropdowns
  $.validator.setDefaults({
      ignore: "input:hidden:not(.dropdownhidden, .searchableajaxdropdown, .sizeUnavailableValueForValidate),select.dropdown-searchable",
    highlight: function (element, errorClass, validClass) {

      if (element.type === 'radio') {
        this.findByName(element.name).removeClass(validClass).addClass(errorClass);
      } else if ($(element).hasClass("dropdownhidden")) {
        var name = $(element).attr("name"),
            dropDownDiv = $(this.currentForm).find("div[data-input-hidden-name='" + name + "']");

        if (dropDownDiv.length > 0) {
          dropDownDiv.removeClass(validClass).addClass(errorClass);
        }
      } else if ($(element).hasClass("searchableajaxdropdown") || $(element).hasClass("dropdown-searchable")) {
        var name = $(element).attr("name"),
            spanError = $(this.currentForm).find("span[data-valmsg-for='" + name + "']");

        if (spanError.length > 0) {
          var dropDownDiv = spanError.siblings("div.chosen-container");
          if (dropDownDiv.length > 0)
            dropDownDiv.removeClass(validClass).addClass(errorClass);
        }
      } else {
        $(element).removeClass(validClass).addClass(errorClass);
      }
    },
    unhighlight: function (element, errorClass, validClass) {
      if (element.type === 'radio') {
        this.findByName(element.name).removeClass(errorClass).addClass(validClass);
      } else if ($(element).hasClass("dropdownhidden")) {
        var name = $(element).attr("name"),
            dropDownDiv = $(this.currentForm).find("div[data-input-hidden-name='" + name + "']");

        if (dropDownDiv.length > 0) {
          dropDownDiv.removeClass(errorClass).addClass(validClass);
        }
      } else if ($(element).hasClass("searchableajaxdropdown") || $(element).hasClass("dropdown-searchable")) {
        var name = $(element).attr("name"),
            spanError = $(this.currentForm).find("span[data-valmsg-for='" + name + "']");

        if (spanError.length > 0) {
          var dropDownDiv = spanError.siblings("div.chosen-container");
          if (dropDownDiv.length > 0)
            dropDownDiv.removeClass(errorClass).addClass(validClass);
        }
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
      }
    }
  });
}if ($.validator && FFAPI.translations) {
	$.validator.messages = {
		required: FFAPI.translations.requiredErrorMsg,
		remote: FFAPI.translations.remoteErrorMsg,
		email: FFAPI.translations.emailErrorMsg,
		url: FFAPI.translations.urlErrorMsg,
		date: FFAPI.translations.dateErrorMsg,
		dateISO: FFAPI.translations.dateISOErrorMsg,
		number: FFAPI.translations.numberErrorMsg,
		digits: FFAPI.translations.digitsErrorMsg,
		creditcard: FFAPI.translations.creditcardErrorMsg,
		equalTo: FFAPI.translations.equalToErrorMsg,
		maxlength: $.validator.format(FFAPI.translations.numCharactersErrorMsg),
		minlength: $.validator.format(FFAPI.translations.minlengthErrorMsg),
		rangelength: $.validator.format(FFAPI.translations.rangelengthErrorMsg),
		range: $.validator.format(FFAPI.translations.rangeErrorMsg),
		max: $.validator.format(FFAPI.translations.maxErrorMsg),
		min: $.validator.format(FFAPI.translations.minErrorMsg)
	};
}