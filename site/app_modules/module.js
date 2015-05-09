var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'module';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.data.getUserModules = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        
        var error = null;
        var docs = [];
        var info = { message:'getUserModule' };
        
        for ( var moduleName in app.module) {
            var module = app.module[moduleName];
            if (module.group === 'user') {
                docs.push({ name:moduleName });
            }
        }
        app.cb(error, docs, info, req, res, callback);
    };
    
    // routes
    app.server.all('/data/modules/*', block.page.checkLogin);
    app.server.get('/data/modules/user', block.data.getUserModules);
    
    return block;
};