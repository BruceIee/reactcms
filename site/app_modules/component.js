var util = require('util');
var tool = require('leaptool');

// this module is for supporting UI component
module.exports = function(app) {
    
    var moduleName = 'component';
    var block = {
        app: app,
        model: null
    };
    
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.data.getComponents = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        
        var error = null;
        var docs = [];
        var info = { message:'getComponents' };
        app.cb(error, docs, info, req, res, callback);
    };
    
    /*
    widget parameter example
    {
        widgetName: 'ArticleDetail',
        widgetInfo: {
            module: 'article',
            condition: { title:'Mission of PTA' },
            filter: {}
        }
    }
    */
    block.data.getWidgetData = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        
        var widgetName = parameter.widgetName;
        var widgetInfo = parameter.widgetInfo;
        var moduleName = widgetInfo.module || '';
        
        // assemble query for data
        var condition = widgetInfo.condition || {};
        var filter = widgetInfo.filter || {};
        var dataModule = app.module[moduleName].data;
        
        dataModule.get(req, res, condition, filter, function(error, docs, info){
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // data route
    app.server.get('/data/components', block.data.getComponents);
    app.server.get('/data/components/get/detail', block.data.getWidgetData);
    
    // page route
    app.server.all('/components', block.page.checkLogin);
    app.server.all('/components/*', block.page.checkLogin);
    app.server.get('/components', block.page.getIndex);
    
    return block;
};