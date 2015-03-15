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
        console.log(req.files);
        block.data.add(req, res, file, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('file/index', { page:page });
    };
    
    block.page.getFileList = function(req, res) {
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.error = error;
            page.docs = docs;
            page.info = info;
            res.render('file/list', { page:page });
        });
    };
    
    block.page.addFile = function(req, res) {
        var page = app.getPage(req);
        res.render('file/add', { page:page });
    };
    
    block.page.addFilePost = function(req, res) {
        block.data.addFile(req, res, null, function(error, docs, info) {
            var page = app.getPage(req);
            res.redirect('/file/list');
        });
    };
    
    block.page.getFileDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            var file = docs && docs[0] || null;
            
            console.log('>>> ', error, docs, info);
            
            var page = app.getPage(req);
            page.file = file;
            
            console.log('>>> file:', page.file);
                
            res.render('file/detail', { page:page });
        });
    };
    
    // data route
    app.server.post('/data/file/add', block.data.addFile);
    
    // page route
    app.server.get('/file/home', block.page.getIndex);
    app.server.get('/file/upload', block.page.addFile);
    app.server.post('/file/upload', block.page.addFilePost);
    app.server.get('/file/list', block.page.getFileList);
    app.server.get('/file/:id/detail', block.page.getFileDetail);

    return block;
};

