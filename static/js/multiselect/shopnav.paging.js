function registerPagingRefresh(templatePaging, templateViews, ViewsAvailable, QSPagingID, QSPagingView, QSPagingTotal) {
    FFAPI.listing.methods.bindPaginationEvents(QSPagingID, QSPagingView);
    WebUIShopNavEngine.RefreshRegister(
        'Paging',
        '#PagingContent',
        null,
        'FFLoad',
        false,
        function (event, JsonData) {
            try {
                if (JsonData != null) {
                    if (JsonData.error == null) {

                        var intActualPage = JsonData.PagingData[QSPagingID];
                        var intItemsPage = JsonData.PagingData[QSPagingView];
                        var intItemsTotal = JsonData.PagingData[QSPagingTotal];
                        var itemTrans = JsonData.PagingData["it"];
                        

                        date_ini = new Date();

                        date_ini = date_ini.getTime();
                        var item_start = new Date();
                        item_start = item_start.getTime();
                        // asynchronous get - gets the template and passes it to mustache
                        $.ajax({
                            url: templatePaging,
                            dataType: 'html',
                            success: function (template) {
                                var mustache_start = new Date().getTime();
                                var listingPagingWrapper = document.getElementById("listingPagingWrapper");
                                if (typeof (JsonData.Pages) !== "undefined" && JsonData.Pages != null) {
                                    document.getElementById("PagingContentBottom").innerHTML = listingPagingWrapper.innerHTML = Mustache.to_html(template, JsonData.Pages);
                                } else {
                                    document.getElementById("PagingContentBottom").innerHTML = listingPagingWrapper.innerHTML = "&nbsp;";
                                }

                                // Puts items total inside div#totalItemsMultiSelect
                                $("#dvtItemsOnCategoryMultiSelect span").html(intItemsTotal + " " + itemTrans);
                                FFAPI.listing.methods.bindPaginationEvents(QSPagingID, QSPagingView);
                                var seo = $('.sidekick-seo h1');
                                if (seo.length > 0) {
                                    $('.listing-seo h2:first').text(seo.text().trim());
                                }

                            }
                        });
                        $.ajax({
                            url: templateViews,
                            dataType: 'html',
                            success: function (template) {
                                var mustache_start = new Date().getTime();
                                if (typeof (JsonData.Views) !== "undefined" && JsonData.Views != null) {
                                    document.getElementById("listingView").innerHTML = Mustache.to_html(template, JsonData.Views);
                                } else {
                                    document.getElementById("listingView").innerHTML = "&nbsp;";
                                }
                                FFAPI.listing.methods.bindPagingViewItemsEvents(QSPagingID, QSPagingView);
                            }
                        });
                    } else {
                        var PagingHeader = document.getElementById('PagingHeader');
                        PagingHeader.removeChild(document.getElementById('PagingContent'));
                        var PagingContent = document.createElement('div');
                        PagingContent.id = 'PagingContent';
                        PagingContent.innerHTML = document.getElementById('errorDiv').innerHTML;
                        PagingHeader.insertBefore(listItem, PagingHeader.firstChild);
                    }
                }
            } catch (err) { }
        } // CALLBACK
    );         // REFRESH REGISTER
}

function PagingItemClick(objItem, ID, QSPagingID, QSPagingView) {
    var jQObjItem = $(objItem);
    WebUIShopNavEngine.UISelectedSet($(ID), false);
    WebUIShopNavEngine.UISelectedSet(jQObjItem, true);
    var PagingSelectorItem = 0;
    var PagingViewItem = 0;
    try {
        PagingSelectorItem = $(".PagingSelectorItem.active").data("paging")[QSPagingID];
    } catch (err) {
        PagingSelectorItem = 1;
    }
    try {
        PagingViewItem = $(".PagingViewItem.active").data("paging")[QSPagingView];
    } catch (err) {
        PagingViewItem = 60;
    }
    var go_to = null;
    if (ID == ".PagingViewItem") {
        var prods = $("#listingItems ul.listing-item").find(".listingItemWrap");
        if (prods.length) {
            var index = 0;
            if (jQObjItem.parents("#PagingContentBottom").length) {
                index = prods.last().attr("data-index");
            } else {
                index = prods.first().attr("data-index");
            }
            if (index >= 4) {
                PagingSelectorItem = Math.ceil(index / PagingViewItem);
                go_to = index;
            }
        }
    }
    WebUIShopNavEngine.PagingGet(PagingSelectorItem, PagingViewItem, go_to);
}
