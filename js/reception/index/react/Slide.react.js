// Slide.react.js
'use strict'
import { Component } from 'react';
import ClassNames from 'classnames';
import ProjectSlide from './ProjectSlide.react.js';

class Slide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectIndex: 0, previousProjectIndex: 0,
            shouldDisplayPreviousProject: false,
            lastSwitchTime: 0,
        };
        this.switchToProjectIndex = this.switchToProjectIndex.bind(this);
        this.switchToNextProject = this.switchToNextProject.bind(this);
        this.switchToPreviousProject = this.switchToPreviousProject.bind(this);
    }
    switchToProjectIndex(index) {
        if(index != this.state.projectIndex) {
            this.setState({
                projectIndex: index,
                previousProjectIndex: this.state.projectIndex,
                shouldDisplayPreviousProject: true,
                lastSwitchTime: Date.now(),
            });
            window.setTimeout(() => {
                this.setState({shouldDisplayPreviousProject: false});
            }, 500);
        }
    }
    switchToNextProject() {
        const { projects } = this.props;
        const { projectIndex } = this.state;
        let nextProjectIndex = projectIndex + 1;
        if(nextProjectIndex >= projects.length) { nextProjectIndex = 0; }
        this.switchToProjectIndex(nextProjectIndex);
    }
    switchToPreviousProject() {
        const { projects } = this.props;
        const { projectIndex } = this.state;
        let previousProjectIndex = projectIndex - 1;
        if(0 > previousProjectIndex) { previousProjectIndex = projects.length - 1; }
        this.switchToProjectIndex(previousProjectIndex);
    }
    componentDidMount() {
        const { slideInterval } = this.props;
        this.intervalId = window.setInterval(() => {
            const { lastSwitchTime } = this.state;
            if(lastSwitchTime + slideInterval < Date.now()) {
                this.switchToNextProject();
            }
        }, slideInterval);
    }
    componentWillUnmount() { this.intervalId && window.clearInterval(this.intervalId); }
    render() {
        const { state, props } = this;
        const projects = props.projects;
        const project = projects[state.projectIndex] || {};
        const previousProject = projects[state.previousProjectIndex] || {};
        return <div id="slide" ref='base'>
            <div className="slide-swipe-zone swipe-left">
                <span
                    className="slide-swipe-icon glyphicon glyphicon-menu-left"
                    aria-label="previous slide"
                    onClick={this.switchToPreviousProject}
                ></span>
            </div>
            <div className='project-slide-container'><ProjectSlide project={project} /></div>
            {state.shouldDisplayPreviousProject && <div className='project-slide-container previous'>
                <ProjectSlide project={previousProject} />
            </div>}
            <div className="slide-swipe-zone swipe-right">
                <span
                    className="slide-swipe-icon glyphicon glyphicon-menu-right"
                    aria-label="next slide"
                    onClick={this.switchToNextProject}
                ></span>
            </div>
        </div>;
    }
}
module.exports = Slide;
