// ProjectMessageBox.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import BootstrapInput from '../../../common/react/BootstrapInput.react.js';

class ProjectMessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = {
            message: {
                label: {string: '留些訊息給我們吧', context: 'Label for message input.'},
                title: {string: '留些訊息給我們吧...', context: 'Title for message input.'},
            },
        };
        this.state = {
            message: '',
            shouldCallOnChange: false,
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    getValue() { return this.state.message; }
    onChange() {
        this.setState({message: this.refs.message.getValue(), shouldCallOnChange: true});
    }
    onBlur(e) {
        e.stopPropagation();
        var isOnMobile = 0 !== window.scrollX;
        if('hidden' !== document.visibilityState && isOnMobile && this.state.message.replace(/\s/g, '')) {
            if(this.props.onSubmit) { this.props.onSubmit(this.getValue()); }
            this.setState({message: '', shouldCallOnChange: true});
        }
        return false;
    }
    onKeyPress(e) {
        e.stopPropagation();
        if(
            !e.shiftKey &&
            ('Enter' === e.code || 'Enter' == e.key || 'NumpadEnter' == e.code)
            && this.state.message.replace(/\s/g, '')
        ) {
            e.preventDefault();
            if(this.props.onSubmit) { this.props.onSubmit(this.getValue()); }
            this.setState({message: '', shouldCallOnChange: true});
        }
        return false;
    }
    componentWillReceiveProps(nextProps) { this.setState({message: nextProps.message}); }
    componentDidMount() { this.refs.base.addEventListener('keypress', this.onKeyPress, false); }
    componentWillUnmount() { this.refs.base.removeEventListener('keypress', this.onKeyPress, false); }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldCallOnChange && this.props.onChange) {
            this.props.onChange(this.getValue());
            this.setState({shouldCallOnChange: false});
        }
    }
    render() {
        let strings = this.staticStrings;
        let author = this.props.author;
        let authorImageSrc = this.props.authorImageSrc;
        let message = this.state.message;
        return <div ref='base' className={ClassNames(
            'project-message-box', {'collapse': this.props.shouldHide}
        )} >
            <div className='project-message-box-author-image-container'>
                <img
                    className='project-message-box-author-image'
                    src={authorImageSrc || '/img/mock_user_icon.jpg'}
                    title={author}
                />
            </div>
            <div className='project-message-box-textarea row'>
                <BootstrapInput
                    ref='message' gridWidth={'12'} headAddon={''} type='textarea'
                    label={strings.message.label.string} labelHidden={true}
                    title={strings.message.title.string} autoFocus={this.props.shouldAutoFocus}
                    value={message} onChange={this.onChange} onBlur={this.onBlur}
                    onFocus={this.props.onFocus}
                />
            </div>
        </div>;
    }
}
module.exports = ProjectMessageBox;
