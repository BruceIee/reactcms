var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'field';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    var fieldCol = {
        'string': {
            subtype: {
                'password': {},
                'random': {},
                'uniqueid': {},
                'text': {
                    subtype: {
                        markdown: {},
                        html: {}
                    }
                },
            }
        },
        'number': {
            subtype: {
                'float': {},
                'integer': {}
            }
        },
        'boolean': {
            subtype: {
                'yesno': {},
                'truefalse': {}
            }
            
        },
        'date': {
            subtype: {
                'date': {},
                'time': {},
                'datetime': {}
            }
            
        },
        'file': {
            subtype: {
                'image': {},
                'textfile': {},
                'binaryfile': {}
            }
            
        },
        'array': {
            subtype: {
                'file': {},
                'object': {},
                'string': {}
            }
            
        },
        'object': {
            subtype: {
                'json': {},
                'string': {}
            }
        }
    };
    
    block.data.getList = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var docs = [];
        for (var fieldName in fieldCol) {
            docs.push(fieldName);
        }
        app.cb(null, docs, { message:'field list' }, req, res, callback);
    };
    
    block.data.getSubtypeList = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var fieldName = parameter.field || '';
        var docs = [];
        var field = fieldCol[fieldName];
        if (field) {
            for (subtypeName in field.subtype) {
                docs.push(subtypeName);
            }
        }
        app.cb(null, docs, { message:'subtypes for ' + fieldName }, req, res, callback);
    };
    
    block.page.viewItem = function(req, res) {
        var page = { title:'Field View' };
        page.fieldCol = fieldCol;
        var parameter = tool.getReqParameter(req);
        var fieldName = parameter.field || '';
        page.fieldName = fieldName;
        page.field = fieldCol[fieldName];
        res.render(moduleName + '/detail', { page:page });
    };
    
    app.server.get('/data/field/list', block.data.getList);
    app.server.get('/data/field/:field/subtype', block.data.getSubtypeList);
    app.server.get('/field', block.page.getIndex);
    app.server.get('/field/:field/view', block.page.viewItem);
    app.server.get('/field/view', block.page.viewItem);

    return block;
};