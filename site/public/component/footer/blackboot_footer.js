// article detail component
var BlackbootFooter = React.createClass({
    name: 'blackbootfooter',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'title' },
            { name:'links1', type:'array', required:false, defaultValue:[], note:'1st links' },
            { name:'links1Title', type:'string', required:false, defaultValue:'', note:'title for 1st links' },
            { name:'links2', type:'array', required:false, defaultValue:[], note:'2nd links' },
            { name:'links2Title', type:'string', required:false, defaultValue:'', note:'title for 2nd links' },
            { name:'links3', type:'array', required:false, defaultValue:[], note:'3rd links' },
            { name:'links3Title', type:'string', required:false, defaultValue:'', note:'title for 3rd links' }
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
        var links1Elements = this.getItemLinks( this.state.links1);
        var links2Elements = this.getItemLinks( this.state.links2);
        var links3Elements = this.getItemLinks( this.state.links3 );
        return (
            <div className="footer_container container">
                <div className="footer-links-primary col-md-3 footer-links">
                    <ul className="list-unstyled">{ links1Elements }</ul>
                </div>
                <div className="footer-links-secondary col-md-3 footer-links">
                    <ul className="list-unstyled">{ links2Elements }</ul>
                </div>
                <div className="footer-links-tertiary col-md-3 footer-links">
                    <ul className="list-unstyled">{ links3Elements }</ul>
                </div>
            </div>
        );
    }
});
