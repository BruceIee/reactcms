// article detail component
var FishFooter = React.createClass({
    name: 'fishfooter',
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
        var primaryLinkElements = this.getItemLinks( this.state.links1);
        var secondaryLinkElements = this.getItemLinks( this.state.links2);
        var tertiaryLinkElements = this.getItemLinks( this.state.links3 );
        return (
            <div className="fish_footer_container container">
            <h2>FishFooter</h2>
                <div className="footer-links-primary col-md-3 footer-links">
                    <ul className="list-unstyled">{ primaryLinkElements }</ul>
                </div>
                <div className="footer-links-secondary col-md-3 footer-links">
                    <ul className="list-unstyled">{ secondaryLinkElements }</ul>
                </div>
                <div className="footer-links-tertiary col-md-3 footer-links">
                    <ul className="list-unstyled">{ tertiaryLinkElements }</ul>
                </div>
            </div>
        );
    }
});
