// article detail component
var EmbedIframe = React.createClass({
    name: 'embediframe',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'link', type:'string', required:false, defaultValue:'', note:'item web link' },
            { name:'style', type:'object', required:false, defaultValue:{ "border-width":"0px" }, note:'style object' }
        ];
        return attributes;
    },
    
    render: function() {
        var content = 
            <iframe width="100%" height="675"  src={ this.state.link } style={ this.state.style } ></iframe>;
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

