// ContentEditable.react.js
const React = require('react');
var ContentEditable = React.createClass({
    render: function(){
        return <span
            ref='input'
            className={this.props.className}
            role={this.props.role}
            autoFocus={this.props.autoFocus}
            onInput={this.emitChange} 
            onBlur={this.props.onBlur}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.value}}
        ></span>;
    },

    componentDidMount: function() {
        if(this.props.autoFocus) {
            document.activeElement.blur();
            this.refs.input.focus();
        }
    },

    shouldComponentUpdate: function(nextProps){
        return nextProps.value !== this.refs.input.innerHTML;
    },

    componentDidUpdate: function() {
        if ( this.props.value !== this.refs.input.innerHTML ) {
           this.refs.input.innerHTML = this.props.value;
        }
    },

    emitChange: function(){
        var value = this.refs.input.innerHTML;
        if (this.props.onChange && value !== this.lastHtml) {
            this.props.onChange(value);
        }
        this.lastHtml = value;
    }
});
module.exports = ContentEditable;
