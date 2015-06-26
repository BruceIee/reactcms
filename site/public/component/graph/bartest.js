// GraphBartest component
var GraphBartest = React.createClass({
    name: 'graph-bartest',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'graph name' },
            { name:'description', type:'string', required:false, defaultValue:'', note:'graph description' },
            { name:'value', type:'object', required:false, defaultValue:null, note:'graph data value' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var graphElement = React.findDOMNode(this.refs.graph);
        console.log('>>> graphElement:', graphElement);
    },
    
    render: function() {
        var displayValue = '';
        if (typeof this.state.value == 'object' ) {
            displayValue = JSON.stringify(this.state.value);
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-bartest-content">
                    <div>Graph Bartest</div>
                    <div>description: { this.state.description }</div>
                    <div>value: { displayValue }</div>
                    <div class="reactlet-graph" ref="graph" />
                </div>
            </div>
        );
    }
});

