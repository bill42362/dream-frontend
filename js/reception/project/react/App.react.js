// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import ProjectHeader from '../../../common/react/ProjectHeader.react.js';
import ProjectTabbar from '../../../common/react/ProjectTabbar.react.js';
import ProjectStory from './ProjectStory.react.js';
import ProjectItem from '../../../common/react/ProjectItem.react.js';
import ConnectedFooter from '../../../common/react/ConnectedFooter.react.js';

const ConnectedHeader = connect(
    state => { return {
        headerNavs: state.navigations.header || [],
    }; },
    dispatch => ({ })
)(Header);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            project: {}, stories: [], items: [], timelineItems: [], comments: [], newsfeeds: [],
            pictures: {}, userProfiles: {}, isTabbarAboveScreen: false
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onGetProjectSuccess = this.onGetProjectSuccess.bind(this);
        this.onReadUserProfilesSuccess = this.onReadUserProfilesSuccess.bind(this);
        this.onReadNewsfeedSuccess = this.onReadNewsfeedSuccess.bind(this);
        if(window.PBPlusDream) {
            let projectId = PBPlusDream.getProjectIdFromUrl();
            PBPlusDream.getProject(projectId, this.onAjaxError, this.onGetProjectSuccess);
            PBPlusDream.readNewsfeed(projectId, undefined, this.onReadNewsfeedSuccess);
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
    onReadNewsfeedSuccess(newsfeeds = []) {
        const userProfiles = this.state.userProfiles;
        const oldNewsfeeds = this.state.newsfeeds;
        oldNewsfeeds.forEach(oldNewsfeed => {
            const existedNewsFeed = newsfeeds.filter(newsfeed => { return oldNewsfeeds.id === newsfeeds.id; })[0];
            if(!existedNewsFeed) { newsfeeds.push(oldNewsfeed); }
        });
        const noProfileNewsfeeds = newsfeeds.filter(newsfeed => {
            return !userProfiles[newsfeed.userPK];
        });
        if(0 < noProfileNewsfeeds.length) {
            let userPKs = noProfileNewsfeeds.map(noProfileNewsfeed => { return noProfileNewsfeed.userPK; });
            PBPlusDream.readProfiles(userPKs, undefined, this.onReadUserProfilesSuccess);
        }
        this.setState({newsfeeds});
    }
    onReadUserProfilesSuccess(profiles = []) {
        let stateUserProfiles = this.state.userProfiles;
        profiles.forEach(profile => { stateUserProfiles[profile.userPK] = profile; });
        this.setState({userProfiles: stateUserProfiles});
    }
    onAjaxError(xhr) {
        let networkError = '網路錯誤，請檢查您的網路，或稍候再試一次。<br />'
            + 'Network error, please check your network, or try again later.';
        let systemError = '系統錯誤，請稍候再試一次。<br />System error, please try again later.';
        var errorStrings = this.staticStrings.errors;
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
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        const state = this.state;
        const project = state.project;
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
        tabs.push({
            key: 'comment', display: '訊息回應',
            count: state.comments.length, href: '/message?p=' + state.project.id
        });
        return <div id='wrapper'>
            <ConnectedHeader fixed={false} iconSrc='/img/brand_icon_black.png' />
            <ProjectHeader
                project={this.state.project} banner={this.state.pictures[this.state.project.bannerId]}
                newsfeeds={state.newsfeeds} userProfiles={state.userProfiles}
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
                        {this.state.stories.map((story, index) => <ProjectStory
                            key={index}
                            story={story} picture={this.state.pictures[story.pictureId]}
                        />)}
                    </div>
                    <div className='col-md-4'>
                        {this.state.items.map((item, index) => <ProjectItem
                            key={index} isProjectFinished={Date.now()/1000 > project.dueTimestamp}
                            item={item} picture={this.state.pictures[item.pictureId]}
                        />)}
                    </div>
                </div>
            </div>
            <ConnectedFooter />
        </div>;
    }
}
module.exports = App;
