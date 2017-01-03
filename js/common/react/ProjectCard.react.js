// ProjectCard.react.js
'use strict'
import ClassNames from 'classnames';

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        const project = this.props.project;
        let proposer = {title: 'pb+寶悍運動平台', src: '//www.pbplus.me/'};
        let leftDays = (project.dueTimestamp - project.startTimestamp)/86400000;
        return <a className="project-card" href={`/project/${project.id}`} >
            <div className='ratio-fixer'>
                <img
                    className='project-banner'
                    src={project.bannerData.src} title={project.bannerData.title}
                />
                <div className='project-content'>
                    <h4 className='project-title'>{project.title}</h4>
                    <div className='project-content-hover-texts'>
                        <h6 className='project-subtitle'>{project.subtitle}</h6>
                        <div className='project-description'>{project.description}</div>
                    </div>
                    <div className='project-content-footer'>
                        <div className='project-progress-line'> ---------- </div>
                        <div className='project-content-footer-texts'>
                            <span className='project-proposer'>{proposer.title}</span>
                            <span className='project-follower'>追蹤一個很長的字串</span>
                            <span className='project-day-countdown'>還剩 {leftDays} 天</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>;
    }
}
module.exports = ProjectCard;

