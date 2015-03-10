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
        status: {
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
    
    // data route
    app.server.get('/data/announcement/add', block.data.addItem);
    app.server.post('/data/announcements/add', block.data.addItem);
    // page route
    app.server.get('/announcements', block.page.getIndex);
    //TODO: ask Yue about using id's in node/mongo and find a way to add gets for individual announcements
    // app.server.get('/announcements', block.page.getIndex);

    return block;
};

