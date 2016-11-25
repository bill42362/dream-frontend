// ProjectTimelineTimelabel.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTimelineTimelabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { top: '0px' };
        this.switchExpending = this.switchExpending.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }
    switchExpending() {
        if(this.props.onSwitchExpend) {
            this.props.onSwitchExpend(this.props.itemComponentId);
        }
    }
    getNewTop(offset) {
        let baseRect = this.refs.base.getBoundingClientRect();
        let baseHeight = this.refs.base.clientHeight;
        let placeholderHeight = this.refs.placeholder.clientHeight;
        let textsHeight = this.refs.texts.clientHeight;
        let maxTop = baseHeight - textsHeight - placeholderHeight;
        return Math.min(-offset - baseRect.top - placeholderHeight, maxTop) + 'px';
    }
    isAboveScreenTop(element, offset, checkBottom) {
        let clientRect = element.getBoundingClientRect();
        if(checkBottom) { return 0 > clientRect.bottom + offset; }
        return 0 > clientRect.top + offset;
    }
    onWindowScroll(e) {
        let top = this.state.top;
        let isTopAboveScreen = this.isAboveScreenTop(this.refs.base, -53);
        if(!!this.refs.placeholder.clientHeight) {
            isTopAboveScreen = this.isAboveScreenTop(this.refs.placeholder, -53, true);
        }
        let isBottomAboveScreen = this.isAboveScreenTop(this.refs.base, -53, true);
        let shouldFixTop = isTopAboveScreen && !isBottomAboveScreen;
        if(shouldFixTop) {
            let newTop = this.getNewTop(-58);
            if(top != newTop) { this.setState({top: newTop}); }
        } else if('0px' != top) { this.setState({top: '0px'}); }
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        let item = this.props.item;
        return <div className='project-timeline-timelabel' ref='base'>
            <div className='project-timeline-timelabel-placeholder' ref='placeholder'></div>
            <div className='project-timeline-timelabel-texts' ref='texts' style={{top: this.state.top}}>
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
            </div>
        </div>;
    }
}
module.exports = ProjectTimelineTimelabel;
