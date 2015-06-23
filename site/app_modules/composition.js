var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'composition';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        filename: {
            type: 'string'
        },
        data: {
            type: 'array',
            subtype: {
                type: 'object'
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
    
    // data
    block.data.getCompositions = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getDataByNameWeb = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var name = parameter.name;
        block.data.getDataByName(req, res, name, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getDataByName = function(req, res, compositionName) {
        var callback = arguments[3] || null;
        var condition = { name:compositionName };
        var filter = {};
        console.log('composition getDataByName query:', condition, filter);
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page 
    block.page.addComposition = function(req, res) {
        var page = app.getPage(req);
        res.render('composition/add', { page:page });
    };
    
    block.page.addCompositionPost = function(req, res) {
        var page = app.getPage(req);
        res.render('composition/add', { page:page });
    };
    
    block.page.getCompositionList = function(req, res) {
        block.data.getCompositions(req, res, null, function(error, docs, info) {
            var page = app.getPage(req);
            page.title = 'List of compositions';
            page.pages = docs;
            res.render('composition/list', { page:page });            
        });
    };
    
    // data route
    app.server.get('/data/compositions', block.data.getCompositions);
    app.server.get('/data/compositions/:name', block.data.getDataByNameWeb);
    
    // page route
    app.server.all('/compositions', block.page.checkLogin);
    app.server.all('/compositions/*', block.page.checkLogin);
    app.server.get('/compositions', block.page.getIndex);
    app.server.get('/compositions/add', block.page.addComposition);
    app.server.get('/compositions/list', block.page.getCompositionList);

    return block;
};

