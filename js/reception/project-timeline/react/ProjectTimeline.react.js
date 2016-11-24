// ProjectTimeline.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import ProjectTimelineTimelabel from './ProjectTimelineTimelabel.react.js';
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
            <div className='project-timeline-header'>
                <div className='project-timeline-header-start-time'>
                    {Core.getDateStringWithFormat(this.props.startTimestamp, 'YYYY-MM-DD hh:mm:ss')}
                </div>
                專案開始
            </div>
            {pairedItems.map((pairedItem, index) =>
                <div
                    className='project-timeline-pair'
                    key={index}
                >
                    <div className='project-timeline-item-container'>
                        <div className='project-timeline-item-wrapper'>
                            <ProjectTimelineItem item={pairedItem[0]} />
                            <ProjectTimelineTimelabel item={pairedItem[0]} />
                        </div>
                    </div>
                    <div className='project-timeline-middle-line'></div>
                    <div className='project-timeline-item-container second'>
                        {pairedItem[1] && <div className='project-timeline-item-wrapper'>
                            <ProjectTimelineTimelabel item={pairedItem[1]} />
                            <ProjectTimelineItem item={pairedItem[1]} />
                        </div>}
                    </div>
                </div>
            )}
        </div>;
    }
}
module.exports = ProjectTimeline;
