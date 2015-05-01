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
            var componentForm = $(event.target).parents('.component-form');
            var sectionName = componentForm.attr('data-section');
            var sectionDataItem = getSectionData(componentForm);
            var sectionData = [sectionDataItem];
            app.pageData.content[sectionName] = sectionData;
            
            console.log('app.pageData:',  app.pageData);
            
        }
        return false;
    });
    // save page button
    $('.btn-save-page').click(savePage);
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
        app.pageData.composition = compositionName;
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

function showSectionContent(sectionName) {
    var source   = $("#component-entry-template").html();
    var template = Handlebars.compile(source);
    var context = app.pageData.content[sectionName] || [];
    context = context && context[0] || {};
    context['sectionName'] = sectionName;
    if (context.widgetInfo && context.widgetInfo.conditionText) {
        context.widgetInfo.condition = context.widgetInfo.conditionText;
    }
    if (context.widgetInfo && context.widgetInfo.filterText) {
        context.widgetInfo.filter = context.widgetInfo.filterText;
    }
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
    var moduleName = $(parent).find('input[name=module]').val();
    var componentName = $(parent).find('input[name=component]').val();
    var conditionText = $(parent).find('textarea[name=condition]').val();
    var filterText = $(parent).find('textarea[name=filter]').val();
    
    var sectionData = {
        widgetName: componentName,
        widgetInfo: {
            module: moduleName,
            conditionText: conditionText,
            condition: getJsonFromText(conditionText) || {},
            filterText: filterText,
            filter: getJsonFromText(filterText) || {}
        }
    };
    
    return sectionData;
}

function savePage() {
    var pageAddUrl = '/data/pages/add';
    var pageName = $('#pageName').val();
    app.pageData.name = pageName;
    console.log('save page:', app.pageData);
    $.post(pageAddUrl, app.pageData, function(data) {
        
        console.log('page saved:', data);
    });
}