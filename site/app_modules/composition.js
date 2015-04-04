var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'composition';
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
        filename: {
            type: 'string'
        },
        data: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        status: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        }
    };
    
    // page route
    app.server.get('/compositions', block.page.getIndex);

    return block;
};

