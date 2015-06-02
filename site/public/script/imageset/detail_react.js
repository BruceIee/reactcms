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
        var new_obj = {}; // props: text, hyperlink, image(path), substance
        new_obj.text = imageset.content[i].text;
        new_obj.hyperlink = imageset.content[i].hyperlink;
        new_obj.image = '/file/' + imageset.content[i].image.name;

        if (imageset.content[i].substance) {
            var substance_tmp = imageset.content[i].substance.replace('\r\n','\n'); // ???
        }
        else {
            var substance_tmp = '';
        }

        new_obj.substance = substance_tmp;
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
        <Inlineshow data={ app.component2Data } />,
        document.getElementById('component2')
    );

    //substance show
    app.component3Data = {
        items: new_array
    };    
    app.component3 = React.render(
       <Substanceshow data={ app.component3Data } />,
       document.getElementById('component3')
    );     
}
