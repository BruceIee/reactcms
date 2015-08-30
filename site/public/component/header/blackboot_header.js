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
            { name:'links1', type:'array', required:false, defaultValue:[], note:'1st links' },
            { name:'links1_title', type:'string', required:false, defaultValue:'', note:'title for 1st links' },
            { name:'links2', type:'array', required:false, defaultValue:[], note:'2nd links' },
            { name:'links2_title', type:'string', required:false, defaultValue:'', note:'title for 2nd links' },
            { name:'links3', type:'array', required:false, defaultValue:[], note:'3rd links' },
            { name:'links3_title', type:'string', required:false, defaultValue:'', note:'title for 3rd links' }
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
        var links1Elements = this.getItemLinks( this.state.links1);
        var links2Elements = this.getItemLinks( this.state.links2);
        var links3Elements = this.getItemLinks( this.state.links3 );
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
                            { links1Elements }
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            { links2Elements }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});
