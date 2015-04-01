// article list_react script
var app = app || {};

$().ready(function() {
    getItems();
});

function getItems() {
    var itemsUrl = '/data/articles';
    $.get(itemsUrl, function(data) {
        var items = data.docs;
        console.log('items=',items);
        _.map(items, function(item) {
            item['id'] = item._id;
            item['text'] = item.title;
            item['iconClass'] = 'fa fa-fw fa-book';
            return item;
        });
        updateItemList(items);
    });
}

function updateItemList(items) {
    app.listData = { items: items };
    app.list1 = React.render(
        <ItemList data={ app.listData } />,
        document.getElementById('itemList')
    );
    app.list1.on('select', function(id) {
        var itemUrl = '/articles/' + id + '/detail/react';
        window.location = itemUrl;
    });
}
