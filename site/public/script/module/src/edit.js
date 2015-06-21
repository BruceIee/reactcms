/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var HtmlInput = require('reactlet-html-input');
var HtmlSelect = require('reactlet-html-select');
var HtmlForm = require('reactlet-html-form');

var app = app ||  window.app || {};

$().ready(function() {
    setup();
    testForm3();
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


function testForm1() {
    console.log('in testForm1');
    app.component1Data = {
        label:'Item Price'
    };
    app.component1 = React.render(
        React.createElement('HtmlInput', { data:app.component1Data }),
        document.getElementById('form1')
    );
    
    /*
    app.table1 = React.render(
        React.createElement(Table, { data:app.table1Data }),
        document.getElementById('table1')
    );
    */
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
        <HtmlForm data={ component2Data } />,
        document.getElementById('form2')
    );
}

function testForm3() {
    app.table3Data = {
        boxClass: 'table-container-bordered',
        colModel: {
            id: { name:'id', text:'ID', width:'15%', key:true },
            name: { name:'name', text:'Name', width:'20%', sort:'up' },
            price: { name:'price', text:'Price', width:'15%', type:'money' },
            description: { name:'description', text:'Description', width:'30%' },
            extra: { name:'extra', text:'Extra', show:false, width:'10%' }
        },
        dataItems:[
            { id:'P01', name:'egg', price:7, description:'fresh egg', extra:'n/a' },
            { id:'P21', name:'bread', price:2.99, description:'whole grain bread', extra:'n/a' },
            { id:'P23', name:'chip', price:2.1, description:'potato chip', extra:'n/a' },
            { id:'P54', name:'sauce', price:1.89, description:'dipping sauce', extra:'n/a' },
            { id:'P81', name:'corn', price:4.59, description:'fresh corn', extra:'n/a' }
        ]
    };
    
    app.table3 = React.render(
        React.createElement(Table, { data:app.table3Data }),
        document.getElementById('form3')
    );

}