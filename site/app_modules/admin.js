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
    
    // page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('admin/index', { page:page });
    };
    
    // routes
    app.server.all('/admin', block.page.checkLogin);
    app.server.all('/admin/*', block.page.checkLogin);
    app.server.get('/admin', block.page.getIndex);
    app.server.get('/' + moduleName + '/page/:pagename', block.page.showPage);
    
    return block;
};