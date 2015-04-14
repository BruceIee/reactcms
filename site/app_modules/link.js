var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'link';
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
        name: {
            type: 'string'
        },
        content: {
            type: 'array'
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getLinks = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.addLinkPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        //console.log("parameter=",parameter);
        /* example:
        parameter= { name: '11111',
          text: [ 'google', 'popyard' ],
          hyperlink: [ 'http://www.google.com', 'http://www.popyard.org' ],
          submit: '' }
        */
        //process.exit();
        
        var linksArray = [];
        
        if (Array.isArray(parameter.text)) {
            for (var i in parameter.text) {
                var newObj = {};
                newObj.text = parameter.text[i];
                newObj.hyperlink = parameter.hyperlink[i];
                linksArray.push(newObj);
            }
        }
        else {
            var newObj = {};
            newObj.text = parameter.text;
            newObj.hyperlink = parameter.hyperlink;
            linksArray.push(newObj);
        }

        var link = {};
        link.name = parameter.name;
        link.content = linksArray;
        link.create_date = new Date();
        console.log('link=',link);
        //process.exit();
        block.data.add(req, res, link, function(error, docs, info) {
            //app.cb(error, docs, info, req, res, callback);
            res.redirect('/links/show_all');
        });        
    }; 
    
    block.data.getLinkDetail = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };    
    
    
    
    
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('item/index', { page:page });
    };
    
    block.page.getItemList = function(req, res) {
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.error = error;
            page.docs = docs;
            page.info = info;
            res.render('item/list', { page:page });
        });
    };
    
    block.page.addItem = function(req, res) {
        var page = app.getPage(req);
        res.render('item/add', { page:page });
    };
    
    block.page.addItemPost = function(req, res) {
        block.data.addItem(req, res, null, function(error, docs, info) {
            var page = app.getPage(req);
            res.redirect('/items/list');
        });
    };

    block.page.getItemDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            var item = docs && docs[0] || null;
            
            console.log('>>> ', error, docs, info);
            
            var page = app.getPage(req);
            page.item = item;
            
            console.log('>>> item:', page.item);
                
            res.render('item/detail', { page:page });
        });
    };
    
    block.page.linkHome = function(req, res) {
        var page = app.getPage(req);
        res.render('link/index', { page:page });
    };
    
     block.page.addLink = function(req, res) {
        var page = app.getPage(req);
        res.render('link/add', { page:page });
    };
    
    block.page.showAll = function(req, res) {
        console.log('---------');
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            //console.log('error=',error);
            //console.log('docs=',docs);
            //console.log('info=',info);
            
            var page = app.getPage(req);
            page.title = 'List of Linkset';
            page.links = docs;
            //console.log('page=',page);
            res.render('link/list', { page:page });
            
            //app.cb(error, docs, info, req, res, callback);
        });        
    };    
    
    block.page.getLinkListReact = function(req, res) {
        var page = app.getPage(req);
        res.render('link/list_react', { page:page });
    };    
    
    block.page.getLinkDetailReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.linkId = parameter.id;
        res.render('link/detail_react', { page:page });
    };    
    
    
    
    
    // data route
    app.server.post('/data/items/add', block.data.addItem);
    app.server.get('/data/links', block.data.getLinks);
    app.server.post('/data/links/add_links_post', block.data.addLinkPost);
    app.server.get('/data/links/:id/detail', block.data.getLinkDetail);
    
    // page route
    app.server.get('/items', block.page.getIndex);
    app.server.get('/items/home', block.page.getIndex);
    app.server.get('/items/add', block.page.addItem);
    app.server.post('/items/add', block.page.addItemPost);
    app.server.get('/items/list', block.page.getItemList);
    app.server.get('/items/:id/detail', block.page.getItemDetail);
    
    app.server.get('/links', block.page.linkHome);
    app.server.get('/links/add_links', block.page.addLink);
    //app.server.post('/links/add_links_post', block.page.addLinkPost);
    app.server.get('/links/show_all', block.page.showAll);
    
    // page react test route
    app.server.get('/links/list/react', block.page.getLinkListReact);
    app.server.get('/links/:id/detail/react', block.page.getLinkDetailReact);

    return block;
};

