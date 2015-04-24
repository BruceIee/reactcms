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
        }
    };
    
    // data
    block.data.getPage = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var pageName = parameter.pagename;
        var condition = { name:pageName };
        var filter = {};
        
        console.log('getPage query:', condition, filter);
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            
            console.log('getPage:', error, docs, info);
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
                    console.log('composition:', composition);
                    
                    /*
                    pageSectionContent example:
                    [{
                        widgetName: 'ArticleDetail',
                        widgetInfo: {
                            module: 'article',
                            condition: { title:'Mission of PTA' },
                            filter: {}
                        }
                    }]
                    */
                    for (var pageSectionName in pageContent) {
                        var widgets = pageContent[pageSectionName];
                        for (var i = 0; i < widgets.length; i++) {
                            var widget = widgets[i];
                            var componentData = app.module['component'].data;
                            tool.setReqParameter(req, widget);
                            componentData.getWidgetData(req, res, null, function(error, docs, info) {
                                //console.log('widget data:', error, docs, info);
                            });
                        }
                    }
                    
                    info = { page:page, composition:composition };
                    app.cb(error, docs, info, req, res, callback);
                });
            }
            
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
        console.log('edit page id:', pageId);
        
        var page = app.getPage(req);
        res.render('page/edit', { page:page });
    };
    
    block.page.getPageList = function(req, res) {
        var condition = {};
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
            page.title = info.page.title || app.setting['app_name'] || '';
            page.pageData = info.page;
            page.compositionData = info.composition;
            var layoutFilename = 'composition/' + info.composition.filename;
            res.render(layoutFilename, { page:page });
        });
    };
    
    // data route
    app.server.get('/data/pages/:pagename', block.data.getPage);
 
    // page route
    app.server.get('/pages', block.page.getIndex);
    app.server.get('/pages/add', block.page.addPage);
    app.server.post('/pages/add', block.page.addPagePost);
    app.server.get('/pages/:id/edit', block.page.editPage);
    app.server.get('/pages/list', block.page.getPageList);
    app.server.get('/pages/:pagename', block.page.getPage);
    
    
    return block;
};

