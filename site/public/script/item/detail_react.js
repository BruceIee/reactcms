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
        var item =  data.docs && data.docs[0] || null;
        item.id = item._id + '';
        callback && callback(item);
    });
}

function showItemDetail(item) {
    app.itemDetail = React.render(
        <ItemDetail data={ item } />,
        document.getElementById('itemDetail')
    );
}
