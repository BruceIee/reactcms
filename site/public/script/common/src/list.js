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
    getModuleInfo(app.moduleName, function(moduleInfo) {
        getModuleData(app.moduleName, function(moduleItems) {
            updateTableDisplay(moduleInfo, moduleItems);
        });
    });
    $('.btn-group .btn').click(function(event) {
        if ($(event.currentTarget).hasClass('btn-view')) {
            viewItem(app.activeRowId);
        } else if ($(event.currentTarget).hasClass('btn-new')) {
            console.log('clicked on new button');
        } else if ($(event.currentTarget).hasClass('btn-edit')) {
            console.log('clicked on edit button');
        } else if ($(event.currentTarget).hasClass('btn-delete')) {
            console.log('clicked on delete button');
        }
    });
}

function getModuleInfo(moduleName, callback) {
    var moduleModelUrl = '/data/modules/' + moduleName + '/info';
    $.get(moduleModelUrl, function(data) {
        callback && callback( data.info);
    });
}

function getModuleData(moduleName, callback) {
    var moduleDataUrl = '/data/modules/' + moduleName + '/all';
    $.get(moduleDataUrl, function(data) {
        callback && callback(data.docs);
    });
}

function getColModel(moduleInfo) {
    var moduleModel = moduleInfo.model;
    var listFields = moduleInfo.listFields;
    var colModel = {};
    colModel['_id'] = { name:'_id', text:'ID', flex:2, key:true };
    if (listFields) {
        for (var i = 0; i < listFields.length; i++) {
            var listField = listFields[i];
            colModel[listField.name] = {
                name: listField.name,
                text: listField.display || listField.name,
                flex: listField.flex || 2
            };
        }
    } else {
        var ignoreProperties = ['create_by', 'create_date', 'edit_by', 'edit_date'];
        for (var property in moduleModel) {
            if (ignoreProperties.indexOf(property) == -1) {
                colModel[property] = {
                    name: property,
                    text: property,
                    flex: 2
                };
            }
        }
    }
    return colModel;
}

function updateTableDisplay(moduleInfo, moduleItems) {
    var colModel = getColModel(moduleInfo);
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