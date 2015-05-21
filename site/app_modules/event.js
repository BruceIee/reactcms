var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'event';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        date: {
            type: 'date'
        },
        content: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        }
    };
    
    // data
    
    
    // page
    block.page.eventHome = function(req, res) {
        var page = app.getPage(req);
        res.render('event/index', { page:page });
    };

    block.page.eventCalendarReact = function(req, res) {
        var page = app.getPage(req);
        res.render('event/calendar_react', { page:page });
    };   
    
    // data route

    
    // page route
    app.server.all('/events', block.page.checkLogin);
    app.server.all('/events/*', block.page.checkLogin);
    app.server.get('/events', block.page.eventHome);
    
    // page react
    app.server.get('/events/calendar_react', block.page.eventCalendarReact);

    return block;
};

