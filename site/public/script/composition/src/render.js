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
        var widgets = app.pageContent[targetClass] || [];
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            widget.targetClass = targetClass;
            getAndShowWidget(widget);
        }
    }
}

function showByWidgetData(content) {
    var widgetDataItems = [ content.data ];
    showWidget(widgetDataItems, content.name, content.section);
}

function getAndShowWidget(widget) {
    if (widget.widgetInfo.data) {
        showWidget([widget.widgetInfo.data], widget.widgetName, widget.targetClass)
    } else {
        getWidgetData(widget);
    }
}

function getWidgetData(widget) {
    var widgetDetailUrl = '/data/components/get/detail';
    $.get(widgetDetailUrl, widget, function(data) {
        if (data.docs.length <= 0) return;
        showWidget(data.docs, this.widgetName, this.targetClass);
    }.bind(widget));
}

function showWidget(widgetDataItems, widgetName, targetClass) {
    var cabinetData = { widget:widgetName, mode:app.pageMode, items: [] };
    for (var i = 0; i < widgetDataItems.length; i++) {
        var widgetData = widgetDataItems[i];
        cabinetData.items.push({ type:widgetName, data:widgetData });
    }
    React.render(
        <Cabinet data={ cabinetData } />,
        $('.' + targetClass)[0]
    );
}