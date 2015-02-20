var form_search = $('.form-search'),
	form_search_input = $('.form-search').find('input'),
	form_search_clear = $('.input-text-clear');

form_search.on('input', function (){
	var checkinput_hasvalue = false,
		form_clear = $(this).find('.input-text-clear');

    $(this).find('input').each(function(i,e){
        if(e.value){
            checkinput_hasvalue = true;
            return false;
        }
    });
    if(checkinput_hasvalue) {
	    form_clear.removeClass('hide');
	} else {
	    form_clear.addClass('hide');
	}			
});

form_search_clear.on('click', function() {
    $(this).addClass('hide').parent().find('input').val("").focus();
    $(this).trigger("clearsearch");
});

form_search_input.focus(function() {
	$(this).parent().addClass('form-search_focus');
});

form_search_input.focusout(function(){
	$(this).parent().removeClass('form-search_focus');
}); 

