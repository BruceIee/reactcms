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
        var homeUrl = '/pages/' + app.setting.site.homepage || 'home';
        res.redirect(homeUrl);
    };

    app.server.get('/', block.page.getHomeIndex);
    app.server.get('/' + moduleName + '/page/:pagename', block.page.showPage);
    
    return block;
};