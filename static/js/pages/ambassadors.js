$(document).ready(function() {

	//-----------
    // Variables
    //-----------
    var

    // Class
    accordionAmbassadors = FFAPI.plugins.accordion.get(document.getElementById('accordion-ambassadors')),
    id_prefix = 'ambassadors-';
    //---------------------

    function hashHandler(refName) {

        if(!accordionAmbassadors) return;

        var accordionItem = document.getElementById(id_prefix + refName);

        // Slide down accordion item
        accordionAmbassadors.slideDown(accordionItem);

        // Scroll to accordion item
        FFAPI.plugins.scroll.to(accordionItem, 0);
    }

    // On hash change
    window.onhashchange = function () {
        hashHandler(FFAPI.methods.urlHash());
    };

    // On page load
    var hash = FFAPI.methods.urlHash();
    if(hash) { hashHandler(hash); }

});

