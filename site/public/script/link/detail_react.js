// linkset detail_react script
var app = app || {};

$().ready(function() {
    if (app.linkId) {
        getLinkDetail(app.linkId, showLinkDetail);
    }
});

function getLinkDetail(linkId, callback) {
    var linkDetailUrl = '/data/links/' + linkId + '/detail';
    $.get(linkDetailUrl, function(data) {
        var link =  data.docs && data.docs[0] || null;
        link.id = link._id + '';
        callback && callback(link);
    });
}

function showLinkDetail(link) {
    app.itemDetail = React.render(
        <LinksetDetail data={ link } />,
        document.getElementById('linksetDetail')
    );
}
