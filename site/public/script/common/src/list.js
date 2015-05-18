var React = require('react');
var Table = require('reactlet-table');

var app = app || {};

$().ready(function() {
    setup();
});

function setup() {
    console.log('in common list page - module:', app.moduleName);
}

