/** command
 * node cmd.js initdb
 * node cmd.js import [project_name]
 * node cmd.js backup [project_name]
 * node cmd.js load [project_name]
 */

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
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp; //Asynchronous recursive file copy utility.
var glob = require('glob');

var quantity_array = []; // use this for comparing if items quantity in file equals items added to DB.
var finish_flag = false;

// set NODE_WEB_SITE in env, for upstart config /etc/init/<site>.conf
//   env NODE_WEB_SITE=/home/user/dev/<sitename>/site
var rootPath = process.env['NODE_WEB_SITE'] || process.cwd();
var setting = tool.getDefaultSetting(rootPath);

// support command shortcuts
var operation = process.argv[2] || 'start';
var project = process.argv[3] || 'default';

switch (operation) {
    case 'initdb':
        setting['operation'] = 'initdb';
        break;
    case 'import':
        setting['operation'] = 'import';
        break;
    case 'backup':
        setting['operation'] = 'backup';
        break;
    case 'load':
        setting['operation'] = 'load';
        break;
    default:
        console.log('usage:\nnode cmd.js initdb|import|backup|load\n');
        process.exit();
}

var sysModulePath = rootPath + '/node_modules';
var filePattern = /(\w+).js/;
setting.sys_modules_to_load = [];
setting.modules_to_load = null;

// all available app modules will be loaded
var appModulePath = rootPath + '/app_modules';
getMatchedFilenames(appModulePath, filePattern, function(names) {
    setting.modules_to_load = names;
    //setting.modules_to_load = ['article','linkset'];
    start(setting);
});

function start(setting) {
    var app = {};
    app.server = express();
    app.setting = setting;
    app.setting.database = {};
    app.setting.database = require('./setting').setting.database;
    app.module = {};
    app.engine = require('webEngine')(app);
    
    for (var i in app.setting.modules_to_load) {
        var name = app.setting.modules_to_load[i];
        var modulePath = path.join(app.setting.server_path, 'app_modules', name);
        app.module[name] = require(modulePath)(app);
    }

    var Database = require(app.setting.database.type + '-database'); // 'mongo-database.js'
    app.db = new Database(app, function() {
        switch(setting['operation']) {
        case 'initdb':
            initDb(app, function() {
                process.exit();
            });
            break;             
        case 'import':
            importData(app, function() {
                process.exit();
            });
            break;
        case 'backup':
            backupData(app, function() {
                process.exit();
            });
            break;   
        case 'load':
            loadProject(app, function() {
                process.exit();
            });
            break;
        default:
            console.log('unknown command:', setting['operation']);
            process.exit();
        }
    });
}

/**
 * Init db
 */
function initDb(app, callback) {
    app.db.createTables(function() {
        console.log('initdb is completed.');
        callback && callback();
    });
}

/**
 * Backup data
 * 
 * default to ./data
 */
function backupData(app, callback) {
    if (project !== 'default') {
        var backup_folder = './data/' + project;
        if ( fs.existsSync(backup_folder) ) {
            rm_rf.sync(backup_folder);  // remove 'project' folder
        }
    } else {
        var backup_folder = './data';
        var txt_array = glob.sync(backup_folder + '/*.txt');
        txt_array.forEach( function(filename){ // synchronous remove *.txt under ./data
            fs.unlinkSync(filename);
        })
    }
    console.log('backup to folder:',backup_folder);
    var app_modulenames_array = [];
    var moduleArray = app.setting.modules_to_load;
    for (var i in moduleArray) {
        var tmp_obj = {};
        tmp_obj['app'] = app;
        tmp_obj['modulename'] = moduleArray[i];
        app_modulenames_array.push(tmp_obj);
    } 
    // backup modules
    async.forEachSeries(app_modulenames_array, backupModule, function(){
        // copy uploaded files
        if (project !== 'default') {
            var upfile_folder = './data/' + project + '/file';
        } else {
            var upfile_folder = './data/file';
        }
        if ( fs.existsSync(upfile_folder) ) {
            rm_rf.sync(upfile_folder);  // remove folder
        }
        mkdirp.sync(upfile_folder); // recursively mkdir
        var source_path = './public/file';
        ncp(source_path, upfile_folder, function (err) { // copy folder to folder
            if (err) {
                console.log(err);
            }
            console.log('uploaded files copied, from ' + source_path + ' to ' + upfile_folder);
            console.log('backup finished.');
            callback && callback();
        });
    });
}

