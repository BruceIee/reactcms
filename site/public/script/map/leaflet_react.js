var app = app || {};
    
$().ready(function() {
    
    app.componentData = {
        coordinate_array: [
            [38.9, 121.6],
            [38.91, 121.61]
        ],
        mapbox_project_id: 'ljnet.52b18d90',
        mapbox_public_accesstoken: 'pk.eyJ1IjoibGpuZXQiLCJhIjoiMjExNTE4NDA1MDNkZTEzMGRlNzM5MDkyYWFkYzQ1ZjQifQ.XZMKtABuo1HTRpC6EumcyQ'
    };
    
    app.component = React.render(
        <MyLeaflet data={ app.componentData } />,
        document.getElementById('component1')
    );
});