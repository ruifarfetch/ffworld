/*
 *	Careers .js
 */

require(['essentials', 'plu_clear_input'], function () {

    //-----------
    // Variables
    //-----------
    var

    // Class
    class_careers_leftmenu = 'careers-leftmenu',
    class_careers_leftmenu_active = 'careers-leftmenu-active',
    class_office_box_wrapper = 'office-box-wrapper',
    class_prefix = 'careers-',
    careers_top = document.getElementById('careers-top');
    //---------------------

    function clickHandler(refName) {
        // Active status
        $('.' + class_careers_leftmenu + ' a').removeClass(class_careers_leftmenu_active);
        $('.' + class_careers_leftmenu + ' a[href="#' + refName + '"]').addClass(class_careers_leftmenu_active);

        // Hide / Show content on click menu
            $('.careers-field:not(.hide)').addClass('hide');
            $('.' + class_prefix + refName).removeClass('hide');

        // Scroll to careers_top element
        FFAPI.plugins.scroll.to(careers_top, 0);
    }

    // On left menu/office box click
    $('.' + class_careers_leftmenu + ' a, .' + class_office_box_wrapper + ' a').click(function (e) {
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
            if (window.innerWidth < 768) {
                $('.sticky').fixTo('destroy');


            } else
                if (window.innerWidth > 768) {
                    require(['plu_fixto'], function () {
                        $('.sticky').fixTo('.sticky-holder', {
                            mind: 'header'
                        });

                    });
                }
        });
        if (window.innerWidth < 768) {
            require(['plu_fixto'], function () {
                $('.sticky').fixTo('destroy');
            });
        }

    });
});