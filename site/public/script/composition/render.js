var app = app || {};

$().ready(function() {
    if (app.pageDataType === 'page') {
        showByPageData(app.pageContent);
    } else if (app.pageDataType === 'widget') {
        showByWidgetData(app.pageContent);
    }
});

function showByPageData(content) {
    for (var positionClass in content) {
        var widgets = app.pageContent[positionClass] || [];
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            widget.positionClass = positionClass;
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
        showWidget([widget.widgetInfo.data], widget.widgetName, widget.positionClass)
    } else {
        getWidgetData(widget);
    }
}

function getWidgetData(widget) {
    var widgetDetailUrl = '/data/components/get/detail';
    $.get(widgetDetailUrl, widget, function(data) {
        if (data.docs.length <= 0) return;
        showWidget(data.docs, this.widgetName, this.positionClass);
    }.bind(widget));
}

function showWidget(widgetDataItems, widgetName, positionClass) {
    var cabinetData = {
        widget:widgetName,
        mode:app.pageMode,
        position: positionClass,
        items: []
    };
    for (var i = 0; i < widgetDataItems.length; i++) {
        var widgetData = widgetDataItems[i];
        cabinetData.items.push({ type:widgetName, data:widgetData });
    }
    var cabinet = React.render(
        <Cabinet data={ cabinetData } />,
        $('.' + positionClass)[0]
    );
    
    // this.fire('component-edit', { position:positionClass });
    cabinet.on('component-edit', function(data) {
        //console.log('edit - data:', data);
        var sectionClass = data.position;
        var sectionEditUrl = '/pages/' + app.pageData._id + '/edit?section=' + sectionClass;
        window.open(sectionEditUrl, '_blank');
    });
}