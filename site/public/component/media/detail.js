// article detail component
var ArticleDetail = React.createClass({
    name: 'mediadetail',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'id', type:'string', required:false, defaultValue:'', note:'item id' },
            { name:'name', type:'string', required:false, defaultValue:'', note:'item name' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'item type' },
            { name:'description', type:'string', required:false, defaultValue:'', note:'item title' },
            { name:'image', type:'object', required:false, defaultValue:null, note:'image' },
            { name:'video', type:'object', required:false, defaultValue:null, note:'video' }
        ];
        return attributes;
    },
    
    render: function() {
        var content = '';
        if (this.state.image) {
            var mediaUrl = '/file/' + this.state.image.filename;
            var mediaContent = <img src={ mediaUrl} />;
            content = 
                <div className="container mediadetail-content">
                    <div className="mediadetail-image-content">
                        { mediaContent }
                    </div>
                </div>;
        } else if (this.state.video) {
            var mediaUrl = '/file/' + this.state.image.filename;
            var mediaContent = <video><source src={ mediaUrl} type="video/mp4"></video>;
            content = 
                <div className="container mediadetail-content">
                    <div className="mediadetail-video-content">
                        { mediaContent }
                    </div>
                </div>;
        }
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

