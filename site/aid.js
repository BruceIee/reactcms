var fs = require('fs');
var util = require('util');
var path = require('path');
var tool = require('leaptool');
var https = require('https');
var http = require('http');
var express = require('express');
var swig = require('swig');
var cons = require('consolidate');
var async = require('async'); 
var readline = require('readline');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
var rm_rf = require('rimraf'); // rm -rf for node
var mongoDb = require('mongodb');

var quantity_array = []; // use this for comparing if items quantity in file equals items added to DB.
var finish_flag = false;

// set NODE_WEB_SITE in env, for upstart config /etc/init/<site>.conf
//   env NODE_WEB_SITE=/home/user/dev/<sitename>/site
var rootPath = process.env['NODE_WEB_SITE'] || process.cwd();
var setting = tool.getDefaultSetting(rootPath);

/**
 * update setting from commandline arguments
 *
 * commandline arguments:
 * 
 * -log_level=debug|info|warn|error|critical
 * -app_name=abc
 * 
 * -cmd=backup
 * -backup_folder=./public, default to ./data
 * 
 * -cmd=import
 * -import_file=data/testdata1.txt;data/testdata2.txt
 * -import_folder=./public
 */
var argumentPattern = /^-([^\s]+)=([^\s]+)/;
process.argv.forEach(function (value, index, array) {
    var result = argumentPattern.exec(value);
    if (result && result.length >= 3) {
        setting[result[1]] = result[2]; //example: setting['cmd'] = backup
    }
});

// support command shortcuts
var cmd = process.argv[2] || 'start';
switch (cmd) {
    case 'initdb':
        setting['cmd'] = 'initdb';
        break;
    case 'import':
        setting['cmd'] = 'import';
        break;
    case 'backup':
        setting['cmd'] = 'backup';
        break;
}

var sysModulePath = rootPath + '/node_modules';
var filePattern = /(\w+).js/;
setting.sys_modules_to_load = [];
setting.modules_to_load = null;

// all available app modules will be loaded
var appModulePath = rootPath + '/app_modules';
getMatchedFilenames(appModulePath, filePattern, function(names) {
    setting.modules_to_load = names;
    //setting.modules_to_load = ['article','link'];
    start(setting);
});


function start(setting) {
    var app = {};
    app.server = express();
    app.setting = setting;
    app.setting.database = {};
    app.setting.database.host = 'localhost';
    app.setting.database.port = '27017';
    app.setting.database.name = 'reactcms';
    app.setting.database.type = 'mongo';
    app.module = {};

    for (var i in app.setting.modules_to_load) {
        var name = app.setting.modules_to_load[i];
        var modulePath = path.join(app.setting.server_path, 'app_modules', name);
        app.module[name] = require(modulePath)(app);
    }    

    var Database = require(app.setting.database.type + '-database'); // 'mongo-database.js'
    app.db = new Database(app, function() {
        switch(setting['cmd']) {
        case 'initdb':
            app.db.createTables(function() {
                console.log('----- initdb is done. -----');
                process.exit();
            });
            break;
        case 'backup':
            backupData(app, function(){
                process.exit();
            });
            break;                
        case 'import':
            importData(app, function(){
                process.exit();
            });
            break;                
        }
    });
}


/**
 * Backup data
 * 
 * -cmd=backup
 * default to ./data
 */
function backupData(app, callback) {
    var app_modulenames_array = [];
    var moduleArray = app.setting.modules_to_load;
    
    for (var i in moduleArray) {
        var tmp_obj = {};
        tmp_obj['app'] = app;
        tmp_obj['modulename'] = moduleArray[i];
        app_modulenames_array.push(tmp_obj);
    } 

    async.forEachSeries(app_modulenames_array, backupModule, function(){    
        console.log('----- backup finished. -----');
        callback && callback();
    });
}


