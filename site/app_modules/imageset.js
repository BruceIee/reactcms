var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'imageset';
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
        content: { // text and image path
            type: 'array'
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    // data
    block.data.addImagesetPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        console.log('@@@ parameter=',parameter);
        
        /*** parameter example: (hyperlink is not must required)
        parameter= { name: 'abcdef',
          text_0: 'aaa',
          hyperlink_0: 'http://www.aaa.com',
          text_1: 'bbb',
          img_1: 
           { fieldname: 'img_1',
             originalname: '02.png',
             name: '021433167059871.png',
             encoding: '7bit',
             mimetype: 'image/png',
             path: 'site/public/file/021433167059871.png',
             extension: 'png',
             size: 56278,
             truncated: false,
             buffer: null },
          img_0: 
           { fieldname: 'img_0',
             originalname: '01.jpg',
             name: '011433167059869.jpg',
             encoding: '7bit',
             mimetype: 'image/jpeg',
             path: 'site/public/file/011433167059869.jpg',
             extension: 'jpg',
             size: 31988,
             truncated: false,
             buffer: null } }
        */

        var content = [];
        var max_num = 0; // text_(max)
        var reg1 = /text_([0-9]+)/;
        
        for (var prop in parameter) {
            if ( reg1.exec(prop) != null ) {
                var the_num = reg1.exec(prop)[1];
                if ( the_num > max_num) {
                    max_num = the_num;
                }
            }
        }

        for ( var i=0; i<=max_num; i++ ) {
            var prop_text = "text_" + i;
            var prop_img = "img_" +i;
            var prop_hyperlink = "hyperlink_" +i;
            if (parameter[prop_text]) {
                var obj_tmp = {};
                obj_tmp.text = parameter[prop_text];
                if (parameter[prop_hyperlink]) {
                    obj_tmp.hyperlink = parameter[prop_hyperlink];
                }
                if (parameter[prop_img]) {
                    obj_tmp.image = parameter[prop_img];
                }
                content.push(obj_tmp);
            }
        }

        var imageset = {};
        imageset.name = parameter.name;
        imageset.content = content;
        imageset.create_date = new Date();

        block.data.add(req, res, imageset, function(error, docs, info) {
            res.redirect('/imagesets/show_all');
        });         
    };
    
    block.data.getImageset = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getImagesetDetail = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };      
    
    // page
    block.page.imagesetHome = function(req, res) {
        var page = app.getPage(req);
        res.render('imageset/index', { page:page });
    };
    
    block.page.addImageset = function(req, res) {
        var page = app.getPage(req);
        res.render('imageset/add', { page:page });
    };
    
    block.page.showAll = function(req, res) {
        var condition = {};
        var filter = {};
        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'List of Imageset';
            page.linksets = docs;
            res.render('imageset/list', { page:page });
        });        
    };
    
    block.page.delImageset = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        app.db.deleteById(moduleName, id, function(error, docs, info) {
            res.redirect('/imagesets/show_all');
        });        
    };
    
    block.page.getImagesetListReact = function(req, res) {
        var page = app.getPage(req);
        res.render('imageset/list_react', { page:page });
    };     
    
    block.page.getImagesetDetailReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.imagesetId = parameter.id;
        res.render('imageset/detail_react', { page:page });
    };
    
    
    // data route
    app.server.post('/data/imagesets/add_imageset_post', block.data.addImagesetPost);
    app.server.get('/data/imagesets', block.data.getImageset);
    app.server.get('/data/imagesets/:id/detail', block.data.getImagesetDetail);
    
    // page route
    app.server.all('/imagesets', block.page.checkLogin);
    app.server.all('/imagesets/*', block.page.checkLogin);
    app.server.get('/imagesets', block.page.imagesetHome);
    app.server.get('/imagesets/add_imageset', block.page.addImageset);
    app.server.get('/imagesets/show_all', block.page.showAll);
    app.server.get('/imagesets/:id/del', block.page.delImageset);
    
    // page react
    app.server.get('/imagesets/list/react', block.page.getImagesetListReact);
    app.server.get('/imagesets/:id/detail/react', block.page.getImagesetDetailReact);

    return block;
};

