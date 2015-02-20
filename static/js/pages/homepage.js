/**
* This module contains global methods for the homepage
* @module HOMEPAGE
*/
/**
    Homepahe javaScript file. It contains the function to make the homepage work on desktop and mobile
    @deprecated pages/
    @class homepage.js
    **/

/*Variables and methods of homepage*/
FFAPI.variables.homepage = FFAPI.variables.homepage || {};
FFAPI.methods.homepage = FFAPI.methods.homepage || {};

/**
* FFAPI variable of the carousel on the homepage
* <b><i>FFAPI.variables.homepage.carouselHero = $('.js-sliderCarousel');<br /></i></b>
* @property FFAPI.variables.homepage.carouselHero
* @type Object
*/
FFAPI.variables.homepage.carouselHero = $('.js-sliderCarousel');
/**
* FFAPI variable of the homepage BXSlider - only defined on the function if necessary
* <b><i>FFAPI.variables.homepage.homepageBxSlider = '';<br /></i></b>
* @property FFAPI.variables.homepage.homepageBxSlider
* @type Object
*/
FFAPI.variables.homepage.homepageBxSlider = '';
/**
* FFAPI variable of the length of the globalPos
* <b><i>FFAPI.variables.homepage.globalPosLength = document.getElementsByClassName('global_pos').length;<br /></i></b>
* @property FFAPI.variables.homepage.globalPosLength
* @type Integer
*/
FFAPI.variables.homepage.globalPosLength = document.getElementsByClassName('global_pos').length;
/**
* FFAPI variable of the gutter height for the BXSlider
* <b><i>FFAPI.variables.homepage.gutter = 40;<br /></i></b>
* @property FFAPI.variables.homepage.gutter
* @type Integer
*/
FFAPI.variables.homepage.gutter = 50;


//OTHERS
FFAPI.variables.homepage.newsletterBanner = document.getElementsByClassName('info')[0];
FFAPI.variables.homepage.newsletterBannerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.homepage.newsletterBanner);





/**
 * Start the BXSlider of the homepage
 * @method FFAPI.methods.homepage.homepageBxSliderStarter
 */
FFAPI.methods.homepage.homepageBxSliderStarter = function(){
    /// Check if it's necessary to put the pagination
    var pagerAux = true,
        infiniteLoop = true;
    if(FFAPI.variables.homepage.auxLength===1){
        pagerAux = false;
        infiniteLoop = false;
    }
    
    FFAPI.variables.homepage.homepageBxSlider = FFAPI.variables.homepage.carouselHero.bxSlider({
        mode: 'vertical',
        auto: true,
        pause: '8000',
        pager : pagerAux,
        speed: 1000,
        infiniteLoop: infiniteLoop,
        touchEnabled: false,
        
        
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            /// Remove from all the slides the class active-slide
            var aux = document.getElementsByClassName('sliderCarousel-slide');
                auxLength = aux.length;
            for (var i=0; i<auxLength;i++){
                FFAPI.methods.removeClass(aux[i],'active-slide');
            }
            /// Define this current slide with the activeClass
            ///$('.sliderCarousel>li').eq(currentSlideHtmlObject+1).addClass('active-slide');
            ///Define the active slide
            FFAPI.methods.addClass(document.getElementsByClassName('sliderCarousel-slide')[currentSlideHtmlObject+1], 'active-slide');

        },
        onSliderLoad: function () {
            /// Define the opacity to 1
            document.getElementsByClassName('fullWidth-hero-carousel')[0].style.opacity=1;
            /// Define the active slide
            var slides = document.getElementsByClassName('sliderCarousel-slide');
            FFAPI.methods.addClass(slides[0], 'active-slide');
            /// Resize the images
            FFAPI.methods.homepage.resizeImage();

            

        }
    });

}



/**
 * Resize the image of the carousel in case it's necessary
 * @method FFAPI.methods.homepage.resizeImage
 */
