// media detail component
var MediaDetail = React.createClass({
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
            { name:'link', type:'string', required:false, defaultValue:'', note:'item web link' },
            { name:'style', type:'object', required:false, defaultValue:null, note:'item style object' },
            { name:'image', type:'object', required:false, defaultValue:null, note:'image' },
            { name:'video', type:'object', required:false, defaultValue:null, note:'video' }
        ];
        return attributes;
    },
    
    render: function() {
        var mediaContent = '';
        var content = '';
        if (this.state.image) {
            var mediaUrl = '/file/' + this.state.image.filename;
            mediaContent =
                <div className="mediadetail-image-content">
                    <img src={ mediaUrl} />
                </div>;
        } else if (this.state.video) {
            var mediaUrl = '/file/' + this.state.image.filename;
            mediaContent =
                <div className="mediadetail-video-content">
                    <video>
                        <source src={ mediaUrl} type="video/mp4" />
                    </video>
                </div>;
        }
        if (this.state.link) {
            mediaContent =
                <a href={ this.state.link }>
                    { mediaContent }
                </a>;
        }
        if (this.state.style) {
            content = 
                <div className="container mediadetail-content" style={ this.state.style } >
                    { mediaContent }
                </div>;
        } else {
            content = 
                <div className="container mediadetail-content">
                    { mediaContent }
                </div>;
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

