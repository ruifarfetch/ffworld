$(document).ready(function () {
    /**
     * FFAPI Variables BX Sliders. This array will save the BX sliders we started
     * <b><i>FFAPI.variables.jsSliderSingle = [];<br /></i></b>
     * @property FFAPI.variables.jsSliderSingle
     * @type Array
     */
	FFAPI.variables.jsSliderSingle = [];
	/**
     * FFAPI Variables BX Sliders ID's. This array will save the BX sliders ID's
     * <b><i>FFAPI.variables.jsSliderSingleId = [];<br /></i></b>
     * @property FFAPI.variables.jsSliderSingleId
     * @type Array
     */
	FFAPI.variables.jsSliderSingleId = [];
	/**
     * FFAPI Variables BX Sliders Class Name. This variable saves the class to start the single BX Slider
     * <b><i>FFAPI.variables.jsSliderSingleClass = '.js-sliderSingle';<br /></i></b>
     * @property FFAPI.variables.jsSliderSingleClass
     * @type String
     */
	FFAPI.variables.jsSliderSingleClass = $('.js-sliderSingle');
	/**
     * For each Single Slider class we execute the bsxlider start
     * @method $.each($(jsSliderSingleClass), function(index, val) {
     * @param
     */
	$.each(FFAPI.variables.jsSliderSingleClass, function(index, val) {
		/// console.log("Slider Single");
		/// Variables to get the parent and our ID
		var aux = $(this).parents('li'),
			auxId = aux.find('>a').data('slider-id');
		/// Start the Slider
		FFAPI.variables.jsSliderSingle[index] = $(this).bxSlider({
			mode: 'fade',
			controls: 'false',
			pager: $(this).find("li").length > 1
		});
		/// Save the id and index
		FFAPI.variables.jsSliderSingleId[index] = auxId;
	});
});

