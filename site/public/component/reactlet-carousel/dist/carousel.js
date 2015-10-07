// Carousel component
var Carousel = React.createClass({displayName: "Carousel",
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
                React.createElement("li", {"data-target":  slideElementKey, "data-slide-to":  i, className:  indicatorActiveClass })
            );
            
            slideNodes.push(
                React.createElement("div", {className:  itemActiveClass }, 
                    React.createElement("img", {alt:  item.text, src:  item.image, "data-holder-rendered": "true"}), 
                    React.createElement("div", {className: "carousel-caption"}, 
                        React.createElement("h4", null,  item.text)
                    )
                )
            );
        }
        
        var content =
            React.createElement("div", {id:  slideElementId, className: "carousel slide", "data-ride": "carousel"}, 
                React.createElement("ol", {className: "carousel-indicators"}, 
                     slideIndicators 
                ), 
                React.createElement("div", {className: "carousel-inner", role: "listbox"}, 
                     slideNodes 
                ), 
                React.createElement("a", {className: "left carousel-control", href:  slideElementKey, role: "button", "data-slide": "prev"}, 
                    React.createElement("span", {className: "glyphicon glyphicon-chevron-left"}), 
                    React.createElement("span", {className: "sr-only"}, "Previous")
                ), 
                React.createElement("a", {className: "right carousel-control", href:  slideElementKey, role: "button", "data-slide": "next"}, 
                    React.createElement("span", {className: "glyphicon glyphicon-chevron-right"}), 
                    React.createElement("span", {className: "sr-only"}, "Next")
                )
                
            )
            ;
        
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' ') }, 
                 content 
            )
        );
    }
});
