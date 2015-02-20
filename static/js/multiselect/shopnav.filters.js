function filterItemClick(jQElem, QSFilterID, QSFilterIDDeep, propertyID, propertyDeep, QSValueID, QSValueSep, BlockedOnBottom) {
    WebUIShopNavEngine.QSPagingSelectorSet(1);

    var fullFilterID = QSFilterID + propertyID + QSFilterIDDeep + propertyDeep; // Force string concat
    var JsonAct = FFAPI.listing.lastJsonAct[fullFilterID],
        JsonSel = FFAPI.listing.lastJsonSel[fullFilterID];

    if ($('#FilterMain' + fullFilterID).hasClass("disabled")) {
        return false;
    }

    //CHANGE SELECTED
    var blnIsSelected = jQElem.hasClass("active"),
        blnIsblocked = false,
        blnFilterBlock = true,
        jQElemData = jQElem.data("filter");
    var PropId = jQElemData[QSFilterID],
        PropVal = jQElemData[QSValueID],
        PropDeep = jQElemData[QSFilterIDDeep];

    //ONLY VERIFIES BLOCKING BEHAVIOUR IF FILTER IS A BLOCKING FILTER
    if (blnFilterBlock) {
        blnIsblocked = jQElem.hasClass("blocked");
    }
    WebUIShopNavEngine.QSFilterLastSelSet(PropId, PropDeep);

    if (blnIsblocked) {
        //THE ONLY ACTION POSSIBLE WHEN IT IS BLOCKED IS TO DESELECT THE ITEM.
        //NO NEED TO CALL SERVER BECAUSE IF IT IS BLOCKED IS BECAUSE IN ACTUAL STATE OF FILTERS
        //THERE ARE NO ITEMS TO THIS VALUE OF FILTER
        //AND THE SELECTED SITUATION COMES FROM PREVIOUS ITERACTION BEFORE BLOCKING OCCURS
        if (blnIsSelected) {
            //CHANGE SIGNAL TO PASS IT TO ENGINE AND INFORM ACTUAL VALUE OF CLICK
            blnIsSelected = !blnIsSelected;
            WebUIShopNavEngine.UISelectedSet('#' + jQElem.attr('id'), blnIsSelected);
            WebUIShopNavEngine.QSChangeSelect(PropId, PropDeep, PropVal, blnIsSelected);
        }
    }
    else {
        //CALL FFWeb.UI.ShopNav.Filter
        //CHANGE SIGNAL TO PASS IT TO ENGINE AND INFORM ACTUAL VALUE OF CLICK
        blnIsSelected = !blnIsSelected;
        WebUIShopNavEngine.UISelectedSet('#' + jQElem.attr('id'), blnIsSelected);
        WebUIShopNavEngine.FilterGet(PropId, PropDeep, PropVal, blnIsSelected);
        if (blnIsSelected) {
            $('#FilterClear' + fullFilterID).removeClass('hide');
            $('.FilterClearAllLink').removeClass('hide');
        }
    }
}

//Filter dependencies; finds every children with dependencies and returns array of dependencies.
//Caller decides whether the dependencies will be shown or hidden
function findDeps(elemID) {
    var localArrDeps = [];
    if (typeof (jsonDependencyList) != "undefined") {
        if (jsonDependencyList.hasOwnProperty(elemID)) {
            var arr = jsonDependencyList[elemID];
            if (arr.length) {
                // array deep copy, so original dependencies are unaltered
                localArrDeps = $.extend(true, [], arr);
            }
        }
    }
    return localArrDeps;
}

