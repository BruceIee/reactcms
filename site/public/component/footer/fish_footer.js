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
            { name:'primaryLinks', type:'array', required:false, defaultValue:[], note:'primaryLinks' },
            { name:'secondaryLinks', type:'array', required:false, defaultValue:[], note:'secondaryLinks' },
            { name:'tertiaryLinks', type:'array', required:false, defaultValue:[], note:'tertiaryLinks' }
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
        var primaryLinkElements = this.getItemLinks( this.state.primaryLinks);
        var secondaryLinkElements = this.getItemLinks( this.state.secondaryLinks);
        var tertiaryLinkElements = this.getItemLinks( this.state.tertiaryLinks );
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
