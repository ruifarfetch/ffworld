function registerOrderRefresh(QSOrderID) {
  WebUIShopNavEngine.RefreshRegister(
        'Order',
        '#listingOrderBy',
        null,
        'FFLoad',
        false,
        function (event, JsonData) {
            var obyDiv = $("#dvtOrderBy" + JsonData[QSOrderID]);
            // Change dropdown value
            if (obyDiv.length) {
                $('#listingOrderBy span a').text(obyDiv.text());
}
        }
    );
}

function OrderItemClick(OrderItem, QSOrderID) {
    WebUIShopNavEngine.QSPagingSelectorSet(1);
    WebUIShopNavEngine.OrderGet(OrderItem.data("order")[QSOrderID]);
}
