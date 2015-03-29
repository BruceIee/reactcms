var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'file';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        filename: {
            type: 'string'
        },
        path: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    block.data.addFile = function(req, res) {
        var callback = arguments[3] || null; 
        var file = tool.getReqParameter(req);
        file.create_date = new Date();
        var uploaded_file = req.files.file;
        file.filename = uploaded_file.originalname;
        file.path = uploaded_file.path;
        console.log(file);
        block.data.add(req, res, file, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };

    block.page.getIndex = function(req, res) {
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.error = error;
            page.docs = docs;
            page.docs.reverse();
            page.info = info;
            res.render('file/index', { page:page });
        });
    };
    
    block.page.addFile = function(req, res) {
        var page = app.getPage(req);
        res.render('file/add', { page:page });
    };
    
    block.page.addFilePost = function(req, res) {
        block.data.addFile(req, res, null, function(error, docs, info) {
            console.log('addFile result:', error, docs, info);
            res.redirect('/files');
        });
    };
    
    // data route
    app.server.post('/data/file/add', block.data.addFile);
    
    // page route
    app.server.get('/files', block.page.getIndex);
    app.server.get('/files/upload', block.page.addFile);
    app.server.post('/files/upload', block.page.addFilePost);

    return block;
};

