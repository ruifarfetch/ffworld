FFAPI.variables.product = FFAPI.variables.product || {};
FFAPI.variables.sliderNamesFinal = [];

// HTML TEMPLATES
FFAPI.variables.product.productTemplateCarousel = "/static/js/ajax/productcarousel.html";
FFAPI.variables.product.productTemplateCarouselWithCloseButton = "/static/js/ajax/productcarousel.html";

// AJAX URL
FFAPI.variables.product.recentlyViewedItemsAjaxUrl = "/common/GetRecentlyViewedCarousel";

// SELECTORS
FFAPI.variables.product.tabContainerId = "tabs";
FFAPI.variables.product.tabAnchorRecommendationsId = "tab-recommendations";
FFAPI.variables.product.tabAnchorRecentViewedId = "tab-recentViewed";
FFAPI.variables.product.tabDivRecommendationsId = "tabs-recommendations";
FFAPI.variables.product.tabDivRecentViewedId = "tabs-recentViewedItems";
FFAPI.variables.product.sliderSelector = "js-sliderProduct";
FFAPI.variables.product.tabContainer = null;

function mqCarousel(slidesCount) {

    var slides = {
        'xl': 2,
        'md': 2,
        'sm': 2,
        'xs': 3
    };
    var $tabsParent = FFAPI.variables.product.tabContainer.parent();
    var parentCol = newCol = 12;
    var regex = $tabsParent.attr('class').match(new RegExp('col([0-9]{1,})', 'i'));
    var containerWidth = $tabsParent.width() * 1.0;
    if(regex) { newCol = parseInt(regex[1]); }

    slides.xl = Math.ceil((newCol * 8) / parentCol);
    slides.md = Math.ceil(slides.xl * 0.75);
    slides.sm = Math.ceil(slides.xl * 0.5);
    // Set minimum of 2 in all formats
    for(var format in slides) { if(slides[format] < slides.xs) slides[format] = slides.xs }

    var slider,
        largeSlider = {
            slideWidth: (containerWidth / slides.xl) - 1,
            minSlides: slides.xl,
            maxSlides: slides.xl,
            moveSlides: slides.xl,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        mediumSlider = {
            slideWidth: (containerWidth / slides.md) - 1,
            minSlides: slides.md,
            maxSlides: slides.md,
            moveSlides: slides.md,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        smallSlider = {
            slideWidth: (containerWidth / slides.sm) - 1,
            minSlides: slides.sm,
            maxSlides: slides.sm,
            moveSlides: slides.sm,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        xsmallSlider = {
            slideWidth: (containerWidth / slides.xs) - 1,
            minSlides: slides.xs,
            maxSlides: slides.xs,
            moveSlides: slides.xs,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        };

    var sliderOptions = {};

    if (window.innerWidth >= 1024 + 1) {
        sliderOptions = $.extend(true, {}, largeSlider);
    }
    else if (window.innerWidth < 500) {
        sliderOptions = $.extend(true, {}, xsmallSlider);
    }
    else if (window.innerWidth < 768 + 1) {
        sliderOptions = $.extend(true, {}, smallSlider);
    }
    else if (window.innerWidth < 1024 + 1) {
        sliderOptions = $.extend(true, {}, mediumSlider);
    }

    if (slidesCount && sliderOptions.minSlides >= slidesCount) {
        sliderOptions.controls = false;
        sliderOptions.infiniteLoop = false;
    }
    
    return sliderOptions;
}

FFAPI.methods.bindBxSlider = function (tabContent) {
    var slider = tabContent.find(('.' + FFAPI.variables.product.sliderSelector));
    var sliderId = tabContent.attr('id');
    var slidesCount = slider.find('li').size();
    var sliderOptions = mqCarousel(slidesCount);
    
    FFAPI.methods.setExtraOptions(sliderOptions);
    
    FFAPI.variables.sliderNamesFinal[sliderId] = slider.bxSlider(sliderOptions);
};

FFAPI.methods.reloadBxSlider = function (tabContent) {
    var slider = tabContent.find(('.' + FFAPI.variables.product.sliderSelector));
    var sliderId = tabContent.attr('id');
    var slidesCount = slider.find('li:not(.bx-clone)').size();
    var sliderOptions = mqCarousel(slidesCount);

    FFAPI.methods.setExtraOptions(sliderOptions);

    if (FFAPI.variables.sliderNamesFinal[sliderId] != undefined && FFAPI.variables.sliderNamesFinal[sliderId].length > 0) {
        FFAPI.variables.sliderNamesFinal[sliderId].reloadSlider(sliderOptions);
    }
};

FFAPI.methods.setExtraOptions = function (sliderOptions) {
    sliderOptions.onSlidePrev = function ($slideElement, oldIndex, newIndex) {
        if (typeof (_fftrkobj) !== 'undefined') {
            _fftrkobj.parse('290');
        }
    };
    sliderOptions.onSlideNext = function ($slideElement, oldIndex, newIndex) {
        if (typeof (_fftrkobj) !== 'undefined') {
            _fftrkobj.parse('290');
        }
    };
};

// Renders a product's list into a carousel
FFAPI.methods.renderProductCarousel = function (templateUrl, dataJson, targetDiv) {
    $.get(templateUrl, function (template) {
        var template = Hogan.compile(template);
        var output = template.render(dataJson).replace(/^\s*/mg, '');

        tgDiv.empty();
        tgDiv.html(output);

        FFAPI.methods.bindBxSlider(tgDiv);
        FFAPI.methods.addBlankLinks();
    });
};

FFAPI.methods.removeRecentlyViewedItem = function (btn) {
    $(btn).closest(".sliderTabs-slide").remove();

    var divRecently = $("#" + FFAPI.variables.product.tabDivRecentViewedId);
    if (divRecently.length > 0) {
        if ($(divRecently).find("li.sliderTabs-slide").length > 0) {
            FFAPI.methods.bindBxSlider(divRecently);
        } else {
            var htmlToReplace = '<div class="baseline col12 col-md-12 col-sm-12 col-xs-12"> <h5 class="heading-regular">' + FFAPI.translations.noRecentlyViewedItems + '</h5></div>';
            divRecently.html(htmlToReplace);
        }
    }
}

// Loads recently viewed items
FFAPI.methods.loadRecentlyViewedItems = function (callback) {

    var divRecently = $("#" + FFAPI.variables.product.tabDivRecentViewedId);
    $.ajax({
        type: window.location.protocol == "https:" ? "POST" : "GET",
        //url: window.universal_variable.page.subfolder + "/common/GetRecentlyViewedCarousel",
        url: requireMainFolder + jsFolderMain + 'ajax/recent.html',
        cache: false,
        success: function (resp, textStatus, jqXHR) {
            // FFAPI.methods.renderProductCarousel(FFAPI.variables.product.productTemplateCarousel,
            //                                     resp,
            //                                     divRecently);
            divRecently.html(resp);
            FFAPI.methods.bindBxSlider(divRecently);
            FFAPI.methods.addBlankLinks();

            divRecently.data('tabsloaded', true);

            if (callback) { callback(); }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var htmlToReplace = '<div class="baseline col12 col-md-12 col-sm-12 col-xs-12"><h5 class="heading-regular">' + FFAPI.translations.noRecentlyViewedItems + '</h5></div>';
            divRecently.html(htmlToReplace);
            divRecently.data('tabsloaded', true);
        }
    });
};

// Loads recommendations from Certona
// FFAPI.methods.loadRecommendations = function (templateUrl, recommendationsJSON, targetDiv, callback) {

//     var dataObj = recommendationsJSON;
//     if (typeof (dataObj) !== "undefined" && dataObj != null
//         && typeof (dataObj.resonance) !== "undefined" && typeof (dataObj.resonance.schemes[0]) !== "undefined" && dataObj.resonance.schemes[0] != null
//         && typeof (dataObj.resonance.schemes[0].items[0]) !== "undefined" && dataObj.resonance.schemes[0].items[0] != null
//         && typeof (dataObj.resonance.schemes[0].items[0].Id) !== "undefined" && dataObj.resonance.schemes[0].items[0].Id != null) {

//         var data = dataObj.resonance.schemes[0];

//         for (var a in data.items) {
//             data.items[a].Detailurl = window.universal_variable.page.subfolder + data.items[a].Detailurl;
//         }
            
//         var tgDiv = $("#" + targetDiv);
//         FFAPI.methods.renderProductCarousel(templateUrl, data, tgDiv);
//         /*  Add Clickstream trk attributes to recommendations */
//         if (window.universal_variable && window.universal_variable.page && window.universal_variable.page.pageId === "basket") {
//             tgDiv.find('ul a').attr('trk', '138');
//         } else if (window.universal_variable && window.universal_variable.page && window.universal_variable.page.pageId === "transaction") {
//             tgDiv.find('ul a').attr('trk', '193');
//         }
//         
//         tgDiv.data('tabsloaded', true);

//         if (callback) { callback(); }
//     }
// };

/* FOR UI GITHUB BRANCH PURPOSE */
FFAPI.methods.loadRecommendations = function (callback) {

    var divRecommendations = $("#" + FFAPI.variables.product.tabDivRecommendationsId);

    $.ajax({
        type: window.location.protocol == "https:" ? "POST" : "GET",
        url: requireMainFolder + jsFolderMain + 'ajax/recommendations.html',
        cache: false,
        success: function (resp, textStatus, jqXHR) {
            divRecommendations.html(resp);
            FFAPI.methods.bindBxSlider(divRecommendations);
            FFAPI.methods.addBlankLinks();

            divRecommendations.data('tabsloaded', true);

            if (callback) { callback(); }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            divRecommendations.data('tabsloaded', true);
        }
    });
};
/* FOR UI GITHUB BRANCH PURPOSE */

// Initialize the recommendations container
FFAPI.methods.initRecommendations = function (certonaDomWaitingTime) {
    var CertonaDOMWaitingTimeInMs = certonaDomWaitingTime, CertonaTimeout, CertonaInterval;

    checkForRecommendations = function () {
        var doc = $(document),
            data = doc.data("recommendations");
        if (typeof (data) === "boolean" && data === false) {
            recommendationsOffAction();
        } else if (typeof (data) === "object") {
            clearTimeout(FFAPI.variables.CertonaInterval);
            clearTimeout(FFAPI.variables.CertonaTimeout);
            FFAPI.variables.CertonaInterval = undefined;
            FFAPI.variables.CertonaTimeout = undefined;

            FFAPI.methods.loadRecommendations(FFAPI.variables.product.productTemplateCarousel,
                                                data,
                                                FFAPI.variables.product.tabDivRecommendationsId,
                                                null);
        }
    };

    recommendationsOffAction = function () {

        // stop checking, it failed already
        clearTimeout(FFAPI.variables.CertonaInterval);
        clearTimeout(FFAPI.variables.CertonaTimeout);
        FFAPI.variables.CertonaInterval = undefined;
        FFAPI.variables.CertonaTimeout = undefined;
        // recommendations off, jump to recently viewed items tab
        $('#' + FFAPI.variables.product.tabAnchorRecommendationsId).parent().hide();
        $("#" + FFAPI.variables.product.tabAnchorRecentViewedId).trigger("click");
    };

    $(document).ready(function () {
        if (FFAPI.variables.CertonaInterval != undefined) {
            clearTimeout(FFAPI.variables.CertonaInterval);
            clearTimeout(FFAPI.variables.CertonaTimeout);
        }
        FFAPI.variables.CertonaInterval = setInterval(checkForRecommendations, 100);
        FFAPI.variables.CertonaTimeout = setTimeout(function () { recommendationsOffAction(); }, CertonaDOMWaitingTimeInMs);
    });
};

require(['essentials'], function () {
    $(document).ready(function () {
        tabContentRecent = $('#' + FFAPI.variables.product.tabDivRecentViewedId),
        tabContentRecommendations = $('#' + FFAPI.variables.product.tabDivRecommendationsId);

        // Set tab container node and jquery object
        var tabContainerNode = document.getElementById(FFAPI.variables.product.tabContainerId);
        if (tabContainerNode) {
            FFAPI.variables.product.tabContainer = $(tabContainerNode);

            // Set callback functions on tabs plugin
            var tabs = FFAPI.plugins.tabs.get(tabContainerNode);
            tabs.setCallback('show', function(event, item) {
                var $itemContent = $(item.content);
                if($itemContent.data("tabsloaded")) {
                    FFAPI.methods.reloadBxSlider($itemContent);
                }
            });

            $("body").on("click", "#" + FFAPI.variables.product.tabAnchorRecentViewedId, function (e) {
                if (tabContentRecent.data("tabsloaded") != true) {
                    FFAPI.methods.loadRecentlyViewedItems();
                }
            });

            /* FOR UI GITHUB BRANCH PURPOSE */
            $("body").on("click", "#" + FFAPI.variables.product.tabAnchorRecommendationsId, function (e) {
                if (tabContentRecommendations.data("tabsloaded") != true) {
                    FFAPI.methods.loadRecommendations();
                }
            });
            $("#" + FFAPI.variables.product.tabAnchorRecommendationsId).trigger("click");
            /* FOR UI GITHUB BRANCH PURPOSE */

            $(window).smartresize(function() {
                if(tabs.activeItem) {
                    var $itemContent = $(tabs.activeItem.content);
                    if($itemContent.data("tabsloaded")) {
                        FFAPI.methods.reloadBxSlider($itemContent);
                    }
                }
            }, FFAPI.variables.resizeWindowTime);
        }
    });
});