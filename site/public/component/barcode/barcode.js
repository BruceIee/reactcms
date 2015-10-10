
var AddBox = React.createClass({
    handleSubmit: function(event) {
        console.log('click');
        this.props.onUserInput(
            this.refs.value_input.getDOMNode().value
        );
        //return false;
        event.preventDefault();
    },      
  
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="input code here" ref="value_input" />
                <input type="submit" value="Show image" />
            </form>        
        );
    }                
});

var ImageBox = React.createClass({
    render: function() {
        return (
            <div>
                <img src={this.props.img_info.img_src} />
            </div>
        );
    }
});        

var MainBox = React.createClass({
    getInitialState: function() {
        return {
            value_str: '',
            img_obj: {}
        };
    }, 

    handleCodeSubmit: function(value_input) {
        /*
        this.setState({
            value_str: value_input
        });
        */
        
        var json1 = {};
        json1.value = value_input;
        
        $.ajax({
            url: '/data/barcode/submit_code',
            dataType: 'json',
            type: 'POST',
            data: json1,
            success: function(data) {
                console.log('success.');
                console.log('data.info=',data.info);
                
                

                
                
                //this.setState({img_obj: data.info});
                this.setState({img_obj: data.info});
            }.bind(this)
        });
        
    },
  
    render: function() {
        return (
            <div className="mainComponent">
                <AddBox onUserInput={this.handleCodeSubmit} />
                <br />
                <ImageBox img_info={this.state.img_obj} />
            </div>
        );
      }
});