// item list_react script
var app = app || {};

$().ready(function() {
    if (app.itemId) {
        getItemDetail(app.itemId, showItemDetail);
    }
});

function getItemDetail(itemId, callback) {
    
    var itemDetailUrl = '/data/items/' + itemId + '/detail';
    $.get(itemDetailUrl, function(data) {
        //console.log('item detail:', itemId, data);
        var item =  data.docs && data.docs[0] || null;
        callback && callback(item);
    });
    
    var itemsUrl = '/data/items';
    $.get(itemsUrl, function(data) {
        var items = data.docs;
        _.map(items, function(item) {
            item['id'] = item._id;
            item['text'] = item.name;
            item['iconClass'] = 'fa fa-fw fa-book';
            return item;
        });
        updateItemList(items);
    });
}

function showItemDetail(item) {
    console.log('>>> showItemDetail:', item);
}

function updateItemList(items) {
    app.listData = { items: items };
    app.itemDetail = React.render(
        <ItemDetail data={ app.listData } />,
        document.getElementById('itemDetail')
    );
    app.itemDetail.on('select', function(id) {
        var itemUrl = '/items/' + id + '/detail/react';
        window.location = itemUrl;
    });
}
