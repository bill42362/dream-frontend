// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import Slide from './Slide.react.js';
import Carousel from './Carousel.react.js';
import ProjectCard from '../../../common/react/ProjectCard.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { projects: [], headerOnTop: true };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.onGetProjectsSuccess = this.onGetProjectsSuccess.bind(this);
        if(window.PBPlusDream) {
            PBPlusDream.getProjects(
                undefined, undefined, undefined,
                this.onAjaxError, this.onGetProjectsSuccess
            );
        }
    }
    onWindowScroll(e) {
        let baseTop = this.refs.base.getBoundingClientRect().top;
        let headerOnTop = -5 < baseTop;
        this.setState({headerOnTop: headerOnTop});
    }
    onGetProjectsSuccess(projects) { console.table(projects); this.setState({projects: projects}); }
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
        let state = this.state;
        return <div id='wrapper' ref='base'>
            <Header fixed={true} isOnTop={this.state.headerOnTop} />
            <Slide />
            <Carousel />
            <div className='project-cards row'>
                {state.projects.map((project, index) => {
                    return <div className='col-sm-4' key={index}>
                        <ProjectCard project={project} />
                    </div>;
                })}
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;
