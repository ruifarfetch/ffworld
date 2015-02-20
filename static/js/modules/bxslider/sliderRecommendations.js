$(document).ready(function(){

	/*Execute script on load*/
	if (window.innerWidth > 1024) {
		var slider = $('.sliderRecommendations').bxSlider({
		  	  minSlides: 6,
			  maxSlides: 6,
			  slideWidth: 240,
			  slideMargin: 2,
			  moveSlides: 1
		});
	}
	else  if (window.innerWidth < 500){
		var slider = $('.sliderRecommendations').bxSlider({
		  	  minSlides: 2,
			  maxSlides: 2,
			  slideWidth: 240,
			  slideMargin: 2,
			  moveSlides: 1
		});
	}
	else  if (window.innerWidth < 768){
		var slider = $('.sliderRecommendations').bxSlider({
		  	  minSlides: 3,
			  maxSlides: 3,
			  slideWidth: 240,
			  slideMargin: 2,
			  moveSlides: 1
		});
	}
	else  if (window.innerWidth < 1024){
		var slider = $('.sliderRecommendations').bxSlider({
		  	  minSlides: 4,
			  maxSlides: 4,
			  slideWidth: 320,
			  slideMargin: 2,
			  moveSlides: 1
		});
	}

	/*Change script according to screen size*/
	$( window ).resize(function() {
	    if (window.innerWidth > 1024) {
			slider.reloadSlider({
			  minSlides: 6,
			  maxSlides: 6,
			  slideWidth:240,
			  slideMargin: 2,
			  moveSlides: 1
	  		});
	    }
	    else  if (window.innerWidth < 500){
			slider.reloadSlider({
		    	  minSlides: 2,
				  maxSlides: 2,
				  slideWidth: 240,
				  slideMargin: 2,
				  moveSlides: 1
	            });
		}
	    else  if (window.innerWidth < 768){
	    	slider.reloadSlider({
	    	  minSlides: 3,
			  maxSlides: 3,
			  slideWidth: 240,
			  slideMargin: 2,
			  moveSlides: 1
            });
	    }
	    else  if (window.innerWidth < 1024){
	    	slider.reloadSlider({
	    	  minSlides: 4,
			  maxSlides: 4,
			  slideWidth: 240,
			  slideMargin: 2,
			  moveSlides: 1
            });
	    }
	});

});