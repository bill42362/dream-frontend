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
    }
    getReplyMessage() { return this.refs.messageBox.getValue(); }
    componentDidMount() { }
    componentDidUpdate() { }
    render() {
        let message = this.props.message;
        return <div className='project-message' ref='base' >
            <img
                className='project-message-author-image'
                src={message.authorImageSrc || 'img/mock_user_icon.jpg'}
                title={message.author}
            />
            <div className='project-message-texts' >
                <h5 className='project-message-author'>{message.author}</h5>
                <span className='project-message-date-string'>
                    {Core.getDateStringWithFormat(message.timestamp, 'YYYY-MM-DD hh:mm:ss')}
                </span>
                <span className='project-message-reply-button'>回覆</span>
                <div className='project-message-content'>{message.content}</div>
                {message.replies.map((reply, index) => <ProjectMessage key={index} message={reply} />)}
                <ProjectMessageBox
                    ref='messageBox'
                    author={message.author} authorImageSrc={message.authorImageSrc}
                    message={this.props.replyMessage} onChange={this.props.onReplyChange}
                />
            </div>
        </div>;
    }
}
module.exports = ProjectMessage;
