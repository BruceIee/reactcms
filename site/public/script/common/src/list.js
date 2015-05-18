var React = require('react');
var Table = require('reactlet-table');

var app = app || {};

$().ready(function() {
    setup();
    //test();
});

function setup() {
    console.log('in common list page - module:', app.moduleName);
    
    
}

/*
function test() {
    
    // table2Data has 'id' column as key column
    app.table2Data = {
        boxClass: 'table-container-bordered',
        colModel: {
            id: { name:'id', text:'ID', width:'15%', key:true, format:app.getIdText },
            name: { name:'name', text:'Name', width:'20%', sort:'up' },
            price: { name:'price', text:'Price', width:'15%', type:'money' },
            description: { name:'description', text:'Description', width:'30%' },
            extra: { name:'extra', text:'Extra', show:false, width:'10%' }
        },
        dataItems:[
            { id:'P01', name:'egg', price:5.98, description:'fresh egg', extra:'n/a' },
            { id:'P02', name:'bread', price:1.29, description:'white bread', extra:'n/a' },
            { id:'P03', name:'chip', price:2.13, description:'potato chip', extra:'n/a' },
            { id:'P04', name:'sauce', price:1.89, description:'dipping sauce', extra:'n/a' },
            { id:'P05', name:'corn', price:4.59, description:'fresh pear', extra:'n/a' },
            { id:'P06', name:'vegi', price:2.12, description:'potato', extra:'n/a' },
            { id:'P07', name:'vegi', price:1.81, description:'eggplant', extra:'n/a' },
            { id:'P08', name:'corn', price:4.99, description:'fresh aple', extra:'n/a' },
            { id:'P09', name:'chip', price:2.15, description:'potato chip', extra:'n/a' },
            { id:'P10', name:'sauce', price:1.82, description:'dipping sauce', extra:'n/a' },
            { id:'P11', name:'corn', price:4.49, description:'fresh cucumber', extra:'n/a' },
            { id:'P12', name:'chip', price:2.19, description:'potato chip', extra:'n/a' },
            { id:'P13', name:'sauce', price:1.29, description:'mild sauce', extra:'n/a' },
            { id:'P14', name:'corn', price:4.39, description:'popcorn', extra:'n/a' },
            { id:'P15', name:'chip', price:2.32, description:'potato soup', extra:'n/a' },
            { id:'P16', name:'sauce', price:1.89, description:'dipping sauce', extra:'n/a' },
            { id:'P17', name:'corn', price:4.29, description:'fresh corn', extra:'n/a' },
            { id:'P18', name:'chip', price:2.41, description:'potato mash', extra:'n/a' },
            { id:'P19', name:'sauce', price:1.80, description:'hot sauce', extra:'n/a' },
            { id:'P20', name:'corn', price:4.19, description:'fresh corn', extra:'n/a' },
            { id:'P21', name:'bread', price:2.99, description:'eight grain bread', extra:'n/a' },
            { id:'P22', name:'chip', price:2.51, description:'corn chip', extra:'n/a' },
            { id:'P23', name:'sauce', price:1.87, description:'medium sauce', extra:'n/a' }
        ],
        paging: {
            size: 5,
            page: 1
        }
    };
    
    // table2 with paging
    app.table2 = React.render(
        <Table data={ app.table2Data } />,
        document.getElementById('table2')
    );
    app.table2.on('table-row-click', function(event) {
        var id = event.id;
        console.log('row click - id:', id, 'table active item id:', app.table2.state.activeItemId);
    });
}
*/