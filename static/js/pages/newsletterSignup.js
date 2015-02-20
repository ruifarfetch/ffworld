FFAPI = FFAPI || {};
FFAPI.methods = FFAPI.methods || {};
FFAPI.methods.newsletter = FFAPI.methods.newsletter || {};
FFAPI.variables = FFAPI.variables || {};
FFAPI.variables.newsletter = FFAPI.variables.newsletter || {};
FFAPI.variables.newsletter.SelectedDesigners = [];
FFAPI.variables.newsletter.SelectedCategories = [];

FFAPI.methods.newsletter.addDesigner = function (designerId) {
    if (FFAPI.variables.newsletter.SelectedDesigners.indexOf(designerId) == -1) {
        FFAPI.variables.newsletter.SelectedDesigners.push(designerId);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.removeDesigner = function (designerId) {
    var elementPos = FFAPI.variables.newsletter.SelectedDesigners.indexOf(designerId);
    if (elementPos != -1) {
        FFAPI.variables.newsletter.SelectedDesigners.splice(elementPos, 1);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.addCategory = function (catId) {
    if (FFAPI.variables.newsletter.SelectedCategories.indexOf(catId) == -1) {
        FFAPI.variables.newsletter.SelectedCategories.push(catId);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.removeCategory = function (catId) {
    var elementPos = FFAPI.variables.newsletter.SelectedCategories.indexOf(catId);
    if (elementPos != -1) {
        FFAPI.variables.newsletter.SelectedCategories.splice(elementPos, 1);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.updateSelectedDesignersInput = function () {
    var selectedDesigners = FFAPI.variables.newsletter.SelectedDesigners.join(",");
    FFAPI.variables.newsletter.selectedDesignersElement.val(selectedDesigners);
}

FFAPI.methods.newsletter.updateSelectedCategoriesInput = function () {
    var selectedCategories = FFAPI.variables.newsletter.SelectedCategories.join(",");
    FFAPI.variables.newsletter.selectedCategoriesElement.val(selectedCategories);
}

FFAPI.methods.newsletter.addDesignerTag = function (suggestion) {
    if (FFAPI.methods.newsletter.addDesigner(suggestion.data)) {
        var template = '<div class="float-left pr20" data-id="' + suggestion.data + '"><span class="newsLetterRemoveDesigner singup-delete-icon glyphs icon-close float-left pr10"></span><p class="color-medium-grey float-left">' + suggestion.value + '</p></div>';
        FFAPI.variables.newsletter.newsletterDesignersTagsElement.append(template);
        FFAPI.methods.newsletter.updateSelectedDesignersInput();
    }
};

FFAPI.methods.newsletter.initDesignersSearch = function (genderId, url) {
    require(['root_essentials_plugins'], function () {
        $(document).ready(function () {
            $('#preferedDesigners').autocomplete({
                serviceUrl: url,
                minChars: 3,
                maxHeight: 200,
                appendTo: '#newsletter_suggestions_container',
                width: '100%',
                zIndex: 1,
                params: { genderId: genderId },
                deferRequestBy: 200, //miliseconds
                onSelect: function (suggestion) {
                    FFAPI.methods.newsletter.addDesignerTag(suggestion);
                    $('#preferedDesigners').val('');
                    $('#preferedDesigners').focus();
                },
            });
        });
    });

    FFAPI.variables.bodyElement.on('click', '.newsLetterRemoveDesigner', function () {
        var jQThis = $(this).parent();
        var designerId = jQThis.data('id');
        FFAPI.methods.newsletter.removeDesigner(designerId);
        FFAPI.methods.newsletter.updateSelectedDesignersInput();
        jQThis.remove();
    });
}

FFAPI.methods.newsletter.initNewsletter = function (genderId, url) {
    FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners();
    // Initialize variables
    FFAPI.variables.newsletter.selectedCategoriesElement = $('#selectedCategories');
    FFAPI.variables.newsletter.selectedDesignersElement = $('#selectedDesigners');
    FFAPI.variables.newsletter.newsletterDesignersTagsElement = $('#newsletterDesignersTags');

    FFAPI.methods.newsletter.initDesignersSearch(genderId, url);

    // Initialize bindings
    $('#btnNewsletterPrefSubmit').on('click', function () {
        $('input[type=checkbox]:checked').each(function () {
            var categoryId = $(this).val();
            FFAPI.methods.newsletter.addCategory(categoryId);
        });
        FFAPI.methods.newsletter.updateSelectedCategoriesInput();
        $('.signup_news_modal').trigger('click.dismiss.bs.modal');
    });

    $("#CountryList").chosen().bind("change", function () {
        $('#SelectedCountry').val($(this).val());
    });
}

FFAPI.methods.newsletter.initPreferencesPopup = function (genderId, url) {
    FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners();
    // Initialize variables
    FFAPI.variables.newsletter.selectedCategoriesElement = $('#selectedCategories');
    FFAPI.variables.newsletter.selectedDesignersElement = $('#selectedDesigners');
    FFAPI.variables.newsletter.newsletterDesignersTagsElement = $('#newsletterDesignersTags');

    // Initialize plugins
    $('.label-check, .label-radio').checkradio();
    FFAPI.plugins.methods.initJQueryDropdowns($(document));
    $.validator.unobtrusive.parse(document);
    FFAPI.methods.newsletter.initDesignersSearch(genderId, url);

    // Initialize bindings
    $('#btnNewsletterPrefSubmit').on('click', function () {
        $('input[type=checkbox]:checked').each(function () {
            var categoryId = $(this).val();
            FFAPI.methods.newsletter.addCategory(categoryId);
        });
        FFAPI.methods.newsletter.updateSelectedCategoriesInput();
        $('.signup_news_modal').trigger('click.dismiss.bs.modal');
    });

};

FFAPI.methods.newsletter.showThankYouPopup = function () {
    $('#signup_thankyou_modal').modal();
    $(document).trigger('subscribedEmail');
    window.setTimeout(function () {
        window.location = '/';
    }, 3000);
    $('#signup_thankyou_modal').on('click.dismiss.bs.modal', function () {
        window.location = '/';
    });
}

$('.icon-close').on('click', function () {
    $(this).closest('.info').slideUp();
});

FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners = function () {
    document.getElementById('preferedDesigners').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
};

$("body").on("click", ".editorial-backTop a", function (e) {
    e.preventDefault();
    $(document).scrollTop(0);
});