// Treeview component
var Treeview = React.createClass({displayName: "Treeview",
    name: 'treeview',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'dispatcher', type:'object', required:false, defaultValue:null, note:'flux dispatcher' },
            { name:'selectType', type:'string', required:false, defaultValue:'n', note:'select type:none/checkbox/radio' },
            { name:'expandLevel', type:'number', required:false, defaultValue:5, note:'levels to expand' },
            { name:'treedata', type:'array', required:false, defaultValue:[], note:'input treeview data' },
            // internal, don't pass in
            { name:'activeNode', type:'object', required:false, defaultValue:[], note:'the active treev node' },
            { name:'treedataObject', type:'object', required:false, defaultValue:[], note:'treeview data object' },
            { name:'treedataCol', type:'array', required:false, defaultValue:[], note:'treeview data in hash array' }
        ];
        return attributes;
    },
    
    componentWillMount: function() {
        this.state.treedataObject = this.prepareTreedata(this.state.treedata);
        this.state.nodes = this.getNodeFromTree();
    },
    
    // add unique id to treedata
    prepareTreedata: function(treedata) {
        // convert object into array
        var startLevel = 1;
        this.state.treedataCol = {};
        if (typeof treedata === 'object') {
            if (treedata.constructor.name === 'Array') {
                startLevel = 0;
                treedata = { children:treedata };
            }
        }
        this.processTreedataItem(treedata, startLevel);
        return treedata;
    },
    
    processTreedataItem: function(item, level) {
        item.level = level;
        item.uid = this.generateUid();
        item.selectStatus = 'n'; // select status can be all | partial | none
        // if isExpanded is not defined, use treeview expandLevel
        if (typeof item.isExpanded === 'undefined') { 
            item.isExpanded = (level < this.state.expandLevel) || false;
        } else {
            item.isExpanded = !!item.isExpanded; // force boolean result
        }
        if (item.isActive) {
            this.state.activeNode = item;
        }
        item.hasChildren = (item.children && item.children.length > 0) || false;
        if (level > 0) {
            this.state.treedataCol[item.uid] = item;
        }
        if (item.children) {
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                this.processTreedataItem(childItem, level + 1);
            }
        }
    },
    
    /*
    Getting nodes from treedata item
    Example input treedata:
    [{
        "name": "Top Level",
        "children": [{
            "name": "Level 2: A",
            "children": [{
                "name": "Son of A"
            }, {
                "name": "Daughter of A"
            }]
        }, {
            "name": "Level 2: B"
        }, {
            "name": "Level 2: C",
            "children": [{
                "name": "Son of C"
            }]
        }]
    }]
    output nodes:
    [
        { display:'Top Level', level:1 },
        { display:'Level 2: A', level:2 },
        { display:'Son of A', level:3 },
        { display:'Daughter of A', level:3 },
        { display:'Level 2: B', level:2 },
        { display:'Level 2: C', level:2 },
        { display:'Son of C', level:3 }
    ]
    */
    getNodeFromTree: function(item, useSimpleForm) {
        // set default item to tree root
        item = item || this.state.treedataObject; 
        var nodes = [];
        var currentNode = { isExpanded:true };
        var display = item && (item.name || item.text) || 'NA';
        // skip level 0, it is artificial object for array input
        if (item.level > 0) {
            currentNode = {
                uid: item.uid,
                item: item,
                display: display,
                level: item.level,
                hasChildren: item.hasChildren,
                isExpanded: !!item.isExpanded,
                isActive: !!item.isActive,
                selectStatus: item.selectStatus,
                boxClass: item.boxClass
            };
            if (useSimpleForm) {
                delete currentNode.item;
                delete currentNode.level;
                delete currentNode.selectStatus;
                delete currentNode.boxClass;
                delete currentNode.hasChildren;
                if (!currentNode.isActive) {
                    delete currentNode.isActive;
                }
                if (!currentNode.isExpanded) {
                    delete currentNode.isExpanded;
                }
            }
            nodes.push(currentNode);
        }
        if (item.children && currentNode.isExpanded) {
            var childNodes = [];
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                var childNodes = this.getNodeFromTree(childItem, useSimpleForm);
                nodes = nodes.concat(childNodes);
            }
        }
        return nodes;
    },
    
    getData: function() {
        var result = this.state.treedataObject.children;
        return result;
    },
    
    /* update select status under item
     * @param item Object item under update
     * @param changedItem Object the item that has change of status originally
     * @param inheritStatus String optional, status to be updated to (inherited from parent)
     */
    updateTreeSelectStatus: function(item, changedItem, inheritStatus) {
        // set initial select status to tree item
        var deduceSelectStatus = false;
        if (item.uid === changedItem.uid) {
            // reached item that changes select status originally, no change is needed for item
            // set inheritStatus for children to set select status to
            inheritStatus = item.selectStatus; // should be 'a' or 'n'
        } else if (inheritStatus) {
            // Set select status to inheritStatus if available
            item.selectStatus = inheritStatus;
        } else {
            // need to deduce selectStatus from children's select statuses
            if (item.children && item.children.length > 0) {
                deduceSelectStatus = true;
            } else {
                // item remains current select status
            }
        }
        // process child items, keep track of selected child items
        var selectChildrenCount = 0;
        if (item.children && item.children.length > 0) {
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                this.updateTreeSelectStatus(childItem, changedItem, inheritStatus);
                if (childItem.selectStatus === 'a') {
                    selectChildrenCount = selectChildrenCount + 1;
                } else if (childItem.selectStatus === 'p') {
                    selectChildrenCount = selectChildrenCount + .5;
                }
            }
        }
        // to deduced select status, compare children count to selected children count
        if (deduceSelectStatus) {
            if (item.children && item.children.length > 0) {
                if (selectChildrenCount === item.children.length) {
                    item.selectStatus = 'a';
                } else if (selectChildrenCount === 0) {
                    item.selectStatus = 'n';
                } else {
                    item.selectStatus = 'p';
                }
            } else {
                item.selectStatus = 'n';
            }
        }
    },
    
    onNodeClick: function(event) {
        var target = $(event.target);
        // get cellId from cell icon <i> or from cell container
        var cellId = target.attr('data-uid'); 
        if (target.hasClass('treeview-cell-expand-container')) {
            cellId = target.find('i').attr('data-uid');
        }
        if (!cellId) {
            return;
        }
        // cellId format: "<nodeKey>-<cellType>-<select status>-<expand status>"
        // cellId example: "36c2b148338c8d7a7f99ef6b881e281f-expand-a-e"
        var parts = cellId.split('-');
        var nodeKey = parts[0];
        var cellType = parts[1];
        var treedataItem = this.state.treedataCol[nodeKey];
        // change this.state.treedata according to type of icon clicked
        var isNodeClickEvent = false;
        switch (cellType) {
            case 'expand':
                treedataItem.isExpanded = !treedataItem.isExpanded;
                break;
            case 'select':
                isNodeClickEvent = true;
                switch(treedataItem.selectStatus) {
                case 'a':
                    treedataItem.selectStatus = 'n';
                    break;
                case 'p':
                    treedataItem.selectStatus = 'a';
                    break;
                case 'n':
                    treedataItem.selectStatus = 'a';
                    break;
                }
                break;
            case 'icon':
                isNodeClickEvent = true;
                break;
            case 'textbox':
                isNodeClickEvent = true;
                break;
        }
        // sync select status of all tree nodes
        this.updateTreeSelectStatus(this.state.treedataObject, treedataItem);
        if (isNodeClickEvent) {
            var node = { key:nodeKey, type:cellType, cellId:cellId, item:treedataItem };
            // fire evernt on node click
            this.fire('treenode-click', [node]);
            // set active node
            this.setActiveItem(treedataItem);
        }
        //this.dumpTree(this.state.treedataObject);
        this.state.nodes = this.getNodeFromTree();
        // update display
        this.forceUpdate();
    },
    
    setActiveItem: function(treedataItem) {
        // first clear the isActive flag on all items
        this.setTreeDataProperty(this.state.treedataObject, { isActive:false });
        treedataItem.isActive = true;
        this.state.activeNode = treedataItem;
    },
    
    setTreeDataProperty: function(treedataItem, source) {
        for (var property in source) {
            treedataItem[property] = source[property];
        }
        if (treedataItem.children && treedataItem.children.length > 0) {
            for (var i = 0; i < treedataItem.children.length; i++) {
                var childItem = treedataItem.children[i];
                this.setTreeDataProperty(childItem, source);
            }
        }
    },
    
    dumpTree: function(item) {
        // set default item to tree root
        item = item || this.state.treedataObject;
        // loop through item
        if (item.level > 0) {
            var output = '';
            for (var i = 0; i < item.level; i++) {
                output = output + '  ';
            }
            output = output + item.name + '-' + item.selectStatus;
            console.log(output);
        }
        if (item.children && item.children.length > 0) {
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                this.dumpTree(childItem);
            }
        }
    },
    
    // set data for display
    setData: function(treedata) {
        this.state.treedata = treedata;
        this.state.treedataObject = this.prepareTreedata(this.state.treedata);
        this.state.nodes = this.getNodeFromTree();
        this.forceUpdate();
    },
    
    // get selected items
    getSelected: function() {
        var resultItems = [];
        var domNode = this.getDOMNode();
        var selectedIcons = $(domNode).find('.treeview-cell-select-container .fa-check-square-o');
        for (var i = 0; i < selectedIcons.length; i ++) {
            var uid = $(selectedIcons[i]).attr('data-uid').split('-')[0];
            var item = this.state.treedataCol[uid];
            resultItems.push(item);
        }
        return resultItems;
    },
    
    getActiveNode: function() {
        return this.state.activeNode;    
    },
    
    // if parent is null,add node to top level
    addNode: function(parent, nodeNew) {
        var parentUid = parent && parent.uid || '';
        var treedata = this.getData();
        this.addTreeNode(treedata, parentUid, nodeNew);
        this.setData(treedata);
    },
    
    addTreeNode: function(nodes, parentUid, nodeNew) {
        if (!parentUid) {
            nodes.push(nodeNew);
            return;
        }
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node && node.uid === parentUid) {
                node.children = node.children || [];
                node.children.push(nodeNew);
            } else {
                if (node.children) {
                    this.addTreeNode(node.children, parentUid, nodeNew);
                }
            }
        }
    },
    
    // delete treenode by node or node uid
    deleteNode: function(node) {
        var uid = node && node.uid;
        var treedata = this.getData();
        this.deleteTreeNode(treedata, uid);
        this.setData(treedata);
    },
    
    // To delete array element, need to do array.splice
    deleteTreeNode: function(nodes, uid) {
        var nodesLength = nodes.length;
        for (var i = nodesLength - 1; i >= 0 ; i--) {
            var node = nodes[i];
            if (node && node.uid === uid) {
                nodes.splice(i, 1);
            }
        }
        // process children of member nodes
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.children && node.children.length > 0) {
                this.deleteTreeNode(node.children, uid);
            }
        }
        return nodes;
    },
    
    findNodes: function(condition) {
        var treedata = this.getData();
        var resultNodes = [];
        this.findTreeNodes(treedata, condition, resultNodes);
        return resultNodes;
    },
    
    findTreeNodes: function(nodes, condition, resultNodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (this.nodeMatch(node, condition)) {
                resultNodes.push(node);
            }
            if (node.children && node.children.length > 0) {
                this.findTreeNodes(node.children, condition, resultNodes);
            }
        }
    },
    
    // check node matches condition or not
    nodeMatch: function(node, condition) {
        var result = true;
        for (var property in condition) {
            // node needs to match property/value in condition
            if (node[property] !== condition[property]) {
                result = false;
            }
        }
        return result;
    },
    
    render: function() {
        var treenodes = [];
        for (var i = 0; i < this.state.nodes.length; i++) {
            var node = this.state.nodes[i];
            node.selectType = node.selectType || this.state.selectType;
            // need to include node properties tied with UI change, for example: isExpanded
            var nodeKey = 'treenode-' + node.uid;
            nodeKey += '-' + node.selectStatus;
            nodeKey += '-' + (node.isExpanded ? 'e' : 'n');
            nodeKey += '-' + (node.isActive ? 'a' : 'n');
            treenodes.push(React.createElement(TreeviewNode, {data:  node, key:  nodeKey }));
        }
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' ') }, 
                React.createElement("div", {onClick:  this.onNodeClick}, 
                     treenodes 
                )
            )
        );
    }
});


