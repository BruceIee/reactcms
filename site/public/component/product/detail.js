// product detail component
var ProeuctDetail = React.createClass({
    name: 'productdetail',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'list element id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'title', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'image', type:'array', required:false, defaultValue:null, note:'item image' },
            { name:'image_link', type:'array', required:false, defaultValue:null, note:'link for item image' },
            { name:'image_style', type:'object', required:false, defaultValue:{ width:"100%" }, note:'style for item image' },
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        var content = '';
        if (this.state.image) {
            if (this.state.image.constructor.name == 'Array' && this.state.image.length > 0) {
                this.state.image = this.state.image[0];
            }
            var imageContent = '';
            var imageUrl = '/file/' + this.state.image.filename;
            if (this.state.image_link) {
                imageContent =
                    <a href={ this.state.image_link } >
                        <img src={ imageUrl } style={ this.state.image_style } />
                    </a>;
            } else {
                imageContent =
                    <img src={ imageUrl} style={ this.state.image_style } />;
            }
            content = 
                <div className="container productdetail-content">
                    <div className="productdetail-image-content col-md-4">
                        { imageContent }
                    </div>
                    <div className="productdetail-text-content col-md-8"
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                    />
                </div>
        } else {
            content = 
                <div className="container productdetail-content"
                    dangerouslySetInnerHTML={{__html: this.state.content}}
                />
        }
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

