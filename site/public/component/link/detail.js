// item detail component
var LinksetDetail = React.createClass({
    name: 'linksetdetail',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'description', type:'string', required:false, defaultValue:'', note:'item description' },
            { name:'content', type:'array', required:false, defaultValue:[], note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        var groups = this.state.content.map(function (group) {
            return (
                <li>
                    <a href={ group.hyperlink }> { group.text } </a>
                </li>
            );
        });

        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="panel panel-default">
                    <div className="panel-heading">
                        { this.state.description }
                        <div className="pull-right">
                            <span className="label label-info label-as-badge">
                                { this.state.id }
                            </span>
                        </div>
                    </div>
                    <div className="panel-body">
                        { groups }
                    </div>
                </div>
            </div>    
        );
    }
});