// TreeviewNode component
var TreeviewNode = React.createClass({displayName: "TreeviewNode",
    name: 'treeview-node',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for node' },
            { name:'level', type:'number', required:false, defaultValue:1, note:'node level' },
            { name:'display', type:'string', required:false, defaultValue:'', note:'text display' },
            { name:'hasChildren', type:'boolean', required:false, defaultValue:false, note:'has children flag' },
            { name:'isExpanded', type:'boolean', required:false, defaultValue:false, note:'is expanded flag' },
            { name:'isActive', type:'boolean', required:false, defaultValue:false, note:'is activeexpanded flag' },
            { name:'selectType', type:'string', required:false, defaultValue:'n', note:'select type:none/checkbox/radio' },
            { name:'selectStatus', type:'boolean', required:false, defaultValue:'n', note:'selecte state all/partial/none' },
            { name:'item', type:'object', required:false, defaultValue:'', note:'original data item' }
        ];
        return attributes;
    },
    
    render: function() {
        var items = [];
        var cells = [];
        var level = this.state.level;
        
        // add active class if node is active
        if (this.state.isActive) {
            this.state.containerClassNames.push('treeview-node-active');
        }
        
        // add branch cells 
        for (var i = 1; i < level; i++) {
            var cellData = { text:i, type:'space' };
            var cellKey = 'treeview-text-cell-space-' + i;
            cells.push(
                React.createElement(TreeviewCell, {data:  cellData, key:  cellKey })
            );
        }
        // add expand cell if there are children
        var expandCellData = {
            uid: this.state.uid + '-expand',
            type: 'expand',
            iconClass: this.state.isExpanded ? 'fa fa-caret-down' : 'fa fa-caret-right'
        };
        if (!this.state.hasChildren) {
            expandCellData.iconClass = 'fa';
        }
        cells.push(React.createElement(TreeviewCell, {data:  expandCellData, key: "treeview-expand-cell"}));
        
        // add select cell
        if (this.state.selectType === 'c') {
            // checkbox select type
            var iconClass = '';
            switch(this.state.selectStatus) {
            case 'a':
                iconClass = 'fa fa-check-square-o';
                break;
            case 'p':
                iconClass = 'fa fa-square';
                break;
            case 'n':
                iconClass = 'fa fa-square-o';
                break;
            }
            var selectCellData = {
                uid: this.state.uid + '-select',
                type: 'select',
                iconClass: iconClass
            };
            var selectCellKey = 'treeview-select-cell';
            cells.push(React.createElement(TreeviewCell, {data:  selectCellData, key:  selectCellKey }));
        }
        
        // only add icon cell when iconClass is present
        if (this.state.item.iconClass) {
            var iconCellData = {
                uid: this.state.uid + '-icon',
                type: 'icon',
                iconClass: this.state.item.iconClass
            };
            cells.push(React.createElement(TreeviewCell, {data:  iconCellData, key: "treeview-icon-cell"}));
        }
        
        // add textbox
        var textboxData = {
            uid: this.state.uid + '-textbox',
            type: 'text',
            text: this.state.display
        };
        cells.push(React.createElement(TreeviewTextBox, {data:  textboxData, key: "treeview-textbox"}));
        
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' '), 
                "data-id":  this.state.uid, 
                onClick:  this.onClick
                }, 
                 cells 
            )
        );
    }
});


