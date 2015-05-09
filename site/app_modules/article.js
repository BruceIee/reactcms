var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    var moduleName = 'article';
    var block = {
        app: app,
        group: 'user',
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
        status: {
            type: 'string'
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
    
    block.data.articlePost = function(req, res) {
        var callback = arguments[3] || null; 
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        block.data.add(req, res, article, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.addWysiwygPost = function(req, res) {
        var callback = arguments[3] || null; 
        var article = tool.getReqParameter(req);
        article.create_date = new Date();
        block.data.add(req, res, article, function(error, docs, info) {
            //app.cb(error, docs, info, req, res, callback);
            res.redirect('/articles/list');
        });
    };

    block.data.editWysiwygPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id_hidden;
        block.data.getById(req, res, id, function(error, docs, info) {
            var article = docs && docs[0] || null;
            article.title = parameter.title;
            article.content = parameter.content;
            article.type = parameter.type;
            article.edit_date = new Date();
            block.data.edit(req, res, article, function(error, docs, info) {
                res.redirect('/articles/list');
            });    
        });
    };    

    block.data.uploadEditorImagePost = function(req, res) {
        var callback = arguments[3] || null; 
        var img = tool.getReqParameter(req);
        console.log('img=',img);
        var url = img.file.name;
        //console.log('url=',url);
        res.send(url);
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
    
    block.data.getArticleByTitle = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var title = parameter.title || '';
        var condition = { title:title };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page
    block.page.addArticle = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add an article';
        page.controller = "articles";
        res.render('article/add', { page:page });
    };
    
    block.page.articleHome = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Article Home';
        res.render('article/index', { page:page });
    };
    
    block.page.articleList = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var condition = {};
        var filter = {};
        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'List of articles';
            page.articles = docs;
            res.render('article/list', { page:page });
        });
    };    

    block.page.addWysiwyg = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add article(WYSIWYG)';
        page.operation = "Add";
        page.formAction = "/data/article/add_wysiwyg_post";
        res.render('article/add_edit_wysiwyg', { page:page });
    };

    block.page.editWysiwyg = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        block.data.getById(req, res, id, function(error, docs, info) {
            var article = docs && docs[0] || null;
            var page = app.getPage(req);
            page.operation = "Edit";
            page.formAction = "/data/article/edit_wysiwyg_post";
            page.article = article;
            page.title = 'Edit article(WYSIWYG)';
            res.render('article/add_edit_wysiwyg', { page:page });
        });        
    };

    block.page.delArticle = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        app.db.deleteById(moduleName, id, function(error, docs, info) {
            res.redirect('/articles/list');
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
    
    
    // data route
    app.server.get('/data/articles', block.data.getArticles);
    app.server.get('/data/articles/:id/detail', block.data.getArticleDetail);
    app.server.get('/data/articles/title/:title', block.data.getArticleByTitle);
    
    app.server.post('/data/article/article_post', block.data.articlePost);
    app.server.post('/data/article/add_wysiwyg_post', block.data.addWysiwygPost);
    app.server.post('/data/article/edit_wysiwyg_post', block.data.editWysiwygPost);
    app.server.post('/data/article/upload_editor_image_post', block.data.uploadEditorImagePost);

    // page route
    app.server.all('/articles', block.page.checkLogin);
    app.server.all('/articles/*', block.page.checkLogin);
    app.server.get('/articles/add', block.page.addArticle);
    app.server.get('/articles', block.page.articleHome);
    app.server.get('/articles/add_wysiwyg', block.page.addWysiwyg);
    app.server.get('/articles/:id/detail', block.page.getArticleDetail);
    app.server.get('/articles/list', block.page.articleList);
    app.server.get('/articles/:id/edit', block.page.editWysiwyg);
    app.server.get('/articles/:id/del', block.page.delArticle);
    
    // page react test route
    app.server.get('/articles/list/react', block.page.getArticleListReact);
    app.server.get('/articles/:id/detail/react', block.page.getArticleDetailReact);
    return block;
};

