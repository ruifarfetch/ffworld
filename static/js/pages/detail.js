/**
 * This module contains global methods for the listing
 * @module LANDING
 */
/**
 Landong page javaScript file. It contains the function to make the listing work on desktop and mobile
 @deprecated pages/
 @class landing.js
 **/

FFAPI.variables.detail = FFAPI.variables.detail || {};
FFAPI.methods.detail = FFAPI.methods.detail || {};

$(document).ready(function () {
    var urlEncoded = encodeURIComponent(document.URL);// encodeURIComponent('http://www.farfetch.com/pt/shopping/men/alexander-mcqueen-lace-panel-shirt-item-10659238.aspx');//

    function socialShare(elem, url) {
        $(elem).on('click', function () {
            window.open(url, 'share', 'top=(screen.height / 2) - (350 / 2), left=(screen.width / 2) - (520 / 2), width=520, height=350');
        });
    }

    socialShare('.displayFacebook', 'https://www.facebook.com/sharer/sharer.php?u=' + urlEncoded);
    socialShare('.displayTwitter', 'http://twitter.com/share?url=' + urlEncoded);
    socialShare('.displayGoogle', 'https://plus.google.com/share?url=' + urlEncoded);
    socialShare('.displayPinterest', 'http://pinterest.com/pin/create/button/?url=' + urlEncoded
	+ '&amp;media=' + encodeURIComponent($('head meta[property="og:image"]').attr('content'))
	+ '&amp;description=' + encodeURIComponent($('head meta[property="og:description"]').attr('content')));
    socialShare('.displayWeibo', 'http://service.weibo.com/share/share.php?url=' + urlEncoded);

    $('.no-touch .sliderTabs-slide').rollover({});

    tooltips();

    require(['essentials'], function () {

        //Variables
        FFAPI.variables.detail.slider = document.getElementsByClassName('sliderProductModule')[0];
        FFAPI.variables.detail.prevSliderButton = FFAPI.variables.detail.slider.getElementsByClassName('bx-prev')[0];
        FFAPI.variables.detail.nextSliderButton = FFAPI.variables.detail.slider.getElementsByClassName('bx-next')[0];

        //Function to use the product slider with left and right arrow keys
        window.onkeydown = function (e) {
            e = e || window.event;
            switch (e.keyCode) {
                case FFAPI.keycode.left_arrow:
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("330"); }
                    FFAPI.variables.product.slider.goToPrevSlide();
                    break;
                case FFAPI.keycode.right_arrow:
                    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("331"); }
                    FFAPI.variables.product.slider.goToNextSlide();
                    break;
                default:
                    return;
            }
        };

        //Function to go to the clicked slide
        FFAPI.methods.detail.slideClick = function () {
            var position = this.getAttribute('data-itemImage');
            if (!$(this).hasClass('slider-active')) {
                if (typeof (_fftrkobj) !== "undefined") {
                    _fftrkobj.track({ "tid": "332", "val": position });
                }
                FFAPI.variables.product.slider.goToSlide(position);
            }
        };

        //adds click event to all slides
        $('.sliderProductModule').on('click', '.sliderProduct-slide', FFAPI.methods.detail.slideClick);
    });
});

$('.js-input-text-clear').on("click", function () {
    $(this).parent().find('input').val("").focus();
    $(this).parent().find('.js-input-text-clear').addClass('hide');
});

/* Help Iframe - Add src on click */
var productContactIcon = $(".productDetailModule-contact-listItem-icon"),
productContactIframe = $(".helpModal").find("iframe");
productContactIcon.click(function () {
    productContactIframe.attr("src", productContactIframe.attr("data-url"));
});

// Add Clear to input
$('.emailInputNotify .input_black').on('input', function (e) {
    var checkinput_hasvalue = false;

    $(this).closest('div').find('.input_black').each(function (i, e) {
        if (e.value) {
            checkinput_hasvalue = true;
            return false;
        }
    });

    if (checkinput_hasvalue) {
        $(this).parent().find('.js-input-text-clear').removeClass('hide');
    } else {
        $(this).parent().find('.js-input-text-clear').addClass('hide');
    }
});

