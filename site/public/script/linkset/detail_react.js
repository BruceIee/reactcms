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
    app.itemDetail2 = React.render(
        <LinksetDetail2 data={ linkset } />,
        document.getElementById('linksetDetail2')
    );
    changeDirection($('#my_select').val());
}

function changeDirection(value) {
    //alert(sel.value);
    var direction = value;
    if ( direction == 'vertical' ) {
        $('#linksetDetail').show();
        $('#linksetDetail2').hide();
    }
    else if (direction == 'horizontal' ) {
        $('#linksetDetail').hide();
        $('#linksetDetail2').show();
    }
    
}
