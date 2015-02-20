try {
FFAPI.methods.product = FFAPI.methods.product || {};
FFAPI.variables.product = FFAPI.variables.product || {};
FFAPI.variables.product.productSliderSelector = ".js-sliderProductPage";
FFAPI.variables.product.productFullscreenSliderSelector = ".js-sliderProductFull";
FFAPI.variables.product.productFullscreenDivID = "productFullscreen";
FFAPI.variables.product.productFullscreenTemplateUrl = "/static/js/ajax/productFullscreen.html";

var largeSliderOptions = {
    minSlides: 3,
    maxSlides: 3,
    slideWidth: 480,
    slideMargin: 2,
    moveSlides: 1,
    pager: false
},
    mediumSliderOptions = {
        minSlides: 3,
        maxSlides: 3,
        slideWidth: 480,
        slideMargin: 2,
        moveSlides: 1,
        pager: false
    },
    smallSliderOptions = {
        minSlides: 1,
        maxSlides: 1,
        slideWidth: 180,
        slideMargin: 2,
        moveSlides: 1,
        pager: true
    };

FFAPI.methods.product.rollover = function ($slideElement) {
    "use strict";
    if (!Modernizr.touch) {
        var $zoomContainerElement = $(".zoomContainer");
        if ($zoomContainerElement.length > 0) {
            $zoomContainerElement.remove();
        }
        $slideElement.find('img').elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 750,
            responsive: true
        });
    }
};

FFAPI.methods.product.defaultSlideCallback = function ($slideElement, oldIndex, newIndex) {
    "use strict";
    $(FFAPI.variables.product.productSliderSelector).find("a")
            .removeClass('slider-active')
        .removeAttr("data-toggle")
        .removeAttr("data-target")
        .removeAttr("href");

    $slideElement.attr({
        "data-toggle": "modal",
        "data-target": ".productDetail-modalSlider",
        href: ""
    });

        if (!$slideElement.hasClass('js-video')) {
            if (FFAPI.variables.video.loaded) {
                FFAPI.methods.video.unloadVideoFromSlider();
                $('.sliderProductModule-fullscreen-btn').css('visibility', 'visible');
            }
        }

        $slideElement.addClass('slider-active');
    FFAPI.methods.product.rollover($slideElement);
};

FFAPI.methods.product.defaultSlideOptions = function (newOptions) {
    "use strict";

    var slideNumber = $(FFAPI.variables.product.productSliderSelector).find('a').length;

        if (slideNumber < 3) {
            $('.sliderProductModule').addClass('sliderProductModule-Min');
        }

        if (slideNumber <= 1) {
            $('.sliderProductModule').removeClass('sliderProductModule-Min').addClass('sliderProductModule-Single');
        }

    var options = {
        pagerCustom: newOptions.pager ? null : '.bx-pager-thumb',
        startSlide: newOptions.startSlide || 0,
        minSlides: newOptions.minSlides || 3,
        maxSlides: newOptions.maxSlides || 3,
        slideWidth: newOptions.slideWidth || 480,
        slideMargin: newOptions.slideMargin || 2,
        moveSlides: newOptions.moveSlides || 1,
        pager: newOptions.pager || true,
        controls: newOptions.controls !== undefined ? newOptions.controls : true,
        onSliderLoad: function (currentIndex) {
            //                FFAPI.methods.product.rollover($('.js-rollover').first());
                var $currentSlide = $(FFAPI.variables.product.productSliderSelector).find("a").not(".bx-clone").eq(currentIndex).addClass('slider-active');
            $currentSlide.attr({
                "data-toggle": "modal",
                "data-target": ".productDetail-modalSlider",
                href: ""
            });
            FFAPI.methods.product.rollover($currentSlide);
            $(FFAPI.variables.product.productSliderSelector).css("visibility", "visible");
        },
            onSlideBefore: function ($slideElement) {
                if ($slideElement.hasClass('js-video')) {
                    FFAPI.methods.video.getVideoFromCaroussel();
                    $('.sliderProductModule-fullscreen-btn').css('visibility', 'hidden');
                } else {
            var $zoomContainerElement = $(".zoomContainer");
            if ($zoomContainerElement.length > 0) {
                $zoomContainerElement.remove();
            }
                }
        },
        onSlideAfter: FFAPI.methods.product.defaultSlideCallback,
        onSlideNext: FFAPI.methods.product.defaultSlideCallback,
        onSlidePrev: FFAPI.methods.product.defaultSlideCallback
    };

    return options;
};

