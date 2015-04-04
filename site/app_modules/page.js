var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'layout';
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
        layout: {
            type: 'string'
        },
        widgets: {
            type: 'array',
            subtype: {
                type: 'object'
            }
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    // data
    block.data.getPage = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var condition = { name:pageName };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            
            // TEST START - use hard-coded value for page name == "test"
            if (pageName === 'test') {
                docs = [{
                    name: 'test',
                    descript: 'test page',
                    layout: 'sidenav',
                    widgets: []
                }];
            }
            // TEST END
            
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('page/index', { page:page });
    };
    
    block.page.getPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        // get page
        block.data.getPage(req, res, null, function(error, docs, info) {
            console.log('Got page:', error, docs, info);
            var page = app.getPage(req);
            page.name = pageName;
            res.render('page/template', { page:page });
        });
    };
    
    // data route
    app.server.get('/data/pages/:pagename', block.data.getPage);
    
    // page route
    app.server.get('/pages', block.page.getIndex);
    app.server.get('/pages/:pagename', block.page.getPage);
    
    
    return block;
};

