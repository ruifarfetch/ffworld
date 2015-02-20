/**
* This module contains global methods for the product
* @module ARTICLE
*/
/**
    article javaScript file. It contains the function to make the product work on desktop and mobile
    @deprecated pages/
    @class article.js
    **/

var carouselHero = $('.js-sliderCarousel'),
carouselArticle = $('.touch .js-sliderCarouselArticle'),
carouselChoice = $(".touch .js-sliderCarouselChoice"),
landingModules = $('#editorial-landing'),
carouselSeasons = $(".js-article-seasons"),
carouselStories = $(".touch .js-article-stories");

/*Editorial Landing page masonry Initialize*/
if ($(landingModules).length > 0) {
    require(['plu_masonry'], function (Masonry) {
        new Masonry(landingModules[0], {
            itemSelector: '.sliderSingleModule',
            isAnimated: false,
            transitionDuration: 0
        });
    });
}

var urlEncoded = encodeURIComponent(document.URL);

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


carouselHero.bxSlider({
    slideWidth: 1440,
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 1,
});



if (FFAPI.responsive.mediaQuerieXS.matches) {
    carouselArticle.bxSlider({
        minSlides: 1,
        adaptiveHeight: true,
        mode: 'fade',
        auto: true,
        pause: 10000
    });
    carouselStories.bxSlider({
        minSlides: 1,
        mode: 'fade',
        auto: true,
        pause: 10000
    });
}

carouselChoice.bxSlider({
    mode: 'fade',
    oneToOneTouch: false,
    onSliderLoad: function () {
        $(".article-choice").css("visibility", "visible");
    }
});


var slider,
largeSlider = {
    slideWidth: 360,
    minSlides: 4,
    maxSlides: 4,
    moveSlides: 1,
    pager: false
},

mediumSlider = {
    slideWidth: 360,
    minSlides: 3,
    maxSlides: 3,
    moveSlides: 1,
    pager: false
},

smallSlider = {
    slideWidth: 480,
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 1,
    controls: false
},
sliderOptions = {},
slidesCount = carouselSeasons.find('.heroContentModule').size();

function mqCarousel(slidesCount) {
    sliderOptions = {};
    if (window.innerWidth >= 1024 + 1) {
        sliderOptions = $.extend(true, {}, largeSlider);
    }
    else if (window.innerWidth < 480 + 1) {
        sliderOptions = $.extend(true, {}, smallSlider);
    }
    else if (window.innerWidth < 1024 + 1) {
        sliderOptions = $.extend(true, {}, mediumSlider);
    }

    if (slidesCount && sliderOptions.minSlides >= slidesCount) {
        sliderOptions.controls = false;
        sliderOptions.infiniteLoop = false;
    }
}

$(window).smartresize(function () {
    mqCarousel(slidesCount);
    carouselSeasons.reloadSlider(sliderOptions);
}, FFAPI.variables.resizeWindowTime);

mqCarousel(slidesCount);
/*Editorial stories carousel init*/
if ($(carouselSeasons).length > 0) {
    carouselSeasons.bxSlider(sliderOptions);
}


/* HAMMER TIME - corrects bug on landing/post pages */
$(document).ready(function () {
    /*if ($('.article-container').length > 0) {
        $('.wrapper').css({ 'padding-bottom': '296px', 'margin-bottom': '-296px' });
    }*/

    /* EDITORIAL FRAMEWORK STUFF*/    
    $('#sidemenu a').on('click', function() {
        var hash = FFAPI.methods.urlHash($(this).attr('href'));
        FFAPI.plugins.scroll.to(document.getElementById(hash));
        return false;
    });
    $("#simplehero").on('click',function(){
        $("#simplehero_container").css('display','block');
        $("#slideshowhero_container").css('display','none');
        $("#slideshowherocopy_container").css('display','none');
        $("#videohero_container").css('display','none');
    });    
    $("#slideshowhero").on('click',function(){
        $("#simplehero_container").css('display','none');
        $("#slideshowhero_container").css('display','block');
        $("#slideshowherocopy_container").css('display','none');
        $("#videohero_container").css('display','none');
    });
    $("#slideshowcopyhero").on('click',function(){
        $("#simplehero_container").css('display','none');
        $("#slideshowhero_container").css('display','none');
        $("#slideshowherocopy_container").css('display','block');
        $("#videohero_container").css('display','none');
    });
    $("#videohero").on('click',function(){
        $("#simplehero_container").css('display','none');
        $("#slideshowhero_container").css('display','none');
        $("#slideshowherocopy_container").css('display','none');
        $("#videohero_container").css('display','block');
    });
    $("#allhero").on('click',function(){
        $("#simplehero_container").css('display','block');
        $("#slideshowhero_container").css('display','block');
        $("#slideshowherocopy_container").css('display','block');
        $("#videohero_container").css('display','block');
    });
     $("#nonehero").on('click',function(){
        $("#simplehero_container").css('display','none');
        $("#slideshowhero_container").css('display','none');
        $("#slideshowherocopy_container").css('display','none');
        $("#videohero_container").css('display','none');
    });
});