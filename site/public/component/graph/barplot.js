// GraphBarplot component
var GraphBarplot = React.createClass({
    name: 'graph-barplot',
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
        // plot using d3
        var graphData = this.state.value;
        React.render(
            React.createElement(ReactD3.BarChart, {
                data: graphData,
                width: 380,
                height: 240,
                margin: { top: 10, bottom: 30, left: 30, right: 10 }
            }),
            graphElement
        );
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-barplot-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});