function filterClearClick(QSFilterID, QSFilterIDDeep, propertyID, propertyDeep, QSValueID, QSValueSep, BlockedOnBottom, blnRefresh) {
    var fullFilterID = QSFilterID + propertyID + QSFilterIDDeep + propertyDeep,
        blnFilterDisabled = $('#FilterMain' + fullFilterID).hasClass("disabled"),
        FilterItemData = null,
        jQFilterItem = null,
        PropID = null,
        PropDeep = null,
        PropVal = null,
        blockedItems = null,
        activeItems = null;
    if (blnFilterDisabled) {
        return false;
    }

    blockedItems = $('.FilterListItem.' + fullFilterID + ' a.blocked');
    for (var i = 0, length = blockedItems.length; i < length; i++) {
        jQFilterItem = blockedItems.eq(i);
        if (jQFilterItem.attr("id").indexOf("_blocked") == -1) {
            if (jQFilterItem.hasClass("active")) {
                //WE ARE UNBLOCKING A SELECTED BLOCKED ITEM
                //MUST CHANGE QS
                //FOR EVERY BLOCKED SELECTED ELEMENT WE MUST CHANGE VALUE TO NEGATIVE
                FilterItemData = jQFilterItem.data("filter");
                WebUIShopNavEngine.QSSelectedBlockedSet(FilterItemData[QSFilterID], FilterItemData[QSFilterIDDeep], FilterItemData[QSValueID], false);
            }
            WebUIShopNavEngine.UIBlockedSet('#' + jQFilterItem.attr('id'), false, BlockedOnBottom, null)
        }
    }

    //SELECT ALL ITEMS SELECTED WITH SELECTOR AND UPDATE IT
    //activeItems = $('.FilterListItem.' + fullFilterID + ' a.active');
    activeItems = $('.FilterListItem.' + fullFilterID + ' input:checked');
    for (var i = 0, length = activeItems.length; i < length; i++) {
        jQFilterItem = activeItems.eq(i).closest('.FilterListItemLink');
        FilterItemData = jQFilterItem.data("filter");
        WebUIShopNavEngine.UISelectedSet('#' + jQFilterItem.attr('id'), false);
        PropID = FilterItemData[QSFilterID];
        PropDeep = FilterItemData[QSFilterIDDeep];
        PropVal = FilterItemData[QSValueID];
        WebUIShopNavEngine.QSChangeSelect(PropID, PropDeep, PropVal, false);
    }
    if (fullFilterID == 'f1d0') {
        popupActiveItems = $('input:checked.FilterPopUpListItemLink.' + fullFilterID);
        if (popupActiveItems != null && popupActiveItems.length > 0) {
            for (var i = 0, length = popupActiveItems.length; i < length; i++) {
                jQFilterItem = popupActiveItems.eq(i);
                FilterItemData = jQFilterItem.data("filter");
                WebUIShopNavEngine.UISelectedSet('#' + jQFilterItem.attr('id'), false);
                PropID = FilterItemData[QSFilterID];
                PropDeep = FilterItemData[QSFilterIDDeep];
                PropVal = FilterItemData[QSValueID];
                WebUIShopNavEngine.QSChangeSelect(PropID, PropDeep, PropVal, false);
            }
        }
    }

    if (blnRefresh) {
        //LAST ITEM SAVED GETS DATA
        WebUIShopNavEngine.FilterGet(PropID, PropDeep, PropVal, false);
    }
}

