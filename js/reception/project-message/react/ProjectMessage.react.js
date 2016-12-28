// ProjectMessage.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import ProjectMessageBox from './ProjectMessageBox.react.js';

class ProjectMessage extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { message: '', };
        this.onReplyChange = this.onReplyChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onReplyChange() {
        if(this.props.onReplyClick) { this.props.onReplyClick(); }
        else if(!this.props.userNickname && this.props.noMessageAlert) {
            this.props.noMessageAlert();
        } else if(this.props.onReplyChange) {
            this.props.onReplyChange(this.refs.messageBox.getValue(), this.props.index);
        }
    }
    onSubmit(replyMessage) {
        if(this.props.onSubmit) { this.props.onSubmit(replyMessage, this.props.uuid); }
    }
    componentDidMount() { }
    componentDidUpdate() { }
    render() {
        let message = this.props.message;
        const userProfiles = this.props.userProfiles;
        const authorProfile = userProfiles[message.authorId] || {};
        return <div className='project-message' ref='base' >
            <img
                className='project-message-author-image'
                src={authorProfile.src || 'img/mock_user_icon.jpg'}
                title={authorProfile.nickname}
            />
            <div className='project-message-texts' >
                <h5 className='project-message-author'>{authorProfile.nickname || ''}</h5>
                <span className='project-message-date-string'>
                    {Core.getDateStringWithFormat(message.timestamp, 'YYYY-MM-DD hh:mm:ss')}
                </span>
                <span
                    className='project-message-reply-button'
                    role='button' onClick={this.onReplyChange}
                >回覆</span>
                <div className='project-message-content'>{message.content}</div>
                {message.replies && message.replies.map((reply, index) => <ProjectMessage
                    key={index} message={reply} userProfiles={this.props.userProfiles}
                    onReplyClick={this.onReplyChange} noMessageAlert={this.props.noMessageAlert}
                    userNickname={this.props.author} userImageSrc={this.props.authorImageSrc}
                />)}
                <ProjectMessageBox
                    ref='messageBox' shouldHide={this.props.shouldHideReplyBox}
                    author={this.props.userNickname} authorImageSrc={this.props.userImageSrc}
                    message={this.props.replyMessage} onChange={this.onReplyChange}
                    onSubmit={this.onSubmit} onFocus={this.props.noMessageAlert}
                />
            </div>
        </div>;
    }
}
module.exports = ProjectMessage;
