// BootstrapRadios.react.js
import React from 'react';
var BootstrapRadios = React.createClass({
    statusClassNameDictionary: {
        success: {formGroup: 'has-success'},
        warning: {formGroup: 'has-warning'},
        error: {formGroup: 'has-error'},
        info: {formGroup: 'has-info'},
        default: {formGroup: ''},
    },
    getValue: function() {
        var value = '';
        var inputs = this.refs.base.getElementsByTagName('input');
        for(var i = 0; i < inputs.length; ++i) {
            if(inputs[i].checked) {
                value = inputs[i].getAttribute('data-option_key');
            }
        }
        return value;
    },
    onChange: function(e) {
        if(this.props.onChange) { this.props.onChange(this.getValue()); }
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var label = this.props.label;
        var labelHidden = this.props.labelHidden || false;
        var hasFeedback = this.props.hasFeedback || false;
        var status = this.props.status || 'default';
        var options = this.props.options || [];
        var value = this.props.value || '';
        var strings = this.staticStrings;
        var baseClassName = ClassNames(
            'form-group', 'col-md-' + gridWidth, {'has-feedback': hasFeedback},
            this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        return <div className={baseClassName} ref='base'>
            {!labelHidden && <label className={labelClassName}>{label}</label>}
            {!labelHidden && <br />}
            {options.map(function(option, index) {
                var optionKey = option.value || option.key || option.id || option;
                var optionDisplay = option.display || option.value || option.name || option;
                var checked = value === optionKey;
                return <label className='radio-inline' key={index}>
                    <input
                        type='radio' title={optionDisplay} name={label}
                        data-option_key={optionKey} data-checked={checked}
                        onChange={this.onChange} checked={checked}
                    />
                    {optionDisplay}
                </label>;
            }, this)}
        </div>;
    }
});
module.exports = BootstrapRadios;
