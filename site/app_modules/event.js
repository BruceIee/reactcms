var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'event';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        date: {
            type: 'date'
        },
        content: {
            type: 'string'
        }
    };
    
    // data
    
    
    // page

    
    
    // data route

    
    // page route

    
    // page react


    return block;
};

