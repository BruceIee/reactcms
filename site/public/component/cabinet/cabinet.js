// cabinet component - container for widgets
var Cabinet = React.createClass({
    name: 'cabinet',
    mixins: [getCommonMixin],
    components: {
        BlackbootHeader: BlackbootHeader,
        BlackbootFooter: BlackbootFooter,
        FishFooter: FishFooter,
        ItemDetail: ItemDetail,
        ArticleDetail: ArticleDetail,
        LinksetDetail: LinksetDetail,
        LinksetDetail2: LinksetDetail2,
        GraphBartest: GraphBartest,
        GraphBarchart: GraphBarchart,
        GraphPiechart: GraphPiechart,
        GraphScatterplot: GraphScatterplot,
        GraphLinechart: GraphLinechart,
        GraphAreachart: GraphAreachart
    },

    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'items', type:'array', required:false, defaultValue:[], note:'items' }
        ];
        return attributes;
    },
    
    render: function() {
        var widgets = [];
        for (var i = 0; i < this.state.items.length; i++) {
            var item = this.state.items[i];
            var component = this.components[item.type];
            if (component) {
                var widget = React.createElement(this.components[item.type], {
                    key: item.key,
                    ref: item.name,
                    data: item.data
                });
                widgets.push(widget);
            } else {
                console.log('component for ' + item.type + ' is not found in Cabinet');
            }
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') }  onClick={ this.onClick } >
                { widgets }
                <div className="div-clear-both"></div>
            </div>
        );
    }
    
});
