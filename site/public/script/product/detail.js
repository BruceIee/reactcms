$().ready(function() {
    setup();
});

function setup() {
    console.log('in product detail');
    $('.btn-add-cart').click(addToShoppingCart);
}

function addToShoppingCart() {
    console.log('add to shopping cart');
    var productId = app.product._id;
    var addBasketUrl = '/data/baskets/add/' + productId;
    $.post(addBasketUrl, function(data) {
        console.log('add basket result:', data);
        if (data.docs) {
            var basketDetailUrl = '/baskets/show';
            window.location = basketDetailUrl;
        }
    });
}