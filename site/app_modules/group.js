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
        users: {
            type: 'array',
            subtype: {
                type: 'string'
            }
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
    
    block.data.editPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        var id = parameter.id_hidden;
        block.data.getById(req, res, id, function(error, docs, info) {
            var group = docs && docs[0] || null;
            group.name = parameter.name;
            group.type = parameter.type;
            group.description = parameter.description;
            group.status = parameter.status;
            group.edit_date = new Date();
            group.edit_by = loginUser.username;
            block.data.edit(req, res, group, function(error, docs, info) {
                res.redirect('/groups/list');
            });    
        });
    };     
    

    
    // block.page
    block.page.groupHome = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Group Home';
        res.render('group/index', { page:page });
    };
    
    block.page.add = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add Group';
        page.operation = "Add";
        page.formAction = "/data/groups/add_post";
        res.render('group/add_edit', { page:page });
    };    
    
    block.page.groupList = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var condition = {};
        var filter = {};
        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'List of groups';
            page.groups = docs;
            res.render('group/list', { page:page });
        });
    };     

    block.page.editGroup = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        block.data.getById(req, res, id, function(error, docs, info) {
            var group = docs && docs[0] || null;
            var page = app.getPage(req);
            page.operation = "Edit";
            page.formAction = "/data/groups/edit_post";
            page.group = group;
            page.title = 'Edit Group';
            res.render('group/add_edit', { page:page });
        });        
    };

    block.page.delGroup = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        app.db.deleteById(moduleName, id, function(error, docs, info) {
            res.redirect('/groups/list');
        });        
    };
    
    
    // data route
    app.server.post('/data/groups/add_post', block.data.addPost);
    app.server.post('/data/groups/edit_post', block.data.editPost);
    
    // page route
    app.server.all('/groups', block.page.checkLogin);
    app.server.all('/groups/*', block.page.checkLogin);
    app.server.get('/groups', block.page.groupHome);

    app.server.get('/groups/add', block.page.add);
    app.server.get('/groups/list', block.page.groupList);
    app.server.get('/groups/:id/edit', block.page.editGroup);
    app.server.get('/groups/:id/del', block.page.delGroup);
    
    return block;
};

