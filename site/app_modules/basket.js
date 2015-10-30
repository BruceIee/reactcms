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
        { name:'status', display:'State', flex:2 },
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
            app.cb(error, basket, {}, req, res, callback);
        });
    };
    
    block.data.addToBasket = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var productId = parameter.productid;
        var loginUser = req.session && req.session.user;
        block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
            if (basket) {
                var itemCol = {};
                for (var i = 0; i < basket.items.length; i++) {
                    var basketItem =  basket.items[i];
                    itemCol[basketItem.id] = basketItem;
                }
                if (itemCol[productId]) {
                    itemCol[productId].quantity = itemCol[productId].quantity + 1;
                } else {
                    basket.items.push({ id:productId, quantity:1 });
                }
                block.data.edit(req, res, basket, function(error, docs, info) {
                    app.cb(error, basket, {}, req, res, callback);
                });
            } else {
                basket = { user_id:loginUser._id, items:[{ id:productId, quantity:1 }] };
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
    
    
    // data route
    app.server.all('/data/baskets/add/:productid', block.data.checkLogin);
    app.server.post('/data/baskets/add/:productid', block.data.addToBasket);
    app.server.all('/data/baskets/show', block.data.checkLogin);
    app.server.get('/data/baskets/show/:userId', block.data.getUserBasket);
    
    // page route
    app.server.get('/baskets', block.page.getIndex);
    app.server.all('/baskets/*', block.page.checkLogin);
    app.server.get('/baskets/show', block.page.showUserBasket);
    
    return block;
};

