var app = app || {};

$().ready(function() {
    setupPage(app.pageData);
    setup();
});

function setupPage(page) {
    $('#pageComposition').val(page.composition);
    var compositionDataUrl = '/data/compositions/' + page.composition;
    $.get(compositionDataUrl, function(data) {
        var composition = data.docs && data.docs[0] || null;
        if (composition) {
            setupCompositionSections(composition);
        }
    });
}

function setup() {
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

function setupCompositionSections(composition) {
    //console.log('setupCompositionSections:', composition);
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
    var pageName = $('#pageName').val();
    var pageExistUrl = '/data/pages/' + pageName + '/exist';
    $.get(pageExistUrl, function(data) {
        if (!data.info.exist) {
            alert('Error: page ' + pageName + ' doesnot exist');
            return;
        } else {
            var pageAddUrl = '/data/pages/' + app.pageData._id + '/edit';
            var pageName = $('#pageName').val();
            app.pageData.name = pageName;
            var pageData = cleanPageData(app.pageData);
            console.log('save page:', pageData);
            $.post(pageAddUrl, pageData, function(data) {
                console.log('page saved:', data);
                alert('page ' + pageName + ' is saved');
            });
        }
    });
}