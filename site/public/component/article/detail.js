// article detail component
var ArticleDetail = React.createClass({
    name: 'articledetail',
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
            { name:'content', type:'string', required:false, defaultValue:'', note:'item content' }
        ];
        return attributes;
    },
    
    render: function() {
        
        console.log('>>> ArticleDetail state:', this.state);
        console.log('>>> ArticleDetail image:', this.state.image);
        
        /*
        destination: "./site/public/file/"
        encoding: "7bit"
        fieldname: "image"
        filename: "65cb45e065f86ebba3d58833c9a2358b"
        mimetype: "image/jpeg"
        originalname: "cat01.jpg"
        path: "site/public/file/65cb45e065f86ebba3d58833c9a2358b"
        size: 6390
        */
        
        var content = '';
        if (this.state.image) {
            var imageContent = '';
            var imageUrl = '/file/' + this.state.image.filename;
            if (this.state.image_link) {
                imageContent =
                    <a href="{ this.state.image_link }" >
                        <img src={ imageUrl} />
                    </a>;
            } else {
                imageContent =
                    <img src={ imageUrl} />;
            }
            content = 
                <div className="container articledetail-content">
                    <div className="articledetail-image-content col-md-4">
                        { imageContent }
                    </div>
                    <div className="articledetail-text-content col-md-8"
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                    />
                </div>
        } else {
            content = 
                <div className="container articledetail-content"
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

