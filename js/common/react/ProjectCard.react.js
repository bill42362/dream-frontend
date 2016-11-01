// ProjectCard.react.js
'use strict'
import ClassNames from 'classnames';

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        let proposer = {title: 'pb+寶悍運動平台', src: '//www.pbplus.me/'};
        let banner = {src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg", title: '新城國小'};
        let projectData = {
            title: '世界十二強的愛 傳送溫暖至偏鄉',
            subtitle: 'pb+圓夢加舉辦了世界12強紀念套票拍賣活動，活動所得將全數捐給新城國小',
            description: '專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述',
            foundTarget: 500000, currentFound: 300000,
            startTimestamp: 1472869212136, dueTimestamp: 1478139612136,
            proposerId: 'proposerId', banner: 'bannerId',
        };
        let leftDays = (projectData.dueTimestamp - projectData.startTimestamp)/86400000;
        return <a className="project-card" href='/project.html' >
            <div className='ratio-fixer'>
                <img className='project-banner' {...banner} />
                <div className='project-content'>
                    <h4 className='project-title'>{projectData.title}</h4>
                    <div className='project-content-hover-texts'>
                        <h6 className='project-subtitle'>{projectData.subtitle}</h6>
                        <div className='project-description'>{projectData.description}</div>
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

