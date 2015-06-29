var MyLeaflet = React.createClass({
    name: 'myleaflet',
    
    getInitialState: function() {
        var state = {};
        var propsData = this.props.data || {};
        var state = propsData;
        return state;
    },
    
    
    dosome: function() {
        
        var map = L.map('map').setView(this.state.coordinate_array[0], 13);
        
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: this.state.mapbox_project_id,
            accessToken: this.state.mapbox_public_accesstoken
        }).addTo(map);
        
        //var marker1 = L.marker([38.9, 121.6]).addTo(map);
        
        //var marker2 = L.marker([38.91, 121.61]).addTo(map);
        
        
        for (var i=0; i<this.state.coordinate_array.length; i++)
        {
            L.marker(this.state.coordinate_array[i]).addTo(map);
        }
     
        
    },

    componentDidMount: function() {
      this.dosome();
    },    
    
    
    render: function() {

        /*
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="panel panel-default">
                    <div className="panel-heading">
                        { this.state.title }
                    </div>
                    <div className="panel-body">
                        { groups }
                    </div>
                </div>
            </div>    
        );
        */
    
    
  
    
    
        return (
            <div ref="map">
                
            </div>    
        );    
    
    }
});