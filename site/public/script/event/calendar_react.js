var app = app || {};
    
$().ready(function() {
    /*
    app.componentData = {
        year: 2015,
        month: 5,
        eventsCollection: {
            '2015-05-01': [
                { category:'home', title:'gas bill' },
                { category:'work', title:'report due' },
                { category:'home', title:'garden' }
            ],
            '2015-05-11': [
                { category:'home', title:'test' },
                { category:'home', title:'another test' },
                { category:'work', title:'3rd test' }
            ]
        }
    };
    */
    
    var url = '/data/events/group_by_date';
    $.get(url, function(data) {
        app.componentData = {
            year: moment().format('YYYY'), // 2015
            month: moment().format('M'),   // 4
            eventsCollection: data
        };    

        app.component = React.render(
            <Calendar data={ app.componentData } />,
            document.getElementById('component1')
        );    
    });
});
    
