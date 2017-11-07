// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ClassNames from 'classnames';
import PbplusMemberCenter from 'pbplus-member-sdk';
import Auth from '../../../common/core/Auth.js';
import Header from '../../../common/react/Header.react.js';
import Slide from './Slide.react.js';
import Carousel from '../../../common/react/Carousel.react.js';
import ProjectCard from '../../../common/react/ProjectCard.react.js';
import ConnectedFooter from '../../../common/react/ConnectedFooter.react.js';

const ConnectedHeader = connect(
    state => { return {
        headerNavs: state.navigations.header || [],
        loginEndpoint: `${state.auth.loginEndpoint}&token_id=${state.pbplusMemberCenter.userUuid}`,
        isUserLoggedIn: state.auth.isUserLoggedIn,
    }; },
    dispatch => ({
        logout: () => {
            dispatch(PbplusMemberCenter.Actions.renewUserUUID());
            dispatch(Auth.Actions.updateIsUserLoggedIn({isUserLoggedIn: false}));
        },
        displayPbplusMemberCenter: () => dispatch(PbplusMemberCenter.Actions.display()),
    })
)(Header);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { projects: [], newsfeeds: [], userProfiles: {}, headerOnTop: true };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onGetProjectsSuccess = this.onGetProjectsSuccess.bind(this);
        this.onReadUserProfilesSuccess = this.onReadUserProfilesSuccess.bind(this);
        this.onReadNewsfeedSuccess = this.onReadNewsfeedSuccess.bind(this);
        if(window.PBPlusDream) {
            PBPlusDream.getProjects(
                undefined, undefined, undefined,
                this.onAjaxError, this.onGetProjectsSuccess
            );
            PBPlusDream.readNewsfeed(undefined, undefined, this.onReadNewsfeedSuccess);
        }
    }
    onWindowScroll(e) {
        let baseTop = this.refs.base.getBoundingClientRect().top;
        let headerOnTop = -5 < baseTop;
        this.setState({headerOnTop: headerOnTop});
    }
    onGetProjectsSuccess(projects) { this.setState({projects: projects}); }
    onReadNewsfeedSuccess(newsfeeds = []) {
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
        if(!xhr.message) {
            Toastr['error'](networkError);
        } else if(/5\d\d/.test(xhr.status)) {
            Toastr['error'](xhr.status + ' "' + xhr.message + '"<br />' + systemError);
        } else {
            Toastr['warning'](xhr.status + ', ' + xhr.message);
        }
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        const { projects, newsfeeds, userProfiles, headerOnTop } = this.state;
        const slideStates = projects.filter(project => { return -1 != project.positions.indexOf('slide'); });
        const listStates = projects.filter(project => { return -1 != project.positions.indexOf('list'); });
        return <div id='wrapper' ref='base'>
            <ConnectedHeader fixed={true} isOnTop={headerOnTop} iconSrc='/img/brand_icon_white.png' />
            <Slide projects={slideStates} slideInterval={5000} />
            <Carousel newsfeeds={newsfeeds} />
            <div className='project-cards row'>
                {listStates.map((project, index) => {
                    return <div className='col-sm-4' key={index}>
                        <ProjectCard project={project} />
                    </div>;
                })}
            </div>
            <ConnectedFooter />
            <div className='pbplus-member-center-container'>
                <PbplusMemberCenter.Container />
            </div>
        </div>;
    }
}
module.exports = App;
