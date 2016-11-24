// ProjectTimelineTimelabel.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTimelineTimelabel extends React.Component {
    constructor(props) { super(props); }
    render() {
        let item = this.props.item;
        return <div className='project-timeline-timelabel'>
            <div className='project-timeline-timelabel-placeholder'></div>
            <div className='project-timeline-timelabel-date'>
                <span className='glyphicon glyphicon-time'></span>
                {Core.getDateStringWithFormat(item.timestamp, 'YYYY-MM-DD')}
            </div>
            <div className={ClassNames(
                'project-timeline-timelabel-pointer'
                , {'with-image': !!item.image}
            )}>
                <div className='project-timeline-timelabel-circle'>
                    <div className='project-timeline-timelabel-innercircle'></div>
                </div>
                <div className='project-timeline-timelabel-line'></div>
            </div>
            <div className='project-timeline-timelabel-time'>
                {Core.getDateStringWithFormat(item.timestamp, 'hh:mm:ss')}
            </div>
        </div>;
    }
}
module.exports = ProjectTimelineTimelabel;
