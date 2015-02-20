require(['forms_validations'], function () {

    var animateTo = function (selector) {
        $('html,body').animate({ scrollTop: $(selector).offset().top }, 500);
    };

    //initialization 
    FFAPI.variables.reviews = FFAPI.variables.reviews || {};
    FFAPI.methods.reviews = FFAPI.methods.reviews || {};

    FFAPI.variables.boutique = FFAPI.variables.boutique || {};
    FFAPI.methods.boutique = FFAPI.methods.boutique || {};

    FFAPI.variables.boutique.texts = document.getElementsByClassName('readmore-text');
    FFAPI.variables.boutique.texts.readmore = FFAPI.variables.boutique.texts[0].getAttribute("data-read-more");
    FFAPI.variables.boutique.texts.readless = FFAPI.variables.boutique.texts[0].getAttribute("data-read-less");
    
    //methods
    FFAPI.methods.reviews.pageChanged = function (evt) {
        FFAPI.variables.reviews.pageSelected.value = $(this).val();
        FFAPI.methods.reviews.submitReviewsForm();
    };

    FFAPI.methods.reviews.boutiqueChanged = function (evt) {
        FFAPI.methods.reviews.resetPageIndex();
        FFAPI.methods.reviews.submitReviewsForm();
    };

    FFAPI.methods.reviews.resetPageIndex = function(){
        FFAPI.variables.reviews.pageSelected.value = 1;
    };

    FFAPI.methods.reviews.submitReviewsForm = function () {
        animateTo("#reviewsWrapper");
        document.getElementById("submitReviewsRequest").click();
        $(".search-mask-loader").removeClass("hide");
    };

    FFAPI.methods.boutique.readmore = function (ele) {
        var link = document.createElement("a");        // Create a <button> element
        var t = document.createTextNode(FFAPI.variables.boutique.texts.readmore);       // Create a text node
        link.appendChild(t);
        link.className += ' ' + 'float-right align-right underline';
        ele.parentNode.appendChild(link);

        if (!link.addEventListener) {
            link.attachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
        } else {
            link.addEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
        }
    }

    function previousElementSibling(el) {
        do { el = el.previousSibling; } while (el && el.nodeType !== 1);
        return el;
    }


    FFAPI.methods.boutique.readMoreClick = function () {
        var aux = this.previousElementSibling || previousElementSibling(this);
        FFAPI.methods.removeClass(aux, 'review-content-more');
        this.innerHTML = FFAPI.variables.boutique.texts.readless;

        if (!this.removeEventListener) {
            this.detachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
            this.attachEvent("onclick", FFAPI.methods.boutique.readLessClick);
        } else {
            this.removeEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
            this.addEventListener("click", FFAPI.methods.boutique.readLessClick, false);
        }
    }

    FFAPI.methods.boutique.readLessClick = function () {
        var aux = this.previousElementSibling || previousElementSibling(this);
        FFAPI.methods.addClass(aux, 'review-content-more');
        this.innerHTML = FFAPI.variables.boutique.texts.readmore;

        if (!this.removeEventListener) {
            this.detachEvent("onclick", FFAPI.methods.boutique.readLessClick);
            this.attachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
        } else {
            this.removeEventListener("click", FFAPI.methods.boutique.readLessClick, false);
            this.addEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
        }
    }

    FFAPI.methods.reviews.bindReviews = function () {

        FFAPI.variables.reviews.pageSelector = document.getElementsByClassName("pageSelector");
        FFAPI.variables.reviews.pageSelected = document.getElementById("page");
        FFAPI.variables.reviews.boutiqueSelector = document.getElementById("boutiqueId");
        FFAPI.variables.reviews.pageSize = document.getElementById("pageSize");
        FFAPI.variables.boutique.review = document.getElementsByClassName('review');

        //evt listeners
        $(FFAPI.variables.reviews.pageSelector).bind("change", FFAPI.methods.reviews.pageChanged);

        $(FFAPI.variables.reviews.boutiqueSelector).bind("change", FFAPI.methods.reviews.boutiqueChanged);

        $("#boutiquesReviewsList span[data-role='pageSelector']").bind("click", function (evt) {
            FFAPI.variables.reviews.pageSelected.value = $(this).data("page");
            FFAPI.methods.reviews.submitReviewsForm();
        });

        $("#boutiquesReviewsList a[data-role='pageSize']").bind("click", function () {
            FFAPI.variables.reviews.pageSize.value = $(this).data("pagesize");
            FFAPI.methods.reviews.submitReviewsForm();
        });

        $("#boutiquesReviewsList select").chosen();
        
        $(".search-mask-loader").addClass("hide");

        var icon = '<span class="icon-search glyphs boutique-icon-search"></span>';
        $('.chosen-search').append(icon);

        for (var i = 0, aux = 0, count = 0; i < FFAPI.variables.boutique.review.length; i++) {
            aux = FFAPI.methods.getElementHeight(FFAPI.variables.boutique.review[i]);
            if (aux > 22) {
                FFAPI.variables.boutique.review[i].className += ' ' + 'review-content-more';
                FFAPI.methods.boutique.readmore(FFAPI.variables.boutique.review[i]);
                count++;
            }
        }

    };

    FFAPI.methods.reviews.bindReviews();

});
