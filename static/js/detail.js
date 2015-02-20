/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 *

/*
 *	jQuery elevateZoom 3.0.3
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	var ElevateZoom = {
			init: function( options, elem ) {
				var self = this;

				self.elem = elem;
				self.$elem = $( elem );

				self.imageSrc = self.$elem.data("zoom-image") ? self.$elem.data("zoom-image") : self.$elem.attr("src");

				self.options = $.extend( {}, $.fn.elevateZoom.options, options );

				//TINT OVERRIDE SETTINGS
				if(self.options.tint) {
					self.options.lensColour = "none", //colour of the lens background
					self.options.lensOpacity =  "1" //opacity of the lens
				}
				//INNER OVERRIDE SETTINGS
				if(self.options.zoomType == "inner") {self.options.showLens = false;}


				//Remove alt on hover

				self.$elem.parent().removeAttr('title').removeAttr('alt');

				self.zoomImage = self.imageSrc;

				self.refresh( 1 );



				//Create the image swap from the gallery 
				$('#'+self.options.gallery + ' a').click( function(e) { 

					//Set a class on the currently active gallery image
					if(self.options.galleryActiveClass){
						$('#'+self.options.gallery + ' a').removeClass(self.options.galleryActiveClass);
						$(this).addClass(self.options.galleryActiveClass);
					}
					//stop any link on the a tag from working
					e.preventDefault();

					//call the swap image function            
					if($(this).data("zoom-image")){self.zoomImagePre = $(this).data("zoom-image")}
					else{self.zoomImagePre = $(this).data("image");}
					self.swaptheimage($(this).data("image"), self.zoomImagePre);
					return false;
				});

			},

			refresh: function( length ) {
				var self = this;

				setTimeout(function() {
					self.fetch(self.imageSrc);

				}, length || self.options.refresh );
			},

			fetch: function(imgsrc) {
				//get the image
				var self = this;
				var newImg = new Image();
				newImg.onload = function() {
					//set the large image dimensions - used to calculte ratio's
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					//once image is loaded start the calls
					self.startZoom();
					self.currentImage = self.imageSrc;
					//let caller know image has been loaded
					self.options.onZoomedImageLoaded(self.$elem);
				}
				newImg.src = imgsrc; // this must be done AFTER setting onload

				return;

			},

			startZoom: function( ) {
				var self = this;
				//get dimensions of the non zoomed image
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				//activated elements
				self.isWindowActive = false;
				self.isLensActive = false;
				self.isTintActive = false;
				self.overWindow = false;    

				//CrossFade Wrappe
				if(self.options.imageCrossfade){
					self.zoomWrap = self.$elem.wrap('<div style="height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;" class="zoomWrapper" />');        
					self.$elem.css('position', 'absolute'); 
				}

				self.zoomLock = 1;
				self.scrollingLock = false;
				self.changeBgSize = false;
				self.currentZoomLevel = self.options.zoomLevel;


				//get offset of the non zoomed image
				self.nzOffset = self.$elem.offset();
				//calculate the width ratio of the large/small image
				self.widthRatio = (self.largeWidth/self.currentZoomLevel) / self.nzWidth;
				self.heightRatio = (self.largeHeight/self.currentZoomLevel) / self.nzHeight; 


				//if window zoom        
				if(self.options.zoomType == "window") {
					self.zoomWindowStyle = "overflow: hidden;"
						+ "background-position: 0px 0px;text-align:center;"  
						+ "background-color: " + String(self.options.zoomWindowBgColour)            
						+ ";width: " + String(self.options.zoomWindowWidth) + "px;"
						+ "height: " + String(self.options.zoomWindowHeight)
						+ "px;float: left;"
						+ "background-size: "+ self.largeWidth/self.currentZoomLevel+ "px " +self.largeHeight/self.currentZoomLevel + "px;"
						+ "display: none;z-index:100;"
						+ "border: " + String(self.options.borderSize) 
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    


				//if inner  zoom    
				if(self.options.zoomType == "inner") {
					//has a border been put on the image? Lets cater for this

					var borderWidth = self.$elem.css("border-left-width");

					self.zoomWindowStyle = "overflow: hidden;"
						+ "margin-left: " + String(borderWidth) + ";" 
						+ "margin-top: " + String(borderWidth) + ";"         
						+ "background-position: 0px 0px;"
						+ "width: " + String(self.nzWidth) + "px;"
						+ "height: " + String(self.nzHeight)
						+ "px;float: left;"
						+ "display: none;"
						+ "cursor:"+(self.options.cursor)+";"
						+ "px solid " + self.options.borderColour 
						+ ";background-repeat: no-repeat;"
						+ "position: absolute;";
				}    



				//lens style for window zoom
				if(self.options.zoomType == "window") {


					// adjust images less than the window height

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;              
					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}
					if(self.largeWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					self.lensStyle = "background-position: 0px 0px;width: " + String((self.options.zoomWindowWidth)/self.widthRatio) + "px;height: " + String((self.options.zoomWindowHeight)/self.heightRatio)
					+ "px;float: right;display: none;"
					+ "overflow: hidden;"
					+ "z-index: 999;"   
					+ "-webkit-transform: translateZ(0);"               
					+ "opacity:"+(self.options.lensOpacity)+";filter: alpha(opacity = "+(self.options.lensOpacity*100)+"); zoom:1;"
					+ "width:"+lensWidth+"px;"
					+ "height:"+lensHeight+"px;"
					+ "background-color:"+(self.options.lensColour)+";"					
					+ "cursor:"+(self.options.cursor)+";"
					+ "border: "+(self.options.lensBorderSize)+"px" +
					" solid "+(self.options.lensBorderColour)+";background-repeat: no-repeat;position: absolute;";
				} 


				//tint style
				self.tintStyle = "display: block;"
					+ "position: absolute;"
					+ "background-color: "+self.options.tintColour+";"	
					+ "filter:alpha(opacity=0);"		
					+ "opacity: 0;"	
					+ "width: " + self.nzWidth + "px;"
					+ "height: " + self.nzHeight + "px;"

					;

				//lens style for lens zoom with optional round for modern browsers
				self.lensRound = '';

				if(self.options.zoomType == "lens") {

					self.lensStyle = "background-position: 0px 0px;"
						+ "float: left;display: none;"
						+ "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour+";"
						+ "width:"+ String(self.options.lensSize) +"px;"
						+ "height:"+ String(self.options.lensSize)+"px;"
						+ "background-repeat: no-repeat;position: absolute;";


				}


				//does not round in all browsers
				if(self.options.lensShape == "round") {
					self.lensRound = "border-top-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-top-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;"
					+ "border-bottom-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;";

				}

				//create the div's                                                + ""
				//self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});

				self.zoomContainer = $('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:'+self.nzOffset.left+'px;top:'+self.nzOffset.top+'px;height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;"></div>');
				$('body').append(self.zoomContainer);	


				//this will add overflow hidden and contrain the lens on lens mode       
				if(self.options.containLensZoom && self.options.zoomType == "lens"){
					self.zoomContainer.css("overflow", "hidden");
				}
				if(self.options.zoomType != "inner") {
					self.zoomLens = $("<div class='zoomLens' style='" + self.lensStyle + self.lensRound +"'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});


					if(self.options.tint) {
						self.tintContainer = $('<div/>').addClass('tintContainer');	
						self.zoomTint = $("<div class='zoomTint' style='"+self.tintStyle+"'></div>");


						self.zoomLens.wrap(self.tintContainer);


						self.zoomTintcss = self.zoomLens.after(self.zoomTint);	

						//if tint enabled - set an image to show over the tint

						self.zoomTintImage = $('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: '+self.nzWidth+'px; height: '+self.nzHeight+'px;" src="'+self.imageSrc+'">')
						.appendTo(self.zoomLens)
						.click(function () {

							self.$elem.trigger('click');
						});

					}          

				}







				//create zoom window 
				if(isNaN(self.options.zoomWindowPosition)){
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo('body')
					.click(function () {
						self.$elem.trigger('click');
					});
				}else{
					self.zoomWindow = $("<div style='z-index:999;left:"+(self.windowOffsetLeft)+"px;top:"+(self.windowOffsetTop)+"px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>")
					.appendTo(self.zoomContainer)
					.click(function () {
						self.$elem.trigger('click');
					});
				}              
				self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css("width",self.options.zoomWindowWidth);
				self.zoomWindow.wrap(self.zoomWindowContainer);


				//  self.captionStyle = "text-align: left;background-color: black;color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";                                                                                                                                                                                                                                          
				// self.zoomCaption = $('<div class="elevatezoom-caption" style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + self.imageSrc + "')" }); 
				}
				/*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
				//touch events
				self.$elem.bind('touchmove', function(e){    
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch);

				});  
				self.zoomContainer.bind('touchmove', function(e){ 
					if(self.options.zoomType == "inner") {
						self.showHideWindow("show");

					}
					e.preventDefault();
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
					self.setPosition(touch); 

				});  	
				self.zoomContainer.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	

				self.$elem.bind('touchend', function(e){ 
					self.showHideWindow("hide");
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
				});  	
				if(self.options.showLens) {
					self.zoomLens.bind('touchmove', function(e){ 

						e.preventDefault();
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];  
						self.setPosition(touch); 
					});    


					self.zoomLens.bind('touchend', function(e){ 
						self.showHideWindow("hide");
						if(self.options.showLens) {self.showHideLens("hide");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("hide");}
					});  
				}
				//Needed to work in IE
				self.$elem.bind('mousemove', function(e){   
					if(self.overWindow == false){self.setElements("show");}
					//make sure on orientation change the setposition is not fired
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    

				});  	

				self.zoomContainer.bind('mousemove', function(e){ 

					if(self.overWindow == false){self.setElements("show");} 

					//make sure on orientation change the setposition is not fired 
					if(self.lastX !== e.clientX || self.lastY !== e.clientY){
						self.setPosition(e);
						self.currentLoc = e;
					}   
					self.lastX = e.clientX;
					self.lastY = e.clientY;    
				});  	
				if(self.options.zoomType != "inner") {
					self.zoomLens.bind('mousemove', function(e){      
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});
				}
				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.bind('mousemove', function(e){ 
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.bind('mousemove', function(e) {
						//self.overWindow = true;
						//make sure on orientation change the setposition is not fired
						if(self.lastX !== e.clientX || self.lastY !== e.clientY){
							self.setPosition(e);
							self.currentLoc = e;
						}   
						self.lastX = e.clientX;
						self.lastY = e.clientY;    
					});

				}


				//  lensFadeOut: 500,  zoomTintFadeIn
				self.zoomContainer.add(self.$elem).mouseenter(function(){

					if(self.overWindow == false){self.setElements("show");} 


				}).mouseleave(function(){
					if(!self.scrollLock){
						self.setElements("hide");
					}
				});
				//end ove image





				if(self.options.zoomType != "inner") {
					self.zoomWindow.mouseenter(function(){
						self.overWindow = true;   
						self.setElements("hide");                  
					}).mouseleave(function(){

						self.overWindow = false;
					});
				}
				//end ove image



//				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);

				//      $(this).empty();    
				//    return false;

				//fix for initial zoom setting
				if (self.options.zoomLevel != 1){
					//	self.changeZoomLevel(self.currentZoomLevel);
				}
				//set the min zoomlevel
				if(self.options.minZoomLevel){
					self.minZoomLevel = self.options.minZoomLevel;
				}
				else{
					self.minZoomLevel = self.options.scrollZoomIncrement * 2;
				}


				if(self.options.scrollZoom){


					self.zoomContainer.add(self.$elem).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){


//						in IE there is issue with firing of mouseleave - So check whether still scrolling
//						and on mouseleave check if scrolllock          
						self.scrollLock = true;
						clearTimeout($.data(this, 'timer'));
						$.data(this, 'timer', setTimeout(function() {
							self.scrollLock = false;
							//do something
						}, 250));

						var theEvent = e.originalEvent.wheelDelta || e.originalEvent.detail*-1


						//this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
						//   e.preventDefault();


						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();


						if(theEvent /120 > 0) {
							//scrolling up
							if(self.currentZoomLevel >= self.minZoomLevel){ 
								self.changeZoomLevel(self.currentZoomLevel-self.options.scrollZoomIncrement);        
							}

						}
						else{
							//scrolling down


							if(self.options.maxZoomLevel){
								if(self.currentZoomLevel <= self.options.maxZoomLevel){           
									self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
								}
							}
							else{
								//andy 

								self.changeZoomLevel(parseFloat(self.currentZoomLevel)+self.options.scrollZoomIncrement);
							}

						}
						return false;
					});
				}


			},
			setElements: function(type) {
				var self = this;
        if(!self.options.zoomEnabled){return false;}
				if(type=="show"){
					if(self.isWindowSet){
						if(self.options.zoomType == "inner") {self.showHideWindow("show");}
						if(self.options.zoomType == "window") {self.showHideWindow("show");}
						if(self.options.showLens) {self.showHideLens("show");}
						if(self.options.tint && self.options.zoomType != "inner") {self.showHideTint("show");
						}
					}
				}

				if(type=="hide"){
					if(self.options.zoomType == "window") {self.showHideWindow("hide");}
					if(!self.options.tint) {self.showHideWindow("hide");}
					if(self.options.showLens) {self.showHideLens("hide");}
					if(self.options.tint) {	self.showHideTint("hide");}
				}   
			},
			setPosition: function(e) {
      
				var self = this;
        
        if(!self.options.zoomEnabled){return false;}

				//recaclc offset each time in case the image moves
				//this can be caused by other on page elements
				self.nzHeight = self.$elem.height();
				self.nzWidth = self.$elem.width();
				self.nzOffset = self.$elem.offset();

				if(self.options.tint && self.options.zoomType != "inner") {
					self.zoomTint.css({ top: 0});
					self.zoomTint.css({ left: 0});
				}
				//set responsive       
				//will checking if the image needs changing before running this code work faster?
				if(self.options.responsive && !self.options.scrollZoom){
					if(self.options.showLens){ 
						if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
							lensHeight = self.nzHeight;              
						}
						else{
							lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
						}
						if(self.largeWidth < self.options.zoomWindowWidth){
							lensWidth = self.nzWidth;
						}       
						else{
							lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
						}
						self.widthRatio = self.largeWidth / self.nzWidth;
						self.heightRatio = self.largeHeight / self.nzHeight;        
						if(self.options.zoomType != "lens") {


							//possibly dont need to keep recalcalculating
							//if the lens is heigher than the image, then set lens size to image size
							if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
								lensHeight = self.nzHeight;  

							}
							else{
								lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
							}

							if(self.options.zoomWindowWidth < self.options.zoomWindowWidth){
								lensWidth = self.nzWidth;
							}       
							else{
								lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
							}            

							self.zoomLens.css('width', lensWidth);    
							self.zoomLens.css('height', lensHeight); 

							if(self.options.tint){    
								self.zoomTintImage.css('width', self.nzWidth);    
								self.zoomTintImage.css('height', self.nzHeight); 
							}

						}                     
						if(self.options.zoomType == "lens") {  

							self.zoomLens.css({ width: String(self.options.lensSize) + 'px', height: String(self.options.lensSize) + 'px' })      


						}        
						//end responsive image change
					}
				}

				//container fix
				self.zoomContainer.css({ top: self.nzOffset.top});
				self.zoomContainer.css({ left: self.nzOffset.left});
				self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
				self.mouseTop = parseInt(e.pageY - self.nzOffset.top);
				//calculate the Location of the Lens

				//calculate the bound regions - but only if zoom window
				if(self.options.zoomType == "window") {
					self.Etoppos = (self.mouseTop < (self.zoomLens.height()/2));
					self.Eboppos = (self.mouseTop > self.nzHeight - (self.zoomLens.height()/2)-(self.options.lensBorderSize*2));
					self.Eloppos = (self.mouseLeft < 0+((self.zoomLens.width()/2))); 
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.zoomLens.width()/2)-(self.options.lensBorderSize*2)));  
				}
				//calculate the bound regions - but only for inner zoom
				if(self.options.zoomType == "inner"){ 
					self.Etoppos = (self.mouseTop < ((self.nzHeight/2)/self.heightRatio) );
					self.Eboppos = (self.mouseTop > (self.nzHeight - ((self.nzHeight/2)/self.heightRatio)));
					self.Eloppos = (self.mouseLeft < 0+(((self.nzWidth/2)/self.widthRatio)));
					self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.nzWidth/2)/self.widthRatio-(self.options.lensBorderSize*2)));  
				}

				// if the mouse position of the slider is one of the outerbounds, then hide  window and lens
				if (self.mouseLeft <= 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight ) {				          
					self.setElements("hide");
					return;
				}
				//else continue with operations
				else {


					//lens options
					if(self.options.showLens) {
						//		self.showHideLens("show");
						//set background position of lens
						self.lensLeftPos = String(self.mouseLeft - self.zoomLens.width() / 2);
						self.lensTopPos = String(self.mouseTop - self.zoomLens.height() / 2);


					}
					//adjust the background position if the mouse is in one of the outer regions 

					//Top region
					if(self.Etoppos){
						self.lensTopPos = 0;
					}
					//Left Region
					if(self.Eloppos){
						self.windowLeftPos = 0;
						self.lensLeftPos = 0;
						self.tintpos=0;
					}     
					//Set bottom and right region for window mode
					if(self.options.zoomType == "window") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( (self.nzHeight)-self.zoomLens.height()-(self.options.lensBorderSize*2), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.zoomLens.width())-(self.options.lensBorderSize*2));
						}  
					}  
					//Set bottom and right region for inner mode
					if(self.options.zoomType == "inner") {
						if(self.Eboppos){
							self.lensTopPos = Math.max( ((self.nzHeight)-(self.options.lensBorderSize*2)), 0 );
						} 
						if(self.Eroppos){
							self.lensLeftPos = (self.nzWidth-(self.nzWidth)-(self.options.lensBorderSize*2));
						}  

					}
					//if lens zoom
					if(self.options.zoomType == "lens") {  
						self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * (-1));   
						self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * (-1));

						self.zoomLens.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });

						if(self.changeBgSize){  

							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								}   

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){       
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								}   
								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
							}
							self.changeBgSize = false;
						}    

						self.setWindowPostition(e);  
					}
					//if tint zoom   
					if(self.options.tint && self.options.zoomType != "inner") {
						self.setTintPosition(e);

					}
					//set the css background position 
					if(self.options.zoomType == "window") {
						self.setWindowPostition(e);   
					}
					if(self.options.zoomType == "inner") {
						self.setWindowPostition(e);   
					}
					if(self.options.showLens) {

						if(self.fullwidth && self.options.zoomType != "lens"){
							self.lensLeftPos = 0;

						}
						self.zoomLens.css({ left: self.lensLeftPos + 'px', top: self.lensTopPos + 'px' })  
					}

				} //end else



			},
			showHideWindow: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isWindowActive){
						if(self.options.zoomWindowFadeIn){
							self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
						}
						else{self.zoomWindow.show();}
						self.isWindowActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isWindowActive){
						if(self.options.zoomWindowFadeOut){
							self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut);
						}
						else{self.zoomWindow.hide();}
						self.isWindowActive = false;        
					}      
				}
			},
			showHideLens: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isLensActive){
						if(self.options.lensFadeIn){
							self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
						}
						else{self.zoomLens.show();}
						self.isLensActive = true;
					}            
				}
				if(change == "hide"){
					if(self.isLensActive){
						if(self.options.lensFadeOut){
							self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
						}
						else{self.zoomLens.hide();}
						self.isLensActive = false;        
					}      
				}
			},
			showHideTint: function(change) {
				var self = this;              
				if(change == "show"){      
					if(!self.isTintActive){

						if(self.options.zoomTintFadeIn){
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate().stop(true, true).fadeIn("slow");
						}
						else{
							self.zoomTint.css({opacity:self.options.tintOpacity}).animate();
							self.zoomTint.show();


						}
						self.isTintActive = true;
					}            
				}
				if(change == "hide"){      
					if(self.isTintActive){ 

						if(self.options.zoomTintFadeOut){
							self.zoomTint.stop(true, true).fadeOut(self.options.zoomTintFadeOut);
						}
						else{self.zoomTint.hide();}
						self.isTintActive = false;        
					}      
				}
			},
			setLensPostition: function( e ) {


			},
			setWindowPostition: function( e ) {
				//return obj.slice( 0, count );
				var self = this;

				if(!isNaN(self.options.zoomWindowPosition)){

					switch (self.options.zoomWindowPosition) { 
					case 1: //done         
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
						self.windowOffsetLeft =(+self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 2:
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						}
						else{ //negative margin

						}
						break;
					case 3: //done        
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;      
					case 4: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;
					case 5: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 6: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}


						break;
					case 7: //done  
						self.windowOffsetTop = (self.nzHeight);  //DONE - 4,5,6,7,8
						self.windowOffsetLeft = 0; //DONE 7, 13
						break;
					case 8: //done  
						self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 9:  //done  
						self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize*2)); //DONE 3,9
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 10: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin

							self.windowOffsetTop = ((self.options.zoomWindowHeight/2)-(self.nzHeight/2))*(-1);
							self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						}
						else{ //negative margin

						}
						break;
					case 11: 
						self.windowOffsetTop = (self.options.zoomWindowOffety);
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 12: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.zoomWindow.width()+(self.options.borderSize*2) )* (-1);  //DONE 8,9,10,11,12
						break;
					case 13: //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(0); //DONE 7, 13
						break;
					case 14: 
						if(self.options.zoomWindowHeight > self.nzHeight){ //positive margin
							self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16

							self.windowOffsetLeft =((self.options.zoomWindowWidth/2)-(self.nzWidth/2)+(self.options.borderSize*2))*(-1);  
						}
						else{ //negative margin

						}

						break;
					case 15://done   
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth-self.zoomWindow.width()-(self.options.borderSize*2)); //DONE - 5,15
						break;
					case 16:  //done  
						self.windowOffsetTop = (self.zoomWindow.height()+(self.options.borderSize*2))*(-1); //DONE 12,13,14,15,16
						self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
						break;            
					default: //done  
						self.windowOffsetTop = (self.options.zoomWindowOffety);//DONE - 1
					self.windowOffsetLeft =(self.nzWidth); //DONE 1, 2, 3, 4, 16
					} 
				} //end isNAN
				else{
					//WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
					self.externalContainer = $('#'+self.options.zoomWindowPosition);
					self.externalContainerWidth = self.externalContainer.width();
					self.externalContainerHeight = self.externalContainer.height();
					self.externalContainerOffset = self.externalContainer.offset();

					self.windowOffsetTop = self.externalContainerOffset.top;//DONE - 1
					self.windowOffsetLeft =self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16

				}
				self.isWindowSet = true;
				self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffety;
				self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffetx;

				self.zoomWindow.css({ top: self.windowOffsetTop});
				self.zoomWindow.css({ left: self.windowOffsetLeft});

				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ top: 0});
					self.zoomWindow.css({ left: 0});

				}   


				self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1));   
				self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));
				if(self.Etoppos){self.windowTopPos = 0;}
				if(self.Eloppos){self.windowLeftPos = 0;}     
				if(self.Eboppos){self.windowTopPos = (self.largeHeight/self.currentZoomLevel-self.zoomWindow.height())*(-1);  } 
				if(self.Eroppos){self.windowLeftPos = ((self.largeWidth/self.currentZoomLevel-self.zoomWindow.width())*(-1));}    

				//stops micro movements
				if(self.fullheight){
					self.windowTopPos = 0;

				}
				if(self.fullwidth){
					self.windowLeftPos = 0;

				}
				//set the css background position 


				if(self.options.zoomType == "window" || self.options.zoomType == "inner") {

					if(self.zoomLock == 1){
						//overrides for images not zoomable
						if(self.widthRatio <= 1){

							self.windowLeftPos = 0;
						}
						if(self.heightRatio <= 1){ 
							self.windowTopPos = 0;
						}
					}
					// adjust images less than the window height

					if(self.largeHeight < self.options.zoomWindowHeight){

						self.windowTopPos = 0;
					}
					if(self.largeWidth < self.options.zoomWindowWidth){
						self.windowLeftPos = 0;
					}       

					//set the zoomwindow background position
					if (self.options.easing){

						//     if(self.changeZoom){
						//           clearInterval(self.loop);
						//           self.changeZoom = false;
						//           self.loop = false;

						//            }
						//set the pos to 0 if not set
						if(!self.xp){self.xp = 0;}
						if(!self.yp){self.yp = 0;}  
						//if loop not already started, then run it 
						if (!self.loop){           
							self.loop = setInterval(function(){                
								//using zeno's paradox    

								self.xp += (self.windowLeftPos  - self.xp) / self.options.easingAmount; 
								self.yp += (self.windowTopPos  - self.yp) / self.options.easingAmount;
								if(self.scrollingLock){


									clearInterval(self.loop);
									self.xp = self.windowLeftPos;
									self.yp = self.windowTopPos            

									self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1);
									self.yp = (((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));                         

									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){  
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}   
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{   
											if(self.options.zoomType != "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}            
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            

										}

										/*
             if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
						if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}  
                 if (!self.bgloop){   
                 	self.bgloop = setInterval(function(){   

                 self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount; 
								self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;

           self.zoomWindow.css({ "background-size": self.bgxp + 'px ' + self.bgyp + 'px' });


                  }, 16);

                 }
										 */
										self.changeBgSize = false;
									}

									self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });
									self.scrollingLock = false;
									self.loop = false;

								}
								else{
									if(self.changeBgSize){    
										if(self.nzHeight>self.nzWidth){ 
											if(self.options.zoomType == "lens"){      
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
											}         
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
										}
										else{                 
											if(self.options.zoomType != "lens"){     
												self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
											}      
											self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
										}
										self.changeBgSize = false;
									}                   

									self.zoomWindow.css({ backgroundPosition: self.xp + 'px ' + self.yp + 'px' });
								}       
							}, 16);
						}
					}   
					else{    
						if(self.changeBgSize){  
							if(self.nzHeight>self.nzWidth){  
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
								} 

								self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });
							}
							else{     
								if(self.options.zoomType == "lens"){      
									self.zoomLens.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });
								} 
								if((self.largeHeight/self.newvaluewidth) < self.options.zoomWindowHeight){ 

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvaluewidth + 'px ' + self.largeHeight/self.newvaluewidth + 'px' });            
								}
								else{

									self.zoomWindow.css({ "background-size": self.largeWidth/self.newvalueheight + 'px ' + self.largeHeight/self.newvalueheight + 'px' });   
								}

							}
							self.changeBgSize = false;
						}     

						self.zoomWindow.css({ backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px' });       
					}
				} 
			},
			setTintPosition: function(e){
				var self = this;
				self.nzOffset = self.$elem.offset();
				self.tintpos = String(((e.pageX - self.nzOffset.left)-(self.zoomLens.width() / 2)) * (-1)); 
				self.tintposy = String(((e.pageY - self.nzOffset.top) - self.zoomLens.height() / 2) * (-1));	
				if(self.Etoppos){
					self.tintposy = 0;
				}
				if(self.Eloppos){
					self.tintpos=0;
				}     
				if(self.Eboppos){
					self.tintposy = (self.nzHeight-self.zoomLens.height()-(self.options.lensBorderSize*2))*(-1);
				} 
				if(self.Eroppos){
					self.tintpos = ((self.nzWidth-self.zoomLens.width()-(self.options.lensBorderSize*2))*(-1));
				}    
				if(self.options.tint) {
					//stops micro movements
					if(self.fullheight){
						self.tintposy = 0;

					}
					if(self.fullwidth){ 
						self.tintpos = 0;

					}   
					self.zoomTintImage.css({'left': self.tintpos+'px'});
					self.zoomTintImage.css({'top': self.tintposy+'px'});
				}
			},

			swaptheimage: function(smallimage, largeimage){
				var self = this;
				var newImg = new Image(); 

				if(self.options.loadingIcon){
					self.spinner = $('<div style="background: url(\''+self.options.loadingIcon+'\') no-repeat center;height:'+self.nzHeight+'px;width:'+self.nzWidth+'px;z-index: 2000;position: absolute; background-position: center center;"></div>');
					self.$elem.after(self.spinner);
				}

				self.options.onImageSwap(self.$elem);

				newImg.onload = function() {
					self.largeWidth = newImg.width;
					self.largeHeight = newImg.height;
					self.zoomImage = largeimage;
					self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });
					self.zoomWindow.css({ "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px' });


					self.swapAction(smallimage, largeimage);
					return;              
				}          
				newImg.src = largeimage; // this must be done AFTER setting onload

			},
			swapAction: function(smallimage, largeimage){


				var self = this;    

				var newImg2 = new Image(); 
				newImg2.onload = function() {
					//re-calculate values
					self.nzHeight = newImg2.height;
					self.nzWidth = newImg2.width;
					self.options.onImageSwapComplete(self.$elem);

					self.doneCallback();  
					return;      
				}          
				newImg2.src = smallimage; 

				//reset the zoomlevel to that initially set in options
				self.currentZoomLevel = self.options.zoomLevel;
				self.options.maxZoomLevel = false;

				//swaps the main image
				//self.$elem.attr("src",smallimage);
				//swaps the zoom image     
				if(self.options.zoomType == "lens") {
					self.zoomLens.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "window") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				}
				if(self.options.zoomType == "inner") {
					self.zoomWindow.css({ backgroundImage: "url('" + largeimage + "')" }); 
				} 



				self.currentImage = largeimage;

				if(self.options.imageCrossfade){
					var oldImg = self.$elem;
					var newImg = oldImg.clone();         
					self.$elem.attr("src",smallimage)
					self.$elem.after(newImg);
					newImg.stop(true).fadeOut(self.options.imageCrossfade, function() {
						$(this).remove();         
					});

					//       				if(self.options.zoomType == "inner"){
					//remove any attributes on the cloned image so we can resize later
					self.$elem.width("auto").removeAttr("width");
					self.$elem.height("auto").removeAttr("height");
					//   }

					oldImg.fadeIn(self.options.imageCrossfade);

					if(self.options.tint && self.options.zoomType != "inner") {

						var oldImgTint = self.zoomTintImage;
						var newImgTint = oldImgTint.clone();         
						self.zoomTintImage.attr("src",largeimage)
						self.zoomTintImage.after(newImgTint);
						newImgTint.stop(true).fadeOut(self.options.imageCrossfade, function() {
							$(this).remove();         
						});



						oldImgTint.fadeIn(self.options.imageCrossfade);


						//self.zoomTintImage.attr("width",elem.data("image"));

						//resize the tint window
						self.zoomTint.css({ height: self.$elem.height()});
						self.zoomTint.css({ width: self.$elem.width()});
					}    

					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.zoomType == "inner"){ 
						if(!self.options.constrainType){
							self.zoomWrap.parent().css("height", self.$elem.height());
							self.zoomWrap.parent().css("width", self.$elem.width());

							self.zoomWindow.css("height", self.$elem.height());
							self.zoomWindow.css("width", self.$elem.width());
						}
					} 

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}
				else{
					self.$elem.attr("src",smallimage); 
					if(self.options.tint) {
						self.zoomTintImage.attr("src",largeimage);
						//self.zoomTintImage.attr("width",elem.data("image"));
						self.zoomTintImage.attr("height",self.$elem.height());
						//self.zoomTintImage.attr('src') = elem.data("image");
						self.zoomTintImage.css({ height: self.$elem.height()}); 
						self.zoomTint.css({ height: self.$elem.height()});

					}
					self.zoomContainer.css("height", self.$elem.height());
					self.zoomContainer.css("width", self.$elem.width());

					if(self.options.imageCrossfade){  
						self.zoomWrap.css("height", self.$elem.height());
						self.zoomWrap.css("width", self.$elem.width());
					} 
				}              
				if(self.options.constrainType){     

					//This will contrain the image proportions
					if(self.options.constrainType == "height"){ 

						self.zoomContainer.css("height", self.options.constrainSize);
						self.zoomContainer.css("width", "auto");

						if(self.options.imageCrossfade){  
							self.zoomWrap.css("height", self.options.constrainSize);
							self.zoomWrap.css("width", "auto"); 
							self.constwidth = self.zoomWrap.width();


						}
						else{                  
							self.$elem.css("height", self.options.constrainSize);
							self.$elem.css("width", "auto");
							self.constwidth = self.$elem.width();
						} 

						if(self.options.zoomType == "inner"){

							self.zoomWrap.parent().css("height", self.options.constrainSize);
							self.zoomWrap.parent().css("width", self.constwidth);   
							self.zoomWindow.css("height", self.options.constrainSize);
							self.zoomWindow.css("width", self.constwidth);    
						}        
						if(self.options.tint){
							self.tintContainer.css("height", self.options.constrainSize);
							self.tintContainer.css("width", self.constwidth);
							self.zoomTint.css("height", self.options.constrainSize);
							self.zoomTint.css("width", self.constwidth);
							self.zoomTintImage.css("height", self.options.constrainSize);
							self.zoomTintImage.css("width", self.constwidth); 
						} 

					}
					if(self.options.constrainType == "width"){       
						self.zoomContainer.css("height", "auto");
						self.zoomContainer.css("width", self.options.constrainSize);

						if(self.options.imageCrossfade){
							self.zoomWrap.css("height", "auto");
							self.zoomWrap.css("width", self.options.constrainSize);
							self.constheight = self.zoomWrap.height();
						}
						else{            
							self.$elem.css("height", "auto");
							self.$elem.css("width", self.options.constrainSize); 
							self.constheight = self.$elem.height();              
						} 
						if(self.options.zoomType == "inner"){
							self.zoomWrap.parent().css("height", self.constheight);
							self.zoomWrap.parent().css("width", self.options.constrainSize);   
							self.zoomWindow.css("height", self.constheight);
							self.zoomWindow.css("width", self.options.constrainSize);    
						} 
						if(self.options.tint){
							self.tintContainer.css("height", self.constheight);
							self.tintContainer.css("width", self.options.constrainSize);
							self.zoomTint.css("height", self.constheight);
							self.zoomTint.css("width", self.options.constrainSize);
							self.zoomTintImage.css("height", self.constheight);
							self.zoomTintImage.css("width", self.options.constrainSize); 
						}   

					}        


				}

			},
			doneCallback: function(){

				var self = this;
				if(self.options.loadingIcon){
					self.spinner.hide();     
				}   

				self.nzOffset = self.$elem.offset();
				self.nzWidth = self.$elem.width();
				self.nzHeight = self.$elem.height();

				// reset the zoomlevel back to default
				self.currentZoomLevel = self.options.zoomLevel;

				//ratio of the large to small image
				self.widthRatio = self.largeWidth / self.nzWidth;
				self.heightRatio = self.largeHeight / self.nzHeight; 

				//NEED TO ADD THE LENS SIZE FOR ROUND
				// adjust images less than the window height
				if(self.options.zoomType == "window") {

					if(self.nzHeight < self.options.zoomWindowWidth/self.widthRatio){
						lensHeight = self.nzHeight;  

					}
					else{
						lensHeight = String((self.options.zoomWindowHeight/self.heightRatio))
					}

					if(self.options.zoomWindowWidth < self.options.zoomWindowWidth){
						lensWidth = self.nzWidth;
					}       
					else{
						lensWidth =  (self.options.zoomWindowWidth/self.widthRatio);
					}


					if(self.zoomLens){

						self.zoomLens.css('width', lensWidth);    
						self.zoomLens.css('height', lensHeight); 


					}
				}
			},
			getCurrentImage: function(){
				var self = this;  
				return self.zoomImage; 
			}, 
			getGalleryList: function(){
				var self = this;   
				//loop through the gallery options and set them in list for fancybox
				self.gallerylist = [];
				if (self.options.gallery){ 


					$('#'+self.options.gallery + ' a').each(function() {

						var img_src = '';
						if($(this).data("zoom-image")){
							img_src = $(this).data("zoom-image");
						}
						else if($(this).data("image")){
							img_src = $(this).data("image");
						}			
						//put the current image at the start
						if(img_src == self.zoomImage){
							self.gallerylist.unshift({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});	
						}
						else{
							self.gallerylist.push({
								href: ''+img_src+'',
								title: $(this).find('img').attr("title")
							});
						}


					});
				}                                                       
				//if no gallery - return current image
				else{
					self.gallerylist.push({
						href: ''+self.zoomImage+'',
						title: $(this).find('img').attr("title")
					}); 
				}
				return self.gallerylist;

			},
			changeZoomLevel: function(value){
				var self = this;   

				//flag a zoom, so can adjust the easing during setPosition     
				self.scrollingLock = true;   

				//round to two decimal places
				self.newvalue = parseFloat(value).toFixed(2);
				newvalue = parseFloat(value).toFixed(2);




				//maxwidth & Maxheight of the image
				maxheightnewvalue = self.largeHeight/((self.options.zoomWindowHeight / self.nzHeight) * self.nzHeight);     
				maxwidthtnewvalue = self.largeWidth/((self.options.zoomWindowWidth / self.nzWidth) * self.nzWidth);   	




				//calculate new heightratio
				if(self.options.zoomType != "inner")
				{
					if(maxheightnewvalue <= newvalue){
						self.heightRatio = (self.largeHeight/maxheightnewvalue) / self.nzHeight;
						self.newvalueheight = maxheightnewvalue;
						self.fullheight = true;

					}
					else{
						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						self.newvalueheight = newvalue;
						self.fullheight = false;

					}


//					calculate new width ratio

					if(maxwidthtnewvalue <= newvalue){
						self.widthRatio = (self.largeWidth/maxwidthtnewvalue) / self.nzWidth;
						self.newvaluewidth = maxwidthtnewvalue;
						self.fullwidth = true;

					}
					else{
						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;

					}
					if(self.options.zoomType == "lens"){
						if(maxheightnewvalue <= newvalue){
							self.fullwidth = true;
							self.newvaluewidth = maxheightnewvalue;

						} else{
							self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
							self.newvaluewidth = newvalue;

							self.fullwidth = false;
						}}
				}



				if(self.options.zoomType == "inner")
				{
					maxheightnewvalue = parseFloat(self.largeHeight/self.nzHeight).toFixed(2);     
					maxwidthtnewvalue = parseFloat(self.largeWidth/self.nzWidth).toFixed(2);      
					if(newvalue > maxheightnewvalue){
						newvalue = maxheightnewvalue;
					}
					if(newvalue > maxwidthtnewvalue){
						newvalue = maxwidthtnewvalue;
					}      


					if(maxheightnewvalue <= newvalue){


						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 
						if(newvalue > maxheightnewvalue){
							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = true;


					}
					else{



						self.heightRatio = (self.largeHeight/newvalue) / self.nzHeight; 

						if(newvalue > maxheightnewvalue){

							self.newvalueheight = maxheightnewvalue;
						}else{
							self.newvalueheight = newvalue;
						}
						self.fullheight = false;
					}




					if(maxwidthtnewvalue <= newvalue){   

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						if(newvalue > maxwidthtnewvalue){

							self.newvaluewidth = maxwidthtnewvalue;
						}else{
							self.newvaluewidth = newvalue;
						}

						self.fullwidth = true;


					}
					else{  

						self.widthRatio = (self.largeWidth/newvalue) / self.nzWidth; 
						self.newvaluewidth = newvalue;
						self.fullwidth = false;
					}        


				} //end inner
				scrcontinue = false;

				if(self.options.zoomType == "inner"){

					if(self.nzWidth > self.nzHeight){
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{

							scrcontinue = false;
							self.fullheight = true;
							self.fullwidth = true;
						}
					}
					if(self.nzHeight > self.nzWidth){     
						if( self.newvaluewidth <= maxwidthtnewvalue){
							scrcontinue = true;
						}
						else{
							scrcontinue = false;  

							self.fullheight = true;
							self.fullwidth = true;
						}
					}
				}

				if(self.options.zoomType != "inner"){
					scrcontinue = true;
				}

				if(scrcontinue){



					self.zoomLock = 0;
					self.changeZoom = true;

					//if lens height is less than image height


					if(((self.options.zoomWindowHeight)/self.heightRatio) <= self.nzHeight){


						self.currentZoomLevel = self.newvalueheight; 
						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({height: String((self.options.zoomWindowHeight)/self.heightRatio) + 'px' }) 
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;  
						}	


					} 




					if((self.options.zoomWindowWidth/self.widthRatio) <= self.nzWidth){



						if(self.options.zoomType != "inner"){
							if(self.newvaluewidth > self.newvalueheight)   {
								self.currentZoomLevel = self.newvaluewidth;                 

							}
						}

						if(self.options.zoomType != "lens" && self.options.zoomType != "inner") {
							self.changeBgSize = true;

							self.zoomLens.css({width: String((self.options.zoomWindowWidth)/self.widthRatio) + 'px' })
						}
						if(self.options.zoomType == "lens" || self.options.zoomType == "inner") {  
							self.changeBgSize = true;
						}	

					}
					if(self.options.zoomType == "inner"){
						self.changeBgSize = true;  

						if(self.nzWidth > self.nzHeight){
							self.currentZoomLevel = self.newvaluewidth;
						}
						if(self.nzHeight > self.nzWidth){
							self.currentZoomLevel = self.newvaluewidth;
						}
					}

				}      //under

				//sets the boundry change, called in setWindowPos
				self.setPosition(self.currentLoc);
				//
			},
			closeAll: function(){
				if(self.zoomWindow){self.zoomWindow.hide();}
				if(self.zoomLens){self.zoomLens.hide();}
				if(self.zoomTint){self.zoomTint.hide();}
			},
			changeState: function(value){
      	var self = this;
				if(value == 'enable'){self.options.zoomEnabled = true;}
				if(value == 'disable'){self.options.zoomEnabled = false;}

			}

	};




	$.fn.elevateZoom = function( options ) {
		return this.each(function() {
			var elevate = Object.create( ElevateZoom );

			elevate.init( options, this );

			$.data( this, 'elevateZoom', elevate );

		});
	};

	$.fn.elevateZoom.options = {
			zoomActivation: "hover", // Can also be click (PLACEHOLDER FOR NEXT VERSION)
      zoomEnabled: true, //false disables zoomwindow from showing
			preloading: 1, //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
			zoomLevel: 1, //default zoom level of image
			scrollZoom: false, //allow zoom on mousewheel, true to activate
			scrollZoomIncrement: 0.1,  //steps of the scrollzoom
			minZoomLevel: false,
			maxZoomLevel: false,
			easing: false,
			easingAmount: 12,
			lensSize: 200,
			zoomWindowWidth: 400,
			zoomWindowHeight: 400,
			zoomWindowOffetx: 0,
			zoomWindowOffety: 0,
			zoomWindowPosition: 1,
			zoomWindowBgColour: "#fff",
			lensFadeIn: false,
			lensFadeOut: false,
			debug: false,
			zoomWindowFadeIn: false,
			zoomWindowFadeOut: false,
			zoomWindowAlwaysShow: false,
			zoomTintFadeIn: false,
			zoomTintFadeOut: false,
			borderSize: 4,
			showLens: true,
			borderColour: "#888",
			lensBorderSize: 1,
			lensBorderColour: "#000",
			lensShape: "square", //can be "round"
			zoomType: "window", //window is default,  also "lens" available -
			containLensZoom: false,
			lensColour: "white", //colour of the lens background
			lensOpacity: 0.4, //opacity of the lens
			lenszoom: false,
			tint: false, //enable the tinting
			tintColour: "#333", //default tint color, can be anything, red, #ccc, rgb(0,0,0)
			tintOpacity: 0.4, //opacity of the tint
			gallery: false,
			galleryActiveClass: "zoomGalleryActive",
			imageCrossfade: false,
			constrainType: false,  //width or height
			constrainSize: false,  //in pixels the dimensions you want to constrain on
			loadingIcon: false, //http://www.example.com/spinner.gif
			cursor:"default", // user should set to what they want the cursor as, if they have set a click function
			responsive:true,
			onComplete: $.noop,
			onZoomedImageLoaded: function() {},
			onImageSwap: $.noop,
			onImageSwapComplete: $.noop
	};

})( jQuery, window, document );/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
/**
 * jquery.wholly.js 0.1.2
 * https://github.com/gajus/wholly
 */