function backupModule(app_moduleName, callback) { //stream
    var app = app_moduleName.app;
    var moduleName = app_moduleName.modulename;
    var condition = {};
    var filter = {};
    
    app.db.find(moduleName, condition, filter, function(error, docs, info){
        if (app.module[moduleName].model === null) { //no model definition
            var module_model = {};
        }
        else {
            var module_model = app.module[moduleName].model;
        }

        var data = {
            name: moduleName,
            //model: module.model,
            model: module_model,
            count: docs.length || 0,
            items: docs
        };
        
        var filepath = './data';
        var filename = util.format('%s/%s-data.txt', filepath, moduleName);
        var dataFileStream = fs.createWriteStream(filename, {
            flags: 'w',
            encoding: 'utf8'
        })
        
        dataFileStream.write('{\n');
        dataFileStream.write('    "name":"' + moduleName + '",\n');
        dataFileStream.write('    "module":' + tool.stringify(module_model, null, 4, '    ')  + ',\n');
        dataFileStream.write('    "count":' + docs.length + ',\n');
        dataFileStream.write('    "items": [' + '\n');
        
        for (var i = 0; i < docs.length; i++) {
            var itemOuptut = tool.stringify(docs[i], null, 4, '        ');
            if (i < docs.length - 1) {
                itemOuptut = itemOuptut + ',';
            }
            itemOuptut = itemOuptut + '\n';
            dataFileStream.write(itemOuptut);
        }
        
        dataFileStream.write('    ]\n');
        dataFileStream.write('}\n');
        dataFileStream.end();
        
        console.log(util.format('module:(%s) backuped %s to %s', moduleName , docs.length, filename));

        dataFileStream.on('finish', function() {
            callback && callback();
        });
    });
}


/**
 * Import data
 *   -cmd=import
 * import all data files, default from ./data
 */
function importData(app, callback) {
    // default is to import all data files from ./data folder
    app.import_folder = './data';

    // get list of data files to be imported
    var items = fs.readdirSync(app.import_folder);
    var filenames_array = []; 
    for (var i in items) {
        var datafilename = items[i];
        var stat = fs.statSync([app.import_folder, datafilename].join('/'));
        if (stat.isFile()) {
            filenames_array.push([app.import_folder, datafilename].join('/'));
        }
    }

    var app_filenames_array = []; // array contains 'app' and 'filename'
    
    for (var i in filenames_array) {
        var tmp_obj = {};
        tmp_obj['app'] = app;
        tmp_obj['filename'] = filenames_array[i];
        app_filenames_array.push(tmp_obj);
    }

    async.forEachSeries(app_filenames_array, importFile, function(){    
        setInterval(function() {
            //console.log('in setInterval, quantity_array=\n', quantity_array);
            //check if finished
            if (finish_flag == true) {
                console.log('----- import finished. -----');
                process.exit(); 
            }                
        }, 1000);  
    });
}


