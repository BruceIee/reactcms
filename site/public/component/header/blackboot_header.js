// article detail component
var BlackbootHeader = React.createClass({
    name: 'blackbootheader',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'title', type:'string', required:false, defaultValue:'Website', note:'title' },
            { name:'titleLink', type:'string', required:false, defaultValue:'/', note:'title link' },
            { name:'mainLinks', type:'array', required:false, defaultValue:[], note:'main links' },
            { name:'sideLinks', type:'array', required:false, defaultValue:[], note:'side links' }
        ];
        return attributes;
    },
    
    render: function() {
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
                      <a className="navbar-brand" href="/">{ this.state.title }</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse navbar-site-main">
                        <ul className="nav navbar-nav navbar-left">
                            <li className="menu-main active"><a href="/">Home</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="/reference">Reference</a></li>
                            <li><a href="/about">About</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});
