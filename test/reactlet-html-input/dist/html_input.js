/** @jsx React.DOM */

var React = React || require('react/addons');

// HtmlInput component
var HtmlInput = React.createClass({displayName: "HtmlInput",
    name: 'html-input',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'name', type:'string', required:true, defaultValue:'', note:'field name' },
            { name:'dispatcher', type:'object', required:false, defaultValue:null, note:'flux dispatcher' },
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'inputClass', type:'string', required:false, defaultValue:'form-control', note:'input element CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'text', note:'input type' },
            { name:'label', type:'string', required:false, defaultValue:'', note:'input label' },
            { name:'value', type:'string', required:false, defaultValue:'', note:'input type' },
            { name:'placeholder', type:'string', required:false, defaultValue:'', note:'placeholder text' },
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
        // set content display
        var content = 
            React.createElement("div", {className:  "form-group html-input-content-container" }, 
                React.createElement("label", null,  this.state.label), 
                React.createElement("input", {
                    type:  this.state.type, 
                    className:  this.state.inputClass, 
                    placeholder:  this.state.placeholder, 
                    value:  this.state.value, 
                    onChange: this.onChange}
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