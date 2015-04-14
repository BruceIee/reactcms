// linkset detail_react script
var app = app || {};

$().ready(function() {
    if (app.linksetId) {
        getLinksetDetail(app.linksetId, showLinksetDetail);
    }
});

function getLinksetDetail(linksetId, callback) {
    var linksetDetailUrl = '/data/linksets/' + linksetId + '/detail';
    $.get(linksetDetailUrl, function(data) {
        var linkset =  data.docs && data.docs[0] || null;
        linkset.id = linkset._id + '';
        callback && callback(linkset);
    });
}

function showLinksetDetail(linkset) {
    app.itemDetail = React.render(
        <LinksetDetail data={ linkset } />,
        document.getElementById('linksetDetail')
    );
}