FFAPI.methods.homepage.resizeImage = function (){

    /// Get the auxiliar height
    /// get the carousek of the slide
    /// get the slidercarousel image height
    var auxHeight = window.innerHeight-FFAPI.methods.getElementHeight(document.querySelectorAll('header')[0]) - FFAPI.variables.homepage.gutter,
        sliderCarouselSlide = document.getElementsByClassName('sliderCarousel-slide');
        sliderCarouselSlideLength = sliderCarouselSlide.length;

    for(var j=0;j<sliderCarouselSlideLength;j++){
        sliderCarouselSlideImgHeight = FFAPI.methods.getElementHeight(sliderCarouselSlide[j].getElementsByTagName('img')[0]);
        ///Define the height of the sliderCarousel
        sliderCarouselSlide[j].style.height = (auxHeight + FFAPI.variables.homepage.newsletterBannerHeight) + "px";
        /// If the image is less the the auxiliar height
        /// just undefine the height
        if ((sliderCarouselSlideImgHeight) < auxHeight){
            sliderCarouselSlide[j].style.height = '';
        }
    }
}




/**
 * Arrow up and arrow down on the BXSlider
 * @method FFAPI.methods.homepage.arrowKeysHandler
 */

FFAPI.methods.homepage.arrowKeysHandler = function (e) {
    /// If arrow down
    if (e.keyCode == FFAPI.keycode.down_arrow) // DOWN arrow
    {
        /// If it's not the last slider
        /// goes to the next slider
        if(FFAPI.variables.homepage.homepageBxSlider.getCurrentSlide()!==(FFAPI.variables.homepage.homepageBxSlider.getSlideCount()-1)){
            e.preventDefault();
            FFAPI.variables.homepage.homepageBxSlider.goToNextSlide();
            FFAPI.variables.homepage.homepageBxSlider.stopAuto();
            return false;
        }
    }
    /// If arrow up
    if(window.scrollY==0){
        if (e.keyCode == FFAPI.keycode.up_arrow) // UP arrow
        {
            /// If it's not the first slider
            /// goes to previous slider
            if(FFAPI.variables.homepage.homepageBxSlider.getCurrentSlide()!==0){
                e.preventDefault();
                FFAPI.variables.homepage.homepageBxSlider.goToPrevSlide();
                FFAPI.variables.homepage.homepageBxSlider.stopAuto();
                return false;
            }
        }
    }
}


/**
 * On window resize
 * @method $(window).resize(function() {
 */
$(window).resize(function() {
  FFAPI.methods.homepage.resizeImage ();
});

/// Check if it has more than a slider
var aux = document.getElementsByClassName('sliderCarousel-slide');
    FFAPI.variables.homepage.auxLength= aux.length;

if(FFAPI.variables.homepage.auxLength>1){
    /// Arrow keysHandler for the BXslider
    /// Adding the event listerner for modern browsers
    if(window.addEventListener){
        window.addEventListener("keydown", FFAPI.methods.homepage.arrowKeysHandler, false);
    }else{
        //for IE/OPERA etc
        window.onkeydown = FFAPI.methods.homepage.arrowKeysHandler;
    }
}

/// Resize the image if necessary
FFAPI.methods.homepage.resizeImage ();
/// Starting the homepageBXSlider
FFAPI.methods.homepage.homepageBxSliderStarter();

///Always check if it's not IE8
if(ffbrowser.isIE8===false){

    /// If it's a small device start the menu with click
    if (FFAPI.responsive.goneSmallQuerie.matches) {
        console.log("Gone Small Homepage");
    }
    /// If it's a small device start the menu with click listener
    FFAPI.responsive.goneSmallQuerie.addListener(function () {
        if (FFAPI.responsive.goneSmallQuerie.matches) {
            console.log("Gone Small Homepage Listener");
        }
    });

    /// If it's a big device start the menu with hover
    if (FFAPI.responsive.goneBigQuerie.matches) {
        console.log("Gone Big Homepage");
    }
    /// If it's a big device start the menu with hover listener
    FFAPI.responsive.goneBigQuerie.addListener(function () {
        if (FFAPI.responsive.goneBigQuerie.matches) {
           console.log("Gone Big Homepage Listener");
        }
    });

}
