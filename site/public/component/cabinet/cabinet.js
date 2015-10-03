// cabinet component - container for widgets
var Cabinet = React.createClass({
    name: 'cabinet',
    mixins: [getCommonMixin],
    components: {
        BlackbootHeader: { widget:BlackbootHeader },
        BlackbootFooter: { widget:BlackbootFooter },
        SimplifyHeader: { widget:SimplifyHeader },
        SimplifyFooter: { widget:SimplifyFooter },
        ItemDetail: { widget:ItemDetail },
        MediaDetail: { widget:MediaDetail },
        ArticleDetail: { widget:ArticleDetail },
        LinksetDetail: { widget:LinksetDetail },
        LinksetDetail2: { widget:LinksetDetail2 },
        GraphBartest: { widget:GraphBartest },
        GraphBarchart: { widget:GraphBarchart },
        GraphPiechart: { widget:GraphPiechart },
        GraphScatterplot: { widget:GraphScatterplot },
        GraphLinechart: { widget:GraphLinechart },
        GraphAreachart: { widget:GraphAreachart },
        Carousel: { widget:Carousel },
        EmbedIframe: { widget:EmbedIframe }
    },
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'widget', type:'string', require:false, defaultValue:'', note:'common widget name' },
            { name:'items', type:'array', required:false, defaultValue:[], note:'items' }
        ];
        return attributes;
    },
    
    // item can overwrite common widget name in this.state.widget
    render: function() {
        var widgets = [];
        
        var component = this.components[this.state.widget];
        console.log('>>> widget name:', this.state.widget, component.constructor.name);
        /*
        for (var p in component) {
            console.log('>>> p:', p, component[p]);
        }
        */
        for (var i = 0; i < this.state.items.length; i++) {
            var item = this.state.items[i];
            if (item.type !== this.state.widget) {
                component = this.components[item.type];
            }
            if (component) {
                var widget = React.createElement(component.widget, {
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
