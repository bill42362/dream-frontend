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
    }
    componentDidMount() { }
    getValue() { return this.state.message; }
    onChange() {
        this.setState({message: this.refs.message.getValue(), shouldCallOnChange: true});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({message: nextProps.message});
    }
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
        return <div className='project-message-box' ref='base' >
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
                    title={strings.message.title.string}
                    value={message} onChange={this.onChange}
                />
            </div>
        </div>;
    }
}
module.exports = ProjectMessageBox;