(function ($) {
    "use strict";

    var debug = false;

    $.fn.wholly = function (options) {
        var calcRowWidth,
            calcTableWidth,
            generateTableIndexTemplate,
            mapTableToIndex;

        var settings = $.extend({
                className: "highlight"
        }, options );
        
        /**
         * @param {Object} table jQuery selector referencing table.
         * @returns {Number} Maximum number of columns across all the table rows.
         */
        calcTableWidth = function (table) {
            var maxWidth = 0;

            table.find('tr').each(function () {
                var rowWidth = calcRowWidth($(this));

                if (rowWidth > maxWidth) {
                    maxWidth = rowWidth;
                }
            });

            return maxWidth;
        };

        /**
         * @param {Object} row jQuery selector referencing table row.
         * @returns {Number} Number of cells in the row.
         */
        calcRowWidth = function (row) {
            var width = 0;

            row.find('td, th').each(function () {
                var colspan = parseInt($(this).attr('colspan'), 10) || 1;

                width += colspan;
            });

            return width;
        };

        /**
         * @param {Number} width Number of cells.
         * @param {Number} height Number of rows.
         * @returns {Array} Table representation in a matrix ignoring rowspan and colspan.
         */
        generateTableIndexTemplate = function (width, height) {
            var tableIndex = [],
                rowWidth,
                rowIndex;

            while (height--) {
                rowWidth = width;
                rowIndex = [];

                while (rowWidth--) {
                    rowIndex.push(null);
                }

                tableIndex.push(rowIndex);
            }

            return tableIndex;
        };

        /**
         * @param {Object} table jQuery selector referencing table.
         * @param {Array} tableIndex Table matrix (index) produced using the generateTableIndexTemplate. This variable is changed by reference.
         */
        mapTableToIndex = function (table, tableIndex) {
            var rows = table.find('tr');

            // Iterate through each hypothetical table row.
            $.each(tableIndex, function (y) {
                var row = rows.eq(y),
                    rowChildren = row.children(),
                    cellIndex = 0;

                if (debug) {
                    console.groupCollapsed('Table row.', 'y:', y, 'rowChildren.length:', rowChildren.length);
                }

                // Iterate through each hypothetical table row column.
                // $.each will make a copy of the array before iterating. Must use live array reference.
                $.each(tableIndex[y], function (x) {
                    var cell = tableIndex[y][x],
                        colspan,
                        rowspan,
                        i,
                        j,
                        tempData;

                    // Table matrix is iterated left to right, top to bottom. It might be that cell has
                    // been assigned a value already because previous row-cell had "rowspan" property,
                    // possibly together with "colspan".
                    if (cell) {
                        if (debug) {
                            console.log('x:', cellIndex, 'cell:', cell[0]);
                        }
                    } else {
                        cell = rowChildren.eq(cellIndex++);

                        colspan = parseInt(cell.attr('colspan'), 10) || 1;
                        rowspan = parseInt(cell.attr('rowspan'), 10) || 1;

                        if (debug) {
                            if (colspan > 1 || rowspan > 1) {
                                console.group('x:', x, 'colspan:', colspan, 'rowspan:', rowspan, 'cell:', cell[0]);
                            } else {
                                console.log('x:', x, 'colspan:', colspan, 'rowspan:', rowspan, 'cell:', cell[0]);
                            }                            
                        }

                        for (i = 0; i < rowspan; i++) {
                            for (j = 0; j < colspan; j++) {
                                if (debug) {
                                    console.log('relative row:', i, 'relative cell:', j, 'absolute row:', y + i, 'absolute cell:', x + j);
                                }
                                
                                tableIndex[y + i][x + j] = cell;
                            }
                        }

                        if (colspan > 1 || rowspan > 1) {
                            console.groupEnd();
                        }
                    }

                    tempData = cell.data('wholly.index');

                    if (tempData === undefined) {
                        cell.data('wholly.index', x);
                    }
                });

                if (debug) {
                    console.groupEnd();
                }
            });
        };

        return this.each(function () {
            var table = $(this),
                tableWidth = calcTableWidth(table),
                tableHeight = table.find('tr').length,
                tableIndex = generateTableIndexTemplate(tableWidth, tableHeight),
                column;

            if (debug) {
                console.log('tableWidth:', tableWidth, 'tableHeight:', tableHeight);
            }

            mapTableToIndex(table, tableIndex);
            
            table.on('mouseenter', 'td, th', function () {
                var colspan = parseInt($(this).attr('colspan'), 10) || 1,
                    cellRealIndex = $(this).data('wholly.index'),
                    highlightCellFrom,
                    highlightCellTo;

                column = $(this);
                column.addClass(settings.className);
                highlightCellFrom = cellRealIndex;
                highlightCellTo = cellRealIndex + colspan;

                $.each(tableIndex, function (n, rowIndex) {
                    $.each(rowIndex.slice(highlightCellFrom, highlightCellTo), function (n, cell) {
                        column = column.add(cell);
                    });                    
                });

                column.trigger('wholly.mouseenter');
            });

            table.on('mouseleave', 'td, th', function () {
                column.trigger('wholly.mouseleave').removeClass(settings.className);

            });
        });
    };
}(jQuery));/*global require, define, z, $, FFAPI, ffbrowser, console, Modernizr */
/*jslint browser: true*/
/*jslint plusplus: true */

