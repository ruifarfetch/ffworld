/**
* This module contains global methods for the listing
* @module LISTING
*/
FFAPI.boutiques = FFAPI.boutiques || {};
FFAPI.boutiques.methods = FFAPI.boutiques.methods || {};

require(['plu_multipleSelect', 'essentials'], function () {
    $(".boutiques-select-search .selectFormMultiple").multipleSelect({
        filter: true,
        selectAll: false,
        single: true,
        isopen: true,
        focusInput: false,
        placeholder: false,
        placeholderText: FFAPI.translations.boutiques_filter_placeholder,
        noresultsText: FFAPI.translations.boutiques_filter_noresults,
        onClick: function (item) { item.li.find('a')[0].click(); }
    });


    $(window).smartresize(function () {
        if (window.innerWidth < 768) {
            setTimeout(function () {
                $('.ms-search .input_black').focus()
            }, 400);
        }
        else {
            setTimeout(function () {
                $('.ms-search .input_black').focus()
            }, 400);
        }

    });

});

$(document).ready(function () {

    var filter_trigger = $('.listing-header-filter'),
        filter_wrapper = $('.left-filters-wrapper'),
        filters_trigger_active = 'filters-filter-active',
        filters_fixed = $('.back-to-top-filters'),
        listing_filter_wrapper = $('.listing-filter-wrapper');

    function openFilter() {
        listing_filter_wrapper.addClass('listing-filter-wrapper-open');

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

    filter_trigger.on("click", function () {
        if (FFAPI.responsive.goneSmallQuerie.matches) {
            
            if(filter_trigger.hasClass(filters_trigger_active)) { // Filter opened
                closeFilter();
            } else { // Filter closed
                openFilter();
            }
        }
    });

    //apply toogle 
    $('.boutique-filters-apply').on("click", function () {
        filter_wrapper.slideToggle(function () {
            filter_trigger.toggleClass(filters_trigger_active);
        });
    });

    require(['plu_waypoints'], function () {
        require(['plu_waypointsSticky'], function () {
            filters_fixed.waypoint('sticky');

            //sticky filters on click 
            filters_fixed.on("click", function () {
                if (FFAPI.responsive.goneSmallQuerie.matches && !filter_trigger.hasClass(filters_trigger_active)) {
                    filter_wrapper.slideDown(function () {
                        filter_trigger.toggleClass(filters_trigger_active);
                    });
                }
            });

        });
    });

    $("body").on("click", ".boutique-filter-paging a span.glyphs", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this).parent()); }
    });

});


FFAPI.boutiques.methods.RefreshBoutiques = function (data) {
    var content = $(data);
    var paginationHtml = content.closest('#boutiquesTopPag')
    var boutiquesListHtml = content.closest('#boutiquesList');
    if (paginationHtml.length > 0) {
        $('#boutiquesTopPag').replaceWith(paginationHtml);
    }
    if (boutiquesListHtml.length > 0) {
        $('#boutiquesList').replaceWith(boutiquesListHtml);
    }

    // Create dropdowns..

    FFAPI.plugins.methods.initJQueryDropdowns(content);

    //Refresh responsive images
    FFAPI.responsive.checkResponsiveImages();
}