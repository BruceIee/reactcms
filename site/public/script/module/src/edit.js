/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var HtmlInput = require('reactlet-html-input');
var HtmlSelect = require('reactlet-html-select');
var HtmlForm = require('reactlet-html-form');

var app = app ||  window.app || {};

$().ready(function() {
    setup();
    testForm1a();
    testForm1b();
    testForm2();
});

function setup() {
    console.log('in common view page - module:', app.moduleName, ' id:', app.itemId);
    /*
    getModuleInfo(app.moduleName, function(moduleInfo) {
        getModuleItemData(app.moduleName, app.itemId, function(moduleItems) {
            //updateTableDisplay(moduleInfo, moduleItems);
        });
    });
    */
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

function getColModel(moduleInfo) {
    var colModel = {
        name: { name:'name', text:'Name', width:'40%' },
        value: { name:'value', text:'Value', width:'60%' }
    };
    return colModel;
}


/*
function updateTableDisplay(moduleInfo, moduleItems) {
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
    var colModel = getColModel(moduleInfo);
    doTableDisplay(colModel, newItems);
}

function doTableDisplay(colModel, items) {
    app.table1Data = {
        boxClass: 'table-container-bordered',
        colModel: colModel,
        dataItems: items,
        //paging: { size: 10, page: 1 }
    };
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
*/

function testForm1a() {
    console.log('in testForm1a');
    app.component1aData = {
        label:'Item Price'
    };
    app.form1a = React.render(
        React.createElement(HtmlInput, { data:app.component1aData }),
        document.getElementById('form1a')
    );
}

function testForm1b() {
    console.log('in testForm1b');
    app.component1bData = {
        label: "Grade",
        value: "grade1",
        options: [
            { id:"blank", display:"" },
            { id:"grade1", display:"grade 1" },
            { id:"grade2", display:"grade 2" },
            { id:"grade3", display:"grade 3" }
        ]
    };
    app.form1b = React.render(
        React.createElement(HtmlSelect, { data:app.component1bData }),
        document.getElementById('form1b')
    );
}

function testForm2() {
    console.log('in testForm2');
    var testFormFields = [
        {
            type: "HtmlInput",
            data: {
                label: "Student",
                "placeholder": "Student Name"
            }
        },
        {
            type: "HtmlSelect",
            data: {
                label: "Grade",
                value: "grade1",
                options: [
                    { id:"blank", display:"" },
                    { id:"grade1", display:"grade 1" },
                    { id:"grade2", display:"grade 2" },
                    { id:"grade3", display:"grade 3" }
                ]
            }
        }
    ];
    var component2Data = { fields:testFormFields };
    var component2 = React.render(
        React.createElement(HtmlForm, { data:component2Data }),
        document.getElementById('form2')
    );
}