//try {
/**
 * FFAPI Video Variables object.
 * @property FFAPI.variables.video
 * @type {Object}
 */
FFAPI.variables.video = {};
/**
 * FFAPI Video Methods object.
 * @property FFAPI.methods.video
 * @type {Object}
 */
FFAPI.methods.video = {};
/**
 * FFAPI Video mediaPlayer array.
 * @property FFAPI.variables.video.mediaPlayer =[];
 * @type {Array}
 */
FFAPI.variables.video.mediaPlayer = [];
/**
 * FFAPI Video play buttons array.
 * @property FFAPI.variables.video.play =[];
 * @type {Array}
 */
FFAPI.variables.video.play = [];
/**
 * FFAPI Video play buttons array Length variable.
 * @property FFAPI.variables.video.playLength = 0;
 * @type {Number}
 */
FFAPI.variables.video.mediaPlayerLength = 0;
/**
 * FFAPI Video play buttons array Length variable.
 * @property FFAPI.variables.video.playLength = 0;
 * @type {Number}
 */
FFAPI.variables.video.playLength = 0;
/**
 * FFAPI Video variable to check if the video is playing
 * @property FFAPI.variables.video.playing = false;
 * @type {Boolean}
 */
FFAPI.variables.video.playing = false;
/**
 * FFAPI Video variable to check if the video behavior is loaded
 * @property FFAPI.variables.video.loaded = false;
 * @type {Boolean}
 */
