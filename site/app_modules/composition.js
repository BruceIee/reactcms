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
    
    block.data.getData = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;
        
        console.log('get by id:', id);
        console.log('block.data.getById:', block.data.getById);
        
        var error = null;
        var docs = [];
        var info = { message:'composition getData' };
        
        // DEBUG
        if (id == 'sidenav') {
            docs = [{
                name: 'sidenav',
                description: 'sidenav composition',
                filename: 'sidenav.html',
                data: [
                    { name:'r1c1', description:'top', width:'12' },
                    { name:'r2c1', description:'side', width:'4' },
                    { name:'r2c2', description:'main', width:'8' }
                ]
            }];
        }
        // END OF DEBUG
        
        app.cb(error, docs, info, req, res, callback);
        
        /*
        block.data.getById(req, res, id, function(error, docs, info) {
            console.log('getById result:', error, docs, info);
        });
        */
    };
    
    // data route
    app.server.get('/data/compositions/:id', block.data.getData);
    
    // page route
    app.server.get('/compositions', block.page.getIndex);

    return block;
};

