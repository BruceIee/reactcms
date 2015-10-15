// footer component
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
            { name:'links1_title', type:'string', required:false, defaultValue:'', note:'title for 1st links' },
            { name:'links2', type:'array', required:false, defaultValue:[], note:'2nd links' },
            { name:'links2_title', type:'string', required:false, defaultValue:'', note:'title for 2nd links' },
            { name:'links3', type:'array', required:false, defaultValue:[], note:'3rd links' },
            { name:'links3_title', type:'string', required:false, defaultValue:'', note:'title for 3rd links' },
            { name:'links4', type:'array', required:false, defaultValue:[], note:'4th links' },
            { name:'links4_title', type:'string', required:false, defaultValue:'', note:'title for 4th links' },
            { name:'links5', type:'array', required:false, defaultValue:[], note:'5th links' },
            { name:'links5_title', type:'string', required:false, defaultValue:'', note:'title for 5th links' }
        ];
        return attributes;
    },
    
    render: function() {
        var links1Elements = this.getItemLinks( this.state.links1);
        var links2Elements = this.getItemLinks( this.state.links2);
        var links3Elements = this.getItemLinks( this.state.links3 );
        var links4Elements = this.getItemLinks( this.state.links4 );
        return (
            <div className="navbar navbar-inverse blackbootfooter-container">
                <div className="footer_container container-fluid">
                    <div className="footer-links-primary col-md-3 footer-links">
                        <ul className="list-unstyled">{ links1Elements }</ul>
                    </div>
                    <div className="footer-links-secondary col-md-3 footer-links">
                        <ul className="list-unstyled">{ links2Elements }</ul>
                    </div>
                    <div className="footer-links-tertiary col-md-3 footer-links">
                        <ul className="list-unstyled">{ links3Elements }</ul>
                    </div>
                    <div className="footer-links-forth col-md-3 footer-links">
                        <ul className="list-unstyled">{ links4Elements }</ul>
                    </div>
                </div>
            </div>
        );
    }
});
