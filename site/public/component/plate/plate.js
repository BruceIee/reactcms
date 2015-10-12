// Plate component
var Plate = React.createClass({
    name: 'plate',
    mixins: [getCommonMixin],
    
    rowCount: 8,
    colCount: 12,
    
    // attribute definitions
    /*
    cellData example in props input:
    {
        "cellData": [
            {
                "row": 1,
                "col": 1,
                "iconClass": "fa fa-dot-circle-o",
                "color": "#f00",
                "text": "blank"
            },
            {
                "row": 8,
                "col": 12,
                "iconClass": "fa fa-circle",
                "color": "#0ff",
                "text": "ref"
            }
        ]
    }
    */
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'96well', note:'plate type' },
            { name:'cellData', type:'array', required:false, defaultValue:null, note:'cell data in array' }
        ];
        return attributes;
    },
    
    getCellData: function() {
        var cellData = [];
        var cellDataCol = {};
        // organize cellData input to be indexed by "<row>_<col>"
        if (this.state.cellData) {
            for (var i = 0; i < this.state.cellData.length; i++) {
                var cell = this.state.cellData[i];
                var cellIndex = cell.row + '_' + cell.col;
                cellDataCol[cellIndex] = cell;
            }
        }
        for (var rowIndex = 1; rowIndex <= this.rowCount; rowIndex++) {
            for (var colIndex = 1; colIndex <= this.colCount; colIndex++) {
                var cellIndex = rowIndex + '_' + colIndex;
                var cell = cellDataCol[cellIndex] || null;
                if (!cell) {
                    cell = { row:rowIndex, col:colIndex, iconClass:'fa fa-circle-thin' };
                }
                cellData.push(cell);
            }
        }
        return cellData;
    },
    
    render: function() {
        this.state.cellData = this.getCellData();
        // set plate display
        var contentTags = [];
        var cellLabelData = null;
        var cellRowCollection = {};
        // setup cell rows
        for (var i = 1; i <= this.rowCount; i++) {
            var rowName = 'row' + i;
            cellRowCollection[rowName] = [];
            // add left cell label to cell row
            cellLabelData = {
                type: 'left',
                text: i,
                boxClass: this.state.boxClass
            };
            cellRowCollection[rowName].push(<CellLabel data={ cellLabelData } />);
        }
        for (var i = 0; i < this.state.cellData.length; i++) {
            var cell = this.state.cellData[i];
            var rowName = 'row' + cell.row;
            cellRowCollection[rowName].push(<Cell data={ cell } />);
        }
        // populate top label row
        var cellLabelRowCollection = [];
        // add corner cell label
        cellLabelData = {
            type: 'corner',
            text: '.',
            boxClass: this.state.boxClass
        };
        cellLabelRowCollection.push(<CellLabel data={ cellLabelData } />);
        // add top cell labels
        for (var i = 1; i <= this.colCount; i++) {
            cellLabelData = {
                type: 'top',
                boxClass: this.state.boxClass,
                text: String.fromCharCode(64 + i)
            };
            cellLabelRowCollection.push(<CellLabel data={ cellLabelData } />);
        }
        // populate contentTags
        contentTags.push(
            <div className="row-label-container" >
                { cellLabelRowCollection }
            </div>
        );
        for (var i = 1; i <= this.rowCount; i++) {
            var rowName = 'row' + i;
            contentTags.push(
                <div className="row-container" >
                    { cellRowCollection[rowName] }
                    <div className="div-clear-both"></div>
                </div>
            );
        }
        
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                { contentTags }
                <div className="div-clear-both"></div>
            </div>
        );
    }
});

// Cell component
var Cell = React.createClass({
    name: 'cell',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', defaultValue:'', note:'icon CSS class' },
            { name:'type', type:'string', defaultValue:'96well', note:'display text' },
            { name:'color', type:'string', defaultValue:'', note:'fore color' },
            { name:'backgroundColor', type:'string', defaultValue:'', note:'background color' },
            { name:'text', type:'string', defaultValue:'', note:'display text' }
        ];
        return attributes;
    },
    
    render: function() {
        // set cell style
        var divStyle = {};
        if (this.state.color) {
            divStyle['color'] = this.state.color;
        }
        if (this.state.backgroundColor) {
            divStyle['background-color'] = this.state.backgroundColor;
        }
        // set icon class names
        this.state.iconClassNames = ['cell-icon-container', this.state.iconClass];
        // set content
        var iconContent =
            <i className={ this.state.iconClassNames.join(' ') }>
            </i>;
        var content =
            <div className="cell-content-container" >
                { iconContent }
            </div>;
        return (
            <div className={ this.state.containerClassNames.join(' ') }  style={ divStyle } >
                { content }
            </div>
        );
        
    }
});

// CellLabel component
var CellLabel = React.createClass({
    name: 'cell-label',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', defaultValue:'', note:'container CSS class' },
            { name:'type', type:'string', defaultValue:'corner', note:'top/bottom/left/right/corner' },
            { name:'text', type:'string', defaultValue:'', note:'display text' }
        ];
        return attributes;
    },
    
    render: function() {
        // set container type
        var typeContainer = 'cell-label-container-' + this.state.type;
        this.state.containerClassNames.push(typeContainer);
        // set content
        var content =
            <div className="cell-label-content-container" >
                <span>{ this.state.text }</span>
            </div>;
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                { content }
            </div>
        );
        
    }
});
