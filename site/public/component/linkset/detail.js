// linkset detail component
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
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
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
                        { this.state.title }
                    </div>
                    <div className="panel-body">
                        { groups }
                    </div>
                </div>
            </div>    
        );
    }
});


var LinksetDetail2 = React.createClass({
    name: 'linksetdetail2',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'content', type:'array', required:false, defaultValue:[], note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        var groups = this.state.content.map(function (group) {
            return (
                <td className="linksetdetail2-item">
                    <a href={ group.hyperlink }>{ group.text }</a>
                </td>
            );
        });

        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <table>
                    <tr>
                        { groups }
                    </tr>    
                </table>
            </div>
        );
    }
});

