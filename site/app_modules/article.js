var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'article';
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
        title: {
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
    
    
    block.page.addArticle = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add an article';
        page.controller = "articles";
        res.render('article/add', { page:page });
    };

    
    block.page.articleList = function(req, res) {
        console.log('---------');
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            console.log('error=',error);
            console.log('docs=',docs);
            console.log('info=',info);
            
            var page = app.getPage(req);
            page.title = 'List of articles';
            docs.reverse();
            page.articles = docs;
            page.controller = "articles";
            console.log('page=',page);
            res.render('article/index', { page:page });
            
            //app.cb(error, docs, info, req, res, callback);
        });
        
        
        /* ???
        block.data.get(req, res, condition, filter, null, function(error, docs, info) {
            console.log('error=',error);
            console.log('docs=',docs);
            console.log('info=',info);
            
            var page = app.getPage(req);
            page.title = 'List of articles';
            page.articles = docs;
            console.log('page=',page);
            res.render('article/article_list', { page:page });            
        });
        */
    };
    
    
    block.page.addWysiwyg = function(req, res) {
        var page = app.getPage(req);
        page.title = 'WYSIWYG';
        res.render('article/add_wysiwyg', { page:page });
    };
    
    
    
    
    
    
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    
    block.data.articlePost = function(req, res) {
        var callback = arguments[3] || null; 
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        console.log('article=',article);
        block.data.add(req, res, article, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    
    
    
    // data route
    
    //app.server.get('/data/item/add', block.data.addItem);
    //app.server.post('/data/item/add', block.data.addItem);
    
    app.server.post('/data/article/article_post', block.data.articlePost);
    
    
    // page route
    //app.server.get('/item', block.page.getIndex);
    
    app.server.get('/articles/add', block.page.addArticle);
    app.server.get('/articles', block.page.articleList);
    
    app.server.get('/article/add_wysiwyg', block.page.addWysiwyg);

    return block;
};

