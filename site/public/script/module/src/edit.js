/** @jsx React.DOM */

var React = require('react');
var Table = require('reactlet-table');

var HtmlInput = require('reactlet-html-input');
var HtmlSelect = require('reactlet-html-select');
var HtmlForm = require('reactlet-html-form');

var app = app ||  window.app || {};

$().ready(function() {
    setup();
    //testForm();
});

function setup() {
    console.log('in common view page - module:', app.moduleName, ' id:', app.itemId);
    getModuleInfo(app.moduleName, function(moduleInfo) {
        if (app.itemId) {
            getModuleItemData(app.moduleName, app.itemId, function(moduleItems) {
                var moduleItem = moduleItems && moduleItems[0] || null;
                updateDisplay(moduleInfo, moduleItem);
            });
        } else {
            updateDisplay(moduleInfo, null);
        }
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

function updateDisplay(moduleInfo, moduleItem) {
    var moduleModel = moduleInfo.model;
    console.log('updateDisplay model:', moduleModel);
    var formFields = getFormFieldsFromModel(moduleModel, moduleItem);
    app.editForm = React.render(
        React.createElement(HtmlForm, { data:{ fields:formFields } }),
        document.getElementById('editForm')
    );
}
