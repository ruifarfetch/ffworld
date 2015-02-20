
    wrapper = $(".wrapper").height();
    $(window).resize(function() {
        $(".grid").height($(".wrapper").height());
    });
    $(".grid").height(wrapper);
    $(".gridToggle").click(function() {
        $(this).toggleClass('showGrid');
        $(".grid").toggle();
    });
