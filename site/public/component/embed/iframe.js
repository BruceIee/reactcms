// article detail component
var EmbedIframe = React.createClass({
    name: 'embediframe',
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
            { name:'link', type:'string', required:false, defaultValue:'', note:'item web link' },
            { name:'style', type:'object', required:false, defaultValue:{ "border-width":"0px" }, note:'style object' }
        ];
        return attributes;
    },
    
    render: function() {
        var content = '';
        
        // https://www.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23cccccc&amp;src=c2m9752m30fjqqkuk3lp7pl1k0%40group.calendar.google.com&amp;color=%23125A12&amp;ctz=America%2FNew_York"
        // scrolling="no" frameborder="0"
        
        content =
            <iframe width="800" height="675"  src={ this.state.link } ></iframe>;

        /*
        if (this.state.image) {
            var imageContent = '';
            var imageUrl = '/file/' + this.state.image.filename;
            if (this.state.image_link) {
                imageContent =
                    <a href={ this.state.image_link } >
                        <img src={ imageUrl} style={ this.state.image_style } />
                    </a>;
            } else {
                imageContent =
                    <img src={ imageUrl} style={ this.state.image_style } />;
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
        */
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                { content }
            </div>
        );
    }
});

