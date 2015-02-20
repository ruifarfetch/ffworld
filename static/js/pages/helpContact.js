/*
*	Help & Contact Us .js
*/

require(['forms_validations', 'plu_clear_input'], function () {

    $(document).ready(function () {

        tooltips();
        $(".checkout-text-input").tipsy({ trigger: 'focus', gravity: 'w', html: 'true' });

        /*
  
      MC existing checkout select mc boutique
  
      */

        $('.js-checkout-mc-fauxTable-selectBtn-action').click(function () {
            event.preventDefault();

            $('.js-checkout-mc-searchFormAndResults-container').slideUp(function () {
                $('.js-checkout-mc-selectedMcAddress').slideDown();
            });

        });

        $('.js-checkout-mc-fauxTable-selectBtn-action-change').click(function () {
            event.preventDefault();

            $('.js-checkout-mc-selectedMcAddress').slideUp(function () {
                $('.js-checkout-mc-searchFormAndResults-container').slideDown();
            });

        });


        //-----------
        // Variables
        //-----------
        var

        // Selectors
        class_helpContact_leftmenu = 'helpContact-leftmenu',
        class_helpContact_leftmenu_active = 'helpContact-leftmenu-active',
        class_prefix = 'helpContact-',
        helpContact_top = document.getElementById('helpContact-top')

        // Class
        class_helpContact_faqs_menu = 'helpContact-faqs-menu'
        ;
        //---------------------


        /*
         * ----------------------
         * helpContact-leftmenu
         * ----------------------
         */
        function clickHandler(refName) {
            // Active status
            $('.' + class_helpContact_leftmenu + ' a').removeClass(class_helpContact_leftmenu_active);
            $('.' + class_helpContact_leftmenu + ' a[href="#' + refName + '"]').addClass(class_helpContact_leftmenu_active);

            // Scroll to helpContact_top element
            FFAPI.plugins.scroll.to(helpContact_top, 0, function() {
                // Hide / Show content on click menu
                $('.' + class_prefix + 'field:not(.hide)').addClass('hide');
                $('.' + refName).removeClass('hide');
            });
        }

        // On left menu/office box click
        $('.' + class_helpContact_leftmenu + ' a').click(function (e) {
            e.preventDefault();

            clickHandler(FFAPI.methods.urlHash($(this).attr("href")));
        });

        // On hash change
        window.onhashchange = function () {
            clickHandler(FFAPI.methods.urlHash());
        };

        // On page load
        var hash = FFAPI.methods.urlHash();
        if(hash) { clickHandler(hash); }
        //---------------------

        /*
         * ----------------------
         * helpContact-faqs-menu
         * ----------------------
         */
        $('.' + class_helpContact_faqs_menu + ' li').click(function () {

            // Active status
            $('.' + class_helpContact_faqs_menu + ' li').removeClass(class_helpContact_leftmenu_active);
            $(this).addClass(class_helpContact_leftmenu_active);

            // Go to target
            var refNameFaqsTarget = $(this).attr("data-name");

            if (refNameFaqsTarget === 'helpContact-FAQs') {
                $('.helpContact-Faq-SubCat').removeClass('hide').addClass('show');
            } else {
                $('.helpContact-Faq-SubCat').addClass('hide').removeClass('show');
                $('.' + refNameFaqsTarget).addClass('show');
            }

        });

        /*
         * ----------------------
         * Fixed Menu
         * ----------------------
         */

        require(['plu_fixto'], function () {
            if (ffbrowser.isIE8 === false) {
                $('.sticky').fixTo('.sticky-holder', {
                    mind: 'header'
                });
            }

        });
        require(['essentials'], function () {
            $(window).smartresize(function () {
                if (ffbrowser.isIE8 === false && window.innerWidth < 768) {
                    $('.sticky').fixTo('destroy');


                } else
                    if (ffbrowser.isIE8 === false && window.innerWidth > 768) {
                        require(['plu_fixto'], function () {
                            $('.sticky').fixTo('.sticky-holder', {
                                mind: 'header'
                            });

                        });
                    }
            });
            if (ffbrowser.isIE8 === false && window.innerWidth < 768) {
                require(['plu_fixto'], function () {
                    $('.sticky').fixTo('destroy');
                });
            }
        });
    });

    $('.helpContact_ClickCollect-modal').off('show.bs.modal').on('show.bs.modal', function () {
        var loaded = $('.helpContact_ClickCollect-modal').data('ajax-loaded');
        if (loaded == null || loaded == undefined) {
            $.ajax({
                url: '/multichannel/faqboutiquefinder',
                type: 'GET',
                success: function (data) {
                    $(".helpContact_ClickCollect-modal-content").html(data);
                    $('.helpContact_ClickCollect-modal').data('ajax-loaded', true);
                    FFAPI.methods.maps.bindEvents();
                    getAllMap();
                    $.validator.unobtrusive.parse(document);
                }
            });
        }
    });
});