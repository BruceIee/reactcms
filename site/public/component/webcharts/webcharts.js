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
        
        console.log('>>> this.state:', this.state);
        
        var graphElement = React.findDOMNode(this.refs.graph);
        var settings = this.state.value;
        
        /*
        var settings = {
            "max_width":"500",
            "x":{
              "label":"Protein (g)",
              "type":"linear",
              "column":"Protein (g)"
            },
            "y":{
              "label":"Carbs (g)",
              "type":"linear",
              "column":"Carbo(g)"
            },
            "marks":[
              {
                "type":"circle",
                "per":["Food"],
                "tooltip":"[Food]\n[Measure]\n[Protein (g)] grams protein\n[Carbo(g)] grams carbs"
              }
            ],
            "aspect":"1",
            "gridlines":"xy"
        };
        */
        
        //var calChart = webCharts.createChart(graphElement, settings);
        var chart = webCharts.createChart('.webcharts-graph', settings);
        d3.csv('/data/webcharts/calories.csv', function(error, data){
            chart.init(data);
        }); 
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


/*
<script src="/lib/d3cdn/d3.v3.min.js"></script>
<script src="/lib/webcharts/webcharts.hole.js"></script>

    // scatter plot
    var settings = {
        "max_width":"500",
        "x":{
          "label":"Protein (g)",
          "type":"linear",
          "column":"Protein (g)"
        },
        "y":{
          "label":"Carbs (g)",
          "type":"linear",
          "column":"Carbo(g)"
        },
        "marks":[
          {
            "type":"circle",
            "per":["Food"],
            "tooltip":"[Food]\n[Measure]\n[Protein (g)] grams protein\n[Carbo(g)] grams carbs"
          }
        ],
        "aspect":"1",
        "gridlines":"xy"
      };
      
    var calChart = webCharts.createChart('.graphic-wrapper', settings);
    d3.csv('/data/webcharts/calories.csv', function(error, data){
        calChart.init(data);
    });

    
    // barchart
    var settings = {
      "max_width":"500",
      "x":{
        "label":"Total",
        "type":"linear",
        "column":"Total",
        domain: [0, null]
      },
      "y":{
        "type":"ordinal",
        "column":"Country",
        "sort":"total-descending"
      },
      "marks":[
        {
          "type":"bar",
          "per":["Country"],
          "tooltip":"[Country] won [Total] medals"
        }
      ],
      "gridlines":"x"
    };
    
    var medalChart = webCharts.createChart('.graphic-wrapper', settings);
    d3.csv('/data/webcharts/OlympicMedals2012.csv', function(error, data){
      //just keep the countries with the 10 most medals 
      var sub = data.filter(function(d,i){
        return i <= 11;
      });
      medalChart.init(sub);
    });
*/