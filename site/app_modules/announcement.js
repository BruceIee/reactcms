var util = require('util');
var tool = require('leaptool');
var pagedown = require("pagedown");
var converter = pagedown.getSanitizingConverter();
//var pagedownExtra = require("pagedown-extra").Extra;
//pagedownExtra.init(converter);

module.exports = function(app) {
    var moduleName = 'announcement';
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
        content_markdown: {
            type: 'string'
        },
        title: {
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

    block.data.addAnnouncementPost = function(req, res) {
        var callback = function(error, docs, info) {
            res.redirect("announcements");
        };
        var announcement = tool.getReqParameter(req);
        announcement.create_date = new Date();
        console.log(announcement.content_markdown);
        announcement.content = converter.makeHtml(announcement.content_markdown);
        block.data.add(req, res, announcement, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    block.page.getAnnouncementIndex = function(req, res) {
        var parameter = tool.getReqParameter(req);
        console.log(parameter);
        var condition = {};
        var filter = {};

        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'Announcements';
            docs.reverse();
            page.announcements = docs;
            page.controller = 'announcements';
            page.shorten = function(text) {
                var ret = text;
                if (ret.length > 300) {
                    ret = ret.substr(0,300-3) + "&hellip;";
                }
                return ret;
            };
            console.log('page=',page);
            res.render('announcement/index', { page:page });
        });
    };

    block.page.getAnnouncementDetail = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        block.data.getById(req, res, id, function(error, docs, info) {
            var announcement = docs && docs[0] || null;
            var page = app.getPage(req);
            page.controller = "announcements";
            page.announcement = announcement;
            res.render('announcement/show', { page:page });
        });
    };

    block.page.addAnnouncement = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add an announcement';
        page.controller = "announcements";
        console.log("Announcements Add");
        res.render('announcement/add', { page:page });
    };

    app.server.all('/announcements', block.page.checkLogin);
    app.server.all('/announcements/*', block.page.checkLogin);
    app.server.get('/announcements', block.page.getAnnouncementIndex);
    app.server.get('/announcements/add', block.page.addAnnouncement);
    app.server.get('/announcements/:id', block.page.getAnnouncementDetail);
    app.server.post('/announcements', block.data.addAnnouncementPost);

    return block;
};

