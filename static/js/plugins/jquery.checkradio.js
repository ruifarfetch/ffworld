/*=====================================================
= CHECKRADIO PLUGIN V1.0 - 2013/10/31                 =
= Copyright laranjeira.pt 2013
= Dual licensed under the MIT 
  (http://www.opensource.org/licenses/mit-license.php)
  and GPL 
  (http://www.opensource.org/licenses/gpl-license.php) 
  licenses.
=====================================================*/
(function ($) {
    var methods = {
        // Method to initiate the plugin, it adds a span and the necessary classes and methods
        init: function (jQobj) {
            var $this = jQobj,
				$el = $this.find('input').first();//get the input inside the label
            if ($this.find('span').length > 0) {
                return;
            }
            var	$checked = $el.prop('checked'),//get the checked value 
				$disabled = $el.prop('disabled'),//get the disabled value 
				$elType = $el.is(':checkbox');//get if it is a checkbox
            $el.after('<span></span>');//add the span element
            var $span = $this.find('span');//get the span just added

            if ($elType === true) {
                //if it is a checkbox

                if ($checked === true) {
                    //if it is checked
                    $span.addClass('glyphs icon-box-checked');//adds the class checked to the span
                    jQobj.addClass('label-check_active');
                }
                else {
                    //if it is not checked
                    $span.addClass('icon-box-unchecked');//adds the class unchecked to the span
                    jQobj.removeClass('label-check_active');
                }

                if ($disabled == false) {
                    //if the checkbox is NOT Disabled adds the click method
                    methods.clickCheck($this, $span);
                }

            }

            else {
                if ($checked === true) {
                    //if it is checked
                    $span.addClass('glyphs icon-radio-checked');//adds the class checked to the span
                    jQobj.addClass('label-check_active');
                }
                else {
                    //if it is not checked
                    $span.addClass('icon-radio-unchecked');//adds the class unchecked to the span
                    jQobj.removeClass('label-check_active');
                }

                if ($disabled == false) {
                    //if the option is NOT Disabled adds the click method
                    methods.clickOption($this, $span);
                }

            }

            $this.attr('started', true);

        },
        // Method to check and uncheck the checkboxes
        clickCheck: function (jQobj, span) {

            jQobj.bind('click', function (e) {//binds the click
                var $el = jQobj.find('input'),//finds the input
					$checked = $el.prop('checked'); //Check if it is checked

                if (!jQobj.hasClass('label-check-disabled'))//If it is not disabled
                {
                    if ($checked === true) {
                        //Uncheck the checkbox and the attribute on the input
                        span.addClass('icon-box-unchecked');
                        span.removeClass('glyphs icon-box-checked');
                        jQobj.removeClass('label-check_active');
                        $el.prop('checked', false);
                        $el.attr('checked', false);
                    }
                    else {
                        //Check the checkbox and the attribute on the input
                        span.addClass('glyphs icon-box-checked');
                        jQobj.addClass('label-check_active');
                        span.removeClass('icon-box-unchecked');
                        $el.prop('checked', true);
                        $el.attr('checked', true);
                    }
                }

                e.preventDefault();//Prevent the default behaviour
            });

        },
        // Method to click on a option - unchecks all with same name
        clickOption: function (jQobj, span) {

            jQobj.bind('click', function (e) {

                var $el = jQobj.find('input'),
				$checked = $el.is(':checked');

                /*CLEAN UP OTHER RADIO BUTTONS WITH SAME NAME*/
                $elemGroup = $("body").find(':radio[name="' + $el.attr('name') + '"]');
                //looks for all elements and unchek them all
                $elemGroup.not($el).each(function () {
                    var $el = $(this);
                    var $label = $el.parent('label');
                    $label.find('span').addClass('icon-radio-unchecked');
                    $label.find('span').removeClass('glyphs icon-radio-checked');
                    $el.prop('checked', false);
                    $el.attr('checked', false);
                });



                if ($checked !== true) {
                    //Check the radio and the attribute on the input
                    span.addClass('glyphs icon-radio-checked');
                    span.removeClass('icon-radio-unchecked');
                    $el.prop('checked', true);
                    $el.attr('checked', true);
                }

                e.preventDefault();//Prevent the default behaviour

            });

        },
        // Method to activate the checkbox if we want to
        activateCheckbox: function (jQobj, span) {
            jQobj.removeClass('label-check-disabled');//remove the disabled class
            jQobj.unbind("click");//be sure there is no other click associated
            methods.clickCheck(jQobj, span);
        },

        // Method to activate the a radio button if we want to
        activateRadio: function (jQobj, span) {
            jQobj.removeClass('label-radio-disabled');//remove the disabled class
            jQobj.unbind("click");//be sure there is no other click associated
            methods.clickOption(jQobj, span);
        }

    }

    $.fn.checkradio = function (options) {

        /* Establish our default settings : 
		for now we just have some text and complete function*/
        var settings = $.extend({
            text: '',
            complete: function () {

            }
        }, options);



        return this.each(function () {
            /*initiate with method init*/
            if ($(this).attr('started') !== "true") {
                methods.init($(this));
            }
            /*Execute complete function at the very end*/
            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });

    };

}(jQuery));

