// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import ProjectHeader from '../../../common/react/ProjectHeader.react.js';
import ProjectTabbar from '../../../common/react/ProjectTabbar.react.js';
import ProjectStory from './ProjectStory.react.js';
import ProjectItem from '../../../common/react/ProjectItem.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            project: {}, stories: [], items: [], timelineItems: [], comments: [],
            pictures: {}, isTabbarAboveScreen: false
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onGetProjectSuccess = this.onGetProjectSuccess.bind(this);
        let searches = Core.getUrlSearches();
        if(!!searches.p && window.PBPlusDream) {
            PBPlusDream.getProject(searches.p, this.onAjaxError, this.onGetProjectSuccess);
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
            });
        } else {
            this.onAjaxError(response);
        }
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
                        {this.state.stories.map((story, index) => <ProjectStory
                            key={index}
                            story={story} picture={this.state.pictures[story.pictureId]}
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
