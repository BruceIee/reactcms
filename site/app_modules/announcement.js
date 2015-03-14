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
        var item = tool.getReqParameter(req);
        item.create_date = new Date();
        block.data.add(req, res, item, function(error, docs, info) {
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
            //page.id = parameter.id;
            page.title = 'Announcements';
            page.announcements = docs;
            console.log('page=',page);
            res.render('announcements/index', { page:page });
        });
    };
    
    // data route
    app.server.get('/data/announcement/add', block.data.addItem);
    app.server.post('/data/announcements/add', block.data.addItem);
    // page route
    app.server.get('/announcements', block.page.getAnnouncementIndex);
    app.server.get('/announcement/:_id', block.data.addItem);

    return block;
};

