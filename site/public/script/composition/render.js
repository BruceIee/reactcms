var app = app || {};

app.widgets = {
    ItemDetail: ItemDetail,
    ArticleDetail: ArticleDetail,
    LinksetDetail: LinksetDetail,
    LinksetDetail2: LinksetDetail2,
    GraphBartest: GraphBartest
};

$().ready(function() {
    for (var targetClass in app.pageContent) {
        var widgets = app.pageContent[targetClass];
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            widget.targetClass = targetClass;
            showWidget(widget);
        }
    }
});

function showWidget(widget) {
    var widgetDetailUrl = '/data/components/get/detail';
    $.get(widgetDetailUrl, widget, function(data) {
        if (data.docs.length <= 0) return;
        var cabinetData = { items: [] };
        for (var i = 0; i < data.docs.length; i++) {
            var widgetData = data.docs && data.docs[i];
            cabinetData.items.push({ type:this.widgetName, data:widgetData });
        }
        React.render(
            <Cabinet data={ cabinetData } />,
            $('.' + this.targetClass)[0]
        );
    }.bind(widget));
}