var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'file';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        filename: {
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
        }
    };
    
    // data route
    //app.server.get('/data/file/add', block.data.addItem);
    // page route
    app.server.get('/file', block.page.getIndex);

    return block;
};

