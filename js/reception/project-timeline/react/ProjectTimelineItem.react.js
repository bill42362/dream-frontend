// ProjectTimelineItem.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTimelineItem extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            expended: false, shouldUpdateContentHeight: false,
            contentHeight: undefined, maxContentHeight: undefined,
        };
        this.switchExpending = this.switchExpending.bind(this);
    }
    updateContentHeight() {
        let contentHeight = '4em';
        if(this.state.expended) { contentHeight = this.state.maxContentHeight; }
        this.setState({contentHeight: contentHeight});
    }
    switchExpending() {
        let expended = !this.state.expended;
        this.setState({expended: expended, shouldUpdateContentHeight: true});
    }
    componentDidMount() {
        let maxContentHeight = this.refs.content.clientHeight + 'px';
        this.setState({maxContentHeight: maxContentHeight});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            expended: nextProps.shouldExpend,
            shouldUpdateContentHeight: true
        });
    }
    componentDidUpdate() {
        if(this.state.shouldUpdateContentHeight) {
            this.updateContentHeight();
            this.setState({shouldUpdateContentHeight: false});
        }
    }
    render() {
        let item = this.props.item;
        let image = item.image;
        return <div ref='base' className='project-timeline-item' >
            {image && <img
                className='project-timeline-item-image'
                src={image.src} title={image.title}
            ></img>}
            <h4 className='project-timeline-item-title'>{item.title}</h4>
            <div
                className='project-timeline-item-content' ref='content'
                style={{height: this.state.contentHeight}}
            >{item.content}</div>
            <div className='project-timeline-item-expend-button' onClick={this.switchExpending}>
                <span className='glyphicon glyphicon-plus'></span>
                看更多
            </div>
        </div>;
    }
}
module.exports = ProjectTimelineItem;
