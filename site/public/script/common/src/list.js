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
    
    colModel = {
        id: { name:'id', text:'ID', width:'15%', key:true, format:app.getIdText },
        name: { name:'name', text:'Name', width:'20%', sort:'up' },
        price: { name:'price', text:'Price', width:'15%', type:'money' },
        description: { name:'description', text:'Description', width:'30%' },
        extra: { name:'extra', text:'Extra', show:false, width:'10%' }
    };
    
    return colModel;
}

function updateTableDisplay(moduleModel, moduleItems) {
    var colModel = getColModel(moduleModel);
    var items = [
        { id:'P01', name:'egg', price:5.98, description:'fresh egg', extra:'n/a' },
        { id:'P02', name:'bread', price:1.29, description:'white bread', extra:'n/a' },
        { id:'P03', name:'chip', price:2.13, description:'potato chip', extra:'n/a' },
        { id:'P04', name:'sauce', price:1.89, description:'dipping sauce', extra:'n/a' },
        { id:'P05', name:'corn', price:4.59, description:'fresh pear', extra:'n/a' },
        { id:'P06', name:'vegi', price:2.12, description:'potato', extra:'n/a' },
        { id:'P07', name:'vegi', price:1.81, description:'eggplant', extra:'n/a' },
        { id:'P08', name:'corn', price:4.99, description:'fresh aple', extra:'n/a' }
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