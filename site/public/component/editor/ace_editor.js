// ace editor component
var AceEditor = React.createClass({
    name: 'aceeditor',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var editorElement = React.findDOMNode(this.refs.aceeditor);
        var settings = this.state.value;
        var content = this.state.value.content;
        // create ace editor object
        var editor = ace.edit(editorElement);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        // set editor content if content if passed in
        if (content) {
            editor.setValue(content);
        }
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="ace-editor-content">
                    <div className="ace-editor" ref="aceeditor"></div>
                </div>
            </div>
        );
    }
});

