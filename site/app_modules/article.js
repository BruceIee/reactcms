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
        content: {
            type: 'string'
        },
        title: {
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

    block.data.addArticlePost = function(req, res) {
        var callback = function(error, docs, info) {
            res.redirect("articles");
        };
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        block.data.add(req, res, article, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.page.articleHome = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Article Home';
        res.render('article/index', { page:page });
    };
    
    block.page.articleList = function(req, res) {
        console.log('---------');
        var parameter = tool.getReqParameter(req);
        console.log(parameter);
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            //console.log('error=',error);
            //console.log('docs=',docs);
            //console.log('info=',info);
            
            var page = app.getPage(req);
            page.title = 'List of articles';
            page.articles = docs;
            //console.log('page=',page);
            res.render('article/list', { page:page });
            
            //app.cb(error, docs, info, req, res, callback);
        });
    };    
    
    
    block.page.addWysiwyg = function(req, res) {
        var page = app.getPage(req);
        page.title = 'WYSIWYG';
        res.render('article/add_wysiwyg', { page:page });
    };

    block.page.getArticleDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            var article = docs && docs[0] || null;
            var page = app.getPage(req);
            page.controller = "articles";
            page.article = article;
            
            console.log('>>> article:', page.article);
                
            res.render('article/detail', { page:page });
        });
    };    
    
    block.page.getArticleListReact = function(req, res) {
        var page = app.getPage(req);
        res.render('article/list_react', { page:page });
    };    
    
    block.page.getArticleDetailReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.articleId = parameter.id;
        res.render('article/detail_react', { page:page });
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
    
    
    block.data.wysiwygPost = function(req, res) {
        var callback = arguments[3] || null; 
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        console.log('article=',article);
        //process.exit();
        block.data.add(req, res, article, function(error, docs, info) {
            //app.cb(error, docs, info, req, res, callback);
            res.redirect('/articles/list');
        });
    };
    
    block.data.uploadEditorImagePost = function(req, res) {
        var callback = arguments[3] || null; 
        var img = tool.getReqParameter(req);
        console.log('img=',img);
        var url = img.file.name;
        console.log('url=',url);
        res.send(url);
        //process.exit();
    };  

    block.data.getArticles = function(req, res) {
        var callback = arguments[3] || null;
        var condition = {};
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.getArticleDetail = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // data route
    app.server.get('/data/articles', block.data.getArticles);
    app.server.get('/data/articles/:id/detail', block.data.getArticleDetail);
    //app.server.get('/data/item/add', block.data.addItem);
    //app.server.post('/data/item/add', block.data.addItem);
    
    app.server.post('/data/article/article_post', block.data.articlePost);
    app.server.post('/data/article/wysiwyg_post', block.data.wysiwygPost);
    app.server.post('/data/article/upload_editor_image_post', block.data.uploadEditorImagePost);

    // page route
    //app.server.get('/item', block.page.getIndex);

    app.server.get('/articles/add', block.page.addArticle);
    app.server.get('/articles', block.page.articleHome);
    app.server.get('/articles/add_wysiwyg', block.page.addWysiwyg);
    app.server.get('/articles/:id/detail', block.page.getArticleDetail);
    app.server.get('/articles/list', block.page.articleList);
    
    // page react test route
    app.server.get('/articles/list/react', block.page.getArticleListReact);
    app.server.get('/articles/:id/detail/react', block.page.getArticleDetailReact);
    return block;
};

