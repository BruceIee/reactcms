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
        type: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        data: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };

    block.page.upload = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Upload a file';
        page.controller = "file";
        res.render('web/upload', { page:page });
    };

    block.page.uploadPost = function(req, res) {
        var parameter = tool.getReqParameter(req);
        console.log(req.files);
        res.end("File uploaded done.");
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
        res.render('web/uploaded_list', { page:page });
    };
    block.page.getHomeIndex = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Home';
        page.controller = "file";
        console.log(page);
        res.render('web/index', { page:page });
    };
    
    // data route
    app.server.get('/upload', block.page.upload);
    app.server.post('/' + moduleName + '/upload_post', block.page.uploadPost);
    app.server.get('/files', block.page.uploadedList);

    return block;
};

