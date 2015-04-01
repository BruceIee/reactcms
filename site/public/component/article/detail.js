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
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        /* 
        // set content display
        var content =
            <div className="panel panel-default">
                <div className="panel-heading">
                    { this.state.title }
                    <div className="pull-right">
                        <span className="label label-info label-as-badge">
                            { this.state.type }
                        </span>
                    </div>
                </div>
                <div className="panel-body">
                    { this.state.content }
                </div>
            </div>;
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
        */
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="panel panel-default">
                    <div className="panel-heading">
                        { this.state.title }
                        <div className="pull-right">
                            <span className="label label-info label-as-badge">
                                { this.state.type }
                            </span>
                        </div>
                    </div>
                    <div className="panel-body"
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                    />
                </div>
            </div>    
        );
    }
});

