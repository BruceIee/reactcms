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
    block.data.getModuleList = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        // get modules from app.module
        var modules = [];
        var moduleNames = [];
        for (var moduleName in app.module) {
            moduleNames.push(moduleName);
        }
        moduleNames = moduleNames.sort();
        for (var i = 0; i < moduleNames.length; i++) {
            modules.push({ name:moduleNames[i] });
        }
        var info = { message:'module list' };
        app.cb(null, modules, info, req, res, callback);
    };
    
    block.data.getModuleInfo = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;
        var moduleModel = app.module[moduleName] && app.module[moduleName].model || null;
        var listFields = app.module[moduleName] && app.module[moduleName].listFields || null;
        var info = {
            message: 'model for module ' + moduleName,
            module: moduleName,
            model: moduleModel,
            listFields: listFields
        };
        app.cb(null, [], info, req, res, callback);
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
    
    block.data.getModuleDataById = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;
        var module = app.module[moduleName];
        // get item data by id
        var condition = { _id:parameter.id };
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
    block.page.getListPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.moduleName = parameter.module;
        res.render('common/list', { page:page });
    };
    
    block.page.viewItem = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.moduleName = parameter.module;
        page.itemId = parameter.id;
        res.render('common/view', { page:page });
    };
    
    // routes
    app.server.all('/data/modules/*', block.page.checkLogin);
    app.server.get('/data/modules/user', block.data.getUserModules);
    app.server.get('/data/modules/list', block.data.getModuleList);
    app.server.get('/data/modules/:module/info', block.data.getModuleInfo);
    app.server.get('/data/modules/:module/all', block.data.getModuleDataAll);
    app.server.get('/data/modules/:module/:id', block.data.getModuleDataById);
    
    app.server.all('/modules/*', block.page.checkLogin);
    app.server.get('/modules/:module/list', block.page.getListPage);
    app.server.get('/modules/:module/:id/view', block.page.viewItem);
    
    return block;
};