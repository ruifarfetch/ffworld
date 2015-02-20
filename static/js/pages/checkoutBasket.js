/************* SHOPPING BAG ***************/

// { INIT VARIABLES }

FFAPI.basket = FFAPI.basket || {};
FFAPI.basket.methods = FFAPI.basket.methods || {};
FFAPI.basket.variables = FFAPI.basket.variables || {};
FFAPI.basket.variables.CertonaInterval = null;
FFAPI.basket.variables.CertonaTimeout = null;

FFAPI.basket.methods.BindsOnBasketRefresh = function () {
    //Bind Rollover
    $('.no-touch .sliderTabs-slide').rollover({});
    //Bind Tooltips
    tooltips();
    //Bind Sticky
    $('.sticky').fixTo('.sticky-holder', { mind: "header" });
    //Bind Clicks on cancel and change 
    //FFAPI.basket.methods.BindClicksChangeCancel();
    //Bind Chosen Dropdowns
    $('.selectForm').chosen();
    $.validator.unobtrusive.parse(document);
}

FFAPI.basket.methods.BindsOnWishlistRefresh = function () {
    //FFAPI.basket.methods.BindClicksChangeCancel();
    $('.selectForm').chosen();
    FFAPI.basket.methods.UpdateHeaderWishlist();
    $.validator.unobtrusive.parse(document);
}

// { METHODS }

//METHODS FOR REFRESHING HEADER ON SHOPPING BAG ACTIONS
FFAPI.basket.methods.init = function (uv, refreshAllPage) {
    var localthis = this,
        basketWrapper = $("#basketWrapper");

    this.BindMoveToBag(localthis);
    this.BindChangeSize(basketWrapper, localthis);
    //this.BindRemoveWishListItem(basketWrapper);
    //this.BindChangeQuantity(basketWrapper);
    this.BindWishlistChangeQuantity(basketWrapper, localthis);
    //this.BindFancyBox();
    //this.BindTooltips();
    //this.BindDocument();

};

FFAPI.basket.methods.UpdateHeaderBag = function () {
    var itemCount = $("#orderItemsCountInfo").val(),
        totalAmmount = $("#orderTotalInfo").val();
    if (totalAmmount == undefined) {
        var bagTotalFormatted = $('.js-bag-total-formatted');
        if (bagTotalFormatted != undefined) {
            totalAmmount = bagTotalFormatted.data('empty-bag-total');
        }        
    }
    if (itemCount == undefined) {
        itemCount = 0;
    }
    FFAPI.methods.header.updateBagTotal(totalAmmount);
    FFAPI.methods.header.updateBagItemCount(itemCount);
}

FFAPI.basket.methods.UpdateHeaderWishlist = function () {
    var itemCount = $("#wishlistItemsCountInfo").val();
    if (itemCount == undefined) {
        itemCount = 0;
    }
    FFAPI.methods.header.updateWishListItemCount(itemCount);
}

FFAPI.basket.methods.UpdateHeaderBagAndWishlist = function () {
    FFAPI.basket.methods.UpdateHeaderBag();
    FFAPI.basket.methods.UpdateHeaderWishlist();
}

FFAPI.basket.methods.OnWishlistUpdateSizeComplete = function () {
    $('.selectForm').chosen();
}
FFAPI.basket.methods.OnBagToWishlistAjaxComplete = function (ItemId, ItemPrice) {
    //FFAPI.basket.methods.OnAjaxComplete();

    var productData = {};
    productData.id = ItemId;
    productData.quantity = 1;
    productData.unit_price = ItemPrice;

    $(document).trigger('BagUpdated', productData);


    $(document).trigger('WishListUpdated');

    //FFAPI.methods.UpdateBagStatus();

    //FFAPI.methods.UpdateFavouriteStatus();

    //FFAPI.basket.methods.BindsOnBasketRefresh();
};

FFAPI.basket.methods.OnWishlistMoveToBagAjaxComplete = function (ItemId, ItemPrice) {
    //FFAPI.basket.methods.OnAjaxComplete();

    var productData = {};
    productData.id = ItemId;
    productData.quantity = 1;
    productData.unit_price = ItemPrice;

    $(document).trigger('BagUpdated', productData);

    $(document).trigger('WishListUpdated');

    FFAPI.basket.methods.BindsOnBasketRefresh();

    FFAPI.basket.methods.UpdateHeaderBagAndWishlist();
    //// Re-create all client-side validators after ajax call
    //$.validator.unobtrusive.parse($("#wishListWrapper").find("form"));
};


