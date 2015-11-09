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
        ProductDetail: { widget:ProductDetail },
        LinksetDetail: { widget:LinksetDetail },
        LinksetDetail2: { widget:LinksetDetail2 },
        GraphBartest: { widget:GraphBartest },
        GraphBarchart: { widget:GraphBarchart },
        GraphPiechart: { widget:GraphPiechart },
        GraphScatterplot: { widget:GraphScatterplot },
        GraphLinechart: { widget:GraphLinechart },
        GraphAreachart: { widget:GraphAreachart },
        Webcharts: { widget:Webcharts },
        Plotly: { widget:PlotlyGraph },
        Highcharts: { widget:HighchartsGraph },
        Calendar: { widget:Calendar },
        Carousel: { widget:Carousel, acceptMultiple:true },
        Table: { widget:Table },
        Treeview: { widget:Treeview },
        Plate: { widget:Plate },
        EmbedIframe: { widget:EmbedIframe },
        AceEditor: { widget:AceEditor },
        QuillEditor: { widget:QuillEditor },
        Typeahead: { widget:Typeahead }
    },
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'widget', type:'string', require:false, defaultValue:'', note:'common widget name' },
            { name:'mode', type:'string', require:false, defaultValue:'view', note:'widget mode' },
            { name:'position', type:'string', require:false, defaultValue:'', note:'widget position class' },
            { name:'items', type:'array', required:false, defaultValue:[], note:'items' }
        ];
        return attributes;
    },
    
    onEditClick: function(event) {
        var positionClass = $(event.currentTarget).attr('data-attribute');
        this.fire('component-edit', [{ position:positionClass }]);
    },
    
    // item can overwrite common widget name in this.state.widget
    render: function() {
        var widgets = [];
        var component = this.components[this.state.widget];
        if (!component) {
            console.log('ERROR: component ' + this.state.widget + ' is not supported in cabinet');
            return;
        }
        if (component.acceptMultiple) {
            if (this.state.items.length == 1) {
                // todo - equal to 1 is a hack, proper way is to check if this item has "items" property inside
                // when there is only one item, no need to pacakge it
                var item = this.state.items[0];
                var widget = React.createElement(component.widget, {
                    key: item.key,
                    ref: item.name,
                    mode: this.state.mode,
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
                    mode: this.state.mode,
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
                        key: item.key || item.name,
                        ref: item.name || item.description,
                        mode: this.state.mode,
                        data: item.data
                    });
                    //console.log('widget data - item:', item);
                    widgets.push(widget);
                } else {
                    console.log('component for ' + item.type + ' is not found in Cabinet');
                }
            }
        }
        var editElement = '';
        if (this.state.mode === 'edit') {
            this.state.containerClassNames.push('cabinet-container-edit');
            editElement =
                <div className="cabinet-edit-element"
                    data-attribute={ this.state.position }
                    onClick={ this.onEditClick }>
                    <i className="fa fa-pencil-square-o"></i>
                </div>;
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                { editElement }
                { widgets }
                <div className="div-clear-both"></div>
            </div>
        );
    }
});
