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
        composition: {
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
            
            var page = docs && docs[0];
            
            // TEST START - use hard-coded value for page name == "test"
            if (pageName === 'test') {
                page = {
                    name: 'test',
                    descript: 'test page',
                    composition: 'sidenav',
                    widgets: []
                };
                docs = [page];
            }
            // TEST END
            
            // get composition
            if (docs.length > 0) {
                var page = docs[0];
                var compositionName = page.composition;
                var compositionDataUrl = '/data/compositions/' + compositionName;
                var compositionData = app.module['composition'].data;
                compositionData.getDataByName(req, res, compositionName, function(error, docs, info) {
                    var composition = docs && docs[0];
                    info = { page:page, composition:composition };
                    console.log('>>> page info:', info);
                    app.cb(error, docs, info, req, res, callback);
                });
            }
            
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
            //console.log('Got page:', error, docs, info);
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

