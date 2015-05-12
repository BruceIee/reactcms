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
        description: {
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
        if (uploaded_file == undefined) {
            uploaded_file = req.files['file-0'];
            file.file = uploaded_file;
        }
        console.log(uploaded_file);
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
            console.log(req.headers);
            console.log(req.accepts('html', 'json'));
            if (req.accepts('html', 'json') == 'html') {
                res.render('file/index', {page: page});
            } else {
                res.set({'Content-Type': 'application/json'});
                res.end(JSON.stringify(docs));
            }
        });
    };
    
    block.page.addFile = function(req, res) {
        var page = app.getPage(req);
        res.render('file/add', { page:page });
    };
    
    block.page.addFilePost = function(req, res) {
        block.data.addFile(req, res, null, function(error, docs, info) {
            console.log(req.accepts('html', 'json'));
            if (req.accepts('html', 'json') == 'html') {
                res.redirect('/files');
            } else {
                res.set({'Content-Type': 'application/json'});
                res.end(JSON.stringify(docs));
            }
        });
    };

    app.server.all('/files', block.page.checkLogin);
    app.server.all('/files/*', block.page.checkLogin);
    app.server.get('/files', block.page.getIndex);
    app.server.get('/files/upload', block.page.addFile);
    app.server.post('/files', block.page.addFilePost);

    return block;
};

