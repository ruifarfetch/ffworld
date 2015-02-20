/**
* This module contains global methods for the listing
* @module LISTING
*/
var FFAPI = FFAPI || {};
FFAPI.variables = FFAPI.variables || {};
FFAPI.methods = FFAPI.methods || {};

FFAPI.listing = FFAPI.listing || {};
FFAPI.listing.methods = FFAPI.listing.methods || {};
FFAPI.listing.variables = FFAPI.listing.variables || {};

/*Homepage javaScript file. It contains the function to make the listing work on desktop and mobile
@deprecated pages/
@class listing.js
**/

try {
    FFAPI.listing.variables.hoverTimeout = {};
    FFAPI.listing.methods.init_old = function () {
        /// <summary>
        ///     Initializes bindings on listing page
        ///     &#10 In this case, it's only initializing the "Saved Items" star
        /// </summary>
        /// <returns type="undefined" />
        var api = FFAPI;
        $(".listingSave").on("click", function (e) {
            var jQThis = $(this),
				parent = jQThis.closest(".listingItemWrap"),
				itemid = parent.data("item-id"),
				savedid = parent.data("data-saved-id"),
				storeid = parent.data("store-id");

            if (jQThis.hasClass("selected")) {
                //check if the wishlist tab is already there, if not, load it, and only then force the click
                if ($("#tabs") && !$("#tabs").data("tabsloaded")) {
                    FFAPI.methods.renderItemsForTabs(function () {
                        $("#SavedItemsTab").find("li[data-item-id='" + itemid + "'][data-store-id='" + storeid + "']").find(".close").trigger({
                            type: "click",
                            triggered: true
                        });
                    });
                    $("#tabs").data("tabsloaded", true);
                }
                else {
                    $("#SavedItemsTab").find("li[data-item-id='" + itemid + "'][data-store-id='" + storeid + "']").find(".close").trigger({
                        type: "click",
                        triggered: true
                    });
                }
            } else {
                api.methods.AddToSaveLater(parent[0], itemid, storeid, function (result, e) {
                    FFAPI.methods.UpdateFavouriteStatus();
                    FFAPI.methods.UpdateItemsForTabs();
                });
            }
        });
    };
    FFAPI.listing.methods.bindRollover_old = function () {
        /// <summary>
        ///     CAUTION: This function is applied after every async request on the multiselect engine.
        /// </summary>
        /// <returns type="undefined" />
        var api = FFAPI;
        var getAsyncDetails = function (jQThis) {
            if (jQThis.data("loadingAsyncDetails")) {
                return false;
            }
            jQThis.data("loadingAsyncDetails", true);
            if (api.variables.AsyncRolloverActive) {
                api.listing.methods.getAsyncDetails(
					jQThis.data("item-id"),
					jQThis.data("store-id"),
					function (result, e) {
					    if (result) {
					        if (!result.Video) {
					            jQThis.find(".productVideoLink").remove();
					        }
					        var template = document.getElementById("ListingRolloverTemplate").innerHTML;
					        jQThis
								.find(".listingSize")
								.html(Mustache.to_html(template, result).replace(/^\s*/mg, ''));
					        jQThis.unbind("mouseenter mouseleave");
					        jQThis.rollover({
					            show: ".listingSave, .listingSize, .productVideoLink .listingVideo",
					            hide: ".productTags, .listingDescription"
					        });
					        if (jQThis.data("hovering")) {
					            jQThis.trigger("mouseenter");
					        }
					    }
					}
				);
            } else {
                jQThis.unbind("mouseenter mouseleave");
                jQThis.rollover({
                    show: ".listingSave"
                });
                if (jQThis.data("hovering")) {
                    jQThis.trigger("mouseenter");
                }
            }
        }
        $(".listingItemWrap", "#listingItems")
		.bind("mouseleave", function (e) {
		    var jQThis = $(this);
		    jQThis.data("hovering", false);
		    var timeout = api.listing.variables.hoverTimeout[jQThis.data("item-id")];
		    if (timeout) {
		        clearTimeout(api.listing.variables.hoverTimeout);
		    }
		})
		.bind("mouseenter", function (e) {
		    var jQThis = $(this);
		    jQThis.data("hovering", true);
		    api.listing.variables.hoverTimeout[jQThis.data("item-id")] = setTimeout(function () {
		        if (jQThis.data("hovering")) {
		            getAsyncDetails(jQThis);
		        }
		    }, api.variables.AsyncRolloverTimeout);
		}).bind("item-saved", function (e) {
		    var jQThis = $(this);
		    jQThis.find(".addsaved").hide();
		    jQThis.find(".saved").show();
		    jQThis.find(".toolTip").addClass("darktoolTip");
		    jQThis.find(".arrowDown").addClass("arrowDownDark");
		    jQThis.find(".listingSave").addClass("selected");
		}).bind("item-unsaved", function (e) {
		    var jQThis = $(this);
		    jQThis.find(".addsaved").show();
		    jQThis.find(".saved").hide();
		    jQThis.find(".toolTip").removeClass("darktoolTip");
		    jQThis.find(".arrowDown").removeClass("arrowDownDark");
		    jQThis.find(".listingSave").removeClass("selected");
		    if (!e.triggered) {
		        var close = $("#SavedItemsTab")
				.find("li[data-item-id='" + jQThis.data("item-id") + "'][data-store-id='" + jQThis.data("store-id") + "']")
				.find(".close");
		        close.trigger("click");
		    }
		}).rollover({ show: ".listingSave" });
        $(".listingSave, .FilterListItemSize").tooltip({});
    };
    FFAPI.listing.methods.getAsyncDetails = function (itemid, storeid, callback) {
        /// <summary>
        ///     Activated the first time the user rolls over a product on the listing page
        /// </summary>
        /// <param name="itemid" type="Number">
        ///     Item ID
        /// </param>
        /// <param name="storeid" type="Number">
        ///     Store ID
        /// </param>
        /// <param name="callback" type="Function">
        ///     Callback to be executed after the async request finishes.
        /// </param>
        /// <returns type="undefined" />
        var api = FFAPI;
        var bucket = (typeof (api.variables.videoBucket) === "undefined" ? "A" : api.variables.videoBucket);
        var url = [];
        url.push(typeof (api.variables.AsyncRolloverDomain) == "undefined" ? "" : api.variables.AsyncRolloverDomain);
        url.push(
			window.universal_variable.page.subfolder + "/api",
			"/product",
			"/", encodeURIComponent(itemid),
			"/", encodeURIComponent(storeid),
			"/", encodeURIComponent(api.variables.lang),
			"/", encodeURIComponent(bucket)
		);

        $.ajax({
            type: "GET",
            url: url.join(""),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result, e) {
                if (result) {
                    if (typeof (callback) === "function") {
                        callback(result, e);
                    }
                }
            }
        });
    };

    var fireQubitSortByFilterEvents = function () {
        try {
            FFAPI.methods.fireQubitEvents("Click sort by filter", "Sort by");
        } catch (e) { }
    }

    /**
	 * Method to init the listing page (init bindings, rollover, etc)
	 */
    FFAPI.listing.methods.init = function () {
        FFAPI.listing.methods.bindRolloverEvents();
        FFAPI.listing.methods.bindDropdownFiltersEvents();
        require(['plu_waypoints'], function () {
            require(['plu_waypointsSticky'], function () {
            });
            // Each time the multiselect is updated, we rebind the rollover
            $("#MultiSelectCallbackCenter").bind("item-render.multiselect", function (e) {
                FFAPI.listing.methods.bindRolloverEvents();
            });
        });

        require(['essentials'], function () {
        FFAPI.listing.methods.initDesignersAndBoutiquesMultiselect();
        });

        FFAPI.listing.methods.bindAddToWishListButtons();

        $("body").on("click", ".listing-backTop button, .listing-backTop a, .editorial-backTop a, .editorial-backTop button", function (e) {
            e.preventDefault();
            $(document).scrollTop(0);
            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("238"); }
        });
    };

    FFAPI.listing.methods.addToWishlist = function (itemid, storeid) {
        var listingItem = $('#listingItemWrap' + itemid);
        // Change star (we should change the start immediately to make it feel more responsive.. if the request fails, we restore the previous star status)
        listingItem.find('.listingSave').addClass('listing-wishlist-active');
        //CLICKSTREAM ACTION 35
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse('{ "tid": 35, "val": ' + itemid + ' }'); }

        $.ajax({
            type: "POST",
            url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + universal_variable.page.subfolder + "/listingpage/AddToWishlist",
            data: {
                storeid: storeid,
                productid: itemid
            },
            success: function (result, e) {
                if (result != undefined) {
                    if (listingItem.length > 0) {
                        if (result.Success == true) {
                            listingItem.data('saved-id', result.WishlistItemId);
                            //update header counter
                            if ((typeof FFAPI !== 'undefined') && (typeof FFAPI.methods !== 'undefined') && (typeof FFAPI.methods.header !== 'undefined')) {
                                FFAPI.methods.header.updateWishListItemCount(result.ItemsCounter);
                            }
                            //force header to reload wishlist items when opened
                            FFAPI.methods.header.needRefreshHeaderTab('header-wishlist-button');
                            FFAPI.methods.addWishListItem(result.ProductId, false);
                            //fire the add to wishlist event
                            var productData = { id: listingItem.data('item-id'), unit_price: listingItem.data('unit-price'), quantity: 1 };
                            $(document).trigger('WishListUpdated', productData);
                        } else {
                            listingItem.find('.listingSave').removeClass('listing-wishlist-active');
                        }
                    }
                }
            },
            error: function (e) {
                listingItem.find('.listingSave').removeClass('listing-wishlist-active');
            }
        });
    };

    FFAPI.listing.methods.removeFromWishlist = function (wishlistitemid, itemid, storeid) {
        var listingItem = $('#listingItemWrap' + itemid);
        // Change star
        listingItem.find('.listingSave').removeClass('listing-wishlist-active');

        //CLICKSTREAM ACTION 72
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse('{ "tid": 72, "val": ' + itemid + ' }'); }

        $.ajax({
            type: "POST",
            url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + universal_variable.page.subfolder + "/listingpage/RemoveFromWishlist",
            data: {
                wishlistitemid: wishlistitemid,
                storeid: storeid,
                productid: itemid
            },
            success: function (result, e) {
                if (result != undefined) {
                    if (listingItem.length > 0) {
                        if (result.Success == true) {
                            listingItem.removeData('savedId');
                            //update header counter
                            if ((typeof FFAPI !== 'undefined') && (typeof FFAPI.methods !== 'undefined') && (typeof FFAPI.methods.header !== 'undefined')) {
                                FFAPI.methods.header.updateWishListItemCount(result.ItemsCounter);
                            }
                            //force header to reload wishlist items when opened
                            FFAPI.methods.header.needRefreshHeaderTab('header-wishlist-button');
                            FFAPI.methods.removeWishListItem(result.ProductId, false);
                        }
                    }
                }
            },
            error: function (e) {
                listingItem.find('.listingSave').addClass('listing-wishlist-active');
            }
        });
    };

    FFAPI.listing.methods.bindAddToWishListButtons = function () {
        $("body").on("click", ".listingSave", function (e) {
            e.preventDefault();
            var jQThis = $(this),
				parent = jQThis.closest(".listingItemWrap"),
				itemid = parent.data("item-id"),
				savedid = parent.data("data-saved-id"),
				storeid = parent.data("store-id");

            if (savedid == undefined && jQThis.hasClass('listing-wishlist-active') == false) {
                FFAPI.listing.methods.addToWishlist(itemid, storeid);
            }
            else {
                if (savedid == undefined) {
                    savedid = 0;
                }
                FFAPI.listing.methods.removeFromWishlist(savedid, itemid, storeid);
            }
        });
    };

    FFAPI.listing.methods.bindRolloverEvents = function () {
        require(['plu_waypoints', 'essentials'], function () {
            require(['plu_waypointsSticky'], function () {
                $(document).ready(function () {
                    $('.no-touch .listing-item li').rollover({ animate: true, crossfade: true });
                });
            });
        });
    };

    FFAPI.listing.methods.bindDropdownFiltersEvents = function () {
        require(['plu_waypoints'], function () {
            require(['plu_waypointsSticky'], function () {
                //define variables//
                var filter_trigger = $('.listing-header-filter'),
					filter_wrapper = $('.left-filters-wrapper'),
					sortby_trigger = $('.listing-filter-sort-title'),
					sortby_dropdown = $('.listing-filter-sort-dropdown'),
					sortby_dropdown_optn = $('.listing-filter-sort-dropdown li'),
					sortby_dropdown_optn_links = $('.listing-filter-sort-dropdown li a'),
					filters_trigger_active = 'filters-filter-active',
					icon_single_column = $('.icon-single-column'),
					icon_multiple_column = $('.icon-multiple-column'),
					icon_grid_active = 'listing-grid_active',
					filters_fixed = $('.back-to-top-filters'),
					listing_item = $('.listing-item'),
                    listing_filter_wrapper = $('.listing-filter-wrapper');

                function openFilter() {
                    listing_filter_wrapper.addClass('listing-filter-wrapper-open');
                    
                    if(sortby_trigger.hasClass(filters_trigger_active)) {
                        closeSortby();
                    }

                    filter_wrapper.slideDown(function () {
                        filter_trigger.addClass(filters_trigger_active);
                    });
                }

                function closeFilter(callback) {
                    filter_wrapper.slideUp(function () {
                        filter_trigger.removeClass(filters_trigger_active);
                        listing_filter_wrapper.removeClass('listing-filter-wrapper-open');
                        if(callback) callback();
                    });
                }

                function openSortby() {
                    listing_filter_wrapper.addClass('listing-sortby-wrapper-open');

                    if(filter_trigger.hasClass(filters_trigger_active)) {
                        closeFilter();
                    }

                    sortby_dropdown.slideDown(function () {
                        sortby_trigger.addClass(filters_trigger_active);
                    });
                }

                function closeSortby() {
                    sortby_dropdown.slideUp(function () {
                        sortby_trigger.removeClass(filters_trigger_active);
                        listing_filter_wrapper.removeClass('listing-sortby-wrapper-open');
                    });
                }

                //mobile open filters
                filter_trigger.on("click", function () {
                    if (FFAPI.responsive.goneSmallQuerie.matches) {

                        if(filter_trigger.hasClass(filters_trigger_active)) { // Filter opened
                            closeFilter();
                        } else { // Filter closed
                            openFilter();
                        }
                    }
                });

                //mobile open sortby
                sortby_dropdown_optn.on("click", function (e) {
                    ///console.log('sortby_dropdown_optn');
                    if (FFAPI.responsive.goneSmallQuerie.matches) {
                        sortby_dropdown.slideToggle(function () {
                            sortby_trigger.toggleClass(filters_trigger_active);
                        });
                    }

                    //load the data
                    e.preventDefault();
                    var jQThis = $(this).find('a');
                    anchorText = jQThis.text();
                    jQThis.closest(".list-regular").siblings("span.glyphs").find("a").html(anchorText);
                    jQThis.trigger('click');

                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract(jQThis); }
                    WebUIShopNavEngine.QSPagingSelectorSet(1);
                    WebUIShopNavEngine.OrderGet(jQThis.data("order")[WebUIShopNavEngine._QSOrderTypeIdentifier]);
                    return false;
                });

                sortby_dropdown_optn_links.on("click", function (e) {
                    if (FFAPI.responsive.goneSmallQuerie.matches) {
                        sortby_dropdown.slideToggle(function () {
                            sortby_trigger.toggleClass(filters_trigger_active);
                        });
                    }

                    //load the data
                    e.preventDefault();
                    var jQThis = $(this);
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract(jQThis); }
                    WebUIShopNavEngine.QSPagingSelectorSet(1);
                    WebUIShopNavEngine.OrderGet(jQThis.data("order")[WebUIShopNavEngine._QSOrderTypeIdentifier]);
                    return false;
                });

                //close sort by when click option
                sortby_trigger.on("click", function () {
                    ///console.log('sortby_trigger');
                    if (FFAPI.responsive.goneSmallQuerie.matches) {

                        if(sortby_trigger.hasClass(filters_trigger_active)) { // Sortby opened
                            closeSortby();
                        } else { // Sortby closed
                            openSortby();
                        }
                    }
                });

                //single grid
                icon_single_column.on("click", function () {
                    if (FFAPI.responsive.goneSmallQuerie.matches) {
                        icon_multiple_column.removeClass(icon_grid_active);
                        $(this).addClass(icon_grid_active);
                        listing_item.addClass("listing-item-fullWidth");
                    }
                });

                //double grid
                icon_multiple_column.on("click", function () {
                    if (FFAPI.responsive.goneSmallQuerie.matches) {
                        icon_single_column.removeClass(icon_grid_active);
                        $(this).addClass(icon_grid_active);
                        listing_item.removeClass("listing-item-fullWidth");
                    }
                });

                //sticky filters
                filters_fixed.waypoint('sticky');

                //sticky filters on click 
                filters_fixed.on("click", function () {
                    if (FFAPI.responsive.goneSmallQuerie.matches && !filter_trigger.hasClass(filters_trigger_active)) {
                        openFilter();
                    }
                });

                //wishlist state
                //$('.listing-item li button').on("click", function () {
                //    $(this).toggleClass("listing-wishlist-active");
                //});

                //apply toogle 
                $('body').off("click", '.listing-filters-apply').on("click", '.listing-filters-apply', function (e) {
                    closeFilter(function() {
                        FFAPI.plugins.scroll.to(document.getElementById('listingItems'), 60);
                    });
                    $("#btnPriceMinMax").trigger('click');
                    e.preventDefault();
                });

                //focus price inputs 
                $('.listing-dropdown-price span').click(function () {
                    $(this).parent().find('.input_black:first').focus();
                });

                // Clear price inputs function
                $.each($('.dropdown-input-clear'), function (index, val) {
                    $(this).on('click', function (event) {
                        $("input[type='number']").val('');
                        $(this).addClass('hide');
                    });
                });
            });
        });
    };

    FFAPI.listing.methods.initDesignersAndBoutiquesMultiselect = function () {
        /**
			Homepahe javaScript file. It contains the function to make the listing work on desktop and mobile
			@deprecated pages/
			@class listing.js
			**/
        /// Chosen Plugin is always necessary and has a general class
            var formMultipleDesigners = $(".listing-select-designer .selectFormMultiple");
            if (formMultipleDesigners.length > 0) {
                formMultipleDesigners.multipleSelect({
                    isopen: true,
                    filter: true,
                    selectAll: false,
                    placeholder: false,
                    placeholderText: FFAPI.translations.multipleselect_filter_placeholder_designer,
                    //noresultsText: FFAPI.translations.multipleselect_filter_noresults,
                    showNoResults: false,
                    onOpen: function () {
                        runPlaceHolder();
                    },
                    onSearch: function () {
                        $(".designers-no-results").hide();

                        $(".listing-select-designer input[type=text]").trigger("change");
                    }
                });
            }

        // Autocomplete designers
        var inputDesignersAutocomplete = $(".listing-select-designer input[type=text]");
        if (inputDesignersAutocomplete.length > 0) {
            inputDesignersAutocomplete.autocomplete({
                minChars: 3,
                serviceUrl: universal_variable.page.subfolder + "/FFAPI/MultiSelect.asmx/GetDesignersByTerm",
                appendTo: '',
                noCache: true,
                showLoading: false,
                paramName: 'Term',
                deferRequestBy: FFAPI.variables.animationSpeed,
                categories: false,
                params: { "PropID": "1", "URL": window.location.href, "Term": "" },
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                noResultsText: FFAPI.translations.multipleselect_filter_noresults,
                transformResult: function (response) {
                    var designersList = $(".listing-select-designer .selectFormMultiple");
                    $.each(response.d, function (index, item) {
                        if ($("div.listing-select-designer li a[id=f1d0v" + item.Value + "]").length == 0) {
                            $opt = $("<option />", {
                                id: "f1d0v" + item.Value,
                                'class': "asyncAdded FilterListItemLink  f1d0 v" + item.Value,
                                'data-ignore': "true",
                                'data-li-class': "FilterListItem f1d0",
                                'data-filter': '{"f":"1","d":"0","v":"' + item.Value + '"}',
                                'data-filter-relative-deep': '0',
                                'data-parent-filter': '{"f":"0","d":"0","v":"0"}',
                                'data-parent-top-filter:': '{"f":"1","d":"0","v":"0"}',
                                //'order': 199,
                                'href': item.SEO,
                                'trk': "{'tid': '42','val': 'f1d0v" + item.Value + "}",
                                'text': item.Desc
                            });

                            designersList.append($opt);
                        }
                    });

                    if (designersList.length > 0) {
                        designersList.multipleSelect("refilter");
                    }

                    $('.moreDesignersModal').trigger('load.async.designers');

                    if (response.d && response.d.length == 0) {
                        $(".designers-no-results").show();
                    }

                    return {
                        suggestions: $.map(response.d, function (item, index) {
                            return { value: item.Desc };
                        })
                    };
                }
            });
        }

            var formMultipleBoutiques = $(".listing-select-boutique .selectFormMultiple");

            if (formMultipleBoutiques.length > 0) {
                formMultipleBoutiques.multipleSelect({
                    isopen: true,
                    filter: true,
                    selectAll: false,
                    placeholder: false,
                    placeholderText: FFAPI.translations.multipleselect_filter_placeholder_boutique,
                    noresultsText: FFAPI.translations.multipleselect_filter_noresults,
                    onOpen: function () {
                        runPlaceHolder();
                    },
                });
            }
    };

    /**
	 * Method to bind click event on a Pagitation Item (ex, next, prev, or a page number)
	 */
    FFAPI.listing.methods.bindPaginationEvents = function (QSPagingID, QSPagingView) {
        $(".listing-pagination-dropdown li, .PagingSelectorItem, #PagingSelectorItemNext, #PagingSelectorItemPrev").bind("click", function (e) {
            e.preventDefault();
            var jQelem = $(this);
            if (!jQelem.is('a')) {
                jQelem = $(this).find('a');
            }
            if (!jQelem.hasClass("active")) {
                if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract(jQelem); }
                if (jQelem.parents("#PagingContentBottom").length) {
                    var offset = 0;
                    var dvtHeading = $("#dvtHeading");
                    if (dvtHeading.length) {
                        offset = dvtHeading.offset().top;
                    }
                    $('html, body').animate({ scrollTop: offset }, 300, function () {
                        PagingItemClick(jQelem[0], '.PagingSelectorItem', QSPagingID, QSPagingView);
                    });
                } else {
                    PagingItemClick(jQelem, '.PagingSelectorItem', QSPagingID, QSPagingView);
                }
            }
            return false;
        });
        FFAPI.listing.methods.bindDropdowns();
    }

    /**
	 * Method to bind click event on Page View Item (ex, when user clicks to view 60 or 180 items per page)
	 */
    FFAPI.listing.methods.bindPagingViewItemsEvents = function (QSPagingID, QSPagingView) {
        $(".PagingViewItem").bind("click", function (e) {
            e.preventDefault();
            var jQelem = $(this);
            if (!jQelem.hasClass("active")) {
                if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract(jQelem); }
                PagingItemClick(this, '.PagingViewItem', QSPagingID, QSPagingView);
            }
            return false;
        });
    };

    FFAPI.listing.methods.bindDropdowns = function () {
        require(['forms_validations'], function () {
            $('.dropdown').dropdown({
            });

            // Setup dropdown open by default
            $('.dropdown_open').dropdown({
                menuOpen: true
            });

            // Prevent events from getting pass .dropdown
            $(".dropdown").off('click').on('click', function (e) {
                e.stopPropagation();
            });
        });
    };

    FFAPI.listing.methods.initSpinnerVars = function () {
        FFAPI.variables.waitElement = document.getElementById("wait");
        FFAPI.variables.listingItemsContainer = document.getElementById("listingItems");
        FFAPI.variables.JQlistingItemsContainer = $(FFAPI.variables.listingItemsContainer);
    };

    FFAPI.listing.methods.refreshWishlistIcons = function () {
        if (FFAPI.variables.wishlistItems == undefined) {
            return;
        }
        var listingItems = $('.listingItemWrap');
        listingItems.each(function () {
            var elem = $(this);
            var productId = elem.data('item-id');
            if (FFAPI.variables.wishlistItems[productId] === true) {
                elem.find('.listingSave').addClass('listing-wishlist-active');
            } else {
                elem.find('.listingSave').removeClass('listing-wishlist-active');
            }
        });
    };

    $(document).ready(function () {
        $('body').on('wishlistUpdated', function () {
            FFAPI.listing.methods.refreshWishlistIcons();
        });
        
        FFAPI.listing.methods.refreshWishlistIcons();
        
        FFAPI.listing.methods.init();
    });
} catch (e) {
    try {
        if (window.debug) {
            console.log(e)
        }
    } catch (ex) {
    }
}
