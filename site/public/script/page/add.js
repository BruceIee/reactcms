var app = app || {};
app.compositionCol = {}; // composition collection keyed by composition name

$().ready(function() {
    setup();
});

function setup() {
    // setup composition dropdown combobox
    var compositionListUrl = '/data/compositions';
    $.get(compositionListUrl, function(data) {
        var compositions = data.docs;
        for (var i = 0; i < compositions.length; i++) {
            var composition = compositions[i];
            //console.log('>>> composition:', composition);
            app.compositionCol[composition.name] = composition;
        }
        setupCompositionSelect();
    });
}

function setupCompositionSelect() {
    var compositionSelect = $('.composition-select');
    //compositionSelect.clear();
    compositionSelect.append('<option></option>');
    for (var name in app.compositionCol) {
        compositionSelect.append('<option>' + name + '</option>');
    }
}