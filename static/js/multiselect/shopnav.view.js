function registerItemRefresh(templateFile) {
    WebUIShopNavEngine.RefreshRegister(
        'Item',
        '#listingItems',
        null,
        'FFLoad',
        false,
        function (event, JsonData) {
            try {
                if (JsonData != null) {
                    if (JsonData.products === undefined || JsonData.products == null || JsonData == []) {
                        BindingItem();
                    }
                    else {
                        if (JsonData.error == null) {
                            date_ini = new Date();
                            date_ini = date_ini.getTime();
                            var item_start = new Date();
                            item_start = item_start.getTime();
                            //var listWrapper = document.getElementById('listItemWrapper');
                            //listWrapper.removeChild(document.getElementById('listItem'));
                            // asynchronous get - gets the template and passes it to mustache
                            $.ajax({
                                url: templateFile,
                                success: function (template) {
                                    var backToTop = document.getElementById("dvtBackToTop");
                                    if (backToTop) {
                                        if (JsonData.products.length <= 6) {
                                            backToTop.style.display = "none";
                                        } else {
                                            backToTop.style.display = "block";
                                        }
                                    }
                                    var mustache_start = new Date().getTime();
                                    // get category name
                                    var seo = $('.sidekick-seo h1');
                                    var categoryName = "";
                                    if (seo.length > 0) {
                                        categoryName = seo.text().trim();
                                        JsonData.CategoryName = categoryName;
                                    }
                                    // end
                                    $("#listingItems ul.listing-item").html(Mustache.to_html(template, JsonData).replace(/^\s*/mg, ''));
                                    FFAPI.methods.addBlankLinks();

                                    FFAPI.listing.methods.refreshWishlistIcons();
                                    try {
                                        if (window.universal_variable.listing.hasOwnProperty("items") && typeof (window.universal_variable.listing.items !== "undefined")) {
                                            var productObj = {};
                                            var JsonDataParse = {};
                                            window.universal_variable.listing.items = [];

                                            for (var j = 0; j < JsonData.products.length; j++) {
                                                JsonDataParse = JsonData.products[j];
                                                productObj = {
                                                    "designerName": JsonDataParse.DesignerName,
                                                    "id": JsonDataParse.Id,
                                                    "name": JsonDataParse.Description,
                                                    "storeId": JsonDataParse.StoreID
                                                }
                                                window.universal_variable.listing.items.push(productObj);

                                            }

                                        }
                                    } catch (e) { }
                                    BindingItem();
                                },
                                dataType: 'html'
                            });
                        } else {
                            var listWrapper = document.getElementById('listItemWrapper');
                            listWrapper.removeChild(document.getElementById('listItem'));
                            var listItem = document.createElement('div');
                            listItem.id = 'listItem';
                            listItem.innerHTML = document.getElementById('errorDiv').innerHTML;
                            listWrapper.insertBefore(listItem, listWrapper.firstChild);
                        }
                    }
                }
            } catch (err) { }
        }
    );
}

function BindingItem() {
    try {
        var gotoItem = WebUIShopNavEngine.QSPagingGoToGet();
        if (gotoItem && !isNaN(Number(gotoItem))) {
            var aux = $(".listingItemWrap" + gotoItem).offset().top - 100;
            if (aux < 1000) {
                aux -= 100;
            }
            scrollTo(0, aux);
            WebUIShopNavEngine.QSPagingGoToSet(0);
        } else {
            var scrollToPos = $.cookie("FF-SHOPNAV-SCROLLPOS");
            if (!isNaN(Number(scrollToPos))) {
                scrollTo(0, scrollToPos);
            }
        }
        // If trigger was prevented, certona won't fire.
        $("#MultiSelectCallbackCenter").trigger({
            type: "item-render.multiselect",
            fireCertona: !FFAPI.listing.variables.preventMSTrigger
        });
        FFAPI.listing.variables.preventMSTrigger = false;
        //FFAPI.listing.methods.bindAddToWishListButtons();
    } catch (err) { }
}

$("#MultiSelectCallbackCenter").bind("item-render.multiselect", function () {
    // scroll fix, deactivate scroll temporarily
    var tmp = window.scroll;
    window.scroll = null;
    $("#listItem").find(".lazyimg").lazyload({
        effect: "fadeIn"
    });
    window.scroll = tmp;
});
if (ffbrowser.isIE8 !== true) {
    $(window).bind("scroll", function () {
        var scrollPos = window.pageYOffset || window.pageYOffset > 0 ? window.pageYOffset : document.documentElement.scrollTop;
        if (scrollPos >= 0) {
            $.cookie("FF-SHOPNAV-SCROLLPOS", scrollPos);
        }
    });
}
/*TESTING NOW*/
