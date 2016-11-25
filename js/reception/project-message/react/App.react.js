// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import ProjectHeader from '../../../common/react/ProjectHeader.react.js';
import ProjectTabbar from '../../../common/react/ProjectTabbar.react.js';
import ProjectMessageBox from './ProjectMessageBox.react.js';
import ProjectMessage from './ProjectMessage.react.js';
import ProjectItem from '../../../common/react/ProjectItem.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            message: '',
            replyMessages: [],
            isTabbarAboveScreen: false,
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onMessagesChange = this.onMessagesChange.bind(this);
    }
    isAboveScreenTop(element, offset) {
        var clientRect = element.getBoundingClientRect();
        return 0 > clientRect.top + offset;
    }
    onWindowScroll(e) {
        var isTabbarAboveScreen = this.state.isTabbarAboveScreen;
        var newValue = this.isAboveScreenTop(this.refs.projectTabbarContainerAnchor, 0);
        if(isTabbarAboveScreen != newValue) { this.setState({isTabbarAboveScreen: newValue}); }
    }
    onMessagesChange() {
        let replyMessages = [];
        for(let key in this.refs) {
            if(0 === key.indexOf('projectMessage-')) {
                let index = +key.replace('projectMessage-', '');
                replyMessages[index] = this.refs[key].getReplyMessage();
            }
        }
        this.setState({message: this.refs.messageBox.getValue(), replyMessages: replyMessages});
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        let proposer = {title: 'pb+寶悍運動平台', href: '//www.pbplus.me/'};
        let banner = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        let projectFullData = {
            title: '世界十二強的愛 傳送溫暖至偏鄉',
            subtitle: 'pb+圓夢加舉辦了世界12強紀念套票拍賣活動 活動所得將全數捐給新城國小',
            description: '專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述',
            foundTarget: 500000, currentFound: 300000,
            startTimestamp: 1472869212136, dueTimestamp: 1478139612136,
            proposerId: 'proposerId', banner: 'bannerId',
        };
        let content = '留言內容留言內容留言內容留言內容留言內容留言內容留言內容留言內容留言內容留言內容';
        let message = {
            timestamp: 1479367134309,
            content: content + content + content,
            author: '留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者',
            authorImageSrc: '/img/mock_user_icon.jpg',
            replies: [
                {
                    timestamp: 1479367134309,
                    content: content + content + content,
                    author: '留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者留言者',
                    authorImageSrc: '/img/mock_user_icon.jpg',
                    replies: [],
                },
                {
                    timestamp: 1479367134309,
                    content: content + content + content,
                    author: '留言者留言者',
                    authorImageSrc: '/img/mock_user_icon.jpg',
                    replies: [],
                },
            ],
        };
        return <div id='wrapper'>
            <Header fixed={false} />
            <ProjectHeader
                projectData={projectFullData} proposer={proposer} banner={banner}
            />
            <div
                ref='projectTabbarContainerAnchor'
                className={ClassNames(
                    'project-tabbar-container-anchor',
                    {'above-screen': this.state.isTabbarAboveScreen}
                )}
            >
                <div className='project-tabbar-container' >
                    <ProjectTabbar />
                </div>
            </div>
            <div className='project-content-container'>
                <div className='project-content row'>
                    <div className='col-md-8'>
                        <ProjectMessageBox
                            ref='messageBox'
                            author={message.author} authorImageSrc={message.authorImageSrc}
                            message={this.state.message} onChange={this.onMessagesChange}
                        />
                        <ProjectMessage
                            ref='projectMessage-0'
                            message={message}
                            replyMessage={this.state.replyMessages[0]}
                            onReplyChange={this.onMessagesChange}
                        />
                        <ProjectMessage
                            ref='projectMessage-1'
                            message={message}
                            replyMessage={this.state.replyMessages[1]}
                            onReplyChange={this.onMessagesChange}
                        />
                    </div>
                    <div className='col-md-4'>
                        <ProjectItem />
                        <ProjectItem />
                        <ProjectItem />
                    </div>
                </div>
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;