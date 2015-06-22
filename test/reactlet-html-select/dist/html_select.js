/** @jsx React.DOM */

var React = React || require('react/addons');

// HtmlInput component
var HtmlInput = React.createClass({displayName: "HtmlInput",
    name: 'html-select',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'name', type:'string', required:true, defaultValue:'', note:'field name' },
            { name:'dispatcher', type:'object', required:false, defaultValue:null, note:'flux dispatcher' },
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'inputClass', type:'string', required:false, defaultValue:'form-control', note:'input element CSS class' },
            { name:'label', type:'string', required:false, defaultValue:'', note:'input label' },
            { name:'value', type:'string', required:false, defaultValue:'', note:'input type' },
            { name:'options', type:'array', required:false, defaultValue:[], note:'options in array' }
        ];
        return attributes;
    },
    
    getValue: function() {
        return this.state.value;
    },
    
    onChange: function(event) {
        var newValue = event.target.value;
        this.setState({ value:newValue });
        this.fire('change', [newValue]);
    },
    
    render: function() {
        // use first option as default value
        if (!this.state.value && this.state.options && this.state.options[0]) {
            this.state.value = this.state.options[0].id || '';
        }
        var options = [];
        for (var i = 0; i < this.state.options.length; i++) {
            var option = this.state.options[i];
            var optionId = option.id || '';
            var optionText = option.display || option.text || '';
            options.push(
                React.createElement("option", {value:  optionId },  optionText )
            );
        }
        // set content display
        var content = 
            React.createElement("div", {className: "form-group html-select-content-container"}, 
                React.createElement("label", null,  this.state.label), 
                React.createElement("select", {
                    className:  this.state.inputClass, 
                    value:  this.state.value, 
                    onChange: this.onChange}, 
                     options 
                )
            );
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' ') }, 
                 content 
            )
        );
    }
});

module.exports = HtmlInput;
