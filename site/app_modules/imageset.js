var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'imageset';
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
        images: {
            type: 'array',
            subtype: {
                type: 'file'
            }
        },
        descriptions: {
            type: 'array',
            subtype: {
                type: 'string'
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
    block.data.getImagesets = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page
    block.page.getImagesetHome = function(req, res) {
        var page = app.getPage(req);
        res.render('imageset/index', { page:page });
    };
    
    // data route
    app.server.get('/data/imagesets', block.data.getImagesets);
    
    // page route
    app.server.all('/imagesets', block.page.checkLogin);
    app.server.all('/imagesets/*', block.page.checkLogin);
    app.server.get('/imagesets', block.page.getImagesetHome);

    return block;
};

