var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'page';
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
        description: {
            type: 'string'
        },
        composition: {
            type: 'string'
        },
        content: {
            type: 'object'
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        },
        group: {
            type: 'string'
        }
    };
    
    // data
    block.data.getPage = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var condition = { name:pageName };
        var filter = {};
        
        //console.log('getPage query:', condition, filter);
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            // get page
            var page = docs && docs[0];
            // get composition
            if (docs.length > 0) {
                var page = docs[0];
                var pageContent = page.content;
                var compositionName = page.composition;
                var compositionDataUrl = '/data/compositions/' + compositionName;
                var compositionData = app.module['composition'].data;
                compositionData.getDataByName(req, res, compositionName, function(error, docs, info) {
                    var composition = docs && docs[0];
                    //console.log('composition:', composition);
                    info = { page:page, composition:composition };
                    app.cb(error, docs, info, req, res, callback);
                });
            } else {
                info = {
                    message: 'page is not found',
                    page: null,
                    composition: null
                };
                app.cb(error, docs, info, req, res, callback);
            }
        });
    };
    
    block.data.isPageNameExist = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var condition = { name:pageName };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            info['pagename'] = pageName;
            info['exist'] = docs.length > 0;
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.addPage = function(req, res) {
        var callback = arguments[3] || null; 
        var page = tool.getReqParameter(req);
        page.create_date = new Date();
        
        block.data.add(req, res, page, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.editPage = function(req, res) {
        var callback = arguments[3] || null; 
        var page = tool.getReqParameter(req);
        block.data.edit(req, res, page, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('page/index', { page:page });
    };
    
    block.page.addPage = function(req, res) {
        var page = app.getPage(req);
        res.render('page/add', { page:page });
    };
    
    block.page.addPagePost = function(req, res) {
        var page = app.getPage(req);
        res.render('page/add', { page:page });
    };
    
    block.page.editPage = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var pageId = parameter.id;
        block.data.getById(req, res, pageId, function(error, docs, info) {
            var page = app.getPage(req);
            page.pageObject = docs && docs[0] || null;
            //console.log('edit page id:', pageId, page.pageObject);
            res.render('page/edit', { page:page });
        });
    };
    
    block.page.getPageList = function(req, res) {
        var condition = {};
        var loginUser = req.session && req.session.user;
        if (loginUser.group) {
            condition.group = loginUser.group;
        }
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.title = 'List of pages';
            page.pages = docs;
            res.render('page/list', { page:page });    
        });
    };
    
    block.page.getPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        // get page
        block.data.getPage(req, res, null, function(error, docs, info) {
            //console.log('Got page:', error, docs, info);
            var page = app.getPage(req);
            if (info.page) {
                page.title = info.page.title || app.setting['app_name'] || '';
                page.pageData = info.page;
                page.compositionData = info.composition;
                var layoutFilename = 'composition/' + info.composition.filename;
                res.render(layoutFilename, { page:page });
            } else {
                // page is not found in database
                page.pageData = { name:pageName };
                res.render('page/missing', { page:page });
            }
        });
    };
    
    // data route
    app.server.get('/data/pages/:pagename', block.data.getPage);
    app.server.post('/data/pages/add', block.data.addPage);
    app.server.get('/data/pages/:pagename/exist', block.data.isPageNameExist);
    app.server.post('/data/pages/:id/edit', block.data.editPage);
 
    // page route
    app.server.all('/pages', block.page.checkLogin);
    app.server.get('/pages', block.page.getIndex);
    app.server.all('/pages/add', block.page.checkLogin);
    app.server.get('/pages/add', block.page.addPage);
    app.server.post('/pages/add', block.page.addPagePost);
    app.server.all('/pages/:id/edit', block.page.checkLogin);
    app.server.get('/pages/:id/edit', block.page.editPage);
    app.server.all('/pages/list', block.page.checkLogin);
    app.server.get('/pages/list', block.page.getPageList);
    app.server.get('/pages/:pagename', block.page.getPage);
    
    
    return block;
};

