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
        var x = d3.scale.linear()
            .domain([0, d3.max(graphData)])
            .range([0, 420]);
        d3.select(graphElement)
            .selectAll('div')
            .data(graphData)
            .enter().append('div')
            .style('width', function(d) { return x(d) + 'px'; })
            .text(function(d) { return d; });
        
        
        
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-bartest-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});

