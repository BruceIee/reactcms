// item detail component
var ItemDetail = React.createClass({
    name: 'itemdetail',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        // set content display
        var content =
            <div className="itemdetaillement-content-container" >
                <div className="itemdetaillement-name-container">
                    { this.state.name }
                </div>
                <div className="itemdetaillement-type-container">
                    { this.state.type }
                </div>
                <div className="itemdetaillement-text-container">
                    { this.state.content }
                </div>
            </div>;
        return (
            <div className={ this.state.containerClassNames.join(' ') }
                data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