function filterRefreshRegister(QSFilterID, QSFilterIDDeep, propertyID, propertyDeep, QSValueID, QSValueGroupID, RefreshFunc, BlockedOnBottom, scrollActive, scrollItemsToShow, scrollHeight, PropType) {
    var fullFilterID = QSFilterID + propertyID + QSFilterIDDeep + propertyDeep,
        blockedList = null,
        filterList = $("#FilterList" + fullFilterID),
        filterListItems = filterList.children("li"),
        filterListLength = filterListItems.length,
        filterLinks = filterListItems.children("label").children("a"),
        filterContent = null,
        preventClick = function (event) {
            event.preventDefault();
            return false;
        };
    if (BlockedOnBottom) {
        blockedList = $("#FilterList" + fullFilterID + "_blocked");

        // Copy list to bottom
        blockedList.html(filterList.html());

        // Prevent click
        var blockedLinks = blockedList.find("li > a");

        // Change IDs
        for (var i = 0, length = blockedLinks.length; i < length; i++) {
            elem = blockedLinks.eq(i);
            elem.attr("id", elem[0].id + "_blocked")
                .bind("click", preventClick)
                .removeClass("blocked")
                    .parent()
                    .addClass("blockedOnBottom");
        }
    }

    if (scrollActive && filterListLength >= scrollItemsToShow) {
        filterContent = filterContent || $('#FilterContent' + fullFilterID);

        // Fix height and init scrolling plugin
        //todo:
        /*
        filterContent
            .height(scrollHeight)
            .jScrollPane({ verticalDragMinHeight: 20 });*/
    }

    filterLinks.unbind("click").bind("click", function (e) {
        e.preventDefault();
        var mayContinue = this;

        //Specific Behaviour for Filter (Loaded or not in section below: find tag #SPECIFIC BEHAVIOUR#)
        if (typeof window.FFAPI.listing.filterClick[propertyID][propertyDeep] === "function") {
            // Changes click context (or not). filterClick always has to return a javascript element or null
            mayContinue = window.FFAPI.listing.filterClick[propertyID][propertyDeep](e);
        }

        if (mayContinue) {
            var jq = $(mayContinue);

            if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract(jq); }
            filterItemClick(
                jq,
                QSFilterID,
                QSFilterIDDeep,
                propertyID,
                propertyDeep,
                QSValueID,
                QSValueGroupID,
                BlockedOnBottom
            );
        }

        fireQubitFilterEvents(PropType);
        return false;
    }); //FILTER ITEM CLICK

    $(".FilterClear." + fullFilterID + " span").unbind("click").bind("click", function (e) {
        e.preventDefault();
        // #SPECIFIC BEHAVIOUR#
        if (typeof window.FFAPI.listing.filterClear[propertyID][propertyDeep] === "function") {
            FFAPI.listing.filterClear[propertyID][propertyDeep]();
        }
        // #SPECIFIC BEHAVIOUR#
        filterClearClick(QSFilterID, QSFilterIDDeep, propertyID, propertyDeep, QSValueID, QSValueGroupID, BlockedOnBottom, /* blnRefresh */ true);
        fireQubitFilterEvents(PropType);
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse('{ "tid": 237, "val": "' + fullFilterID + '" }'); }
        return false;
    }); //FILTER CLEAR CLICK

    WebUIShopNavEngine.RefreshRegister(
        'Filter',
        '#filterWrapper',
        fullFilterID,
        'FFLoad',
        false,
        function (event, JsonData) {
            var FilterID = JsonData.FilterID,
                JsonDataSel = JsonData.PropsSel,
                JsonDataAct = JsonData.PropsAct;

            FFAPI.listing.lastJsonSel[fullFilterID] = JsonDataSel;
            FFAPI.listing.lastJsonAct[fullFilterID] = JsonDataAct;

            if (fullFilterID == 'f1d0') {
                //save designers "raw" filter to be used in the "More Designers" dialog
                if (FFAPI.listing.lastJsonActRaw == null) {
                    FFAPI.listing.lastJsonActRaw = {
                        "f1d0": []
                    };
                }

                if (FFAPI.listing.lastJsonActRaw[fullFilterID].length < JsonDataAct.length) {
                    FFAPI.listing.lastJsonActRaw[fullFilterID] = JsonDataAct;
                }
            }

            if (JsonDataSel.length > 0) {
                //************** SELECTED AREA **************
                //FOR EACH ITEM FROM JSON OF SELECTED VALUES ON QUERY
                for (var i = 0; i < JsonDataSel.length; i++) {
                    var arrJsonID = [JsonDataSel[i]];
                    if (JsonDataSel[i].toString().indexOf(QSValueGroupID) != -1) {
                        arrJsonID = JsonDataSel[i].split(QSValueGroupID);
                    }
                    /**************** PARSEINT ****************/
                    var jsonID = parseInt(JsonDataSel[i]);
                    /**************** PARSEINT ****************/
                    if (jsonID < 0) {
                        jsonID = (jsonID * -1);
                    }

                    var jsonIDFinal = jsonID;
                    if (arrJsonID.length == 2) {
                        jsonIDFinal += QSValueGroupID + arrJsonID[1]
                    }
                    WebUIShopNavEngine.UISelectedSet('#' + fullFilterID + QSValueID + jsonIDFinal, true);

                    var elemLink = $('#' + fullFilterID + QSValueID + jsonIDFinal);
                    //elemLink.find('input').prop('checked', true);
                    //$('#FilterClear' + fullFilterID).removeClass('hide');
                    //$('.FilterClearAllLink').removeClass('hide');
                    var accordion = elemLink.closest('.FilterMain.dropdown-accordion');
                    if (accordion.length > 0) {
                        accordion.addClass('dropdown_open');
                        elemLink.closest('ul').first().slideDown();
                        accordion.find('.FilterHeader').addClass("menuOpen");
                    }
                    else {
                        var ms_element = elemLink.closest('.ms-parent');
                        if (!ms_element.hasClass('ms-parent-open')) {
                            ms_element.find('.ms-choice').click();
                        }
                    }
                }
                //************** SELECTED AREA **************
            } else {
                $('#FilterClear' + fullFilterID).removeClass('show').addClass('hide');
            }

            //************** BLOCKED AREA **************
            var blnFilterBlock = true;
            var JsonDataCaller = JsonData.IDFilterCaller;
            var blnNoSelection = true;
            //var $ElemsSelAux = $('.FilterListItem.' + fullFilterID + ' a.active');
            var $ElemsSelAux = $('.FilterListItem.' + fullFilterID + ' input:checked');

            //TO SEE NO SELECTION SELECT ALL SELECTED ITEMS AND SEE IF NOT BLOCKED
            for (var i = 0; i < $ElemsSelAux.length; i++) {
                var Elem = $ElemsSelAux[i];
                if ($(Elem).hasClass("blocked") == false) {
                    blnNoSelection = false;
                }
            }

            //ONLY REFRESH BLOCKED IF:
            //1 - FILTER IS BLOCKING
            //2.1 - NOT THE CALLER
            //2.2 - OR IS THE CALLER BUT HAS NO SELECTION
            if ((JsonDataCaller != FilterID) || (JsonDataCaller = FilterID && blnNoSelection)) {
                //BY DEFAULT BLOCKS ALL ITEMS
                WebUIShopNavEngine.UIBlockedSet($('.FilterListItemLink.' + fullFilterID + ':not(.asyncAdded)'), true, BlockedOnBottom, fullFilterID);
                FFAPI.listing.lastJsonActHash[fullFilterID] = {};
                for (var i = 0; i < JsonDataAct.length; i++) {
                    var jsonID = JsonDataAct[i].Value;
                    if (JsonDataAct[i].Group > 0) {
                        jsonID += QSValueGroupID + JsonDataAct[i].Group;
                    }
                    // Store hash with current active (not selected) values
                    FFAPI.listing.lastJsonActHash[fullFilterID][QSValueID + jsonID] = 1;
                    WebUIShopNavEngine.UIBlockedSet('#' + fullFilterID + QSValueID + jsonID, false, BlockedOnBottom, null);
                }
            }
            //************** BLOCKED AREA **************

            //************** SELECTED BLOCKED AREA **************
            //*** REMOVE NEGATIVE IDs ***
            //var $elemsSel = $("#FilterList" + fullFilterID).find("a.active"),
            var $elemsSel = $("#FilterList" + fullFilterID).find("input:checked"),
                jQElemData = null;
            for (var i = 0, length = $elemsSel.length; i < length; i++) {
                jQElemData = jQElemData = $elemsSel.eq(i).parent().data("filter");
                if (jQElemData == undefined)
                    jQElemData = $elemsSel.eq(i).parent().parent().data("filter");

                //FOR EVERY SELECTED ELEMENT WE MUST CHANGE VALUE TO POSITIVE
                WebUIShopNavEngine.QSSelectedBlockedSet(jQElemData[QSFilterID], jQElemData[QSFilterIDDeep], jQElemData[QSValueID], false);
            }
            //*** REMOVE NEGATIVE IDs ***

            //*** ADD NEGATIVE IDs ***
            var $ElemsSelBlock = $('#FilterList' + fullFilterID).find("a.blocked.active"),
                jQElemData = null;
            for (var i = 0; i < $ElemsSelBlock.length; i++) {
                jQElemData = $ElemsSelBlock.eq(i).data("filter");
                //FOR EVERY BLOCKED SELECTED ELEMENT WE MUST CHANGE VALUE TO NEGATIVE
                WebUIShopNavEngine.QSSelectedBlockedSet(jQElemData[QSFilterID], jQElemData[QSFilterIDDeep], jQElemData[QSValueID], true);
            }
            if (typeof RefreshFunc === "function") {
                RefreshFunc();
            }
        }
    );
}