FFAPI.variables.video.loaded = false;
/**
 * FFAPI variable video with originalHtml for unloading the video from the slider
 * @property FFAPI.variables.video.originalHtml = false;
 * @type {String}
 */
FFAPI.variables.video.originalHtml = '';

/**
 * Video Preloading has some issues on Chrome
 * https://code.google.com/p/chromium/issues/detail?id=234779
 * We detected this and we don't use preloading at his best so we don't have issues on Chrome
 * 
 */

FFAPI.methods.video.checkVideoSupport = function () {
    'use strict';
    /// If it has a video element and support to video
    if (document.getElementsByClassName('js-video-element') && Modernizr.video) {
        FFAPI.methods.video.getVideoFromCaroussel();
    }
    return true;
};

/**
* Reset the video on mobile. We should use this for touch devices only for exitFullScreen if it has support and set the current time to frame 4
* @param  {[type]} idVideo [description]
*/
FFAPI.methods.video.resetVideo = function () {
    var idVideo = this.getAttribute('clickedID');
    FFAPI.methods.video.exitFullScreen(idVideo);
    FFAPI.methods.video.setCurrentTime(idVideo);
}
/**
* Exit the fullscreen video
* @param  {[type]} idVideo [description]
*/
FFAPI.methods.video.exitFullScreen = function (idVideo) {

    FFAPI.variables.video.mediaVideoElements[idVideo].webkitExitFullscreen();

}
/**
* Set the current time to second 4 in order we can see the poster for the video
* @param {[type]} idVideo [description]
*/
FFAPI.methods.video.setCurrentTime = function (idVideo) {
    setTimeout(function () {
        FFAPI.variables.video.mediaVideoElements[idVideo].currentTime = 4;
    }, 2000);
}

