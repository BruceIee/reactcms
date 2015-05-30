/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var app = app ||  window.app || {};

$().ready(function() {
    setup();
});

function setup() {
    console.log('in common view page - module:', app.moduleName, ' id:', app.itemId);
    getModuleInfo(app.moduleName, function(moduleInfo) {
        getModuleItemData(app.moduleName, app.itemId, function(moduleItems) {
            updateTableDisplay(moduleInfo, moduleItems);
        });
    });
}

function getModuleInfo(moduleName, callback) {
    var moduleInfoUrl = '/data/modules/' + moduleName + '/info';
    $.get(moduleInfoUrl, function(data) {
        callback && callback( data.info);
    });
}

function getModuleItemData(moduleName, itemId, callback) {
    var moduleItemDataUrl = '/data/modules/' + moduleName + '/' + itemId;
    $.get(moduleItemDataUrl, function(data) {
        callback && callback(data.docs);
    });
}

function getColModel(moduleModel) {
    var colModel = {
        name: { name:'name', text:'Name', width:'40%' },
        value: { name:'value', text:'Value', width:'60%' }
    };
    return colModel;

}

function updateTableDisplay(moduleInfo, moduleItems) {
    /* moduleItems example:
    [
        {
            id: xxx,
            title: yyy,
            content: zzz
        }
    ]
    */
    var newItems = [];
    for ( var prop in moduleItems[0] ) {
        if ( prop != '_class' &&
             prop != 'create_by'  && prop != 'create_date' &&
             prop != 'edit_by'   && prop != 'edit_date' ) {
            var newObj = {};
            newObj.name = prop;
            newObj.value = moduleItems[0][prop];
            newItems.push(newObj);
        }
    }

    /* newItems example:
    [
        { name:'_id', value:'123456' },
        { name:'title', value:'tttttt' },
        { name:'content', value:'xxxxxxxxx' },
    ]
    */
    var colModel = getColModel(moduleInfo);
    doTableDisplay(colModel, newItems);
}

function doTableDisplay(colModel, items) {
    // table2Data has 'id' column as key column
    app.table1Data = {
        boxClass: 'table-container-bordered',
        colModel: colModel,
        dataItems: items,
        //paging: { size: 10, page: 1 }
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
    var itemViewUrl = '/module/' + app.moduleName + '/' + itemId + '/view';
    console.log('view item:', itemId, itemViewUrl);
}