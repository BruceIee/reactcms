// WebChartss components
// https://github.com/RhoInc/Webcharts
var Webcharts = React.createClass({
    name: 'webchart-bartest',
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
        var settings = this.state.value;
        var dataUrl = this.state.value.data_url || '';
        if (dataUrl) {
            var chart = webCharts.createChart('.webcharts-graph', settings);
            d3.csv('/data/webcharts/calories.csv', function(error, data){
            //d3.csv(dataUrl, function(error, data){
                chart.init(data);
            });
        }
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="webcharts-content">
                    <div className="webcharts-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});
