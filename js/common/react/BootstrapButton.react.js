// BootstrapButton.react.js
import React from 'react';
import ClassNames from 'classnames';

const statusClassNameDictionary = {
    primary: {formGroup: '', button: 'btn-primary'},
    success: {formGroup: 'has-success', button: 'btn-success'},
    warning: {formGroup: 'has-warning', button: 'btn-warning'},
    danger: {formGroup: 'has-error', button: 'btn-danger'},
    info: {formGroup: 'has-info', button: 'btn-info'},
    default: {formGroup: '', button: 'btn-default'},
};

class BootstrapButton extends React.Component {
    onClick(e) {
        if(!this.props.disabled && this.props.onClick) {
            this.props.onClick(e);
        }
    }
    render() {
        var gridWidth = this.props.gridWidth || '12';
        var labelHidden = this.props.labelHidden;
        var label = this.props.label;
        var title = this.props.title;
        var status = this.props.status || 'default';
        var disabled = this.props.disabled || false;
        var classNames = statusClassNameDictionary[status] || statusClassNameDictionary.default;
        var baseClassName = ClassNames(
            'form-group', 'col-md-' + gridWidth, classNames.formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var buttonClassName = ClassNames('btn col-md-12', classNames.button, {'disabled': disabled});
        return <div className={baseClassName} ref='base'>
            <label className={labelClassName}>{label}</label><br />
            <button
                className={buttonClassName} type="button"
                title={title} onClick={this.onClick}
            >
                {title}
            </button>
        </div>;
    }
};
module.exports = BootstrapButton;
