// imageset detail_react script
var app = app || {};

$().ready(function() {
    if (app.imagesetId) {
        getImagesetDetail(app.imagesetId, showImagesetDetail);
    }
});

function getImagesetDetail(imagesetId, callback) {
    var imagesetDetailUrl = '/data/imagesets/' + imagesetId + '/detail';
    $.get(imagesetDetailUrl, function(data) {
        var imageset =  data.docs && data.docs[0] || null;
        imageset.id = imageset._id + '';
        callback && callback(imageset);
    });
}

function showImagesetDetail(imageset) {
    $('#detailName').html(imageset.name);
    var new_array = [];
    for (var i in imageset.content) {
        var new_obj = {}; // props: text, hyperlink, image(path)
        new_obj.text = imageset.content[i].text;
        new_obj.hyperlink = imageset.content[i].hyperlink;
        new_obj.image = '/file/' + imageset.content[i].image.name;
        new_array.push(new_obj);
    }

    //carousel show
    app.component1Data = {
        items: new_array
    };
    app.component1 = React.render(
        <Carousel data={ app.component1Data } />,
        document.getElementById('component1')
    );

    //inline show
    app.component2Data = {
        items: new_array
    };    
     app.component2 = React.render(
        <Newshow data={ app.component2Data } />,
        document.getElementById('component2')
    );     
}
