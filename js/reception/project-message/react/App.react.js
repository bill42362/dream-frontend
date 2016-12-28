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
            project: {}, stories: [], items: [], timelineItems: [], comments: [],
            message: '', replyMessage: '', replyMessageIndex: -1,
            userSapId: '', userProfiles: {}, pictures: {}, isTabbarAboveScreen: false,
        };
        this.createMessage = this.createMessage.bind(this);
        this.replyMessage = this.replyMessage.bind(this);
        this.noMessageAlert = this.noMessageAlert.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.onReplyMessageChange = this.onReplyMessageChange.bind(this);
        this.onGetProjectSuccess = this.onGetProjectSuccess.bind(this);
        this.onPostMessageSuccess = this.onPostMessageSuccess.bind(this);
        this.onGetUserSapIdSuccess = this.onGetUserSapIdSuccess.bind(this);
        this.onReadUserProfilesSuccess = this.onReadUserProfilesSuccess.bind(this);
        if(window.PBPlusDream) {
            let projectId = PBPlusDream.getProjectIdFromUrl();
            PBPlusDream.getProject(projectId, this.onAjaxError, this.onGetProjectSuccess);
            this.state.userSapId = PBPlusDream.userSapId;
            if(!PBPlusDream.userSapId) {
                PBPlusDream.getUserSapId(undefined, this.onGetUserSapIdSuccess);
            } else {
                PBPlusDream.readProfiles([PBPlusDream.userSapId], undefined, this.onReadUserProfilesSuccess);
            }
        }
    }
    isAboveScreenTop(element, offset) {
        var clientRect = element.getBoundingClientRect();
        return 0 > clientRect.top + offset;
    }
    cachePicture(pictureData) {
        var pictures = this.state.pictures;
        if(pictureData.id) { pictures[pictureData.id] = pictureData; }
        this.setState({pictures: pictures});
    }
    noMessageAlert() {
        let state = this.state;
        if(!state.userSapId) {
            Toastr.warning('請先登入後再留言。');
            this.setState({replyMessage: '', replyMessageIndex: -1});
            document.activeElement.blur();
        } else {
            let userProfile = state.userProfiles[state.userSapId];
            if(userProfile && !userProfile.nickname) {
                Toastr.warning('請先設定暱稱後再留言。');
                this.setState({replyMessage: '', replyMessageIndex: -1});
                document.activeElement.blur();
            }
        }
    }
    onGetProjectSuccess(response) {
        if(200 === response.status) {
            var project = response.message[0];
            this.cachePicture(project.bannerData);
            response.stories.forEach(function(story) {
                this.cachePicture(story.pictureData);
            }.bind(this));
            response.items.forEach(function(item) {
                this.cachePicture(item.pictureData);
            }.bind(this));
            response.timelineItems.forEach(function(timelineItem) {
                this.cachePicture(timelineItem.pictureData);
            }.bind(this));
            let messageUserSapIds = response.messages.map(function(message) {
                return message.body.authorId;
            });
            response.messages.forEach(function(message) {
                if(message.body.replies) {
                    messageUserSapIds = messageUserSapIds.concat(message.body.replies.map(
                        function(reply) { return reply.authorId; }
                    ));
                }
            });
            messageUserSapIds = [...new Set(messageUserSapIds)]; // Get unique items.
            PBPlusDream.readProfiles(messageUserSapIds, undefined, this.onReadUserProfilesSuccess);
            this.setState({
                project: project,
                stories: response.stories,
                items: response.items,
                timelineItems: response.timelineItems,
                comments: response.messages,
            });
        } else {
            this.onAjaxError(response);
        }
    }
    onGetUserSapIdSuccess(sapId) {
        if(sapId) { PBPlusDream.readProfiles([sapId], undefined, this.onReadUserProfilesSuccess); }
        this.setState({userSapId: sapId});
    }
    onReadUserProfilesSuccess(profiles) {
        let stateUserProfiles = this.state.userProfiles;
        profiles.forEach(profile => { stateUserProfiles[profile.userPK] = profile; });
        this.setState({userProfiles: stateUserProfiles});
    }
    onAjaxError(xhr) {
        let networkError = '網路錯誤，請檢查您的網路，或稍候再試一次。<br />'
            + 'Network error, please check your network, or try again later.';
        let systemError = '系統錯誤，請稍候再試一次。<br />System error, please try again later.';
        if(!xhr.message) {
            Toastr['error'](networkError);
        } else if(/[45]\d\d/.test(xhr.status)) {
            Toastr['error'](xhr.status + ' "' + xhr.message + '"<br />' + systemError);
        } else {
            Toastr['warning'](xhr.status + xhr.message);
        }
    }
    onWindowScroll(e) {
        var isTabbarAboveScreen = this.state.isTabbarAboveScreen;
        var newValue = this.isAboveScreenTop(this.refs.projectTabbarContainerAnchor, 0);
        if(isTabbarAboveScreen != newValue) { this.setState({isTabbarAboveScreen: newValue}); }
    }
    onMessageChange() { this.setState({message: this.refs.messageBox.getValue()}); }
    onReplyMessageChange(message, index) {
        this.setState({replyMessage: message, replyMessageIndex: index});
    }
    createMessage(message) {
        if(window.PBPlusDream) {
            PBPlusDream.createMessage(
                message, this.state.project.id,
                this.onAjaxError, this.onPostMessageSuccess
            );
        }
    }
    replyMessage(replyMessage, messageUuid) {
        if(window.PBPlusDream) {
            PBPlusDream.replyMessage(
                replyMessage, messageUuid, this.state.project.id,
                this.onAjaxError, this.onPostMessageSuccess
            );
        }
    }
    onPostMessageSuccess(response) {
        if(200 === response.status) {
            Toastr['success']('留言成功');
            PBPlusDream.getProject(this.state.project.id, this.onAjaxError, this.onGetProjectSuccess);
        } else {
            this.onAjaxError(response);
        }
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        const state = this.state;
        let tabs = [];
        tabs.push(
            {key: 'story', display: '專案故事', count: 0, href: '/project?p=' + state.project.id}
        );
        if(state.timelineItems.length) {
            tabs.push({
                key: 'timeline', display: '專案進度',
                count: state.timelineItems.length, href: '/timeline?p=' + state.project.id
            });
        }
        if(state.comments.length) {
            tabs.push({
                key: 'comment', display: '訊息回應',
                count: state.comments.length, href: '/message?p=' + state.project.id
            });
        }
        let userImageSrc = '', userNickname = '';
        if(state.userSapId && state.userProfiles[state.userSapId]) {
            userImageSrc = state.userProfiles[state.userSapId].src;
            userNickname = state.userProfiles[state.userSapId].nickname;
        }
        return <div id='wrapper'>
            <Header fixed={false} />
            <ProjectHeader
                project={this.state.project} banner={this.state.pictures[this.state.project.bannerId]}
            />
            <div
                ref='projectTabbarContainerAnchor'
                className={ClassNames(
                    'project-tabbar-container-anchor',
                    {'above-screen': this.state.isTabbarAboveScreen}
                )}
            >
                <div className='project-tabbar-container' >
                    <ProjectTabbar tabs={tabs} />
                </div>
            </div>
            <div className='project-content-container'>
                <div className='project-content row'>
                    <div className='col-md-8'>
                        <ProjectMessageBox
                            ref='messageBox'
                            author={userNickname} authorImageSrc={userImageSrc}
                            message={this.state.message} onChange={this.onMessageChange}
                            onSubmit={this.createMessage} onFocus={this.noMessageAlert}
                            shouldAutoFocus={!!userNickname}
                        />
                        {state.comments.map((comment, index) => <ProjectMessage
                            message={comment.body} index={index} key={index} uuid={comment.uuid}
                            userProfiles={state.userProfiles}
                            shouldHideReplyBox={index !== state.replyMessageIndex}
                            userNickname={userNickname} userImageSrc={userImageSrc}
                            replyMessage={index === state.replyMessageIndex ? state.replyMessage : ''}
                            onReplyChange={this.onReplyMessageChange} onSubmit={this.replyMessage}
                            noMessageAlert={this.noMessageAlert}
                        />)}
                    </div>
                    <div className='col-md-4'>
                        {this.state.items.map((item, index) => <ProjectItem
                            key={index}
                            item={item} picture={this.state.pictures[item.pictureId]}
                        />)}
                    </div>
                </div>
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;
