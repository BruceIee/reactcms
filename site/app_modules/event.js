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
        category: {
            type: 'string'
        },
        title: {
            type: 'string'
        },
        create_date: {
            type: 'date'
        },
        create_by: {
            type: 'string'
        },
        edit_date: {
            type: 'date'
        },
        edit_by: {
            type: 'string'
        }
    };
    
    // data
    block.data.addEventPost = function(req, res) {
        var callback = arguments[3] || null;
        var loginUser = req.session && req.session.user;
        var parameter = tool.getReqParameter(req);
        /* parameter example:
        parameter= { date: '2015-03-14',
          category: 'home',
          title: 'Happy Birthday!' }
        */

        var new_event = {};
        
        new_event.date = parameter.date;
        new_event.category = parameter.category;
        new_event.title = parameter.title;        
        new_event.create_date = new Date();
        new_event.create_by = loginUser.username;

        block.data.add(req, res, new_event, function(error, docs, info) {
            res.redirect('/events/list');
        });        
    };     
    
    block.data.editEventPost = function(req, res) {
        var callback = arguments[3] || null; 
        var parameter = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        var id = parameter.id_hidden;
        block.data.getById(req, res, id, function(error, docs, info) {
            var event = docs && docs[0] || null;
            event.date = parameter.date;
            event.category = parameter.category;
            event.title = parameter.title;
            event.edit_date = new Date();
            event.edit_by = loginUser.username;

            /*
            block.data.edit(req, res, event, function(error, docs, info) {
                res.redirect('/events/list');
            });
            */

            app.db.updateById(moduleName, id, event, function(error, docs, info) {
                //app.cb(error, docs, info, req, res, callback);
                res.redirect('/events/list');
            });            
        });
    };  

    block.data.groupByDate = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var eventsCollection = {};
        /* eventsCollection example:
        {
            '2015-05-01': [
                { category:'home', title:'gas bill' },
                { category:'work', title:'report due' }
            ],
            '2015-05-11': [
                { category:'home', title:'test' }
            ]
        }
        */

        var db_setting = app.db.app.setting.database;
        var MongoClient = require('mongodb').MongoClient;
        var db_string = "mongodb://" + db_setting.host + ":" + db_setting.port + "/" + db_setting.name;

        MongoClient.connect(db_string, function(err, db) {
            console.log("err=",err);
            // Get an aggregation cursor
            var cursor = db.collection(moduleName).aggregate([
                    { $group : { _id : "$date", rec: { $push: "$$ROOT" } }  }  // Aggregation, group by date
                ], {
                allowDiskUse: true
              , cursor: {batchSize: 1000}
                });
        
            // Use cursor as stream
            cursor.on('data', function(data) {
                /* data example. stream data(by each "date"), group by "date"
                data= { _id: '2015-05-22',
                  rec: 
                   [ { _id: 5560901a59335dc25220ac28,
                       date: '2015-05-22',
                       category: 'work',
                       title: 'Metro starts',
                       create_date: Sat May 23 2015 22:35:06 GMT+0800 (CST),
                       create_by: 'ljnet',
                       _class: 'event',
                       edit_date: Sat May 23 2015 23:07:35 GMT+0800 (CST),
                       edit_by: 'ljnet' },
                     { _id: 5560979961bcf00954c54ad9,
                       date: '2015-05-22',
                       category: 'home',
                       title: 'CAT6',
                       create_date: Sat May 23 2015 23:07:05 GMT+0800 (CST),
                       create_by: 'ljnet',
                       _class: 'event' } ] }
                */
                
                var tmp_key = data._id;
                var tmp_value_array = [];
                
                for ( var i in data.rec ) {
                    var tmp_obj = {};
                    tmp_obj.category = data.rec[i].category;
                    tmp_obj.title = data.rec[i].title;
                    tmp_value_array.push(tmp_obj);
                }
                
                eventsCollection[tmp_key] = tmp_value_array;
            });
        
            cursor.on('end', function() {
                console.log("on end");
                db.close();
                res.send(eventsCollection);
            });
        });        
    };   

    
    // page
    block.page.eventHome = function(req, res) {
        var page = app.getPage(req);
        res.render('event/index', { page:page });
    };
    
    block.page.addEvent = function(req, res) {
        var page = app.getPage(req);
        page.title = 'Add Event';
        page.operation = "Add";
        page.formAction = "/data/events/add_post";
        res.render('event/add_edit', { page:page });
    };

    block.page.eventList = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var condition = {};
        var filter = {};
        app.db.find(moduleName, condition, filter, function(error, docs, info){
            var page = app.getPage(req);
            page.title = 'Event List';
            page.events = docs;
            res.render('event/list', { page:page });
        });
    };     
    
    block.page.editEvent = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        block.data.getById(req, res, id, function(error, docs, info) {
            var event = docs && docs[0] || null;
            var page = app.getPage(req);
            page.operation = "Edit";
            page.formAction = "/data/events/edit_post";
            page.event = event;
            page.title = 'Edit Event';
            res.render('event/add_edit', { page:page });
        });        
    };

    block.page.delEvent = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var id = parameter.id;        
        app.db.deleteById(moduleName, id, function(error, docs, info) {
            res.redirect('/events/list');
        });        
    };    

    block.page.eventCalendarReact = function(req, res) {
        var parameter = tool.getReqParameter(req);
        var page = app.getPage(req);
        res.render('event/calendar_react', { page:page });
    };   

    // data route
    app.server.post('/data/events/add_post', block.data.addEventPost);
    app.server.post('/data/events/edit_post', block.data.editEventPost);
    app.server.get('/data/events/group_by_date', block.data.groupByDate);
    
    // page route
    app.server.all('/events', block.page.checkLogin);
    app.server.all('/events/*', block.page.checkLogin);
    app.server.get('/events', block.page.eventHome);
    app.server.get('/events/add_event', block.page.addEvent);
    app.server.get('/events/list', block.page.eventList);
    app.server.get('/events/:id/edit', block.page.editEvent);
    app.server.get('/events/:id/del', block.page.delEvent);
    
    // page react
    app.server.get('/events/calendar_react', block.page.eventCalendarReact);

    return block;
};

