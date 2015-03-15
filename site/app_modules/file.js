/*var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'file';
    var block = {
        app: app,
        model:
        {
            name: {
                type: 'string'
            },
            path: {
                type: 'string'
            },
            create_date: {
                type: 'date'
            }
        }
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));

    block.page.upload = function(req, res) {
        var page = app.getPage(req);
        page.controller = "file";
        console.log(page);
        res.render('web/index', { page:page });
    };

    block.data.uploadPost = function(req, res) {
        var parameter = tool.getReqParameter(req);
        console.log(req.files);
        res.end("File uploaded done.");
    };

    block.data.addFile = function(req, res) {
        var callback = arguments[3] || null;
        var file = tool.getReqParameter(req);
        file.create_date = new Date();
        block.data.add(req, res, file, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };

    block.page.uploadedList = function(req, res) {
        var fs = require('fs');
        var dir = './site/public/file/';
        var files = fs.readdirSync(dir);
        console.log('files=',files);
        var page = app.getPage(req);
        page.title = 'List of uploaded files';
        page.controller = "file";
        page.files = files;
        res.render('file/index', { page:page });
    };

    app.server.get('/file/upload', block.page.upload);
    app.server.post('/data/file/upload', block.data.uploadPost);
    app.server.get('/files', block.page.uploadedList);
    return block;
};*/
var util = require('util');
var tool = require('leaptool');
var fs = require('fs');

module.exports = function(app) {

    var moduleName = 'file';
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

            console.log('add file:', error, docs, info);

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

            console.log('add file:', error, docs, info);

            var files = req.files;
            for (var file in files) {

            }
            var page = app.getPage(req);
            res.redirect('/file/list');
        });
    };

    block.page.viewFile = function(req, res) {
        var page = app.getPage(req);
        res.render('file/view', { page:page });
    };

    // data route
    app.server.get('/data/file/add', block.data.addFile);
    //app.server.post('/data/file/add', block.data.addFilePost);

    // page route
    app.server.get('/file/home', block.page.getIndex);
    app.server.get('/file/add', block.page.addFile);
    app.server.post('/file/add', block.page.addFilePost);
    app.server.get('/file/list', block.page.getFileList);
    app.server.get('/file/:id/view', block.page.viewFile);

    return block;
};