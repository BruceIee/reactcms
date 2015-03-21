var util = require('util');
var tool = require('leaptool');

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
        title: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    block.data.addItem = function(req, res) {
        var callback = arguments[3] || null; 
        var announcement = tool.getReqParameter(req);
        announcement.create_date = new Date();
        block.data.add(req, res, announcement, function(error, docs, info) {
            app.cb(error, docs, info, req, res, callback);
        });
    };
    block.page.getAnnouncementIndex = function(req, res) {
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
        block.data.getById(req, res, req.parameters._id, function(error, docs, info) {
            console.log(error);
            console.log(info);
            var page = app.getPage(req);
            page.controller = "announcements";
            var announcement = docs && docs[0] || null;
            page.announcement = announcement;
            res.render('announcement/show', { page:page });
        });
    };

    block.page.addAnnouncement = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add an announcement';
        page.controller = "announcements";
        console.log("Announcements Add")
        res.render('announcement/add', { page:page });
    };
    
    // data route
    //app.server.get('/data/announcement/add', block.data.addItem);
    //app.server.post('/data/announcements/add', block.data.addItem);
    // page route
    app.server.get('/announcements', block.page.getAnnouncementIndex);
    app.server.get('/announcements/add', block.page.addAnnouncement);
    app.server.get('/announcements/:_id', block.page.getAnnouncementDetail);

    return block;
};

