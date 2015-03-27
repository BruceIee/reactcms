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
            res.render('article/show', { page:page });
        });
    };

    block.page.addArticle = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add an article';
        page.controller = "articles";
        console.log("Articles Add");
        res.render('article/add', { page:page });
    };

    app.server.get('/articles', block.page.articleHome);
    app.server.get('/articles/add_wysiwyg', block.page.addWysiwyg);
    app.server.get('/articles/:id/detail', block.page.getArticleDetail);
    app.server.get('/articles/list', block.page.articleList);
    return block;
};

