// Slide.react.js
'use strict'
import ClassNames from 'classnames';
import ProjectSlide from './ProjectSlide.react.js';

class Slide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectIndex: 0, previousProjectIndex: 0,
            shouldDisplayPreviousProject: false
        };
        this.switchToProjectIndex = this.switchToProjectIndex.bind(this);
        this.switchToNextProject = this.switchToNextProject.bind(this);
    }
    switchToProjectIndex(index) {
        if(index != this.state.projectIndex) {
            this.setState({
                projectIndex: index,
                previousProjectIndex: this.state.projectIndex,
                shouldDisplayPreviousProject: true
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
    componentDidMount() {
        this.intervalId = window.setInterval(this.switchToNextProject, this.props.slideInterval);
    }
    componentWillUnmount() { this.intervalId && window.clearInterval(this.intervalId); }
    render() {
        const {state, props} = this;
        const projects = props.projects;
        let project = projects[state.projectIndex] || {};
        let previousProject = projects[state.previousProjectIndex] || {};
        let previousProjectIndex = state.projectIndex - 1;
        if(previousProjectIndex < 0) { previousProjectIndex = projects.length - 1; }
        return <div id="slide" ref='base'>
            <div className="slide-swipe-zone swipe-left">
                <span
                    className="slide-swipe-icon glyphicon glyphicon-menu-left"
                    aria-label="previous slide"
                    onClick={this.switchToNextProject}
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
                    onClick={() => { this.switchToProjectIndex(nextProjectIndex); }}
                ></span>
            </div>
        </div>;
    }
}
module.exports = Slide;
