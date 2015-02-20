 // DESIGNERS DIRECTORY V2.0

    //VARIABLES

    FFAPI.variables.designers = FFAPI.variables.designers || {};
    FFAPI.methods.designers = FFAPI.methods.designers || {};

    FFAPI.variables.designers.header = document.getElementsByTagName('header')[0];
    FFAPI.variables.designers.headerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.header);
    FFAPI.variables.designers.sidekick = document.getElementsByClassName('designers-header')[0];
    FFAPI.variables.designers.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.sidekick);
    FFAPI.variables.designers.infoBannersContainer = document.getElementsByClassName('info-banners-container')[0];
    FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);
    FFAPI.variables.designers.designersList = document.getElementsByClassName('designers-list')[0];
    FFAPI.variables.designers.designersFilters = document.getElementsByClassName('designers-filters')[0];
    FFAPI.variables.designers.designersFiltersGlyphs = FFAPI.variables.designers.designersFilters.getElementsByClassName('glyphs');
    FFAPI.variables.designers.designersFiltersDropdown = FFAPI.variables.designers.designersFilters.getElementsByClassName('dropdown');
    FFAPI.variables.designers.designersFiltersListRegular = FFAPI.variables.designers.designersFilters.getElementsByClassName('list-regular');
    FFAPI.variables.designers.designersFilterToggle = document.getElementsByClassName('designers-filters-toggle-title')[0];
    FFAPI.variables.designers.designersFilterSearch = document.getElementsByClassName('designers-filter-search')[0];
    FFAPI.variables.designers.designersFilterIconSearch = document.getElementsByClassName('designers-filter-icon-search')[0];
    FFAPI.variables.designers.designersIconSearch = document.getElementsByClassName('designers-icon-search')[0];
    FFAPI.variables.designers.designersIconSearchClose = document.getElementsByClassName('designers-icon-search-close')[0];
    FFAPI.variables.designers.designersDropdownFilter = document.getElementsByClassName('designers-dropdown-filter');
    FFAPI.variables.designers.designersSearchInput = document.getElementsByClassName('designers-search-input')[0];
    FFAPI.variables.designers.designersFilterListAlphabetic = document.getElementsByClassName('designers-filter-list-alphabetic');
    FFAPI.variables.designers.designersFilterListAlphabeticItem = FFAPI.variables.designers.designersFilterListAlphabetic[0].getElementsByTagName('a');
    FFAPI.variables.designers.designersListItem = document.getElementsByClassName('designers-list-item');
    FFAPI.variables.designers.designersListItemTitle = document.getElementsByClassName('designers-list-item-title');
    FFAPI.variables.designers.searchResults = document.getElementsByClassName('designers-selector-results')[0];
    FFAPI.variables.designers.designersFiltersWrapper = document.getElementsByClassName('back-to-top-filters')[0];
    FFAPI.variables.designers.windowInnerWidth = window.innerWidth;

    //JQuery/others
    var listingFilterWrapper = $('.listing-filter-wrapper'),
        designersFilterToggle = $('.designers-filters-toggle-title'),
        designersFilters = $('.designers-filters'),
        designersIconSearch = $('.designers-filter-icon-search'),
        designersFilterSearch = $('.designers-filter-search'),
        designersIconSearchClose = $('.designers-icon-search-close'),
        designersSearchInput = $('.designers-search-input'),
        designersDropdownFilter = $('.designers-dropdown-filter'),
        designersDropdown = $('.designers-dropdown'),
        designersFiltersWrapper = $('.back-to-top-filters'),
        designersFilterListAlphabeticItem = $('.designers-filter-list-alphabetic a'),
        designersListItem = $('.designers-list-item'),
        designersListItemTitle = $('.designers-list-item-title'),
        designersFilterListAlphabetic = $('.designers-filter-list-alphabetic'),
        htmlTag = $('html'),
        headerTag = $('header'),
        clearButtonSearch = $('#clearResultsBtn'),
        htmlHasIpadClass = false,
        htmlHasAndroidClass = false,
        inputIsFocused = false,
        searchIconIsClicked = false;

    //GLOBAL SETTING
    window.scrollTo(0, 0);

    //CHECKS IF IS IPAD
    htmlTag.hasClass('ipad') ? htmlHasIpadClass = true : htmlHasIpadClass = false;

    //CHECKS IF IS ANDROID
    htmlTag.hasClass('android') ? htmlHasAndroidClass = true : htmlHasAndroidClass = false;

    //CHECKS IF IS MOBILE DEVICE
    htmlTag.hasClass('mobile-device') ? htmlHasMobileClass = true : htmlHasMobileClass = false;

    //CHECKS IF IS TOUCH DEVICE
    htmlTag.hasClass('touch') ? htmlHasTouchClass = true : htmlHasTouchClass = false;

    //TO CONTROL THE ANIMATION LATTER ON INPUT FOCUSIN/FOCUSOUT
    designersSearchInput.on('focusin', function() {
        inputIsFocused = true;
        //CONTROL THE ACTIVE STATE OF THE ICONS
        FFAPI.methods.addClass(FFAPI.variables.designers.designersFilterIconSearch, 'color-black');
        FFAPI.methods.addClass(FFAPI.variables.designers.designersIconSearch, 'color-black');
        FFAPI.methods.addClass(FFAPI.variables.designers.designersIconSearchClose, 'color-black');
        if(htmlHasIpadClass || (htmlHasAndroidClass && FFAPI.variables.designers.windowInnerWidth > FFAPI.responsive.fablet)) {
            FFAPI.methods.designers.sidekickAnimationState(true);
        }

        //HIDE THE FILTER BUTTON FIXED TO AVOID BUGS ON MOBILE DEVICES
        FFAPI.variables.designers.designersFiltersWrapper.style.display = 'none';

    });

    designersSearchInput.on('focusout', function(){
        inputIsFocused = false;
        //CONTROL THE ACTIVE STATE OF THE ICONS
        FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterIconSearch, 'color-black');
        FFAPI.methods.removeClass(FFAPI.variables.designers.designersIconSearch, 'color-black');
        FFAPI.methods.removeClass(FFAPI.variables.designers.designersIconSearchClose, 'color-black');
        if(htmlHasIpadClass || (htmlHasAndroidClass && FFAPI.variables.designers.windowInnerWidth > FFAPI.responsive.fablet)) {
            FFAPI.methods.designers.sidekickAnimationState(true);
        }

        //SHOW THE FILTER BUTTON FIXED
        FFAPI.variables.designers.designersFiltersWrapper.style.display = 'block';        
    });  

    //GLOBAL SETTINGS FUNCTION
    FFAPI.methods.designers.GlobalSettings = function () {
        'use strict';

        if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {

            //RESET THE FILTER ACCORDIONS ON MOBILE
            FFAPI.variables.designers.designersFilters.style.display = 'none';
            FFAPI.variables.designers.designersFiltersWrapper.style.display = 'block';
            
            //REMOVE ACTIVE STATE FROM THE DROPDOWN TITLES
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersGlyphs.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFiltersGlyphs[i], 'designers-dropdown-name-active');
            }

           //HIDE ALL THE DROPDOWNS
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersDropdown.length; i++) {
                FFAPI.variables.designers.designersFiltersDropdown[i].style.display = 'none';
            }

            //HIDE ALL UL.LIST-REGULAR
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersListRegular.length; i++) {
                FFAPI.variables.designers.designersFiltersListRegular[i].style.display = 'block';
                //NEEDED TO GET IT WORKING
                FFAPI.methods.addClass(FFAPI.variables.designers.designersFiltersListRegular[i], 'show');
            }

            //RESET FILTER TOGGLE
            FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterToggle, 'dropdown-active');
            FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterToggle, 'color-black');

        } else {
            
            //RESET FILTERS AND SEARCH INPUT
            FFAPI.variables.designers.designersFilters.style.display = 'block';
            FFAPI.variables.designers.designersFilterSearch.style.display = 'block';
            FFAPI.variables.designers.designersFiltersWrapper.style.display = 'none';

            //REMOVE ACTIVE STATE FROM DROPDOWN TITLES
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersGlyphs.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFiltersGlyphs[i], 'designers-dropdown-name-active');
            }

            //SHOW ALL DROPDOWNS
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersDropdown.length; i++) {
                FFAPI.variables.designers.designersFiltersDropdown[i].style.display = 'block';
            }
            
            //HIDE ALL UL.LIST-REGULAR
            for (var i = 0; i < FFAPI.variables.designers.designersFiltersListRegular.length; i++) {
                FFAPI.variables.designers.designersFiltersListRegular[i].style.display = 'none';
                //NEEDED TO GET IT WORKING
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFiltersListRegular[i], 'show');
            }
        }
    }

    //FUNCTION TO ANIMATE THE SIDEKICK 
    FFAPI.methods.designers.sidekickAnimationOnScroll = function() {
        'use strict';
        var scrollY;

        //set the variable according to the browser
        htmlTag.hasClass('msie') ? scrollY = document.documentElement.scrollTop : scrollY = window.scrollY;

        //ANIMATE ONLY WHEN
        if((FFAPI.variables.designers.windowInnerWidth > FFAPI.responsive.fablet) && (!(((htmlHasIpadClass || htmlHasAndroidClass) && inputIsFocused)))) {
            //set the position of the info banners container and the sidekick according to the scroll position
            if(scrollY > 50) {
                FFAPI.variables.designers.infoBannersContainer.style.top = -(FFAPI.variables.designers.infoBannersContainerHeight + 20) + 'px';
                FFAPI.variables.designers.sidekick.style.top = - 45 + 'px';

            } else if (scrollY < 50) {
                FFAPI.variables.designers.infoBannersContainer.style.top = FFAPI.variables.designers.headerHeight + 'px';
                FFAPI.variables.designers.sidekick.style.top = (FFAPI.variables.designers.headerHeight + FFAPI.variables.designers.infoBannersContainerHeight) + 'px';
            }
        }
    }
   
    //THIS FUNCTION DETERMINATES IF THE SIDEKICK WILL OR NOT ANIMATE ACCORDING TO THE WINDOW WIDTH
    FFAPI.methods.designers.sidekickAnimationState = function (reSetMarginToList) {
        'use strict';
        //RECALCULATE VARS
        FFAPI.variables.designers.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.sidekick);
        FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);

        if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
            //RESET ANIMATION OF THE SIDEKICK
            FFAPI.variables.designers.infoBannersContainer.style.position = 'relative';
            FFAPI.variables.designers.sidekick.style.cssText = 'position:relative;top:0;';
            FFAPI.variables.designers.designersList.style.marginTop = '0';
            FFAPI.variables.designers.searchResults.style.marginTop = '0'; 
            FFAPI.variables.designers.designersFilterSearch.style.display = 'none';
            FFAPI.variables.designers.infoBannersContainer.style.top = '0'; 
        } else if((htmlHasIpadClass || htmlHasAndroidClass) && inputIsFocused) {
            //ACTIVATE THE SIDEKCICK ANIMATION
            FFAPI.variables.designers.infoBannersContainer.style.cssText = 'position:relative;top:0px;';    
            FFAPI.variables.designers.sidekick.style.cssText = 'position:relative;top:0;';
            FFAPI.variables.designers.designersList.style.marginTop = '0px';  
            FFAPI.variables.designers.searchResults.style.marginTop = '0px';
        } else {
            //ACTIVATE THE SIDEKCICK ANIMATION
            FFAPI.variables.designers.infoBannersContainer.style.cssText = 'position:fixed;top:' + FFAPI.variables.designers.headerHeight + 'px;';    
            FFAPI.variables.designers.sidekick.style.cssText = 'position:fixed;top:' + (FFAPI.variables.designers.headerHeight + FFAPI.variables.designers.infoBannersContainerHeight) + 'px;';
            
            //RESET VARS
            FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);
            FFAPI.variables.designers.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.sidekick);
            
            //SET THE MARGIN-TOP TO THE .DESIGNERS-LIST ACCORDING TO THE HEIGHT OF THE ANIMATION-CONTAINER(SIDEKICK)
            if(reSetMarginToList) {
                FFAPI.variables.designers.designersList.style.marginTop = (FFAPI.variables.designers.infoBannersContainerHeight + FFAPI.variables.designers.sidekickHeight) + 'px'; 
                FFAPI.variables.designers.searchResults.style.marginTop = (FFAPI.variables.designers.infoBannersContainerHeight + FFAPI.variables.designers.sidekickHeight) + 'px'; 
            }
        }
    }


    //FUNCTION TO OPEN THE FILTERS ON MOBILE
    FFAPI.methods.designers.openCloseFilters = function () {
        'use strict';

        function openFilter() {
            listingFilterWrapper.addClass('listing-filter-wrapper-open');
            
            if(designersIconSearch.hasClass('search-active')) {
                closeSearch();
            }

            designersFilters.slideDown(function () {
                designersFilterToggle.addClass('dropdown-active color-black');
            });
        }

        function closeFilter(callback) {
            designersFilters.slideUp(function () {
                designersFilterToggle.removeClass('dropdown-active color-black');
                listingFilterWrapper.removeClass('listing-filter-wrapper-open');
                if(callback) callback();
            });
        }

        function openSearch() {
            listingFilterWrapper.addClass('listing-search-wrapper-open');

            if(designersFilterToggle.hasClass('dropdown-active')) {
                closeFilter();
            }

            designersFilterSearch.slideDown(function () {
                designersIconSearch.addClass('search-active color-black');
                designersSearchInput.val('').focus();
            });
        }

        function closeSearch() {
            designersFilterSearch.slideUp(function () {
                designersIconSearch.removeClass('search-active color-black');
                listingFilterWrapper.removeClass('listing-search-wrapper-open');
            });
        }

        if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
            FFAPI.variables.designers.aux = true;
            
            //SHOW/HIDE FILTERS
            designersFilterToggle.on('click', function (e) {

                if(designersFilterToggle.hasClass('dropdown-active')) { // Filter opened
                    closeFilter();
                } else {
                    openFilter();
                }

                e.stopPropagation();
                e.preventDefault();
                
            });

            //SHOW/HIDE SEARCH INPUT
            designersIconSearch.on('click', function (e) {

                if(designersIconSearch.hasClass('search-active')) { // Filter opened
                    closeSearch();
                } else {
                    openSearch();
                }

                e.stopPropagation();
                e.preventDefault();
            });              

            //CLOSE/CLEAR SEARCH INPUT 
            designersIconSearchClose.on('click', function() {
                closeSearch();
            });


            //OPEN THE FILTER CLICKED
            designersDropdownFilter.on('click', function() {
                //REPEATED THE CONDITION OF THE WINDOW WIDTH TO AVOID CONFLICT
                if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
                    //RESET OTHERS
                    designersDropdownFilter.not(this).find('.glyphs').removeClass('designers-dropdown-name-active');
                    designersDropdownFilter.not(this).find('.dropdown').slideUp(FFAPI.variables.animationSpeed);
                    
                    //FOR THE ONE CLICKED
                    var clickedFilter = $(this);
                    clickedFilter.find('.dropdown').slideToggle(FFAPI.variables.animationSpeed, function() {
                        clickedFilter.find('.glyphs').toggleClass('designers-dropdown-name-active');
                    });
                }
            });

        } else {
            //CLOSE/CLEAR SEARCH INPUT 
            designersIconSearchClose.on('click', function() { 
                FFAPI.variables.designers.designersSearchInput.value = '';
            });
        } 
    };

    //FUNCTION TO FIX THE FILTER BUTTON ON MOBILE
    FFAPI.methods.designers.filterButtonFixed = function() {
        'use strict';
        require(['plu_waypoints'], function () {
            require(['plu_waypointsSticky'], function () {


                if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
                    designersFiltersWrapper.waypoint('sticky', {
                        offset: function () {
                            return -(FFAPI.variables.designers.infoBannersContainerHeight + FFAPI.variables.designers.sidekickHeight - FFAPI.variables.designers.headerHeight);
                        }
                    });

                    designersFiltersWrapper.on('click', function () {
                        FFAPI.methods.addClass(FFAPI.variables.designers.designersFilterToggle, 'dropdown-active');
                        FFAPI.methods.addClass(FFAPI.variables.designers.designersFilterToggle, 'color-black');
                        designersFilters.slideDown(FFAPI.variables.animationSpeed);
                        designersFilterSearch.slideUp(FFAPI.variables.animationSpeed);
                    });
                } 
            });
        });
    };

    //FUNCTION TO THE ALPHABETIC FILTERS
    FFAPI.methods.designers.alphabeticFilters = function () {
        'use strict';
         designersFilterListAlphabeticItem.on('click', function(e){
            e.preventDefault();
            
            var targetId = this.id,
            targetDiv = $('.' + targetId);
            //DO ONLY WHEN LETTER IS NOT DISABLED AND SETS VARIABLE TO TRUE TO CONTROL LATTER
            if(!FFAPI.methods.hasClass(this, 'letter-disabled')) {
                var targetDivPosition = targetDiv.offset().top;
                var isNotDisabled = true;
            }
            //SETS JS VARIABLE
            FFAPI.variables.designers.targetDiv = document.getElementsByClassName(targetId)[0];

            //RECALCULATE SO THE SCROLL LANDS CORRECTLY
            FFAPI.variables.designers.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.sidekick);
            FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);
            //CONTROL THE FINAL POSITION ACCORDING TO THE WINDOW WIDTH (DUE TO RELATIVE/FIXED ELEMENTS IN DIFFERENT BREAKPOINTS)
            if(FFAPI.variables.designers.windowInnerWidth < (FFAPI.responsive.fablet + 1)) {
                var finalPosition = targetDivPosition - FFAPI.variables.designers.headerHeight - 30;
            } else {
                var finalPosition = targetDivPosition - (FFAPI.variables.designers.sidekickHeight - 35); 
            }

            //ANIMATE TO THE SELECTED LETTER ON THE FILTER WHEN NOT DISABLED
            if(isNotDisabled) {
                $('html, body').stop().animate({ scrollTop: finalPosition }, FFAPI.variables.animationSpeed);
                e.stopPropagation();
            }
            
            //RESET ALL FILTER LETTERS TO NORMAL STATE
            for(var i = 0; i < designersFilterListAlphabeticItem.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterListAlphabeticItem[i], 'designers-alphabetic-filter-active');  
            }
            
            //ACTIVE STATE ON THE LETTER
            FFAPI.methods.addClass(this, 'designers-alphabetic-filter-active');

            //RESET OPACITY OFF ALL CONTAINERS
            if(isNotDisabled) {
                for(var i = 0; i < FFAPI.variables.designers.designersListItem.length; i++) {
                    FFAPI.methods.addClass(FFAPI.variables.designers.designersListItem[i], 'designers-item-opacity-disable');
                }
            } else {

               for(var i = 0; i < FFAPI.variables.designers.designersListItem.length; i++) {
                    FFAPI.methods.removeClass(FFAPI.variables.designers.designersListItem[i], 'designers-item-opacity-disable');
                } 
            }

            //REMOVE OPACITY FROM THE TARGET DIV TO APPEAR AS ACTIVE STATE
            if(isNotDisabled) { 
                FFAPI.methods.removeClass(FFAPI.variables.designers.targetDiv, 'designers-item-opacity-disable');
            }
        });

        $('body').on('click', function() {
            //RESET ALL THE CONTAINERS TO NORMAL
            for(var i = 0; i < FFAPI.variables.designers.designersListItem.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersListItem[i], 'designers-item-opacity-disable');
            }

            //RESET ALL FILTER LETTERS TO NORMAL STATE
            for(var i = 0; i < designersFilterListAlphabeticItem.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterListAlphabeticItem[i], 'designers-alphabetic-filter-active');  
            }
        });
    };

    FFAPI.methods.designers.activateLetterGroup = function () {
        designersListItemTitle.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            //SET OPACITY OFF ALL CONTAINERS
            for(var i = 0; i < FFAPI.variables.designers.designersListItem.length; i++) {
                FFAPI.methods.addClass(FFAPI.variables.designers.designersListItem[i], 'designers-item-opacity-disable');
            }

            //RESET ALL FILTER LETTERS TO NORMAL STATE
            for(var i = 0; i < designersFilterListAlphabeticItem.length; i++) {
                FFAPI.methods.removeClass(FFAPI.variables.designers.designersFilterListAlphabeticItem[i], 'designers-alphabetic-filter-active');  
            }

            $(this).parents('.designers-list-item').removeClass('designers-item-opacity-disable');

            //GET THE LETTER OF THE CLICKED ELEMENT AND USE IT TO ACTIVATE THE LETTER ON THE FILTER BY ADDING THE CLASS 
            var contentLetter = this.innerHTML.toLowerCase(),
            idToActivate = 'js-item-' + contentLetter; 

            var elementToActivate = document.getElementById(idToActivate);

            FFAPI.methods.addClass(elementToActivate, 'designers-alphabetic-filter-active');
        });
    };


    //FUNCTION TO CONTROL THE designers LIST AND RESULTS OF SEARCH ACCORDING TO THE STATE OF THE INPUT
    FFAPI.methods.designers.designersSearchResults = function() {        
        if(FFAPI.variables.designers.designersSearchInput.value != '') {
            //HIDE THE designers LIST
            FFAPI.variables.designers.designersList.style.display = 'none';

            //RECALCULATE ANIMATION CONTAINER HEIGHT (TO FIX BUG)
            FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);
            FFAPI.variables.designers.windowInnerWidth = window.innerWidth;
            
            //SHOW THE RESULTS
            FFAPI.methods.removeClass(FFAPI.variables.designers.searchResults, 'hide');
        } else {
        
            //SHOW THE designers LIST
            FFAPI.variables.designers.designersList.style.display = 'block';
            //HIDE THE RESULTS
            FFAPI.methods.addClass(FFAPI.variables.designers.searchResults, 'hide');
        }
        

        //FUNCTION TO CLEAR THE SEARCH RESULTS
        clearButtonSearch.on('click', function() {
            //SHOW  THE designers LIST
            FFAPI.variables.designers.designersList.style.display = 'block';
            //HIDE THE RESULTS
            FFAPI.methods.addClass(FFAPI.variables.designers.searchResults, 'hide');
        
            //CLEAR THE VALUEo OF INPUT
            FFAPI.variables.designers.designersSearchInput.value = '';
        });

        //FUNCTION FOR THE CLEAR INPUT BUTTON
        FFAPI.variables.designers.designersIconSearchClose.onclick = function() {
            //FORCE THE CLICK OF THE CLEAR RESULTS TO RUN HIS FUNCTION
            clearButtonSearch.click();
        };
    };

    //FUNCTION ON RESIZE
    $(window).smartresize(function () {
       'use strict';
        //RECALCULATE VARIABLES
        FFAPI.variables.designers.headerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.header);
        FFAPI.variables.designers.infoBannersContainerHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.infoBannersContainer);
        FFAPI.variables.designers.sidekickHeight = FFAPI.methods.getElementHeight(FFAPI.variables.designers.sidekick);
        FFAPI.variables.designers.windowInnerWidth = window.innerWidth;
        
        //RUN FUNCTIONS ON RESIZE
        FFAPI.methods.designers.designersSearchResults();

        //TO AVOID ANDROID BUG
        if(!(htmlHasAndroidClass && FFAPI.variables.designers.windowInnerWidth < FFAPI.responsive.fablet)) {
            FFAPI.methods.designers.GlobalSettings();
            FFAPI.methods.designers.sidekickAnimationState(true);
        }
        FFAPI.methods.designers.filterButtonFixed();
        FFAPI.methods.designers.alphabeticFilters();

        //TO AVOID PROPAGATION OF THE SLIDETOGGLE
        if(!(FFAPI.variables.designers.aux || (htmlHasAndroidClass && FFAPI.variables.designers.windowInnerWidth < FFAPI.responsive.fablet))) {
           FFAPI.methods.designers.openCloseFilters();
        }
        //TO AVOID BUGS ON ANDROID
        FFAPI.methods.designers.sidekickAnimationOnScroll();

        //TO AVOID BUG ON ANDROID
        if(!htmlHasAndroidClass) {
            FFAPI.methods.designers.designersSearchResults();
        }
    });
 
    //FUNCTION ON SCROLL
    $(document).on('scroll', function(){
        'use strict';
        //RUN FUNCTIONS ON SCROLL
        FFAPI.methods.designers.sidekickAnimationOnScroll();
    });

    //RUN FUNCTIONS ON PAGE LOAD
    FFAPI.methods.designers.GlobalSettings();
    FFAPI.methods.designers.sidekickAnimationState(true);
    FFAPI.methods.designers.filterButtonFixed();
    FFAPI.methods.designers.alphabeticFilters();
    FFAPI.methods.designers.activateLetterGroup();
    FFAPI.methods.designers.openCloseFilters();

    //TO MAKE THE DROPDOWN WORK AS PRETENDED (ONE CLOSES THE OTHERS)
    $(document).ready(function($) {
        require(['plu_dropdown'], function () {
            FFAPI.plugins.methods.initJQueryDropdowns($(document), true);
        });
    });    


    //FUNCTION TO UPDATE THE STATE OF THE ELEMENTS ACCORDING TO THE VALUE OF THE INPUT
    designersSearchInput.on('keyup', function(){
        FFAPI.methods.designers.designersSearchResults();
    });


    //WHEN CLOSING THE INFO BANNER RUN THE FUNCTION TO RECALCULATE THE ANIMATION OF THE SIDEKICK
    $('.close-info-banner').on('click', function(){ 
        setTimeout(function(){
            if(FFAPI.variables.designers.windowInnerWidth > FFAPI.responsive.fablet){
                FFAPI.methods.designers.sidekickAnimationState(false);
                FFAPI.methods.designers.sidekickAnimationOnScroll();
            }
        }, FFAPI.variables.animationSpeed);
    });

    FFAPI.methods.designers.autoCloseInfoBanner = function() {
        FFAPI.variables.infoBanner = document.getElementsByClassName('info');
        
        for(var i = 0; i < FFAPI.variables.infoBanner.length; i++) {
            var attrState = FFAPI.variables.infoBanner[i].getAttribute('data-auto-close');
            if(attrState === 'true') {
                FFAPI.methods.elSlideUp($(FFAPI.variables.infoBanner[i]), FFAPI.variables.slideUpSpeed);
                setTimeout(function() {
                    if(FFAPI.variables.designers.windowInnerWidth > FFAPI.responsive.fablet){
                        FFAPI.methods.designers.sidekickAnimationState(false);
                        FFAPI.methods.designers.sidekickAnimationOnScroll();
                    }
                }, (FFAPI.variables.slideUpSpeed + FFAPI.variables.animationSpeed));     
            } 
        }  
    };
    
    FFAPI.methods.designers.autoCloseInfoBanner();