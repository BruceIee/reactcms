// ace editor component
var AceEditor = React.createClass({
    name: 'aceeditor',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var graphElement = React.findDOMNode(this.refs.graph);
        var settings = this.state.value;
        var dataUrl = this.state.value.data_url + '';
        if (dataUrl) {
            var chart = webCharts.createChart(graphElement, settings);
            d3.csv(dataUrl, function(error, data) {
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

