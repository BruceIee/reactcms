var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'admin';
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
    
    // page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('admin/index', { page:page });
    };
    
    block.page.getCommonListPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var moduleName = parameter.module;        
        var page = app.getPage(req);
        page.moduleName = moduleName;
        res.render('common/list', { page:page });
    };
    
    // routes
    app.server.all('/data/module/*', block.page.checkLogin);
    app.server.get('/data/module/:module/model', block.data.getModuleModel);
    
    app.server.all('/module/*', block.page.checkLogin);
    app.server.get('/module/:module/list', block.page.getCommonListPage);
    
    app.server.all('/admin', block.page.checkLogin);
    app.server.all('/admin/*', block.page.checkLogin);
    app.server.get('/admin', block.page.getIndex);
    app.server.get('/' + moduleName + '/page/:pagename', block.page.showPage);
    
    return block;
};