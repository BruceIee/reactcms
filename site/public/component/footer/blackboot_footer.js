// article detail component
var BlackbootFooter = React.createClass({
    name: 'blackbootfooter',
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
            <div>
                blackboot footer
            </div>
        );
    }
});