//import each data file (readline stream)
function importFile(app_filename, callback) {
    var txt_tmp = '';
    var items_found_flag = false;
    var item_started_flag = false;
    var item_ended_flag = false;
    var tmp_obj = {module_name:'', rec_cnt:0, added_cnt:0};
    var moduleName = '';
    var patternA = /^    "name":.+/; //for module name
    var opt = { flags:'r', encoding: 'utf8', autoClose: true};
    var streamObj = fs.createReadStream(app_filename.filename, opt);
    var tmp_cnt1 = 0;
    var rec_cnt = 0; //record(item) count
  
    var rl = readline.createInterface({
        input: streamObj,
        output: process.stdout,
        terminal: false
    });    
        
    rl.on('line', function(line) {
        tmp_cnt1 += 1;
        //console.log('** on line, line='+line);

        if (patternA.test(line)) {  //module name, should only found once in a file at second line.
            //console.log('module name found');
            //console.log('line='+line);
            moduleName = line.replace(/"name":|\s|"|,/g, '');
            //console.log('moduleName='+moduleName);
            tmp_obj.module_name = moduleName;
            quantity_array.push(tmp_obj); //example: {module_name:'patient', rec_cnt:0, added_cnt:0}
            //console.log('quantity_array=\n', quantity_array);
        }
        
        if (line == '    "items": [') {
            //console.log('items block found');
            items_found_flag = true;
        }

        if (tmp_cnt1 == 2000) {
            //process.exit();
        }
        
        if (items_found_flag == true && line == '        {') { //item start
            //console.log('item start found');
            txt_tmp += line;
            item_started_flag = true;
            item_ended_flag = false;
        }
        else if (items_found_flag == true && item_started_flag == true && item_ended_flag == false &&
                 line.slice(0,12) == '            ') { //item
            txt_tmp += line + '\n';
            item_started_flag = true;
            item_ended_flag = false;            
        }        
        else if (items_found_flag == true && (line == '        },' || line == '        }') ) { //item end
            rec_cnt += 1;
            //console.log('### item end found');
            
            if (line == '        },') {
                line = '        }' //remove last ','
            }
            
            txt_tmp += line;
            var rec_json = JSON.parse(txt_tmp);

            //---add to DB---
            if (moduleName != "") {
                var doc = convertJsonObject2(app_filename.app, rec_json, moduleName);
                app_filename.app.db.add(moduleName, doc, function(error, result, info) {
                    if (error) {
                        console.log('Error: ', error.err);
                    }

                    added_cnt_plus_to_array(moduleName);
                    //console.log('addedtoDB quantity_array=\n', quantity_array);
                    
                    var tmp_flag = false;
                    for (var m in quantity_array) {
                        if (quantity_array[m].rec_cnt == quantity_array[m].added_cnt) {
                            tmp_flag = true;
                        }
                        else {
                            tmp_flag = false;
                            break;                            
                        }
                    }
                    finish_flag = tmp_flag;
                });
            }

            txt_tmp = '';
            item_started_flag = true;
            item_ended_flag = true;            
        }
    });    
    
    rl.on('close', function() { //current file read done.
        //rec_cnt to quantity_array's related module obj
        rec_cnt_to_array(moduleName, rec_cnt);
        
        //console.log('close quantity_array=\n', quantity_array);
        /* example of quantity_array
        [ { module_name: 'dataset', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'method', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'patient', rec_cnt: 19997, added_cnt: 19997 },
         { module_name: 'task', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'comment', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'file', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'query', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'sequence', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'template', rec_cnt: 0, added_cnt: 0 },
         { module_name: 'user', rec_cnt: 0, added_cnt: 0 } ]        
        */
        
        var tmp_flag = false;
        
        for (var m in quantity_array) {
            if (quantity_array[m].rec_cnt == quantity_array[m].added_cnt) {
                tmp_flag = true;
            }
            else {
                tmp_flag = false;
                break;                            
            }
        }
        
        finish_flag = tmp_flag;        
        console.log(util.format('imported: (%s) to module(%s) from %s', rec_cnt, moduleName, app_filename.filename))
        items_found_flag = false;
        item_started_flag = false;
        item_ended_flag = false;

        callback && callback(); //for async.forEachSeries
    });    
}


/**
 * Enforce data type conversion on json objects read from import file
 */
function convertJsonObject(app, items, moduleName) {
    var module = app.module[moduleName];
    var model =  module.model;
    var docs = [];
    for (var i in items) {
        var doc = items[i];
        for (var property in model) {
            var value = castData(doc[property], model[property]);
            doc[property] = value;
        }
        docs.push(doc);
    }
    return docs;
}


function convertJsonObject2(app, item, moduleName) {
    var module = app.module[moduleName];
    var model =  module.model;
    var doc = item;
    for (var property in model) {
        var value = castData(doc[property], model[property]);
        doc[property] = value;
    }
    return doc;
}


function rec_cnt_to_array(module_name, rec_cnt) {
    //quantity_array
    for (var i in quantity_array) {
        if (quantity_array[i].module_name == module_name) {
            quantity_array[i].rec_cnt = rec_cnt;
            break;
        }
    }
}


function added_cnt_plus_to_array(module_name) {
    //quantity_array
    for (var i in quantity_array) {
        if (quantity_array[i].module_name == module_name) {
            quantity_array[i].added_cnt += 1;
            break;
        }
    }
}


// pattern exmaple: /(\w+).js/
function getMatchedFilenames (path, pattern, callback) {
    var names = [];
    fs.readdir(path, function(error, files) {
        for (var i in files) {
            var match = files[i].match(pattern)
            if (match) {
                names.push(match[1]);
            }
        }
        callback(names);
    })
};


function castData(input, model) {
    var result = '';
    //var subtype = model.subtype && model.subtype.type || '';
    switch(model.type) {
        case 'string':
            result = castStringData(input, model);
            break;
        case 'number':
            result = parseFloat(input) || 0;
            break;
        case 'boolean':
            result = castBooleanData(input, model);
            break;
        case 'text':
            result = input || '';
            break;
        case 'date':
            result = castDateData(input, model);
            break;
        case 'array':
            result = castArrayData(input, model);
            break;
        case 'file':
            input = input || [];
            if (input.constructor.name == 'Array') {
                result = input;
            } else {
                result = [input];
            }
            break;
        case 'object':
            result = castObjectData(input, model);
            break;
        case 'sequence':
            result = input;
        default:
            result = input;
    }
    return result;
};


function castStringData(input, model) {
    input = input || '';
    var result = '';
    var subtype = model.subtype && model.subtype.type || '';
    // if input has value, keep its value
    if (input) {
        result = input;
    } else {
        switch(subtype) {
            case 'random':
                result = Math.floor(Math.random() * 100000000);
                break;
            case 'uuid':
                result = require('node-uuid').v4().replace(/-/g, '');
                break;
            default:
                result = input;
        }
    }
    return result;
}

function castBooleanData(input, model) {
    var result = false;
    if (/true|yes/i.exec(input)) {
        result = true;
    }
    return result;
}

function castArrayData(input, model) {
    input = input || [];
    var result = '';
    var subtype = model.subtype && model.subtype.type || 'string';
    
    if (input.constructor.name == 'Array') {
        result = input;
    } else {
        switch(subtype) {
            case 'file':
                result = [input];
                break;
            case 'string':
                if (input.constructor.name == 'String') {
                    result = tool.toArray(input);
                } else {
                    result = [input];
                }
                break;
            case 'number':
                if (input.constructor.name == 'String') {
                    var output = tool.toArray(input);
                    var result = [];
                    for (var i in output) {
                        result.push(parseFloat(output[i]));
                    }
                } else {
                    result = [input];
                }
                break;
            case 'object':
                result = castObjectData(input, model.subtype);
                break;
            default:
                result = input;
        }
    }
    return result;
}

function castObjectData(input, model) {
    var result = null;
    var subtype = model.subtype && model.subtype.type || 'mixed';
    switch(subtype) {
        case 'json':
            result = null;
            try {
                if (input && typeof input == 'object') {
                    result = input;
                } else if (input) {
                    result = JSON.parse(input);
                }
            } catch (e) {
                console.log('ERROR in castObjectData: ' + e);
                result = null;
            }
            break;
        case 'mixed':
            result = input;
            break;
        default:
            result = input;
    }
    return result;
}

function castDateData(input, model) {
    var result = null;
    var subtype = model.subtype && model.subtype.type || '';
    switch(subtype) {
        case 'time':
            if (new Date(input) == 'Invalid Date') {
                // example: 9:50 or 7:30 PM
                input = '1/1/1970 ' + input; // add fixed date
                result = new Date(Date.parse(input));
            } else {
                result = new Date(input);
            }
            break;
        default:
            result = input && new Date(Date.parse(input));
    }
    return result;
}
    
    
    