var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'item';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        type: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        data: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('item/index', { page:page });
    };
    
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
            res.redirect('/item/list');
        });
    };
    
    block.page.getItemDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            var item = docs && docs[0] || null;
            
            console.log('>>> ', error, docs, info);
            
            var page = app.getPage(req);
            page.item = item;
            
            console.log('>>> item:', page.item);
                
            res.render('item/detail', { page:page });
        });
    };
    
    // data route
    app.server.post('/data/item/add', block.data.addItem);
    
    // page route
    app.server.get('/item/home', block.page.getIndex);
    app.server.get('/item/add', block.page.addItem);
    app.server.post('/item/add', block.page.addItemPost);
    app.server.get('/item/list', block.page.getItemList);
    app.server.get('/item/:id/detail', block.page.getItemDetail);

    return block;
};

