// footer component
var SimplifyFooter = React.createClass({
    name: 'simplifyfooter',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'image', type:'object', required:false, defaultValue:null, note:'header image' },
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
        if (this.state.image) {
            if (this.state.image.constructor.name == 'Array' && this.state.image.length > 0) {
                this.state.image = this.state.image[0];
            }
        }
        var title = this.state.title;
        var titleLink = this.state.title_link || '/';
        var links1Elements = this.getItemLinks( this.state.links1);
        var links2Elements = this.getItemLinks( this.state.links2);
        var links3Elements = this.getItemLinks( this.state.links3 );
        var links4Elements = this.getItemLinks( this.state.links4 );
        return (
            <div className="navbar simplifyfooter-container">
                <div className="footer_container container">
                    <div className="row footer-links footer-links-1">
                        <ul className="list-unstyled">{ links1Elements }</ul>
                    </div>
                    <div className="row footer-links footer-links-2">
                        <ul className="list-unstyled">{ links2Elements }</ul>
                    </div>
                    
                    <div className="row footer-links footer-links-3 ">
                        <ul className="list-unstyled">{ links3Elements }</ul>
                    </div>
                    
                    <div className="row footer-links footer-links-4">
                        <ul className="list-unstyled">{ links4Elements }</ul>
                    </div>
                    
                </div>
            </div>
        );
    }
});