/**
 * FFAPI.methods.video.getVideoFromCaroussel function to get the video info and elements from the Caroussel. We load the elements from a slider and if it has support we load the video.
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.getVideoFromCaroussel = function () {
    'use strict';
    /// Get all the variablaes and attributes
    /// Prepare a template to add the video to the HTML
    var i = 0,
        sliderVideo = document.getElementsByClassName('js-video-element'),
        sliderVideoPoster = sliderVideo[0].getAttribute('src'),
        sliderVideoId = sliderVideo[0].getAttribute('data-video-id'),
        sliderVideoControls = sliderVideo[0].getAttribute('data-video-controls'),
        sliderVideoMp4 = sliderVideo[0].getAttribute('data-video-mp4'),
        sliderVideoWebm = sliderVideo[0].getAttribute('data-video-webm'),
        sliderVideoOgg = sliderVideo[0].getAttribute('data-video-ogg'),
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length,
        template = '';
    if (FFAPI.variables.touchSupported) {
        template = '<video class="' + sliderVideoId + '" width="100%" height="100%" poster="' + sliderVideoPoster + '" controls="controls" preload="auto">';
    } else {
        template = '<video class="' + sliderVideoId + '" width="100%" height="100%" poster="' + sliderVideoPoster + '" controls="false" preload="auto">';
    }
    /// Get the original html
    if (sliderVideoContainer) {
        FFAPI.variables.video.originalHtml = sliderVideoContainer[0].innerHTML;
    }
    ///Check what video formats are available
    if (sliderVideoMp4) {
        template += '<source src="' + sliderVideoMp4 + '" type="video/mp4">';
    }
    if (sliderVideoWebm) {
        template += '<source src="' + sliderVideoWebm + '" type="video/wbm">';
    }
    if (sliderVideoOgg) {
        template += '<source src="' + sliderVideoOgg + '" type="video/ogg">';
    }
    template += '</video><div class="media-controls"><div id="play-pause-button" class="play"><span class="icon-play glyphs"></span></div></div>';


    if (sliderVideoContainerLength) {
        /// Change the slider HTML to this new content from template
        for (i; i < sliderVideoContainerLength; i++) {
            sliderVideoContainer[i].innerHTML = template;
        }
        FFAPI.variables.video.loaded = true;

        if (FFAPI.variables.touchSupported) {
            /**
         * FOR WHEN VIDEO ENDED ON MOBILE
         * TEST THIS WELL
         */

            FFAPI.variables.video.mediaVideoElements = document.getElementsByClassName('media-video'),
            FFAPI.variables.video.mediaVideoElementsLength = FFAPI.variables.video.mediaVideoElements.length;

            /**
         * Add the event Listener
         * @type {Number}
         */
            for (var i = 0; i < FFAPI.variables.video.mediaVideoElementsLength; i++) {
                FFAPI.variables.video.mediaVideoElements[i].setAttribute("clickedId", i);
                if (FFAPI.variables.touchSupported) {
                    FFAPI.variables.video.mediaVideoElements[i].setAttribute("controls", "");
                }
                FFAPI.variables.video.mediaVideoElements[i].addEventListener("ended", FFAPI.methods.video.resetVideo);
            }

            /**
         * END OF WHEN VIDEO ENDED
         */
        }
    }

    /// Define the globals media Players
    /// Get it's length
    if (sliderVideoId) {
        FFAPI.variables.video.mediaPlayer = document.getElementsByClassName(sliderVideoId);
        FFAPI.variables.video.mediaPlayerLength = FFAPI.variables.video.mediaPlayer.length;
        ///Bind click on the video to play the video
        FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideoBind);
        /// Remove controls from all mediaControls
        /// Add an event when video ended
        for (i = 0; i < FFAPI.variables.video.mediaPlayerLength; i++) {
            if (FFAPI.variables.touchSupported) {
                FFAPI.variables.video.mediaPlayer[i].setAttribute("controls", "");
            } else {
                FFAPI.variables.video.mediaPlayer[i].controls = false;
            }
            /// Add an event when video ended
            FFAPI.variables.video.mediaPlayer[i].addEventListener('ended', FFAPI.methods.video.endedCarousselVideo);
        }
    }
    /// Define the globals player controls
    /// Get their length
    if (sliderVideoControls) {
        FFAPI.variables.video.play = document.getElementsByClassName(sliderVideoControls);
        FFAPI.variables.video.playLength = FFAPI.variables.video.play.length;
        ///Bind click on the Button play to play the video
        FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideoBind);
    }

    return true;
};

