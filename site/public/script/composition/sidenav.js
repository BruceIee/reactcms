var app = app || {};

app.widgets = {
    ItemDetail: ItemDetail,
    ArticleDetail: ArticleDetail,
    LinksetDetail: LinksetDetail,
    LinksetDetail2: LinksetDetail2
};

$().ready(function() {
    //console.log('page content:', app.pageContent);
    //console.log('page composition:', app.pageComposition);
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
    //console.log('showWidget on targetClass:', widget.targetClass);
    //console.log('widget name:', widget.widgetName);
    //console.log('widget info:', widget.widgetInfo);
    //$('.' + widget.targetClass).append(widget.widgetName);
    var widgetDetailUrl = '/data/components/get/detail';
    $.get(widgetDetailUrl, widget, function(data) {
        console.log('data.docs.length:', data.docs.length);
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