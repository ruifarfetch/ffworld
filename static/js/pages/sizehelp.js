$(document).ready(function() {
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
});