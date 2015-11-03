var util = require('util');
var tool = require('leaptool');
var multer  = require('multer');

module.exports = function(app) {
    
    var moduleName = 'basket';
    var block = {
        app: app,
        group: 'app',
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        user_id: {
            type: 'string'
        },
        items: {
            type: 'array',
            subtype: {
                type: 'object'
            }
        },
        status: {
            type: 'string',
            values: ['active', 'inactive', 'complete']
        },
        create_date: {
            type: 'date'
        },
        create_by: {
            type: 'string'
        },
        edit_date: {
            type: 'date'
        },
        edit_by: {
            type: 'string'
        }
    };
    
    block.listFields = [
        { name:'user_id', display:'User', flex:2, sort:'asc' },
        { name:'status', display:'Status', flex:2 },
        { name:'create_date', display:'Create Date', flex:2 }
    ];
    
    // block.data
    block.data.getUserBasket = function(req, res, userId) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        if (!userId) {
            userId = parameter.userId;
        }
        var condition = { user_id:userId };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            console.log('getUserBasket - condition:', condition);
            console.log('getUserBasket - result:', error, docs, info);
            var basket = docs && docs[0];
            if (basket) {
                basket.total = 0;
                for (var i = 0; i < basket.items.length; i++) {
                    basket.total += basket.items[i].price * basket.items[i].quantity;
                }
            }
            app.cb(error, basket, {}, req, res, callback);
        });
    };
    
    block.data.clearBasket = function(req, res, userId) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        userId = userId || parameter.userId;
        var condition = { user_id:userId };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var basket = docs && docs[0];
            if (basket) {
                basket.total = 0;
                basket.items = [];
                block.data.edit(req, res, basket, function(error, docs, info) {
                    app.cb(error, basket, {}, req, res, callback);
                });
            } else {
                app.cb(error, basket, {}, req, res, callback);
            }
        });
    };
    
    block.data.addToBasket = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var productId = parameter.productid;
        var productData = app.module['product'].data;
        productData.getById(req, res, productId, function(error, docs, info) {
            var product = docs && docs[0];
            if (error || !product) {
                error = error || new Error('product is not found');
                app.cb(error, null, { message:'error in getting product' }, req, res, callback);
            } else {
                block.data.addProductToBasket(req, res, product, callback);
            }
        });
    };
    
    block.data.addProductToBasket = function(req, res, product, callback) {
        var loginUser = req.session && req.session.user;
        var productId = product._id;
        block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
            var newItem = {
                id: productId,
                title: product.title,
                price: product.price,
                image: product.iamge,
                quantity: 1
            };
            if (basket) {
                // put basket items into hash keyed by productId
                var itemCol = {};
                for (var i = 0; i < basket.items.length; i++) {
                    var basketItem =  basket.items[i];
                    itemCol[basketItem.id] = basketItem;
                }
                // add product to basket by productId
                if (itemCol[productId]) {
                    itemCol[productId].quantity = itemCol[productId].quantity + 1;
                } else {
                    basket.items.push(newItem);
                }
                block.data.edit(req, res, basket, function(error, docs, info) {
                    app.cb(error, basket, {}, req, res, callback);
                });
            } else {
                basket = { user_id:loginUser._id, items:[newItem] };
                block.data.add(req, res, basket, function(error, docs, info) {
                    app.cb(error, basket, {}, req, res, callback);
                });
            }
        });
    };
    
    
    // block.page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('basket/index', { page:page });
    };
    
    block.page.showUserBasket = function(req, res) {
        var loginUser = req.session && req.session.user;
        block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
            var page = app.getPage(req);
            page.basket = basket;
            res.render('basket/detail', { page:page });
        });
    };
    
    block.page.checkoutUserBasket = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
            var page = app.getPage(req);
            page.errorMessage = parameter.erroMessage || '';
            page.basket = basket;
            page.stripe_publishable_key = app.setting.payment.stripe_publishable_key;
            res.render('basket/checkout', { page:page });
        });
    };
    
    block.page.purchaseBasket = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        //console.log('purchase parameter:', parameter);
        var chargeData = app.module['charge'].data;
        block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
            chargeData.processPayment(req, res, null, function(error, charge) {
                if (error) {
                    if (error.type === 'StripeCardError') {
                        console.log('The card has been declined', error);
                    }
                    // render checkout page with error message if error occurred in payment
                    var page = app.getPage(req);
                    page.basket = basket;
                    page.error = error;
                    res.render('basket/receipt', { page:page });
                } else {
                    block.page.processPostPayment(req, res, basket, charge);
                }
            });
        });
    };
    
    block.page.processPostPayment = function(req, res, basket, charge) {
        var loginUser = req.session && req.session.user;
        var userId = loginUser._id
        block.data.clearBasket(req, res, userId, function(error, docs, info) {
            // todo: save payment info to charge table
            var page = app.getPage(req);
            page.basket = basket;
            page.charge = charge;
            res.render('basket/receipt', { page:page });
        });
    };
    
    // data route
    app.server.all('/data/baskets/add/:productid', block.data.checkLogin);
    app.server.post('/data/baskets/add/:productid', block.data.addToBasket);
    app.server.all('/data/baskets/show', block.data.checkLogin);
    app.server.get('/data/baskets/show/:userId', block.data.getUserBasket);
    
    // page route
    app.server.get('/baskets', block.page.getIndex);
    app.server.all('/baskets/*', block.page.checkLogin);
    app.server.get('/baskets/show', block.page.showUserBasket);
    app.server.get('/baskets/checkout', block.page.checkoutUserBasket);
    app.server.post('/baskets/purchase', block.page.purchaseBasket);
    
    return block;
};

