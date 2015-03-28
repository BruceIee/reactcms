// item list_react script
var app = app || {};

$().ready(function() {
    getItems();
});

function getItems() {
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

function updateItemList(items) {
    app.listData = { items: items };
    app.list1 = React.render(
        <List data={ app.listData } />,
        document.getElementById('itemList')
    );
    app.list1.on('select', function(id) {
        var itemUrl = '/items/' + id + '/detail';
        window.location = itemUrl;
    });
}
