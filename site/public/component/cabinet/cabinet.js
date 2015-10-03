// cabinet component - container for widgets
var Cabinet = React.createClass({
    name: 'cabinet',
    mixins: [getCommonMixin],
    components: {
        BlackbootHeader: BlackbootHeader,
        BlackbootFooter: BlackbootFooter,
        SimplifyHeader: SimplifyHeader,
        SimplifyFooter: SimplifyFooter,
        ItemDetail: ItemDetail,
        MediaDetail: MediaDetail,
        ArticleDetail: ArticleDetail,
        LinksetDetail: LinksetDetail,
        LinksetDetail2: LinksetDetail2,
        GraphBartest: GraphBartest,
        GraphBarchart: GraphBarchart,
        GraphPiechart: GraphPiechart,
        GraphScatterplot: GraphScatterplot,
        GraphLinechart: GraphLinechart,
        GraphAreachart: GraphAreachart,
        Carousel: Carousel,
        EmbedIframe: EmbedIframe
    },

    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'widget', type:'string', require:false, defaultValue:'', note:'widget name' },
            { name:'items', type:'array', required:false, defaultValue:[], note:'items' }
        ];
        return attributes;
    },
    
    render: function() {
        var widgets = [];
        
        console.log('>>> widget name:', this.state.widget);
        var component = this.components[this.state.widget];
        
        for (var i = 0; i < this.state.items.length; i++) {
            var item = this.state.items[i];
            if (item.type !== this.state.widget) {
                component = this.components[item.type];
            }
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
