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
});