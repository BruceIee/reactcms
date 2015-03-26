$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({container: 'body'});
    });
    $(function () {
        $('[data-toggle="dropdown"]').dropdown();
    });
    var converter = Markdown.getSanitizingConverter();
    Markdown.Extra.init(converter);
    var markdown_editor = ace.edit("markdown_editor");
    markdown_editor.setTheme("ace/theme/chrome");
    markdown_editor.renderer.setShowGutter(false);
    markdown_editor.getSession().setMode("ace/mode/markdown");
    markdown_editor.setShowPrintMargin(false);
    markdown_editor.getSession().setUseWrapMode(true);
    markdown_editor.$blockScrolling = Infinity;
    markdown_editor.getSession().on('change', function(e) {
        document.getElementById("text_preview").innerHTML=converter.makeHtml(markdown_editor.getValue());
        document.getElementById("content_markdown").innerHTML=markdown_editor.getValue();
    });
    var bold_tag = "**";
    var bold_tag_closing = "**";
    var italics_tag = "*";
    var italics_tag_closing = "*";
    var underline_tag = "<u>";
    var underline_tag_closing = "</u>";
    var strikethrough_tag = "~~";
    var strikethrough_tag_closing = "~~";
    var unordered_list_tag = "* ";
    var ordered_list_tag = "1. ";
    var tag;
    var closing_tag;
    var parse_syntax_buttons = function (type) {
        if (type == "bold") {
            tag = bold_tag;
            closing_tag = bold_tag_closing;
        } else if (type == "italics") {
            tag = italics_tag;
            closing_tag = italics_tag_closing;
        } else if (type == "underline") {
            tag = underline_tag;
            closing_tag = underline_tag_closing;
        } else if (type == "strikethrough") {
            tag = strikethrough_tag;
            closing_tag = strikethrough_tag_closing;
        } else if (type == "unordered_list") {
            tag = unordered_list_tag;
            closing_tag = " ";
        } else if (type == "ordered_list") {
            tag = ordered_list_tag;
            closing_tag = " ";
        }
        if (markdown_editor.getCopyText().indexOf(tag) == -1 && markdown_editor.getCopyText().indexOf(closing_tag) == -1) {
            if (markdown_editor.getCopyText() == "") {
                markdown_editor.insert(closing_tag);
                markdown_editor.navigateLeft(closing_tag.length);
                markdown_editor.insert(tag);
                markdown_editor.focus();
            } else {
                var text_length = markdown_editor.getCopyText().length;
                markdown_editor.insert(markdown_editor.getCopyText());
                markdown_editor.insert(closing_tag);
                markdown_editor.navigateLeft(closing_tag.length + text_length);
                markdown_editor.insert(tag);
                markdown_editor.navigateRight(text_length);
                markdown_editor.focus();
            }
        } else {
            markdown_editor.insert(markdown_editor.getCopyText().replace(tag, "").replace(closing_tag, ""));
            markdown_editor.focus();
        }
    };
    $( "#bold_button" ).click(function() {
        parse_syntax_buttons("bold");
    });
    $( "#italics_button" ).click(function() {
        parse_syntax_buttons("italics");

    });
    $( "#underline_button" ).click(function() {
        parse_syntax_buttons("underline");

    });
    $( "#strikethrough_button" ).click(function() {
        parse_syntax_buttons("strikethrough");
    });
    $( "#unordered_list_button" ).click(function() {
        parse_syntax_buttons("unordered_list");
    });
    $( "#ordered_list_button" ).click(function() {
        parse_syntax_buttons("ordered_list");
    });
    $( "#add_link_button" ).click(function() {
        var link_url = $("#link_url").val();
        var link_label = $("#link_label").val();
        markdown_editor.focus();
        markdown_editor.insert("[" + link_label + "](" + link_url + ")");
        markdown_editor.focus();
    });
});