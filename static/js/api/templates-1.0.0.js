    /**
    Templates javaScript file. It contains the templates functions and variables you can use across the site.<br>
    @deprecated api/
    @class templates-1.0.0.js
    **/

    /**
    * This module contains global methods of our API
    * @module FFAPI
    */

try{
	/**
    * FFAPI templates object. You can include on this object all the templates variables and methods you need on your page
    * @property FFAPI.templates
    * @type Object
    */
	FFAPI.templates = FFAPI.templates || {}; //Is variable initialized

	/// Loader and HTML to load for each content
	/// These are our tmp variables that will help us
	/// to load specific html to specific elements
	/**
    * FFAPI Templates Loader Element Huge. The object Huge Element Loader<br />
    * <b><i> FFAPI.templates.loaderElementHuge = "#contentHuge";<br /></i></b>
    * @property FFAPI.templates.loaderElementHuge
    * @type String
    */
	FFAPI.templates.loaderElementHuge = "#contentHuge";
	/**
    * FFAPI Templates Loader Element Extra Large. The object Extra Large Element Loader<br />
    * <b><i> FFAPI.templates.loaderElementXL = "#contentXL";<br /></i></b>
    * @property FFAPI.templates.loaderElementXL
    * @type String
    */
	FFAPI.templates.loaderElementXL = "#contentXL";
	/**
    * FFAPI Templates Loader Element Medium. The object Medium Element Loader<br />
    * <b><i> FFAPI.templates.loaderElementMD = "#contentMD";<br /></i></b>
    * @property FFAPI.templates.loaderElementMD
    * @type String
    */
	FFAPI.templates.loaderElementMD = "#contentMD";
	/**
    * FFAPI Templates Loader Element Small. The object Extra Large Element Small<br />
    * <b><i> FFAPI.templates.loaderElementSM = "#contentSM";<br /></i></b>
    * @property FFAPI.templates.loaderElementSM
    * @type String
    */
	FFAPI.templates.loaderElementSM = "#contentSM";
	/**
    * FFAPI Templates Loader Element Extra Small. The object Extra Small Element Loader<br />
    * <b><i> FFAPI.templates.loaderElementXS = "#contentXS";<br /></i></b>
    * @property FFAPI.templates.loaderElementXS
    * @type String
    */
	FFAPI.templates.loaderElementXS = "#contentXS";
	/**
    * FFAPI Templates Loader HTML Huge. The html Huge Element text<br />
    * <b><i> FFAPI.templates.loaderHTMLHuge = "<p>contentHuge</p>";<br /></i></b>
    * @property FFAPI.templates.loaderHTMLHuge
    * @type String
    */
	FFAPI.templates.loaderHTMLHuge = "<p>contentHuge</p>";
	/**
    * FFAPI Templates Loader HTML Extra Large. The html Extra Large Element text<br />
    * <b><i> FFAPI.templates.loaderHTMLXL = "<p>contentXL</p>";<br /></i></b>
    * @property FFAPI.templates.loaderHTMLXL
    * @type String
    */
	FFAPI.templates.loaderHTMLXL = "<p>contentXL</p>";
	/**
    * FFAPI Templates Loader HTML Medium. The html Medium Element text<br />
    * <b><i> FFAPI.templates.contentMD = "<p>contentMD</p>";<br /></i></b>
    * @property FFAPI.templates.contentMD
    * @type String
    */
	FFAPI.templates.loaderHTMLMD = "<p>contentMD</p>";
	/**
    * FFAPI Templates Loader HTML Small. The html Small Element text<br />
    * <b><i> FFAPI.templates.loaderHTMLSM = "<p>contentSM</p>";<br /></i></b>
    * @property FFAPI.templates.loaderHTMLSM
    * @type String
    */
	FFAPI.templates.loaderHTMLSM = "<p>contentSM</p>";
	/**
    * FFAPI Templates Loader HTML Extra Small. The html Extra Small Element text<br />
    * <b><i> FFAPI.templates.loaderHTMLXS = "<p>contentXs</p>";<br /></i></b>
    * @property FFAPI.templates.loaderHTMLXS
    * @type String
    */
	FFAPI.templates.loaderHTMLXS = "<p>contentXS</p>";



	/**
	 * To load HTML for an alement. Always removes the class hide and adds HTML
	 * @method FFAPI.templates.loadHtmlToElement
	 * @param {Object} element -  HTML Object
	 * @param {String} content  - HTML code
	 * @return Boolean
	 */
	FFAPI.templates.loadHtmlToElement = function(element,content){
		if(typeof element != "undefined"){
			var ne = document.querySelector(element);

			/// Removes the Class Hide
			/// FFAPI.methods.removeClass(ne,'hide');
			//Adds content to the innerHTML
			
			if(ne != null){
				ne.innerHTML = content;
			}
		}

		return true;
	};


	/**
	 * To load HTML for an alement with a media querie and after that removes this listener for this mediaQuerie
	 * @method FFAPI.templates.loadMediaQuerieHtml
	 * @param {String} mediaQuerie - The matchMedia mediaquerie
	 * @param {Object} element - HTML object
	 * @param {String} content - HTML code
	 * @return Boolean
	 */
	FFAPI.templates.loadMediaQuerieHtml = function(mediaQuerie,element,content){
		mediaQuerie.addListener(function () {
			if(mediaQuerie.matches===true){
				FFAPI.templates.loadHtmlToElement(element,content);
				mediaQuerie.removeListener(arguments.callee, false);
			}
		},false);
		return true;
	};

	/**
	 * To load HTML for an alement with a media querie
	 * @method FFAPI.templates.loadResponsiveHtmlListeners
	 * @param {String} listenersToLoad - Just to check what media queries to load (huge, xl, md, sm, xs)
	 * @return Boolean
	 */
	FFAPI.templates.loadResponsiveHtmlListeners = function(listenersToLoad){
		switch (listenersToLoad) {
		case "" :
			break;

		case "huge" :
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieHuge,FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			break;

		case "xl" :
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieHuge,FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieXL,FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			break;

		case "md" :
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieHuge,FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieXL,FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieMD,FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			break;

		case "sm" :
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieHuge,FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieXL,FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieMD,FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieSM,FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			break;

		case "xs" :
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieHuge,FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieXL,FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieMD,FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieSM,FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			FFAPI.templates.loadMediaQuerieHtml(FFAPI.responsive.mediaQuerieXS,FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			break;
		}
		return true;
	};

	/**
	 * Loading the Responsive HTML for each element and after that Loads the Listeners to make the necessary changes on this
	 * @method FFAPI.templates.loadResponsiveHtml
	 */
	FFAPI.templates.loadResponsiveHtml = function(){
		if(FFAPI.responsive.mediaQuerieHuge.matches===true){
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementHuge,FFAPI.templates.loaderHTMLHuge);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			FFAPI.responsive.listenersToLoad = "";
		}

		else if(FFAPI.responsive.mediaQuerieXL.matches===true){
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXL,FFAPI.templates.loaderHTMLXL);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			FFAPI.responsive.listenersToLoad = "huge";
		}

		else if(FFAPI.responsive.mediaQuerieMD.matches===true){
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementMD,FFAPI.templates.loaderHTMLMD);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			FFAPI.responsive.listenersToLoad = "xl";
		}


		else if(FFAPI.responsive.mediaQuerieSM.matches===true){
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementSM,FFAPI.templates.loaderHTMLSM);
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			FFAPI.responsive.listenersToLoad = "md";
		}


		else if(FFAPI.responsive.mediaQuerieXS.matches===true){
			FFAPI.templates.loadHtmlToElement(FFAPI.templates.loaderElementXS,FFAPI.templates.loaderHTMLXS);
			FFAPI.responsive.listenersToLoad = "xs";
		}

		/// Load the Listeners to make the necessary changes on
		FFAPI.templates.loadResponsiveHtmlListeners(FFAPI.responsive.listenersToLoad);
	};


	/**
    * On document ready load the loadResponsiveHtml
    * @method $(document).ready(function($)
    */
	$(document).ready(function($) {
		FFAPI.templates.loadResponsiveHtml();

	});

	/**
    * On resizing the window after FFAPI.variables.resizeWindowTime it updates. For now it doesn't make anything
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
