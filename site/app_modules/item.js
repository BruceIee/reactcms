var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'item';
    var block = {
        app: app,
        group: 'test',
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        type: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        description: {
            type: 'text'
        },
        value: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        status: {
            type: 'string',
            values: ['active', 'inactive']
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
    
    // block.data
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
    
    // block.page
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
    
    block.page.getItemListReact = function(req, res) {
        var page = app.getPage(req);
        res.render('item/list_react', { page:page });
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
    
    // data route
    app.server.get('/data/items', block.data.getItems);
    app.server.post('/data/items/add', block.data.addItem);
    app.server.get('/data/items/:id', block.data.getItemDetail);
    app.server.get('/data/items/:id/detail', block.data.getItemDetail);
    
    // page route
    app.server.all('/items', block.page.checkLogin);
    app.server.all('/items/*', block.page.checkLogin);
    app.server.get('/items', block.page.getIndex);
    app.server.get('/items/home', block.page.getIndex);
    app.server.get('/items/add', block.page.addItem);
    app.server.post('/items/add', block.page.addItemPost);
    app.server.get('/items/list', block.page.getItemList);
    app.server.get('/items/:id/detail', block.page.getItemDetail);
    
    // page react test route
    app.server.get('/items/list/react', block.page.getItemListReact);
    app.server.get('/items/:id/detail/react', block.page.getItemDetailReact);

    return block;
};