function backupModule(app_moduleName, callback) {
    var app = app_moduleName.app;
    var moduleName = app_moduleName.modulename;
    var condition = {};
    var filter = {};
    
    app.db.find(moduleName, condition, filter, function(error, docs, info){
        if (app.module[moduleName].model === null) { //no model definition
            var module_model = {};
        } else {
            var module_model = app.module[moduleName].model;
        }

        var data = {
            name: moduleName,
            model: module_model,
            count: docs.length || 0,
            items: docs
        };
        
        if (project !== 'default') {
            var filepath = './data/' + project;
        } else {
            var filepath = './data';
        }

        mkdirp.sync(filepath); // create backup folder that we need
        
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
 * import all data files, default from ./data
 */
function importData(app, callback) {
    if (project !== 'default') {
        app.import_folder = './data/' + project;
    } else {
        // default is to import all data files from ./data folder
        app.import_folder = './data';
    }
    console.log('import from folder:',app.import_folder);
    if ( fs.existsSync(app.import_folder) == false ) {
        console.log('exit. no such folder:', app.import_folder);
        process.exit();
    }
    // get list of data files to be imported
    var items = fs.readdirSync(app.import_folder);
    var filenames_array = []; 
    for (var i in items) {
        if ( items[i].substr(-4) == '.txt' ) {
            var datafilename = items[i];
            var stat = fs.statSync([app.import_folder, datafilename].join('/'));
            if (stat.isFile()) {
                filenames_array.push([app.import_folder, datafilename].join('/'));
            }            
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
            //check if finished
            if (finish_flag == true) {
                // copy uploaded files
                var pubfile_folder = './public/file';
                if ( fs.existsSync(pubfile_folder) ) {
                    rm_rf.sync(pubfile_folder);  // remove folder
                }
                mkdirp.sync(pubfile_folder); // recursively mkdir
                var source_path = app.import_folder + '/file';
                if (fs.existsSync(source_path)) {
                    ncp(source_path, pubfile_folder, function (err) { // copy folder to folder
                        if (err) {
                            console.log(err);
                        }
                        console.log('uploaded files copied, from ' + source_path + ' to ' + pubfile_folder);
                        console.log('import finished.');
                        callback && callback();
                    });
                } else {
                    console.log('uploaded files copied, from ' + source_path + ' to ' + pubfile_folder);
                    console.log('import finished.');
                    callback && callback();
                }
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
        if (patternA.test(line)) {  //module name, should only found once in a file at second line.
            moduleName = line.replace(/"name":|\s|"|,/g, '');
            tmp_obj.module_name = moduleName;
            quantity_array.push(tmp_obj); //example: {module_name:'patient', rec_cnt:0, added_cnt:0}
        }
        if (line == '    "items": [') {
            //console.log('items block found');
            items_found_flag = true;
        }
        if (items_found_flag == true && line == '        {') {
            //item start
            txt_tmp += line;
            item_started_flag = true;
            item_ended_flag = false;
        } else if (items_found_flag == true &&
            item_started_flag == true &&
            item_ended_flag == false &&
            line.slice(0,12) == '            ') {
            txt_tmp += line + '\n';
            item_started_flag = true;
            item_ended_flag = false;            
        } else if (items_found_flag == true && (line == '        },' || line == '        }') ) { //item end
            rec_cnt += 1;
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
                    var tmp_flag = false;
                    for (var m in quantity_array) {
                        if (quantity_array[m].rec_cnt == quantity_array[m].added_cnt) {
                            tmp_flag = true;
                        } else {
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
        var tmp_flag = false;
        for (var m in quantity_array) {
            if (quantity_array[m].rec_cnt == quantity_array[m].added_cnt) {
                tmp_flag = true;
            } else {
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
            var value = app.engine.castData(doc[property], model[property]);
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
        var value = app.engine.castData(doc[property], model[property]);
        doc[property] = value;
    }
    return doc;
}

function rec_cnt_to_array(module_name, rec_cnt) {
    for (var i in quantity_array) {
        if (quantity_array[i].module_name == module_name) {
            quantity_array[i].rec_cnt = rec_cnt;
            break;
        }
    }
}

function added_cnt_plus_to_array(module_name) {
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
}

// switch to project by refreshing database data 
function loadProject(app, callback) {    
    initDb(app, function() {
        importData(app, function() {
            process.exit();
        });
    });
}
