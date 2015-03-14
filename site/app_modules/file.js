var util = require('util');
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
};

