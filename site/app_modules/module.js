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
    
    // data
    block.data.getModuleModel = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;
        var moduleModel = app.module[moduleName] && app.module[moduleName].model || null;
        var info = { message:'model for module ' + moduleName, module:moduleName };
        app.cb(null, moduleModel, info, req, res, callback);
    };
    
    block.data.getModuleDataAll = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;
        var module = app.module[moduleName];
        // get module data
        var condition = {};
        var filter = {};
        module.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
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
    
    // page
    block.page.getCommonListPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;        
        var page = app.getPage(req);
        page.moduleName = moduleName;
        res.render('common/list', { page:page });
    };
    
    // routes
    app.server.all('/data/modules/*', block.page.checkLogin);
    app.server.get('/data/modules/user', block.data.getUserModules);
    app.server.get('/data/modules/:module/model', block.data.getModuleModel);
    app.server.get('/data/modules/:module/all', block.data.getModuleDataAll);
    
    app.server.all('/modules/*', block.page.checkLogin);
    app.server.get('/modules/:module/list', block.page.getCommonListPage);
    
    return block;
};