// TreeviewCell component
var TreeviewCell = React.createClass({displayName: "TreeviewCell",
    name: 'treeview-cell',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for cell' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'treeview type' }
        ];
        return attributes;
    },
    
    render: function() {
        // set iconClass
        var displayText = '';
        var iconClass = this.state.iconClass || '';
        var iconContainerClass = 'treeview-cell-' + this.state.type + '-container';
        switch (this.state.type) {
            case 'text':
                displayText = this.state.text;
                break;
            case 'expand':
                iconClass = iconClass || 'fa fa-plus-square-o';
                break;
            case 'select':
                iconClass = iconClass || 'fa fa-check-square-o';
                break;
            case 'icon':
                iconClass = iconClass || '';
                break;
        }
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' ') }, 
                React.createElement("div", {className:  iconContainerClass }, 
                    React.createElement("i", {className:  iconClass, "data-uid":  this.state.uid},  displayText )
                )
            )
        );
    }
});


// Treeview textbox component
var TreeviewTextBox = React.createClass({displayName: "TreeviewTextBox",
    name: 'treeview-textbox',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for cell' },
            { name:'text', type:'string', required:false, defaultValue:'', note:'display text' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'treeview type' }
        ];
        return attributes;
    },
    
    render: function() {
        // set content
        var displayText = this.state.text;
        return (
            React.createElement("div", {className:  this.state.containerClassNames.join(' ') }, 
                React.createElement("div", {className: "treeview-textbox-content", "data-uid":  this.state.uid, 
                    dangerouslySetInnerHTML: { __html: displayText}}
                )
            )
        );
    }
});
