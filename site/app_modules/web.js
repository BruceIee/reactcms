var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'web';
    var block = {
        app: app,
        model: null
    };

    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));

    block.page.getHomeIndex = function(req, res) {
        res.redirect('/pages/home');
        /*
        var page = app.getPage(req);
        page.title = 'Home';
        page.controller = 'home';
        res.render('web/index', { page:page });
        */
    };
    
    app.server.get('/', block.page.getHomeIndex);
    app.server.get('/' + moduleName + '/page/:pagename', block.page.showPage);
    
    return block;
};