FFAPI.methods.product.createSlider = function (options) {
    "use strict";
    return $(FFAPI.variables.product.productSliderSelector).bxSlider(FFAPI.methods.product.defaultSlideOptions(options));
};

FFAPI.methods.product.reloadProductSlider = function (options) {
    "use strict";
    FFAPI.variables.product.slider.reloadSlider(FFAPI.methods.product.defaultSlideOptions(options));
        if (FFAPI.variables.video.playing) {
            FFAPI.methods.video.playCarousselVideo();
        }
};

FFAPI.methods.product.createFullscreenSlider = function () {
    "use strict";

    var options = {};
    if (window.innerWidth < 767) {
        options = {
            pager: true
        };

        if (Modernizr.touch) {
            options.controls = false;
        }
        $('.bx-pager-thumbFull').hide();
    }

    options.pagerCustom = options.pager ? null : '.bx-pager-thumbFull';
        var currentSlideIndex = FFAPI.variables.product.slider.getCurrentSlide() || 0;
        if (currentSlideIndex != 0) {
            if ($('.js-video', FFAPI.variables.product.slider).length > 0) {
                currentSlideIndex--;
            }
        }
        options.startSlide = currentSlideIndex;

    FFAPI.variables.product.sliderFullScreen = $(FFAPI.variables.product.productFullscreenSliderSelector).bxSlider(options);
};

FFAPI.methods.product.lockButtonAction = function () {
    "use strict";
    $("#divWishlist").unbind("click").bind("click", function (e) { e.preventDefault(); return false; });
};

FFAPI.methods.product.unlockButtonAction = function () {
    "use strict";
    $("#divWishlist").unbind("click");
};

FFAPI.methods.product.onAddToWishlist = function () {
    FFAPI.methods.product.unlockButtonAction();
    FFAPI.methods.header.needRefreshHeaderTab(2);

    //fire the add to wishlist event
    var productData = { id: window.universal_variable.product.id, unit_price: window.universal_variable.product.unit_price, quantity: 1 };
    $(document).trigger('WishListUpdated', productData);
}

FFAPI.methods.product.createProductSizesDropdown = function () {
    ///Validate the form
    require(['forms_validations'], function () {
        $('.customdropdown').dropdown({
            onItemClick: function (e) {
                e.preventDefault();
                var jQThis = $(this);
                    var sizeSelected = jQThis.find(".sizeposition").val();
                    var sizeDescription = jQThis.find(".sizedesc").val();

                $("#spanSelectedSizeText").html(
                        (sizeSelected != undefined && sizeSelected == 17 ? '' : FFAPI.translations.size + ' ') +
                        jQThis.find("span:eq(0)").html() + ' ' +
                    FFAPI.translations.selected);

                $("#hiddenSize").val(sizeSelected);
                $("#hiddenSizeDesc").val(sizeDescription);

                var btn = $("#btnAddToWishlist");
                    var href = btn.attr("data-ajax-url");

                var regex = "(&sizeSelected=.*)";
                var matches = href.match(regex);
                if (matches != null && matches.length > 0) {
                        btn.attr("data-ajax-url", href.replace(matches[0], "&sizeSelected=" + sizeSelected));
                }
                else {
                        btn.attr("data-ajax-url", href + "&sizeSelected=" + sizeSelected);
                }
            }
        });
    });
};

