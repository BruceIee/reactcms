// article detail component
var BlackbootHeader = React.createClass({
    name: 'blackbootheader',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                <div className="blackbootheader-content">
                </div>
            </div>
        );
    }
});


/*
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="header-container container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">Project DNRDW</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse navbar-site-main">
            <ul class="nav navbar-nav navbar-left">
                <li class="menu-main active">
                    <a href="/">
                        <span style="padding-left:5px;">Home</span>
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="/reference">Reference</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </div>
    </div>
</nav>
*/