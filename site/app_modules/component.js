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

    block.data.getComponentData = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module || '';
        // assemble query for data
        var condition = parameter.condition || {};
        var filter = parameter.filter || {};
        var dataModule = app.module[moduleName].data;
        dataModule.get(req, res, condition, filter, function(error, docs, info){
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    app.server.get('/data/components/get/data', block.data.getComponentData);
    
    return block;
};