    /**
    HTML Hogan Templates javaScript file. It contains the html templates to e rendered with hogan.js. This way we can add elements, compile them as HTML and insert them into our page<br>
    @deprecated api/
    @class html-templates-1.0.0.js
    **/

    /**
    * This module contains global methods of our API
    * @module FFAPI
    */
try{

	FFAPI.templates = FFAPI.templates || {}; //Is variable initialized

	/**
	 * Template for na HTML responsive image
	 * @method FFAPI.templates.responsiveImage
	 * @param {String} imgSrc - The absolute path for the image
	 * @param {String} imgAlt - The description of the image
	 * @param {String} imgClass - Classes to add to the image
	 * @param {String} imgId - The image Id if necessary
	 * @param {String} imgDataAttr - The image Data attributes to use if necessary
	 * @return renderedTemplate - Return the image HTML rendered
	 */
	FFAPI.templates.responsiveImage = function(imgSrc, imgAlt, imgClass, imgId, imgDataAttr){
		/// Get last undescore index, the length, the substr, lastIndexof dot(.) and the file extension
		/// Get the 3 images size based on the original
		var u = imgSrc.lastIndexOf("_")+1,
			l = imgSrc.length,
			ns = imgSrc.substr(0,l - (l-u)),
			e = imgSrc.lastIndexOf("."),
			ex = imgSrc.substr(l - (l-e)),
			imageXL = ns+FFAPI.responsive.imageXL+ex,
			imageMD = ns+FFAPI.responsive.imageMD+ex,
			imageXS = ns+FFAPI.responsive.imageXS+ex,
			renderedTemplate = "",
			compiledTemplate = "",
			template = "",
			data = {
				imageAlt:       imgAlt,
				imageClasses:   imgClass,
				imageId:        imgId,
				imageData:      imgDataAttr,
				imageSrc:       imgSrc,
				imageSrcXL:     imageXL,
				imageSrcMD:     imageMD,
				imageSrcXS:     imageXS
			};

		/// Template  the image HTML
		template = '<img src="{{imageSrc}}" class="responsive {{imageClasses}}" data-large="{{imageSrcXL}}" data-medium="{{imageSrcMD}}" data-small="{{imageSrcXS}}" alt="{{imageAlt}}" id="{{imageId}}" {{imageData}} />';

		/// Compile template
		compiledTemplate = Hogan.compile(template);
		/// Render the template
		renderedTemplate = compiledTemplate.render(data);
		/// Return the image HTML rendered
		return renderedTemplate;

	};

	/**
	 * Template for na getting HTML by request
	 * @method FFAPI.templates.getHtmlToPage
	 * @param {String} tabToLoad - The absolute path for the image
	 * @return renderedTemplate - Return the image HTML rendered
	 */
	FFAPI.templates.getHtmlToPage = function(tabToload){
		var template= "",
			compiledTemplate= "",
			renderedTemplate= "",
			html = "",
			fileGet= "";

			switch (tabToload) {
				case "header-tabs-1":
					fileGet = "sign-in.html";
					break;
				case "header-tabs-2":
				    fileGet = "/Header/DetailedWishlist";
					break;
				case "header-tabs-3":
					fileGet = "favourites.html";
					break;
				case "header-tabs-4":
					fileGet = "bag.html";
					break;
			}
			//setTimeout(function(){
				$.get(fileGet,{tabsToLoad: tabToload }, function(data) {
					template = data;
					compiledTemplate = Hogan.compile(template);
					renderedTemplate = compiledTemplate.render();
					var ne = document.getElementById(tabToload);
					//Adds content to the innerHTML
					ne.innerHTML = renderedTemplate;
					FFAPI.variables.tabOpenVal = "#"+tabToload;
					return true;
				});
			//}, 2000);

			
	};


	/**
    * On document ready loads
    * @method $(document).ready(function($)
    */
	$(document).ready(function($){

	});

	/**
    * On resizing the window after. For now it doesn't make anything
    * @method $(window).resize(function($)
    */
	$(window).resize(function(){
		
	});


} catch (e) {
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}

