var app = app || {};
app.compositionCol = {}; // composition collection keyed by composition name

$().ready(function() {
    setup();
});

function setup() {
    // setup composition dropdown combobox
    app.compositionSelect = $('.composition-select');
    var compositionListUrl = '/data/compositions';
    $.get(compositionListUrl, function(data) {
        var compositions = data.docs;
        for (var i = 0; i < compositions.length; i++) {
            var composition = compositions[i];
            app.compositionCol[composition.name] = composition;
        }
        setupCompositionSelect();
    });
    app.compositionSelect.on('change', onCompositionSelect);
    // setup section event
    $('.section-container').click(onSectionClick);
}

function setupCompositionSelect() {
    app.compositionSelect.append('<option>Select composition below</option>');
    for (var name in app.compositionCol) {
        app.compositionSelect.append('<option value="' + name + '">' + name + '</option>');
    }
}

function onCompositionSelect(event) {
    var composition = null;
    var compositionName =  $(event.target).val();
    if (compositionName) {
        composition = app.compositionCol[compositionName];
        setupCompositionSections(composition);
    }
}

function setupCompositionSections(composition) {
    console.log('setupCompositionSections:', composition);
    $('.section-container').empty();
    var sections = composition.data;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        console.log('>>> section:', section);
        $('.section-container').append(
            '<div class="section-item" data-name="' + section.name + '">' +
            section.name + ' (' + section.description + ')' +
            '</div>'
        );
    }
}

/*
"widgetName": "LinksetDetail",
"widgetInfo": {
    "module": "linkset",
    "condition": {
        "name": "home-links"
    },
    "filter": {}
}
*/
function onSectionClick(event) {
    if ($(event.target).hasClass('section-item')) {
        var sectionName = $(event.target).attr('data-name');
        var source   = $("#component-entry-template").html();
        var template = Handlebars.compile(source);
        var context = { sectionName: sectionName };
        var html = template(context);
        
        console.log('html:', html);
        $('.block-container').empty();
        $('.block-container').append(html);
        
    }
}