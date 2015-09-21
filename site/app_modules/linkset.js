var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'linkset';
    var block = {
        app: app,
        group: 'user',
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        name: {
            type: 'string'
        },
        title: {
            type: 'string'
        },
        title_link: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        image: {
            type: 'file',
            subtype: {
                type: 'image'
            }
        },
        links1_title: {
            type: 'string'
        },
        links1: {
            type: 'array',
            subtype: {
                type: 'string'
            }
        },
        links2_title: {
            type: 'string'
        },
        links2: {
            type: 'array',
            subtype: {
                type: 'string'
            }
        },
        links3_title: {
            type: 'string'
        },
        links3: {
            type: 'array',
            subtype: {
                type: 'string'
            }
        },
        links4_title: {
            type: 'string'
        },
        links4: {
            type: 'array',
            subtype: {
                type: 'string'
            }
        },
        links5_title: {
            type: 'string'
        },
        links5: {
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
    
    // data
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getLinkset = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.addLinksetPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);

        /* example:
        parameter= { name: '11111',
          text: [ 'google', 'popyard' ],
          hyperlink: [ 'http://www.google.com', 'http://www.popyard.org' ],
          submit: '' }
        */
        
        var content = [];
        
        if (Array.isArray(parameter.text)) {
            for (var i in parameter.text) {
                var newObj = {};
                newObj.text = parameter.text[i];
                newObj.hyperlink = parameter.hyperlink[i];
                content.push(newObj);
            }
        } else {
            var newObj = {};
            newObj.text = parameter.text;
            newObj.hyperlink = parameter.hyperlink;
            content.push(newObj);
        }

        var linkset = {};
        linkset.name = parameter.name;
        linkset.content = content;
        linkset.create_date = new Date();

        block.data.add(req, res, linkset, function(error, docs, info) {
            res.redirect('/linksets/show_all');
        });        
    }; 
    
    block.data.getLinksetDetail = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };    
    
    // page
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
            var page = app.getPage(req);
            page.item = item;
            res.render('item/detail', { page:page });
        });
    };
    
    block.page.linksetHome = function(req, res) {
        var page = app.getPage(req);
        res.render('linkset/index', { page:page });
    };
    
    block.page.addLinkset = function(req, res) {
        var page = app.getPage(req);
        res.render('linkset/add', { page:page });
    };
    
    block.page.showAll = function(req, res) {
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'List of Linkset';
            page.linksets = docs;
            res.render('linkset/list', { page:page });
        });        
    };
    
    block.page.delLinkset = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        app.db.deleteById(moduleName, id, function(error, docs, info) {
            res.redirect('/linksets/show_all');
        });        
    };    
    
    block.page.getLinksetListReact = function(req, res) {
        var page = app.getPage(req);
        res.render('linkset/list_react', { page:page });
    };    
    
    block.page.getLinksetDetailReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.linksetId = parameter.id;
        res.render('linkset/detail_react', { page:page });
    };    
    
    // data route
    //app.server.post('/data/items/add', block.data.addItem);
    app.server.get('/data/linksets', block.data.getLinkset);
    app.server.post('/data/linksets/add_linkset_post', block.data.addLinksetPost);
    app.server.get('/data/linksets/:id/detail', block.data.getLinksetDetail);
    
    // page route
    app.server.all('/linksets', block.page.checkLogin);
    app.server.all('/linksets/*', block.page.checkLogin);
    app.server.get('/linksets', block.page.linksetHome);
    app.server.get('/linksets/add_linkset', block.page.addLinkset);
    app.server.get('/linksets/show_all', block.page.showAll);
    app.server.get('/linksets/:id/del', block.page.delLinkset);
    
    // page react test route
    app.server.get('/linksets/list/react', block.page.getLinksetListReact);
    app.server.get('/linksets/:id/detail/react', block.page.getLinksetDetailReact);

    return block;
};

