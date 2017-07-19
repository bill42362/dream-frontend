// Slide.react.js
'use strict'
import { Component } from 'react';
import ClassNames from 'classnames';

class Slide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentZoneTop: '50%',
            imageTop: 0, imageLeft: 0,
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.updateImageLeft = this.updateImageLeft.bind(this);
    }
    updateContentZoneTop() {
        const baseRect = this.refs.base.getBoundingClientRect();
        const contentZoneRect = this.refs.contentZone.getBoundingClientRect();
        const maxContentZoneTop = baseRect.height - contentZoneRect.height - 15;
        const minContentZoneTop = Math.min(0.5*baseRect.height, maxContentZoneTop);
        const offsetRatio = Math.max(-baseRect.top/(baseRect.height - 50));
        const contentZoneTopRange = maxContentZoneTop - minContentZoneTop;
        const newZoneTop = Math.min(minContentZoneTop + offsetRatio*contentZoneTopRange, maxContentZoneTop);
        if(!+this.state.contentZoneTop || 1 < Math.abs(newZoneTop - this.state.contentZoneTop)) {
            this.setState({contentZoneTop: newZoneTop});
        }
    }
    updateImageTop() {
        if(this.refs.image) {
            const baseRect = this.refs.base.getBoundingClientRect();
            let baseViewportPercent = 1 + (1 + baseRect.top)/baseRect.height;
            let imageHeight = this.refs.image.clientHeight;
            let imageBottomOffset = imageHeight - baseRect.height;
            let newImageTop = -imageBottomOffset*(1 - baseViewportPercent);
            if(newImageTop != this.state.imageTop) { this.setState({imageTop: newImageTop}); }
        }
    }
    onWindowScroll(e) { this.updateContentZoneTop(); this.updateImageTop(); }
    updateImageLeft() {
        let imageContainerWidth = this.refs.imageContainer.getBoundingClientRect().width;
        let imageWidth = this.refs.image.clientWidth;
        let imageLeft = Math.floor(0.5*imageContainerWidth - 0.5*imageWidth);
        this.setState({imageLeft: imageLeft});
    }
    componentDidMount() {
        document.addEventListener('scroll', this.onWindowScroll, false);
        this.updateContentZoneTop();
        if(this.refs.image) { this.updateImageLeft(); }
    }
    componentDidUpdate() { this.updateContentZoneTop(); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        const {props, state} = this;
        const project = this.props.project;
        const leftSeconds = project.dueTimestamp - (Date.now()/1000);
        let leftDays = leftSeconds/86400;
        if(10 > leftDays) { leftDays = Math.round(10*leftDays)/10; }
        else { leftDays = Math.round(leftDays); }
        let projectButtonUrl = `/project?p=${project.id}`;
        if('outer' === project.type) { projectButtonUrl = project.relateUrl; }
        return <div className="project-slide" ref='base' >
            <div className='slide-image-container' ref='imageContainer' >
                {project.bannerData && <img
                    className="slide-image" ref='image'
                    style={{left: this.state.imageLeft, top: this.state.imageTop}}
                    src={project.bannerData.src}
                    onLoad={this.updateImageLeft}
                />}
            </div>
            <div
                className="slide-content-zone row" ref='contentZone'
                style={{top: this.state.contentZoneTop}}
            >
                <div className="slide-texts col-md-8" >
                    <h1 className='slide-texts-title'>{project.title || '...'}</h1>
                    <h3 className='slide-texts-subtitle'>
                        {project.subtitle || '...'}
                    </h3>
                    <h4 className='slide-texts-progress'>
                        <span className='left-days-label'>
                            <i className='fa fa-clock-o' aria-hidden='true'></i>
                            {(0 < leftSeconds) && ` 還剩 ${leftDays} 天`}
                            {(0 >= leftSeconds) && ` 募資結束`}
                        </span>
                        {!!+project.founderCount && <span className='funder-count-label' >
                            <i className='fa fa-user-circle-o' aria-hidden='true'></i>
                            {` ${project.founderCount} 人贊助`}
                        </span>}
                        {!!+project.currentFound && <span className='fund-target-label' >
                            <i className='fa fa-flag-checkered' aria-hidden='true'></i>
                            {
                                ` $${Core.addNumberComma(project.currentFound)} 
                                / $${Core.addNumberComma(project.foundTarget)}`
                            }
                        </span>}
                    </h4>
                </div>
                <div className="project-button-container col-md-4">
                    <a href={projectButtonUrl} >
                        <span className="project-button" role='button' >進一步了解</span>
                    </a>
                </div>
            </div>
        </div>;
    }
}
module.exports = Slide;
