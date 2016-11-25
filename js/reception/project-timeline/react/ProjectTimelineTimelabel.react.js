// ProjectTimelineTimelabel.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTimelineTimelabel extends React.Component {
    constructor(props) {
        super(props);
        this.switchExpending = this.switchExpending.bind(this);
    }
    switchExpending() {
        if(this.props.onSwitchExpend) {
            this.props.onSwitchExpend(this.props.itemComponentId);
        }
    }
    render() {
        let item = this.props.item;
        return <div className='project-timeline-timelabel'>
            <div className='project-timeline-timelabel-placeholder'></div>
            <div className='project-timeline-timelabel-date'>
                <span className='glyphicon glyphicon-time'></span>
                <span className='year'>
                    {Core.getDateStringWithFormat(item.timestamp, 'YYYY')}
                </span>
                <span className='year-dash'>-</span>
                <span className='date'>
                    {Core.getDateStringWithFormat(item.timestamp, 'MM-DD')}
                </span>
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
            <div
                className='project-timeline-timelabel-expend-button'
                onClick={this.switchExpending}
            >
                <span className='glyphicon glyphicon-plus'></span>
                更多
            </div>
        </div>;
    }
}
module.exports = ProjectTimelineTimelabel;