FFAPI.methods.product.createProductSizesUnavailableDropdown = function () {
    require(['forms_validations'], function () {
        $('.sizeUnavailableDropdown').dropdown({
            onItemClick: function (e) {
                e.preventDefault();
                $("#sizeUnavailableValue").val($(this).attr('data-size-pos'));
            }
        });
    });
};

FFAPI.methods.product.checkOneSizeOnly = function () {
    var drop = $("#divSizesInformation ul.productDetailModule-selectSize");

    var onesize = drop.find("[data-sizeid='OS']");
    if (onesize.length > 0 && drop.find("li").length == 1) {
        if (onesize.length > 1) {
            onesize = onesize.filter("[data-store-id='" + window.universal_variable.product.storeId + "']");
        }
        onesize.trigger("click");
    }
};

require(['essentials'], function () {
    FFAPI.methods.product.checkOneSizeOnly();
});

FFAPI.methods.product.AddToCartTrack = function () {
    // Track add to cart for certona

    try {
        window.resx = new Object();

        resx.appid = "Farfetch01";
        // Check language to send a different application id
        if (FFAPI && FFAPI.variables && FFAPI.variables.lang) {
            if (FFAPI.variables.lang === "BR") {
                resx.appid = "Farfetchbr";
            } else if (FFAPI.variables.lang === "FR") {
                resx.appid = "Farfetchfr";
            }
        }

        if (window.universal_variable.user.isLogged) {
            resx.customerid = window.universal_variable.user.user_id;
        }

        resx.event = "cart_op";
        resx.itemid = window.universal_variable.product.id;

        certonaResx.run();
    }
    catch (e) {
    }
};

FFAPI.methods.product.reloadFullscreenSlider = function () {
    "use strict";

    var options = {};
    if (window.innerWidth < 767) {
        options = {
            pager: true
        };

        if (Modernizr.touch) {
            options.controls = false;
        }
        $('.bx-pager-thumbFull').hide();
    }
    else {
        $('.bx-pager-thumbFull').show();
    }

    options.pagerCustom = options.pager ? null : '.bx-pager-thumbFull';
    options.startSlide = FFAPI.variables.product.sliderFullScreen.getCurrentSlide() || 0;

    FFAPI.variables.product.sliderFullScreen.reloadSlider(options);
};

FFAPI.methods.product.hideSizesInformation = function (data) {
    "use strict";

    if (data.indexOf("field-validation-error") > -1) return;

    $("#divSizesInformation").hide();
    $("#divWishlist").hide();

    FFAPI.methods.product.bindOrderByEmailForm();
};

FFAPI.methods.product.bindOrderByEmailForm = function () {
    "use strict";

    FFAPI.variables.formsToValidate = $('form[data-ajax=true], .form-validator');
    FFAPI.variables.formsToValidate.data("unobtrusiveValidation", null);
    FFAPI.variables.formsToValidate.data("validator", null);

    $.validator.unobtrusive.parse(document);
};

FFAPI.methods.product.getBoutiqueInfo = function () {
    "use strict";

    var elemContainer = document.getElementsByClassName('productDetail-boutique-container')[0];
    if (elemContainer && window.innerWidth >= 768) {
        elemContainer.style.display = 'block';
    }
    else if (elemContainer) {
        elemContainer.style.display = 'none';
    }
};

function mqValidation() {
    "use strict";

    var sliderOptions = {};

    if (window.innerWidth >= 1024) {
        $.extend(true, sliderOptions, largeSliderOptions);
    }
    else if (window.innerWidth <= 767) {
        $.extend(true, sliderOptions, smallSliderOptions);
        if (Modernizr.touch) {
            sliderOptions.controls = false;
        }
    }
    else {
        $.extend(true, sliderOptions, mediumSliderOptions);
    }

    return sliderOptions;
}

