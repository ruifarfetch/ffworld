


/// Chosen Plugin is always necessary and has a general class


$(document).ready(function () {
    require(['plu_rate'], function () {
        $('div.js-rateit, span.js-rateit').rateit();
        ///console.log("Loaded plu_rate");
    });

    $('.label-radio').on('click', function () {
        var targetID = $(this).attr('for');
        var targetChosen = $('#' + targetID + '_select');
        var currentVal = $(this).find('input').val();
        targetChosen.val(currentVal);
        targetChosen.trigger("chosen:updated");        
    });

    $('#RecommendBoutiqueToFamilyOrFriendsRating_select').on('change', function () {
        var value = $(this).val();
        $('.label-radio[for="RecommendBoutiqueToFamilyOrFriendsRating"]')[value].click()
    });

    $('#RecommendFarfetchToFamilyOrFriendsRating_select').on('change', function () {
        var value = $(this).val();
        $('.label-radio[for="RecommendFarfetchToFamilyOrFriendsRating"]')[value].click()
    });

});