/**
 * [playCarousselVideoBind description]
 * @return {Boolean} Just return true when end.
 * REDO THE PREVENDEFAULT - TEST IE / CHROME AND MOBILE
 */
FFAPI.methods.video.playCarousselVideoBind = function (event) {
    'use strict';
    if (window.event) {
        var e = window.event;
        if (!e.preventDefault) {
            e.returnValue = false;
            e.cancelBubble = true;
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    } else {
        var e = event;
        e.preventDefault();
        e.stopPropagation();
    }
    FFAPI.methods.video.playCarousselVideo();
    ///Unbind click on the video to play the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideo);
    ///Unbind click on the Button play to play the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideo);
    ///Bind click on the video to stop the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the Button stop to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);

    return false;
};
/**
 * [stopCarousselVideoBind description]
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.stopCarousselVideoBind = function () {
    'use strict';
    FFAPI.methods.video.stopCarousselVideo();
    ///Unbind click on the video to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Unbind click on the Button play to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the video to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideo);
    ///Bind click on the Button play to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideo);

    return true;
};


/**
 * [unloadVideoFromSlider description]
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.unloadVideoFromSlider = function () {
    'use strict';
    ///Just to be sure the video has stopped
    FFAPI.methods.video.stopCarousselVideoBind();
    var i = 0,
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length;

    if (sliderVideoContainerLength) {
        /// Change the slider HTML to this new content from template
        for (i; i < sliderVideoContainerLength; i++) {
            sliderVideoContainer[i].innerHTML = FFAPI.variables.video.originalHtml;
        }
        FFAPI.variables.video.loaded = false;
    }

    return true;
};

/**
 * FFAPI.methods.video.playCarousselVideo function to play video on the product caroussel
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.playCarousselVideo = function () {
    'use strict';
    /// Declare variable i for auliary methods
    var i = 0;

    /*Clickstream*/
    if (FFAPI.variables.video.mediaPlayer != undefined) {
        if (FFAPI.variables.video.mediaPlayer[0].currentTime === 0) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.parse("59"); //Play Video
            }
        } else if (FFAPI.variables.video.mediaPlayer[0].paused === true) {
            if (typeof (_fftrkobj) !== "undefined") {
                _fftrkobj.parse("61"); //Resume Video
            }
        }
    }

    /// We make the play for all videos on the slideshow
    /// So they are syncronized
    for (i; i < FFAPI.variables.video.mediaPlayerLength; i++) {
        FFAPI.variables.video.mediaPlayer[i].play();
    }

    /// Change the video variable playing to true
    /// This way we know video is playing
    FFAPI.variables.video.playing = true;

    /// Change the class for the video control button
    /// We remove the class play-stop
    /// We add the class play-start
    for (i = 0; i < FFAPI.variables.video.playLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[i], 'play-stop');
        FFAPI.methods.addClass(FFAPI.variables.video.play[i], 'play-start');
    }

    return true;

};



