// Carousel component
var Carousel = React.createClass({
    name: 'carousel',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'items', type:'array', required:false, defaultValue:[], note:'slides' },
            { name:'componentKey', type:'string', required:false, defaultValue:'', note:'unique key value' },
        ];
        return attributes;
    },
    
    componentWillMount: function() {
        if (!this.state.componentKey) {
            this.state.componentKey = this.generateUid();
        }
    },
    
    render: function() {
        var slideIndicators = [];
        var slideNodes = [];
        var slideElementId = 'carousel-' + this.state.componentKey;
        var slideElementKey = '#' + slideElementId;
        
        for (var i = 0;  i < this.state.items.length; i++) {
            var item = this.state.items[i];
            var indicatorActiveClass = (i === 0) ? 'active' : '';
            var itemActiveClass = (i === 0) ? 'item active' : 'item';
            
            slideIndicators.push(
                <li data-target={ slideElementKey } data-slide-to={ i } className={ indicatorActiveClass }></li>
            );
            
            slideNodes.push(
                <div className={ itemActiveClass }>
                    <img alt={ item.text } src={ item.image } data-holder-rendered="true" />
                    <div className="carousel-caption">
                        <h4>{ item.text }</h4>
                    </div>
                </div>
            );
        }
        
        var content =
            <div id={ slideElementId } className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    { slideIndicators }
                </ol>
                <div className="carousel-inner" role="listbox">
                    { slideNodes }
                </div>
                <a className="left carousel-control" href={ slideElementKey } role="button" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href={ slideElementKey } role="button" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                </a>
                
            </div>
            ;
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                { content }
            </div>
        );
    }
});


var Newshow = React.createClass({
    name: 'newshow',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'items', type:'array', required:false, defaultValue:[], note:'' }
        ];
        return attributes;
    },

    render: function() {
        var content = [];
        for (var i = 0;  i < this.state.items.length; i++) {
            var item = this.state.items[i];
            content.push(
                <div className="column">
                    <a className="home-column-link" href={ item.hyperlink } >
                        <div className="column-image">
                            <img src={ item.image } data-holder-rendered="true" />
                        </div>    
                        <div className="column-title">
                            { item.text }
                        </div>
                    </a>
                </div>
            );
        }        
        return (
            <div className="home-columns">
                { content }
            </div>
        );
    }
});