/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var app = app ||  window.app || {};
app.activeRowId = '';

$().ready(function() {
    setup();
});

function setup() {
    //console.log('in common list page - module:', app.moduleName);
    getModuleModel(app.moduleName, function(moduleModel) {
        getModuleData(app.moduleName, function(moduleItems) {
            updateTableDisplay(moduleModel, moduleItems);
        });
    });
    $('.btn-group .btn').click(function(event) {
        if ($(event.currentTarget).hasClass('btn-view')) {
            viewItem(app.activeRowId);
        }
    });
}

function getModuleModel(moduleName, callback) {
    var moduleModelUrl = '/data/modules/' + moduleName + '/info';
    $.get(moduleModelUrl, function(data) {
        var moduleModel = data.info.model;
        callback && callback(moduleModel);
    });
}

function getModuleData(moduleName, callback) {
    var moduleDataUrl = '/data/modules/' + moduleName + '/all';
    $.get(moduleDataUrl, function(data) {
        callback && callback(data.docs);
    });
}

function getColModel(moduleModel) {
    var colModel = {};
    var ignoreProperties = ['create_by', 'create_date', 'edit_by', 'edit_date'];
    colModel['_id'] = { name:'_id', text:'ID', flex:3, key:true };
    for (var property in moduleModel) {
        if (ignoreProperties.indexOf(property) == -1) {
            colModel[property] = {
                name: property,
                text: property,
                flex: 2
            };
        }
    }
    return colModel;
}

function updateTableDisplay(moduleModel, moduleItems) {
    var colModel = getColModel(moduleModel);
    doTableDisplay(colModel, moduleItems);
}

function doTableDisplay(colModel, items) {
    // table2Data has 'id' column as key column
    app.table1Data = {
        boxClass: 'table-container-bordered',
        colModel: colModel,
        dataItems: items,
        paging: { size: 10, page: 1 }
    };
    // table2 with paging
    app.table1 = React.render(
        React.createElement(Table, { data:app.table1Data }),
        document.getElementById('table1')
    );
    app.table1.on('table-row-click', function(event) {
        var id = event.id;
        app.activeRowId = app.table1.state.activeItemId;
    });
}

function viewItem(itemId) {
    if (!itemId) {
        return;
    }
    var itemViewUrl = '/modules/' + app.moduleName + '/' + itemId + '/view';
    console.log('view item:', itemId, itemViewUrl);
    window.location = itemViewUrl;
}