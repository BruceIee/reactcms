// item list_react script
var app = app || {};

$().ready(function() {
    console.log('in item list_react page');
    
});

function setup() {
    app.list1Data = {
        items: [
            { text:'Apple', iconClass:'fa fa-fw fa-bicycle', id:'apple' },
            { text:'Pear', iconClass:'fa fa-fw fa-bus', id:'pear' },
            { text:'Mango', iconClass:'fa fa-fw fa-tree', id:'mango' },
            { text:'Melon', iconClass:'fa fa-fw fa-bank', id:'melon' },
            { text:'Grape', iconClass:'fa fa-fw fa-book', id:'grape' }
        ]
    };
    app.list1 = React.renderComponent(
        <List data={ app.list1Data } />,
        document.getElementById('itemList')
    );
    app.list1.on('select', function(id) {
        console.log('list item selected:', id);
    });
}

setup();