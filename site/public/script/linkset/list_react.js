// linkset list_react script
var app = app || {};

$().ready(function() {
    getItems();
});

function getItems() {
    var itemsUrl = '/data/linksets';
    $.get(itemsUrl, function(data) {
        var items = data.docs;
        //console.log('items=',items);
        _.map(items, function(item) {
            item['id'] = item._id;
            item['description'] = item.description;
            item['content'] = item.content;
            item['iconClass'] = 'fa fa-fw fa-link';
            return item;
        });
        updateItemList(items);
    });
}

function updateItemList(items) {
    app.listData = { items: items };
    app.list1 = React.render(
        <LinksetList data={ app.listData } />,
        document.getElementById('linksetList')
    );
    app.list1.on('select', function(id) {
        var itemUrl = '/linksets/' + id + '/detail/react';
        window.location = itemUrl;
    });
}
