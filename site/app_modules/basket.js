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
        if (loginUser) {
            block.data.getUserBasket(req, res, loginUser._id, function(error, basket, info) {
                if (basket) {
                    basket.items.push(productId);
                    block.data.edit(req, res, basket, function(error, docs, info) {
                        app.cb(error, basket, {}, req, res, callback);
                    });
                } else {
                    basket = { user_id:loginUser._id, items:[productId] };
                    block.data.add(req, res, basket, function(error, docs, info) {
                        app.cb(error, basket, {}, req, res, callback);
                    });
                }
            });
        } else {
            var message = 'User is not logged in';
            app.cb(new Error(message), [], { message:message }, req, res, callback);
        }
    };
    
    /*
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getItemDetail = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getItems = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    */
    
    // block.page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('basket/index', { page:page });
    };
    
    /*
    block.page.getItemList = function(req, res) {
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.error = error;
            page.docs = docs;
            page.info = info;
            res.render('item/list', { page:page });
        });
    };
    
    block.page.addItem = function(req, res) {
        var page = app.getPage(req);
        res.render('item/add', { page:page });
    };
    
    block.page.addItemPost = function(req, res) {
        block.data.addItem(req, res, null, function(error, docs, info) {
            var page = app.getPage(req);
            res.redirect('/items/list');
        });
    };
    
    block.page.getItemDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        block.data.getItemDetail(req, res, null, function(error, docs, info) {
            var item = docs && docs[0] || null;
            var page = app.getPage(req);
            page.item = item;
            res.render('item/detail', { page:page });
        });
    };
    
    block.page.getItemDetailReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.itemId = parameter.id;
        res.render('item/detail_react', { page:page });
    };
    */
    
    // data route
    
    // /data/baskets/add/562d924858356dce131b9f6f
    app.server.get('/data/baskets/add/:productid', block.data.addToBasket);
    
    /*
    app.server.get('/data/products', block.data.getProducts);
    app.server.post('/data/items/add', block.data.addItem);
    app.server.get('/data/items/:id', block.data.getItemDetail);
    app.server.get('/data/items/:id/detail', block.data.getItemDetail);
    */
    
    // page route
    app.server.get('/baskets', block.page.getIndex);
    
    /*
    app.server.all('/items', block.page.checkLogin);
    app.server.all('/items/*', block.page.checkLogin);
    app.server.get('/items/home', block.page.getIndex);
    app.server.get('/items/add', block.page.addItem);
    app.server.post('/items/add', block.page.addItemPost);
    app.server.get('/items/list', block.page.getItemList);
    app.server.get('/items/:id/detail', block.page.getItemDetail);
    */
    
    return block;
};

