// Highcharts components
// http://www.highcharts.com/
var PlotlyGraph = React.createClass({
    name: 'highcharts',
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
        
        var data = this.state.value.data;
        
        //var layout = this.state.value.layout;
        // Plotly.plot(graphElement, data, layout);
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="highcharts-content">
                    <div className="highcharts-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});
