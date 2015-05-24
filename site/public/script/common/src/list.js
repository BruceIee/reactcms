/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var app = app ||  window.app || {};

$().ready(function() {
    setup();
});

function setup() {
    console.log('in common list page - module:', app.moduleName);
    getModuleModel(app.moduleName, function(moduleModel) {
        getModuleData(app.moduleName, function(moduleItems) {
            console.log('>>> module:', moduleModel, moduleItems);
            updateTableDisplay(moduleModel, moduleItems);
        });
    });
}

function getModuleModel(moduleName, callback) {
    var moduleModelUrl = '/data/modules/' + moduleName + '/model';
    $.get(moduleModelUrl, function(data) {
        var moduleModel = data.docs;
        //console.log('>>> module model:', moduleModel);
        callback && callback(moduleModel);
    });
}

function getModuleData(moduleName, callback) {
    var moduleDataUrl = '/data/modules/' + moduleName + '/all';
    $.get(moduleDataUrl, function(data) {
        //console.log('>>> module data:', data.docs);
        callback && callback(data.docs);
    });
}

function getColModel(moduleModel) {
    var colModel = {};
    var ignoreProperties = ['create_by', 'create_date', 'edit_by', 'edit_date'];
    colModel['_id'] = { name:'_id', text:'ID', key:true, width:'10%' };
    for (var property in moduleModel) {
        if (ignoreProperties.indexOf(property) == -1) {
            colModel[property] = {
                name: property,
                text: property,
                width: '20%'
            };
        }
    }
    /*
    colModel = {
        '_id': { name:'_id', text:'ID', key:true, width:'20%' },
        title: { name:'title', text:'Title' },
        content: { name:'content', text:'Content' }
    };
    */
    return colModel;
}

function updateTableDisplay(moduleModel, moduleItems) {
    var colModel = getColModel(moduleModel);
    var items = [
        { _id:'P01', title:'egg', price:5.98, content:'fresh egg' },
        { _id:'P02', title:'bread', price:1.29, content:'white bread' },
        { _id:'P03', title:'chip', price:2.13, content:'potato chip' },
        { _id:'P04', title:'sauce', price:1.89, content:'dipping sauce' },
        { _id:'P05', title:'corn', price:4.59, content:'fresh pear' },
        { _id:'P06', title:'vegi', price:2.12, content:'potato' },
        { _id:'P07', title:'vegi', price:1.81, content:'eggplant' },
        { _id:'P08', title:'corn', price:4.99, content:'fresh aple' }
    ];
    doTableDisplay(colModel, items);
}

function doTableDisplay(colModel, items) {
    
    // table2Data has 'id' column as key column
    app.table1Data = {
        boxClass: 'table-container-bordered',
        colModel: colModel,
        dataItems: items,
        paging: { size: 5, page: 1 }
    };
    
    // table2 with paging
    app.table1 = React.render(
        React.createElement(Table, { data:app.table1Data }),
        document.getElementById('table1')
    );
    app.table1.on('table-row-click', function(event) {
        var id = event.id;
        console.log('row click - id:', id, 'table active item id:', app.table1.state.activeItemId);
    });
}