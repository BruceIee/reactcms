// Plot.ly components
// https://plot.ly/
var Plotly = React.createClass({
    name: 'plotly',
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
        var data = this.state.value;
        
        /*
        var data = [{
            x: [1, 2, 3],
            y: [2, 3, 2]
        }];
        */
        
        Plotly.plot(graphElement, data);

        /*
        var dataUrl = this.state.value.data_url + '';
        if (dataUrl) {
            var chart = webCharts.createChart(graphElement, settings);
            d3.csv(dataUrl, function(error, data) {
                chart.init(data);
            });
        }
        */
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="plotly-content">
                    <div className="plotly-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});
