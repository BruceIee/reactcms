// product detail component
var ProductDetail = React.createClass({
    name: 'productdetail',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'category', type:'string', required:false, defaultValue:'', note:'item category' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'image', type:'array', required:false, defaultValue:null, note:'item image' }
        ];
        return attributes;
    },
    
    render: function() {
        var content = '';
        if (this.state.image.constructor.name == 'Array' && this.state.image.length > 0) {
            this.state.image = this.state.image[0];
        }
        var imageUrl = '/file/' + this.state.image.filename;
        var productUrl = '/products/' + this.state.id + '/detail';
        var imageContent =
            <a href={ productUrl } >
                <img src={ imageUrl } />
            </a>;
        content = 
            <div className="container productdetail-content">
                <div className="productdetail-image-content">
                    { imageContent }
                </div>
                <div className="productdetail-text-content">
                    { this.state.title }
                </div>
            </div>;
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

