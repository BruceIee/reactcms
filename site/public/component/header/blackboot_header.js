// article detail component
var BlackbootHeader = React.createClass({
    name: 'blackbootheader',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'title', type:'string', required:false, defaultValue:'Site', note:'title' },
            { name:'title_link', type:'string', required:false, defaultValue:'/', note:'title link' },
            { name:'links1', type:'array', required:false, defaultValue:[], note:'1st links' },
            { name:'links1_title', type:'string', required:false, defaultValue:'', note:'title for 1st links' },
            { name:'links2', type:'array', required:false, defaultValue:[], note:'2nd links' },
            { name:'links2_title', type:'string', required:false, defaultValue:'', note:'title for 2nd links' },
            { name:'links3', type:'array', required:false, defaultValue:[], note:'3rd links' },
            { name:'links3_title', type:'string', required:false, defaultValue:'', note:'title for 3rd links' }
        ];
        return attributes;
    },
    
    render: function() {
        var title = this.state.title;
        var titleLink = this.state.title_link || '/';
        var links1Elements = this.getItemLinks( this.state.links1);
        var links2Elements = this.getItemLinks( this.state.links2);
        var links3Elements = this.getItemLinks( this.state.links3 );
        return (
            <nav className="navbar navbar-inverse blackbootheader-container" role="navigation">
                <div className="header-container container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href={ this.state.title_link }>{ title }</a>
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