/**
 * FFAPI.methods.video.playCarousselVideo function to play video on the product caroussel
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.stopCarousselVideo = function () {
    'use strict';
    /// Declare variable i for auliary methods
    var i = 0;

    /// We make the stop for all videos on the slideshow
    /// So they are syncronized
    for (i; i < FFAPI.variables.video.mediaPlayerLength; i++) {
        FFAPI.variables.video.mediaPlayer[i].pause();
    }

    /// Change the video variable playing to true
    /// This way we know video is playing
    FFAPI.variables.video.playing = false;

    /// Change the class for the video control button
    /// We remove the class play-stop
    /// We add the class play-start
    for (i = 0; i < FFAPI.variables.video.playLength; i++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[i], 'play-start');
        FFAPI.methods.addClass(FFAPI.variables.video.play[i], 'play-stop');
    }

    /*Clickstream*/
    if (typeof (_fftrkobj) !== "undefined") {
        _fftrkobj.parse("60"); //Pause Video
    }

    return true;
};


/**
 * FFAPI.methods.video.endedCarousselVideo function for when the video is over
 * @return {Boolean} Just return true when end.
 */
FFAPI.methods.video.endedCarousselVideo = function () {
    'use strict';
    var j = 0;
    ///Load the video in order to make it available
    this.load();
    for (j; j < FFAPI.variables.video.playLength; j++) {
        FFAPI.methods.removeClass(FFAPI.variables.video.play[j], 'play-start');
        FFAPI.methods.addClass(FFAPI.variables.video.play[j], 'play-stop');
    }
    ///Unbind click on the video to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.stopCarousselVideoBind);
    ///Unbind click on the Button play to stop the video
    FFAPI.methods.unbindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.stopCarousselVideoBind);
    ///Bind click on the video to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.mediaPlayer, FFAPI.methods.video.playCarousselVideoBind);
    ///Bind click on the Button play to play the video
    FFAPI.methods.bindElemClick(FFAPI.variables.video.play, FFAPI.methods.video.playCarousselVideoBind);

    /// Change the video variable playing to false
    /// This way we know video is stopped
    FFAPI.variables.video.playing = false;

    /*Clickstream*/
    if (typeof (_fftrkobj) !== "undefined") {
        _fftrkobj.parse("62"); //Video End
    }

    return true;

};



