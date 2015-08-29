// article detail component
var BlackbootHeader = React.createClass({
    name: 'blackbootheader',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'title' },
            { name:'links1', type:'array', required:false, defaultValue:[], note:'primary links' },
            { name:'links2', type:'array', required:false, defaultValue:[], note:'secondary links' },
            { name:'links3', type:'array', required:false, defaultValue:[], note:'tertiary links, not in use' }
        ];
        return attributes;
    },
    
    getItemLinks: function(linkItems) {
        var linkElements = [];
        if (linkItems) {
            for (var i = 0; i < linkItems.length; i++) {
                var linkItem = linkItems[i];
                var linkItemKey = 'link-item-' + linkItem.text;
                linkElements.push(
                    <li className="link-container" key={ linkItemKey }>
                        <a href={ linkItem.link }>{ linkItem.text }</a>
                    </li>
                );
            }
        }
        return linkElements;
    },
    
    render: function() {
        var title = this.state.title;
        var mainLinkElements = this.getItemLinks( this.state.links1);
        var sideLinkElements = this.getItemLinks( this.state.links2);
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top blackbootheader-container" role="navigation">
                <div className="header-container container-fluid">
                    <div className="navbar-header">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="/">{ title }</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse navbar-site-main">
                        <ul className="nav navbar-nav navbar-left">
                            { mainLinkElements }
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            { sideLinkElements }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});
