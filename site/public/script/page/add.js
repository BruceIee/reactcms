var app = app || {};
app.compositionCol = {}; // composition collection keyed by composition name
app.pageData = {
    composition: null,
    content: {}
};

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
    $('.section-container').click(function(event) {
        if ($(event.target).hasClass('section-item')) {
            var sectionName = $(event.target).attr('data-name');
            showSectionContent(sectionName);
        }
    });
    // section save button
    $('.block-container').click(function(event) {
        if ($(event.target).hasClass('section-save')) {
            var componentEntry = $(event.target).parents('.component-entry');
            var sectionName = 'abc';
            var sectionData = getSectionData(componentEntry);
            app.pageData.content[sectionName] = sectionData;
            
            console.log('>>> sectionData:', sectionData);
            console.log('>>>  app.pageData:',  app.pageData);
        }
        return false;
    });
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
        app.pageData.composition = composition;
        setupCompositionSections(composition);
    }
}

function setupCompositionSections(composition) {
    console.log('setupCompositionSections:', composition);
    $('.section-container').empty();
    var sections = composition.data;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
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
function showSectionContent(sectionName) {
    var source   = $("#component-entry-template").html();
    var template = Handlebars.compile(source);
    var context = { sectionName: sectionName };
    var html = template(context);
    $('.block-container').empty();
    $('.block-container').append(html);
}

// use parent element passed in, get form data for section
/*
{
    "widgetName": "ArticleDetail",
    "widgetInfo": {
        "module": "article",
        "condition": {
            "title": "mccpta-title"
        },
        "filter": {}
    }
}
*/
function getSectionData(parent) {
    var sectionData = {};
    var result = {};
    result['module'] = $(parent).find('input[name=module]').val();
    result['component'] = $(parent).find('input[name=component]').val();
    result['condition'] = $(parent).find('textarea[name=condition]').val();
    result['filter'] = $(parent).find('textarea[name=filter]').val();
    
    sectionData = result;
    return sectionData;
}