require(['loads'], function () {
    $(document).ready(function () {
        require(['essentials'], function () {
            $(".FilterClearAllLink").bind("click", function (e) {
                e.preventDefault();
                window.location.hash = "";
                // Visually clean the UI
                $('.FilterListItemLink.active').each(function () {
                    WebUIShopNavEngine.UISelectedSet('#' + $(this).attr('id'), false);
                });
                $("#txtPriceMin").val("");
                $("#txtPriceMax").val("");
                $("#txtPriceMin").removeClass('form-validator_error');
                $("#txtPriceMax").removeClass('form-validator_error');
                $('.toplevel_active').removeClass("toplevel_active");
                $('.FilterClear').addClass('hide');
                $('.FilterClearAllLink').addClass('hide');
                $('.ms-search .js-input-text-clear').click();
                WebUIShopNavEngine.FilterGet(0, 0, 0, false);
                if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("81"); }
                return false;
            });
        });
    });
});

var fireQubitFilterEvents = function (propType) {
    if (!propType) {
        return;
    }
    propType = parseFloat(propType, 10);
    try {
        switch (propType) {
            case 1://Brand
                FFAPI.methods.fireQubitEvents("Click on any designer ﬁlter", "designer ﬁlter");
                break;
            case 2://Style
                break;
            case 3:/*Color*/ case 64:/*AllColors*/ case 990:/*MainColor*/ case 989:/*SecColor*/
                FFAPI.methods.fireQubitEvents("Click on any colour ﬁlter", "colour ﬁlter");
                break;
            case 4://Detail
                break;
            case 5://Gender
                break;
            case 9://Season
                break;
            case 10://Material
                break;
            case 11://Department
                FFAPI.methods.fireQubitEvents("Click on any department ﬁlter", "department filter");
                break;
            case 30://Categories
                FFAPI.methods.fireQubitEvents("Click on any category ﬁlter", "category ﬁlter");
                break;
            case 31://Attributes
                break;
            case 60://Boutique
                FFAPI.methods.fireQubitEvents("Click on any boutique ﬁlter", "boutique ﬁlter");
                break;
            case 61://BoutiqueLocation
                FFAPI.methods.fireQubitEvents("Click on any location ﬁlter", "location filter");
                break;
            case 62://Size
                FFAPI.methods.fireQubitEvents("Click on any size ﬁlter", "size ﬁlter");
                break;
            case 63://Price
                FFAPI.methods.fireQubitEvents("Click on any price ﬁlter", "price ﬁlter");
                break;
            default:
                break;
        }
    } catch (e) { }
};