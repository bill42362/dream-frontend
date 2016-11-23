// ProjectTimeline.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import ProjectTimelineItem from './ProjectTimelineItem.react.js';

class ProjectTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    componentDidMount() { }
    componentDidUpdate() { }
    render() {
        let items = this.props.timelineItems;
        let pairedItems = [], tempItems = JSON.parse(JSON.stringify(items));
        let i, j, chunk = 2;
        for(i = 0, j = tempItems.length; i < j; i += chunk) {
            pairedItems.push(tempItems.slice(i, i+chunk));
        }
        return <div ref='base' className='project-timeline' >
            {pairedItems.map((pairedItem, index) =>
                <div
                    className='project-timeline-pair'
                    key={index}
                >
                    <div className='project-timeline-item-container'>
                        <div className='project-timeline-item-wrapper'>
                            <ProjectTimelineItem item={pairedItem[0]} />
                            <div className='project-timeline-timelabel'>
                                <div className='project-timeline-timelabel-placeholder'></div>
                                <div className='project-timeline-timelabel-date'>
                                    <span className='glyphicon glyphicon-time'></span>
                                    date
                                </div>
                                <div className='project-timeline-timelabel-time'>time</div>
                            </div>
                        </div>
                    </div>
                    <div className='project-timeline-middle-line'></div>
                    <div className='project-timeline-item-container second'>
                        {pairedItem[1] && <div className='project-timeline-item-wrapper'>
                            <div className='project-timeline-timelabel'>
                                <div className='project-timeline-timelabel-placeholder'></div>
                                <div className='project-timeline-timelabel-date'>
                                    <span className='glyphicon glyphicon-time'></span>
                                    date
                                </div>
                                <div className='project-timeline-timelabel-time'>time</div>
                            </div>
                            <ProjectTimelineItem item={pairedItem[1]} />
                        </div>}
                    </div>
                </div>
            )}
        </div>;
    }
}
module.exports = ProjectTimeline;
