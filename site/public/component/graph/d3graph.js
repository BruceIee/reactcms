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


// GraphBarchart component
var GraphBarchart = React.createClass({
    name: 'graph-barchart',
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
                <div className="graph-barchart-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});


// GraphPiechart component
var GraphPiechart = React.createClass({
    name: 'graph-piechart',
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
        var sort = null; // todo
        React.render(
            React.createElement(ReactD3.PieChart, {
                data: graphData,
                sort: sort,
                width: 400,
                height: 280,
                margin: { top: 10, bottom: 10, left: 50, right: 50 }
            }),
            graphElement
        );
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-piechart-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});


// GraphScatterplot component
var GraphScatterplot = React.createClass({
    name: 'graph-scatterplot',
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
            React.createElement(ReactD3.ScatterPlot, {
                data: graphData,
                width: 400,
                height: 280,
                margin: { top: 30, bottom: 30, left: 30, right: 10 }
            }),
            graphElement
        );
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-scatterplot-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});


// GraphLinechart component
var GraphLinechart = React.createClass({
    name: 'graph-linehart',
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
            React.createElement(ReactD3.LineChart, {
                data: graphData,
                width: 400,
                height: 280,
                margin: { top: 30, bottom: 30, left: 30, right: 10 }
            }),
            graphElement
        );
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-linechart-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});


// GraphAreachart component
var GraphAreachart = React.createClass({
    name: 'graph-areachart',
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
            React.createElement(ReactD3.AreaChart, {
                data: graphData,
                width: 400,
                height: 280,
                margin: { top: 30, bottom: 30, left: 30, right: 10 }
            }),
            graphElement
        );
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="graph-areachart-content">
                    <div className="reactlet-graph" ref="graph"></div>
                </div>
            </div>
        );
    }
});