$(window).smartresize(function () {
    "use strict";
    var options = mqValidation();
    options.startSlide = FFAPI.variables.product.slider.getCurrentSlide() || 0;

    FFAPI.methods.product.reloadProductSlider(options);
    if ($('.productDetail-modalSlider').is(":visible")) {
        FFAPI.methods.product.reloadFullscreenSlider();
    }

    FFAPI.methods.product.getBoutiqueInfo();
}, FFAPI.variables.resizeWindowTime);

$(document).ready(function ($) {
    $("#divSizesInformation .productDetailModule-selectSize li").on('click', function (e) {
        if (!$(e.target).is("a")) {
            var anchor = $(this).find("a");
            anchor.trigger('click');
        }
    });

    $(".sizeUnavailableDropdown li").on('click', function (e) {
        if (!$(e.target).is("a")) {
            //HAMMER TO REPLACE THE DROPDOWN VALUE
            var anchor = $(this).find("a");
            var anchortext = anchor.text();
            $("span.sizeUnavailableValue").html(anchortext);
            $(this).find('a').trigger('click');
        }
    });

    require(['forms_validations'], function () {
        $("#form_validate").validate({
            onfocusout: false,
            errorClass: "form-validator_error",
            validClass: "form-validator_success"
        });
    });

    $('.productDetail-modalSlider').on('shown.bs.modal', function (e) {
        "use strict";
        var nodes = $(".sliderProduct-slide img", this);
        for (var j = 0; j <= nodes.length - 1; j++) {
            FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-fullsrc'), FFAPI.responsive.changeImageSrc);
        }
        FFAPI.methods.product.createFullscreenSlider();
    });

    $('.productDetail-modalSlider').on('hidden.bs.modal', function (e) {
        "use strict";
        FFAPI.variables.product.sliderFullScreen.destroySlider();
    });

    FFAPI.methods.product.closeSizeUnavailableModal = function (xhr, status) {
        $('div.sizeUnavailable button.modal-close-action').trigger('click');
        $('div.sizeUnavailable-modal-button button span.js-text-value').toggleClass('hide');
        $('div.sizeUnavailable-modal-button button span.js-text-value-sent').toggleClass('show');
    };

    FFAPI.methods.product.getBoutiqueInfo();
    FFAPI.methods.product.createProductSizesDropdown();
    FFAPI.methods.product.createProductSizesUnavailableDropdown();

    //CLICKSTREAM HAMMERED ACTIONS

    var body = $("body");

    body.on('click', '#btnRemoveFromWishlist', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    body.on('click', '#btnAddToWishlist', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    $(".productDetailModule-contact").on('click', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("27"); }
    });

    $("#spanSelectedSizeText").on('click', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("126"); }
    });

    body.on('click', '.sliderProductModule-fullscreen-container a', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("234"); }
    });

    body.on('click', '.sliderProductModule .bx-prev', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("235"); }
    });

    body.on('click', '.sliderProductModule .bx-next', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("236"); }
    });

    body.on('click', '.zoomContainer', function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("24"); }
    });

    FFAPI.methods.product.sendSizeUnavailableRequest = function () {
        $('div.sizeUnavailable-modal-button button span.js-text-value').toggleClass('hide');
        $('div.sizeUnavailable-modal-button button span.js-text-value-sent').toggleClass('show');

        if (typeof (_fftrkobj) !== 'undefined') {
            _fftrkobj.parse('80');
        }
    }

    FFAPI.methods.product.FollowBoutique = function (followId, followType) {
        if (followType == 1) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.track({ "tid": "222", "val": followId });
            }
        }

        if (followType == 2) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.track({ "tid": "221", "val": followId });
            }
        }
    };

    FFAPI.methods.product.FollowDesigner = function (followId, followType) {
        if (followType == 1) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.track({ "tid": "232", "val": followId });
            }
        }

        if (followType == 2) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.track({ "tid": "231", "val": followId });
            }
        }
    };

    var options = mqValidation();
    FFAPI.variables.product.slider = FFAPI.methods.product.createSlider(options);
});
} catch (e) {
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}