$(document).ready(function() {
    /**
        Duplicates Actions In Sizes Dropdown
    **/

    var detailSizeDropdown = $("#detailSizeDropdown");

    //Size not available in dropdown clicks on the existing "size unavailable" link
    $(".js-product-selecSize-sizeNotAvailable").on('mouseup', function (event) {
        $(".size-unavailable").trigger("click");
    });

    //sizes available only on other boutiques, shows
    $(".js-product-selecSize-dropdown-otherStoreAvailable").on('click', function (event) {
        var jQThis = $(this);
        var sizePosition = jQThis.data("sizepos");

        if (!sizePosition) {
            return;
        }

        var itemsToShow = detailSizeDropdown.find(".js-product-selecSize-fromNewBoutique-Info." + sizePosition);
        itemsToShow.removeClass("hide");

        var itemsToHide = detailSizeDropdown.find("li").not(itemsToShow);
        itemsToHide.addClass("hide");

        showDropDown();
    });

    //back button
    $(".js-product-selecSize-fromNewBoutique-Info-back, .js-product-selecSize-fromNewBoutique-Info-back span").on('click', function (event) {
        detailSizeDropdown.find("li.js-product-selecSize-fromNewBoutique-Info").addClass("hide");
        detailSizeDropdown.find("li:not(.js-product-selecSize-fromNewBoutique-Info)").removeClass("hide");

        showDropDown();

        event.stopPropagation();
    });
    $(".js-product-selecSize-fromNewBoutique-Header").on("mouseup", function () {
        event.stopPropagation();
    });

    function showDropDown() {
        if (!detailSizeDropdown.is(":visible")) {
            $(".sizedropdown").trigger("mouseup");
        }
    }

    // Follow buttons
    FFAPI.follow = {
        events: {
            'click': { 'c': 'follow', 'n': 'following' },
            'mouseenter': { 'c': 'following', 'n': 'unfollow' },
            'mouseleave': { 'c': 'unfollow', 'n': 'following' },
            'unfollowclick': { 'c': 'unfollow', 'n': 'follow' }
        },

        start: function() {
            var buttons = document.querySelectorAll('.global-button-a.js-follow');
            for (var i = 0; i < buttons.length; i++) {
                this.bind(buttons[i]);
                $(buttons[i]).on('click', this.handler);
            }
        },

        bind: function(el) {
            if(FFAPI.methods.hasClass(el, 'follow')) {
                $(el).off('mouseenter', this.handler).off('mouseleave', this.handler).tipsy('enable');
            } 

            if(FFAPI.methods.hasClass(el, 'following')) {
                $(el).on('mouseenter', this.handler).on('mouseleave', this.handler).tipsy('disable');
            }
        },

        handler: function(e) {
            var evt = e ? e:window.event;
            var evttype = evt.type;
            var issue;

            if(evttype === 'click' && !FFAPI.methods.hasClass(this, 'follow')) {
                evttype = 'unfollowclick';
                issue = FFAPI.follow.events[evttype]['c'];
            } else {
                issue = FFAPI.follow.events[evttype]['n'];
            }

            var span = this.querySelectorAll('span')[0];
            var text = this.getAttribute('data-' + FFAPI.follow.events[evttype]['n']);

            if(text) { span.textContent = text; }

            FFAPI.methods.removeClass(this, FFAPI.follow.events[evttype]['c']);
            FFAPI.methods.addClass(this, FFAPI.follow.events[evttype]['n']);

            FFAPI.follow[evt.type](this, issue);

            // Prevents default action
            if (evt.preventDefault) evt.preventDefault();
            evt.returnValue = false;
            return false;
        },

        click: function(tip, issue) {
            this.bind(tip);
        },

        mouseenter: function(tip, issue) {
        },

        mouseleave: function(tip, issue) {
        }
    };

    FFAPI.follow.start();
});