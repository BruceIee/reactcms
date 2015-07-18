var app = app || {};

$().ready(function() {
    if (app.pageDataType === 'page') {
        showByPageData(app.pageContent);
    } else if (app.pageDataType === 'widget') {
        showByWidgetData(app.pageContent);
    }
});

function showByPageData(content) {
    for (var targetClass in content) {
        var widgets = app.pageContent[targetClass];
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            widget.targetClass = targetClass;
            showWidget(widget);
        }
    }
}

function showByWidgetData(content) {
    console.log('showByWidgetData content:', content);
}

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