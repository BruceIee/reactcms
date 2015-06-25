var app = app || {};
app.compositionCol = {}; // composition collection keyed by composition name

$().ready(function() {
    resetPageData();
    setup();
});

function resetPageData() {
    if (app.mode == 'add') {
        $('#pageName').val(app.pageName);
        app.pageData = {
            composition: null,
            content: {}
        };
    }
}

function setup() {
    // compile section content template
    var source   = $("#component-entry-template").html();
    app.sectionTemplate = Handlebars.compile(source);
    // setup composition dropdown combobox
    app.compositionSelect = $('.composition-select');
    var compositionListUrl = '/data/compositions';
    $.get(compositionListUrl, function(data) {
        var compositions = data.docs;
        for (var i = 0; i < compositions.length; i++) {
            var composition = compositions[i];
            app.compositionCol[composition.name] = composition;
        }
        if (app.mode == 'add') {
            setupCompositionSelect();
        } else if (app.mode == 'edit') {
            var compositionName = app.pageData.composition;
            $('#pageComposition').val(compositionName);
            onCompositionSelect(compositionName);
        }
    });
    app.compositionSelect.on('change', function(event) {
        var composition = null;
        var compositionName =  $(event.target).val();
        if (compositionName) {
            onCompositionSelect(compositionName);
        }
    });
    // setup section event
    $('.section-container').click(function(event) {
        if ($(event.target).hasClass('section-item')) {
            var sectionName = $(event.target).attr('data-name');
            showSectionContent(sectionName);
        }
    });
    // action buttons
    $('.btn-save-page').click(function() {
        // retrievre section data from sections content panels
        retrievePageSectionData();
        if (app.mode == 'add') {
            createPage();
        } else if (app.mode == 'edit') {
            savePage();
        }
    });
    $('.btn-view-page').click(function() {
        var pageViewUrl = '/pages/' + app.pageName;
        window.open(pageViewUrl, '_blank');
    });
}

function setupCompositionSelect() {
    app.compositionSelect.append('<option>Select composition</option>');
    for (var name in app.compositionCol) {
        app.compositionSelect.append('<option value="' + name + '">' + name + '</option>');
    }
}

function onCompositionSelect(compositionName) {
    // clear app.pageData
    resetPageData();
    // use selected composition
    composition = app.compositionCol[compositionName];
    app.pageData.composition = compositionName;
    setupCompositionSections(composition);
    setupCompositionSectionContents(composition);
    // select first section for content display on right
    var sections = composition.data;
    if (sections.length > 0) {
        showSectionContent(sections[0].name);
    }
}

// show composition section buttons on left side
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
}

// setup compoisiton section content panels on right side
function setupCompositionSectionContents(composition) {
    // setup composition pages in a card layout
    $('.block-container').empty();
    var sections = composition.data;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        $('.block-container').append(
            '<div class="section-content hidden" data-name="' + section.name + '"></div>'
        );
        populateSectionContent(section.name, app.sectionTemplate);
    }
}

function populateSectionContent(sectionName, template) {
    // show section content
    var context = app.pageData.content[sectionName] || [];
    context = context && context[0] || {};
    context['sectionName'] = sectionName;
    context.widgetInfo = context.widgetInfo || {};
    context.widgetInfo.condition = context.widgetInfo.condition || null;
    context.widgetInfo.filter = context.widgetInfo.filter || null;
    if (context.widgetInfo && context.widgetInfo.condition) {
        context.widgetInfo.condition = JSON.stringify(context.widgetInfo.condition);
    }
    if (context.widgetInfo && context.widgetInfo.filter) {
        context.widgetInfo.filter = JSON.stringify(context.widgetInfo.filter);
    }
    var html = template(context);
    $('.section-content[data-name=' + sectionName + ']').append(html);
}

function showSectionContent(sectionName) {
    // set selected section to active state
    $('.section-item').removeClass('section-item-active');
    $('.section-item[data-name=' + sectionName + ']').addClass('section-item-active');
    // show section content
    $('.section-content').addClass('hidden');    
    $('.section-content[data-name=' + sectionName + ']').removeClass('hidden');
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
                condition: getJsonFromText(conditionText) || null,
                filter: getJsonFromText(filterText) || null
            }
        };
    }
    return sectionData;
}

function createPage() {
    // check page name is unique
    var pageName = $('#pageName').val();
    var pageExistUrl = '/data/pages/' + pageName + '/exist';
    $.get(pageExistUrl, function(data) {
        if (data.info.exist) {
            alert('Error: page ' + pageName + ' exists');
            return;
        } else {
            var pageAddUrl = '/data/pages/add';
            app.pageData.name = pageName;
            $.post(pageAddUrl, app.pageData, function(data) {
                var page = data.docs && data.docs[0] || null;
                if (page) {
                    var pageEditUrl = '/pages/' + page._id + '/edit';
                    window.location = pageEditUrl;
                }
            });
        }
    });
}

function savePage() {
    var pageName = $('#pageName').val();
    var pageExistUrl = '/data/pages/' + pageName + '/exist';
    // check page name exists
    $.get(pageExistUrl, function(data) {
        if (!data.info.exist) {
            alert('Error: page ' + pageName + ' doesnot exist');
            return;
        } else {
            var pageAddUrl = '/data/pages/' + app.pageData._id + '/edit';
            var pageName = $('#pageName').val();
            app.pageData.name = pageName;
            $.post(pageAddUrl, app.pageData, function(data) {
                console.log('page saved:', data);
                alert('page ' + pageName + ' is saved');
            });
        }
    });
}

function retrievePageSectionData() {
    var composition = app.compositionCol[app.pageData.composition];
    var sections = composition.data;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var sectionName = section.name;
        var componentForm = $('.section-content[data-name=' + sectionName + ']');
        var sectionDataItem = getSectionData(componentForm);
        if (sectionDataItem) {
            app.pageData.content[sectionName] = [sectionDataItem];
        } else {
            app.pageData.content[sectionName] = null;
        }
    }
}
