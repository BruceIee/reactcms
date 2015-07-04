var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'access';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        source_id: {
            type: 'string'
        },
        source_type: {
            type: 'string'
        },
        target_id: {
            type: 'string'
        },
        target_type: {
            type: 'string'
        },
        value: {
            type: 'number'
        },
        status: {
            type: 'string',
            values: ['active', 'inactive']
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
    /*
    block.data.addPost = function(req, res) {
        var callback = arguments[3] || null; 
        var group = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        group.create_date = new Date();
        group.create_by = loginUser.username;
        group.edit_date = null;
        group.edit_by = null;
        block.data.add(req, res, group, function(error, docs, info) {
            res.redirect('/groups/list');
        });
    };
    */
    
    // block.page
    block.page.home = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Access Home';
        res.render('access/index', { page:page });
    };
    
    
    // data route
    /* app.server.post('/data/groups/add_post', block.data.addPost); */
    
    // page route
    app.server.all('/access', block.page.checkLogin);
    app.server.all('/access/*', block.page.checkLogin);
    app.server.get('/access', block.page.home);

    return block;
};

