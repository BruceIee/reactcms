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
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        group: {
            type: 'string'
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
    block.listFields = [
        { name:'name', display:'Title', flex:2, sort:'asc' },
        { name:'description', display:'Description', flex:3, },
        { name:'composition', display:'Composition', flex:2, },
        { name:'status', display:'Status', flex:2 }
    ];

    // data
    block.data.getPage = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var condition = { name:pageName };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            block.data.processPageData(req, res, error, docs, info, callback);
        });
    };
    
    block.data.getPageById = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var condition = { _id:parameter.id };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            block.data.processPageData(req, res, error, docs, info, callback);
        });
    };
    
    block.data.processPageData = function(req, res, error, docs, info, callback) {
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
        var parameter = tool.getReqParameter(req);
        var page = tool.getReqParameter(req);
        page.create_date = new Date();
        block.data.add(req, res, page, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.editPage = function(req, res) {
        var callback = arguments[3] || null; 
        var page = tool.getReqParameter(req);
        var parameter = tool.getReqParameter(req);
        //console.log('parameter:', JSON.stringify(parameter, null, '  '));
        block.data.edit(req, res, page, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    // page
    block.page.getIndex = function(req, res) {
        var page = app.getPage(req);
        res.render('page/index', { page:page });
    };
    
    block.page.showPageDirect = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var compositionName = parameter.composition;
        var pagedata = tool.JsonParse(parameter.pagedata);
        var widgetdata = tool.JsonParse(parameter.widgetdata);
        // based on parameter input, show page accordingly
        if (pagedata) {
            block.page.showPageWithPageData(req, res);
        } else if (widgetdata) {
            block.page.showPageWithWidgetData(req, res);
        } else {
            var info = { message:'Invalid parameters for page show direct' };
            app.renderInfoPage(null, null, info, req, res);
        }
    };
    
    block.page.showPageWithPageData = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var compositionName = parameter.composition;
        var pagedataInput = tool.JsonParse(parameter.pagedata);
        var pageData = {
            name: 'page',
            datatype: 'page',
            composition: compositionName,
            content: pagedataInput
        };
        var compositionData = app.module.composition.data;
        compositionData.getDataByName(req, res, compositionName, function(error, docs, info) {
            var composition = docs && docs[0];
            var page = app.getPage(req);
            page.pageData = pageData;
            page.compositionData = composition;
            var layoutFilename = 'composition/' + composition.filename;
            res.render(layoutFilename, { page:page });
        });
    };
    
    block.page.showPageWithWidgetData = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var compositionName = parameter.composition || 'theone';
        var sectionName = parameter.sectionname || 'r1c1';
        var widgetName = parameter.widgetname;
        var widgetData = tool.JsonParse(parameter.widgetdata);
        var pageData = {
            name: 'page',
            datatype: 'widget',
            composition: compositionName,
            content: {
                section: sectionName,
                name: widgetName,
                data: widgetData
            }
        };
        var compositionData = app.module.composition.data;
        compositionData.getDataByName(req, res, compositionName, function(error, docs, info) {
            var composition = docs && docs[0];
            var page = app.getPage(req);
            page.pageData = pageData;
            page.compositionData = composition;
            var layoutFilename = 'composition/' + composition.filename;
            res.render(layoutFilename, { page:page });
        });
    };
    
    block.page.addPage = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        page.mode = 'add';
        page.name = parameter.name || '';
        res.render('page/edit', { page:page });
    };
    
    block.page.addPagePost = function(req, res) {
        var page = app.getPage(req);
        res.render('page/edit', { page:page });
    };
    
    block.page.editPage = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var pageId = parameter.id;
        block.data.getById(req, res, pageId, function(error, docs, info) {
            var page = app.getPage(req);
            page.mode = 'edit';
            page.section = parameter.section || '';
            page.pageObject = docs && docs[0] || null;
            res.render('page/edit', { page:page });
        });
    };

    block.page.editPageByName = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.name;
        var condition = { name:pageName };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var page = app.getPage(req);
            page.mode = 'edit';
            page.pageObject = docs && docs[0] || null;
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
        // get page data
        block.data.getPage(req, res, null, function(error, docs, info) {
            block.page.showPage(req, res, info);
        });
    };
    
    block.page.viewPage = function(req, res) {
        block.data.getPageById(req, res, null, function(error, docs, info) {
            block.page.showPage(req, res, info);
        });
    };
    
    block.page.showPage = function(req, res, info) {
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var page = app.getPage(req);
        if (info.page) {
            page.title = info.page.title || app.setting['app_name'] || '';
            page.mode = (typeof parameter.edit === 'undefined') ? 'view': 'edit';
            page.pageData = info.page;
            page.compositionData = info.composition;
            var layoutFilename = 'composition/' + info.composition.filename;
            res.render(layoutFilename, { page:page });
        } else {
            // page is not found in database
            page.pageData = { name:pageName };
            res.render('page/missing', { page:page });
        }
    };
    // data route
    app.server.get('/data/pages/:pagename', block.data.getPage);
    app.server.post('/data/pages/add', block.data.addPage);
    app.server.get('/data/pages/:pagename/exist', block.data.isPageNameExist);
    app.server.post('/data/pages/:id/edit', block.data.editPage);
 
    // page route
    app.server.all('/pages', block.page.checkLogin);
    app.server.get('/pages', block.page.getIndex);
    app.server.get('/pages/show/direct', block.page.showPageDirect);
    app.server.all('/pages/new', block.page.checkLogin);
    app.server.get('/pages/new', block.page.addPage);
    app.server.all('/pages/add', block.page.checkLogin);
    app.server.get('/pages/add', block.page.addPage);
    app.server.post('/pages/add', block.page.addPagePost);
    app.server.all('/pages/:id/edit', block.page.checkLogin);
    app.server.get('/pages/:id/edit', block.page.editPage);
    app.server.all('/pages/edit', block.page.checkLogin);
    app.server.get('/pages/edit', block.page.editPage);
    app.server.all('/pages/:name/edit_by_name', block.page.checkLogin);
    app.server.get('/pages/:name/edit_by_name', block.page.editPageByName);
    app.server.all('/pages/list', block.page.checkLogin);
    app.server.get('/pages/list', block.page.getPageList);
    app.server.get('/pages/view', block.page.viewPage);
    app.server.get('/pages/:pagename', block.page.getPage);
    
    return block;
};

