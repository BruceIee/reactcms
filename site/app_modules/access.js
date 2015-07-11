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
        source_type: {
            type: 'string'
        },
        source_id: {
            type: 'string'
        },
        target_type: {
            type: 'string'
        },
        target_id: {
            type: 'string'
        },
        value: {
            type: 'number',
            values: ['0', '100']
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
    
    // sources is array of ids for source_id fields
    // target is id for target_id field
    // access is access value to check
    block.data.checkAccess = function(req, res, sources, target, access, callback) {
        access = access || 100; // default access value is set to 100
        
        var info = { access:true };
        app.cb(null, [], info, req, res, callback);
    };
    
    // lj temp try, one sourceid
    block.data.checkAccessSingle = function(req, res, source, target, access, callback) {
        access = access || 100; // default access value is set to 100
        
        var info = { access:true };
        app.cb(null, [], info, req, res, callback);
    };
    
    
    block.data.addAccess = function(req, res, source_type, source_id, target_type, target_id, value, callback) {
        var accessItem = {};
        accessItem.source_type = source_type;
        accessItem.source_id = source_id;
        accessItem.target_type = target_type;
        accessItem.target_id = target_id;
        accessItem.create_date = new Date();
        //accessItem.create_by = app.getLoginUser();
        accessItem.data.add(req, res, page, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // block.page
    block.page.home = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Access Home';
        res.render('access/index', { page:page });
    };
    
    block.page.addAccess = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add Access';
        res.render('access/add', { page:page });
    };
    
    block.page.addAccessPost = function(req, res) {
        var page = app.getPage(req);
        res.render('/modules/access/list', { page:page });
    };
    
    // data route
    /* app.server.post('/data/groups/add_post', block.data.addPost); */
    
    // page route
    app.server.all('/access', block.page.checkLogin);
    app.server.all('/access/*', block.page.checkLogin);
    app.server.get('/access', block.page.home);
    app.server.get('/access/add', block.page.addAccess);
    app.server.post('/access/add', block.page.addAccessPost);

    return block;
};

