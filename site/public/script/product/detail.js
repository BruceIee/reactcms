$().ready(function() {
    setup();
});

function setup() {
    console.log('in product detail');
    $('.btn-add-cart').click(addToShoppingCart);
}

function addToShoppingCart() {
    console.log('add to shopping cart');
}