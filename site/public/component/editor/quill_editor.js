// quill editor component
var QuillEditor = React.createClass({
    name: 'quilleditor',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'theme', type:'string', required:false, defaultValue:'snow', note:'editor theme' },
            { name:'readOnly', type:'boolean', required:false, defaultValue:false, note:'set editor read only' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'value', type:'string', required:false, defaultValue:'', note:'item value' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var editorElement = React.findDOMNode(this.refs.quilleditor);
        var editorToolbarElement = React.findDOMNode(this.refs.quilleditor_toolbar);
        // create editor object
        var configs = {
            //readOnly: this.state.readOnly,
            theme: this.state.theme
        };
        var editor = new Quill(editorElement, configs);
        editor.addModule('toolbar', { container: '.quill-editor-toolbar' });
        editor.setText(this.state.value || '');
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="quill-editor-content">
                    <div className="quill-editor-toolbar sc-toolbar-container toolbar">
                        <button className="ql-bold">Bold</button>
                        <button className="ql-italic">Italic</button>
                    </div>
                    <div className="quill-editor" ref="quilleditor">
                    </div>
                    <div className="div-clear-both" />
                </div>
            </div>
        );
    }
});

