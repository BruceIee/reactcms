// article detail component
var BlackbootFooter = React.createClass({
    name: 'blackbootfooter',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'value', type:'object', required:false, defaultValue:{}, note:'data value' }
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
        var primaryLinkElements = this.getItemLinks( this.state.value.primaryLinks);
        var secondaryLinkElements = this.getItemLinks( this.state.value.secondaryLinks);
        return (
            <div className="footer_container container">
                <div className="footer-links-primary">
                    <ul className="list-inline">{ primaryLinkElements }</ul>
                </div>
                <div className="footer-links-secondary">
                    <ul className="list-inline">{ secondaryLinkElements }</ul>
                </div>
            </div>
        );
    }
});