/**
 * If the browser doesn't support video we remove all the elements from the DOM if they exist
 * @return {Boolean} Just return true when end.
 */

FFAPI.methods.video.removeVideoSliderElements = function () {
    'use strict';
    /// Get all the variables and attributes
    /// Prepare to change the data-slide-index of the links on the bx-pager-thumb
    var i = 0,
        sliderProductModule = document.getElementsByClassName('js-sliderProductPage'),
        sliderThumbs = document.getElementsByClassName('bx-pager-thumb'),
        sliderVideoContainer = document.getElementsByClassName('js-video'),
        sliderVideoContainerLength = sliderVideoContainer.length,
        sliderVideoThumb = document.getElementsByClassName('js-video-thumb'),
        sliderVideoThumbLength = sliderVideoContainer.length,
        sliderVideoThumbsLinks = '',
        sliderVideoThumbsLinksLength = '';

    ///Remove the sliderVideoContainer on the slider
    if (sliderVideoContainer && sliderProductModule) {
        for (i; i < sliderVideoContainerLength; i++) {
            sliderProductModule[0].removeChild(sliderVideoContainer[i]);
        }
    }

    ///Remove the sliderVideoThumb on the slider
    if (sliderVideoThumb && sliderThumbs) {
        for (i = 0; i < sliderVideoThumbLength; i++) {
            sliderThumbs[0].removeChild(sliderVideoThumb[i]);
        }
    }

    ///Re-organize the sliderVideoThumbLinks
    if (sliderVideoThumb) {
        sliderVideoThumbsLinks = sliderThumbs[0].getElementsByTagName('a');
        sliderVideoThumbsLinksLength = sliderVideoThumbsLinks.length;

        for (i = 0; i < sliderVideoThumbsLinksLength; i++) {
            sliderVideoThumbsLinks[i].setAttribute('data-slide-index', i);
        }
    }
    return true;
};
/**
 * Document ready for Video - we check if the browser has video execute FFAPI.methods.video.removeVideoSliderElements
 */
$(document).ready(function () {
    'use strict';
    if (!Modernizr.video) {
        FFAPI.methods.video.removeVideoSliderElements();
    }
});

/*} catch (e) {
 try {
     if (window.debug) {
         console.log(e);
     }
 } catch (ignore) {
 }
}*/try {
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
}$(document).ready(function() {
    require(['plu_resTables'], function () {

        function loadInteractiveSizeGuides() {
            var table = $('.scrollable .sizehelp');

            table.wholly({
                className: "sizehelp-interactive-selected_hover"
            });

            table.on('wholly.mouseenter', 'td, th', function () {
                $(this).addClass('sizehelp-interactive_hover');
            });

            table.on('wholly.mouseleave', 'td, th', function () {
                $(this).removeClass('sizehelp-interactive_hover');
                });

            //Add hover class to row when you hover pinned and scrollable table to eachother
            $(".sizehelp").delegate('td, th', 'mouseover mouseleave', function (e) {
                var $this = $(this),
                    parentIndex = $this.parent().index(),
                    tableWrapper = $this.closest(".table-wrapper");

                if (e.type == 'mouseover') {
                    tableWrapper.find(".scrollable .sizehelp tr").eq(parentIndex).addClass("sizehelp-interactive_hover");
                    tableWrapper.find(".pinned .sizehelp tr").eq(parentIndex).addClass("sizehelp-interactive_hover");
                }
                else {
                    tableWrapper.find(".scrollable .sizehelp tr").eq(parentIndex).removeClass("sizehelp-interactive_hover");
                    tableWrapper.find(".pinned .sizehelp tr").eq(parentIndex).removeClass("sizehelp-interactive_hover");
                }
            });

            //Remove class hover when hover th
            $(".scrollable .sizehelp").delegate('th', 'mouseover mouseleave', function (e) {
                if (e.type == 'mouseover') {
                    $(this).parent().removeClass("sizehelp-interactive_hover");
                }
                    });

            //Remove hover on blank spaces
            $(".pinned .sizehelp").delegate('td.sizehelp-nohover', 'mouseover mouseleave', function (e) {
                if (e.type == 'mouseover') {
                    $(this).closest(".table-wrapper").find('.scrollable .sizehelp th').parent().removeClass("sizehelp-interactive_hover");
                }
            });

            //Remove hover on category
            $(".scrollable .sizehelp").delegate('th.sizehelp-nohover', 'mouseover mouseleave', function (e) {
                if (e.type == 'mouseover') {
                    $(this).closest(".table-wrapper").find('.scrollable .sizehelp td, .scrollable .sizehelp th').removeClass("sizehelp-interactive_hover");
                }
            });
        }
        
        $(".sizeGuideModal").on("loaded.bs.modal", function () {
            $(this).find('table.responsiveTable-lg').each(function (i, element) {
                splitTable($(element));
            });
        
            loadInteractiveSizeGuides();
        });
    });
});/**
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