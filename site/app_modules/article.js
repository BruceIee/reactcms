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
        }
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        block.data.add(req, res, article, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    block.page.getArticleIndex = function(req, res) {
        console.log('---------');
        var parameter = tool.getReqParameter(req);
        console.log(parameter);
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            console.log('error=',error);
            console.log('docs=',docs);
            console.log('info=',info);

            var page = app.getPage(req);
            page.title = 'Articles';
            docs.reverse();
            page.articles = docs;
            page.controller = 'articles';
            page.shorten = function(text) {
                var ret = text;
                if (ret.length > 300) {
                    ret = ret.substr(0,300-3) + "&hellip;";
                }
                return ret;
            };
            console.log('page=',page);
            res.render('article/index', { page:page });
        });
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

    app.server.get('/articles', block.page.getArticleIndex);
    app.server.get('/articles/add', block.page.addArticle);
    app.server.get('/articles/:id', block.page.getArticleDetail);
    app.server.post('/articles', block.data.addArticlePost);

    return block;
};

