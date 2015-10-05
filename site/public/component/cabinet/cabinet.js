// cabinet component - container for widgets
var Cabinet = React.createClass({
    name: 'cabinet',
    mixins: [getCommonMixin],
    
    // acceptMultiple indicates whether component can take multiple items as input
    // for example: carousel takes multiple media items as input
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
        Carousel: { widget:Carousel, acceptMultiple:true },
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
        if (component.acceptMultiple) {
            if (this.state.items.length == 1) {
                // todo - equal to 1 is a hack, proper way is to check if this item has "items" property inside
                // when there is only one item, no need to pacakge it
                var item = this.state.items[0];
                var widget = React.createElement(component.widget, {
                    key: item.key,
                    ref: item.name,
                    data: item.data
                });
                widgets.push(widget);
            } else {
                // when component accepts mutliple entries, the items in state needs to be
                // packaged into one entry with multiple items inside
                var items = [];
                for (var i = 0; i < this.state.items.length; i++) {
                    var item = this.state.items[i];
                    var image = item.data && item.data.image;
                    if (image) {
                        items.push({
                            image:'/file/' + image.filename,
                            text:image.description
                        });
                    }
                }
                var widget = React.createElement(component.widget, {
                    key: this.state.widget,
                    ref: this.state.widget,
                    data: { items:items }
                });
                widgets.push(widget);
            }
        } else {
            // when component doesn't accpet multiple entries, treat each item as one component
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
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') }  onClick={ this.onClick } >
                { widgets }
                <div className="div-clear-both"></div>
            </div>
        );
    }
});
