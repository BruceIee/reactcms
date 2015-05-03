var app = app || {};
app.compositionCol = {}; // composition collection keyed by composition name
app.pageData = null;

$().ready(function() {
    resetPageData();
    setup();
});

function resetPageData() {
    app.pageData = {
        composition: null,
        content: {}
    };
}

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
            app.pageData.content[sectionName] = null;
            if (sectionDataItem) {
                app.pageData.content[sectionName] = [sectionDataItem];
            }
        }
        return false;
    });
    // save page button
    $('.btn-save-page').click(savePage);
}

function setupCompositionSelect() {
    app.compositionSelect.append('<option>Select composition</option>');
    for (var name in app.compositionCol) {
        app.compositionSelect.append('<option value="' + name + '">' + name + '</option>');
    }
}

function onCompositionSelect(event) {
    var composition = null;
    var compositionName =  $(event.target).val();
    if (compositionName) {
        // clear app.pageData
        resetPageData();
        // use selected composition
        composition = app.compositionCol[compositionName];
        app.pageData.composition = compositionName;
        setupCompositionSections(composition);
    }
}

function setupCompositionSections(composition) {
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
    // select first section for content display on right
    if (sections.length > 0) {
        showSectionContent(sections[0].name);
    }
}

function showSectionContent(sectionName) {
    // set selected section to active state
    $('.section-item').removeClass('section-item-active');
    $('.section-item[data-name=' + sectionName + ']').addClass('section-item-active');
    // show section content
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
    // moduleName and componentName is required for section
    var sectionData = null;
    if (moduleName && componentName) {
        sectionData = {
            widgetName: componentName,
            widgetInfo: {
                module: moduleName,
                conditionText: conditionText,
                condition: getJsonFromText(conditionText) || {},
                filterText: filterText,
                filter: getJsonFromText(filterText) || {}
            }
        };
    }
    return sectionData;
}

function cleanPageData(pageData) {
    for (var sectionName in pageData.content) {
        var sectionData = pageData.content[sectionName];
        console.log('>section:', sectionName, sectionData);
    }
    return pageData;
}

function savePage() {
    var pageAddUrl = '/data/pages/add';
    var pageName = $('#pageName').val();
    app.pageData.name = pageName;
    var pageData = cleanPageData(app.pageData);
    console.log('save page:', pageData);
    $.post(pageAddUrl, pageData, function(data) {
        console.log('page saved:', data);
    });
}