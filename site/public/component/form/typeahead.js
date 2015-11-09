// typeahead input component
var Typeahead = React.createClass({
    name: 'typeahead',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'value', type:'string', required:false, defaultValue:'', note:'item value' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var targetElement = React.findDOMNode(this.refs.typeahead);
        
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="typeahead-content">
                    <div className="typeahead-input" ref="typeahead"></div>
                    <div className="div-clear-both" />
                </div>
            </div>
        );
    }
});

