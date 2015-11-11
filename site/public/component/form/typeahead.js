// typeahead input component
var Typeahead = React.createClass({
    name: 'typeahead',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'label', type:'string', required:false, defaultValue:'', note:'item label' },
            { name:'value', type:'string', required:false, defaultValue:'', note:'item value' },
            { name:'values', type:'array', required:false, defaultValue:[], note:'item values for selection' }
        ];
        return attributes;
    },
    
    componentDidMount: function() {
        var targetElement = React.findDOMNode(this.refs.typeahead);
        
        /*
        var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
            'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
            'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        */
        
        function substringMatcher(strs) {
            return function findMatches(q, cb) {
                var matches, substringRegex;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        }
        $(targetElement).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'entry',
            source: substringMatcher(this.state.values)
        });
    },
        
    render: function() {
        return (
            <div className={ this.state.containerClassNames.join(' ') } data-id={ this.state.id } >
                <div className="typeahead-content">
                    <div className="form-group typeahead-input">
                        <div className="typeahead-label">{ this.state.label }</div>
                        <input className="form-control typeahead" ref="typeahead" type="text" placeholder="" />
                    </div>
                    <div className="div-clear-both" />
                </div>
            </div>
        );
    }
});
