var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'map';
    var block = {
        app: app,
        model: null
    };

    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));

    block.page.leafletReact = function(req, res) {
        var page = app.getPage(req);
        res.render('map/leaflet_react', { page:page });
    };

    app.server.get('/map/leaflet_react', block.page.leafletReact);
    
    return block;
};