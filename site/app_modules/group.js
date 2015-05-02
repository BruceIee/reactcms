var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'group';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        name: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        users: {
            type: 'array'
        },
        create_date: {
            type: 'date'
        },
        create_by: {
            type: 'string'
        },
        edit_date: {
            type: 'date'
        },
        edit_by: {
            type: 'string'
        }
    };
    
    // block.data

    
    // block.page
    block.page.groupHome = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Group Home';
        res.render('group/index', { page:page });
    };
    
    // data route

    
    // page route
    app.server.all('/groups', block.page.checkLogin);
    app.server.all('/groups/*', block.page.checkLogin);
    app.server.get('/groups', block.page.groupHome);

    return block;
};

