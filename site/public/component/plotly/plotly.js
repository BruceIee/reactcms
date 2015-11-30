// Plot.ly components
// https://plot.ly/
var PlotlyGraph = React.createClass({
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
        var filetype = this.state.value.filetype || 'csv';
        var filename = this.state.value.filename || '';
        var data = this.state.value.data;
        var layout = this.state.value.layout;
        var graphElement = React.findDOMNode(this.refs.graph);
        /* read data from file if filename is present
        column name on first row of csv file (x,y) must match data attribute names( x and y )
        {
            "filename": "/data/chart/2014_apple_stock.csv",
            "data": [
                {
                    "x": null,
                    "y": null
                }
            ]
        }
        */
        if (filename) {
            d3.csv(filename, function(rows) {
                var plotData = {};
                for (var fieldName in data[0]) {
                    plotData[fieldName] = [];
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        plotData[fieldName].push(row[fieldName]);
                    }
                }
                Plotly.plot(graphElement, [plotData], layout);
            });
        } else {
            Plotly.plot(graphElement, data[0], layout);
        }
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