FFAPI.basket.methods.BindChangeSize = function (basketWrapper, localthis) {
    // Click on "change" if saved item has size selected
    basketWrapper.on("change", ".wishListChangeSizeOnly", function (e) {
        $(this).closest("form").eq(0).submit();
        e.preventDefault();
        return false;
    });
};

FFAPI.basket.methods.BindWishlistChangeQuantity = function (basketWrapper, localthis) {
    basketWrapper.on("change", ".WishListChangeSize", function (args) {
        var jQThis = $(args.currentTarget),
            splittedId = args.currentTarget.id.split("_"),
            inputHidden = jQThis,//$("input:hidden#" + splittedId[0] + "_" + splittedId[1] + "_input"),
            selectedVal = inputHidden.val(),
            myForm = jQThis.closest("form"),
            wishlistItemId = myForm.find(".WishListItemId").val(),
            selectQuantityDropdown = myForm.find(".WishlistChangeQuantity"),
            selectQuantitySplittedId = myForm.find(".WishlistChangeQuantity").get(0).id.split("_"), optionToAdd = "";

        if (selectedVal != "") {
            if (typeof (FFAPI.basket.variables.SizeQuantityObj) !== "undefined") {
                var quantity = FFAPI.basket.variables.SizeQuantityObj[wishlistItemId][selectedVal],
                    newOption = "<option {1}>{0}</option>";
                selectQuantityDropdown.empty();
                selectQuantityDropdown.append("<option></option>");
                for (var i = 0; i < quantity; i++) {
                    optionToAdd = $.format(newOption, i + 1);

                    if (i == 0) {
                        optionToAdd = $.format(newOption, i + 1, "selected='selected'");
                    }
                    else {
                        optionToAdd = $.format(newOption, i + 1, "");
                    }

                    selectQuantityDropdown.append(optionToAdd);
                }
            }
            selectQuantityDropdown.removeAttr('disabled');
        } else {
            selectQuantityDropdown.find("option:not(:first)").remove();
            selectQuantityDropdown.attr('disabled', 'disabled');
        }
        
        selectQuantityDropdown.trigger("chosen:updated");
    });
};

FFAPI.basket.methods.BindMoveToBag = function (wishListWrapper, localthis) {
    /*Show size and qty dropdown on shopping bag*/
    $('body').on('click', '.buttonMoveToBag', function (e) {
        var jQThis = $(this),
            form = jQThis.closest("form"),
            inputs = form.find("input, select"),
            wishListId = form.get(0).id.split("_")[1];
        $(this).closest("form").eq(0).submit();
        e.preventDefault();
        /*Clickstream*/
        if (typeof (_fftrkobj) !== "undefined") {
            _fftrkobj.extract($(this));
        }
        //// Verify if is to PostBack
        //if (!$(this).hasClass("DoPostBack")) {
        //    $(this).addClass("DoPostBack");
        //    form.find('.WishListChangeSizeDiv').removeClass('hide');
        //    form.find('.WishlistChangeQuantityDiv').removeClass('hide');
        //    $('#StockAndSizeGuide_' + wishListId).removeClass('hide');
        //} else {
        //    $(this).closest("form").eq(0).submit();
        //    e.preventDefault();
        //    /*Clickstream*/
        //    if (typeof (_fftrkobj) !== "undefined") {
        //        _fftrkobj.extract($(this));
        //    }
        //}

        return false;
    });
};

FFAPI.methods.initWishlistCarousel = function (width) {
    if (width == undefined) {
        width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    /*transform wishlist to carousel on mobile*/

    if ($('.js-checkout-turnToSlider-mobile').length > 0) {
        var checkoutTurnToSlider = $('.js-checkout-turnToSlider-mobile').bxSlider();

        if (width > 480) {
            checkoutTurnToSlider.destroySlider();
        }

        $(window).smartresize(function () {
            if (window.innerWidth < 480) {
                checkoutTurnToSlider.reloadSlider({
                    minSlides: 1,
                    maxSlides: 1,
                    slideMargin: 0,
                    moveSlides: 1,
                });
            } else {
                if (window.innerWidth > 480) {
                    checkoutTurnToSlider.destroySlider();
                }
            }
        });
    }
}

FFAPI.methods.initWishlistCarousel();
//CLICKSTREAM

$("body").on('click', '#recommendations .bx-prev,#recommendations .bx-next', function () {
    if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse(138); }
});

FFAPI.basket.methods.init(window.universal_variable);