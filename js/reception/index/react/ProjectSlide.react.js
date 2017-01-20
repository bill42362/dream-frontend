// Slide.react.js
'use strict'
import ClassNames from 'classnames';

class Slide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentZoneTop: '50%',
            imageTop: 0, imageLeft: 0,
            isProjectButtonHovered: false,
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
        let newZoneTop = Math.min(minContentZoneTop + offsetRatio*contentZoneTopRange, maxContentZoneTop);
        if(newZoneTop != this.state.contentZoneTop) { this.setState({contentZoneTop: newZoneTop}); }
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
        return <div className="project-slide" ref='base' style={{height: '100%'}} >
            <div
                className='slide-image-container' ref='imageContainer'
                style={{position: 'relative', height: '100%', backgroundColor: 'rgb(250, 130, 160)'}}
            >
                {project.bannerData && <img
                    className="slide-image" ref='image'
                    style={{
                        position: 'absolute',
                        left: this.state.imageLeft, top: this.state.imageTop,
                        width: '100%', minWidth: '800px'
                    }}
                    src={project.bannerData.src}
                    onLoad={this.updateImageLeft}
                />}
            </div>
            <div
                className="slide-content-zone row" ref='contentZone'
                style={{
                    position: 'absolute', width: '60%', left: '20%',
                    top: this.state.contentZoneTop
                }}
            >
                <div
                    className="slide-texts col-md-8"
                    style={{color: 'rgb(240, 240, 240)', textShadow: 'black 1px 1px 10px'}}
                >
                    <h1 style={{margin: '0em 0em 1em'}}>{project.title || '...'}</h1>
                    <h3 style={{margin: '0em 0em 3em'}}>{project.subtitle || '...'}</h3>
                    <h4>
                        <span className='left-days-label' style={{marginRight: '2em'}}>
                            <i className='fa fa-clock-o' aria-hidden='true'></i>
                            {(0 < leftSeconds) && ` 還剩 ${leftDays} 天`}
                            {(0 >= leftSeconds) && ` 募資結束`}
                        </span>
                        {!!+project.founderCount && <span
                            className='funder-count-label' style={{marginRight: '2em'}}
                        >
                            <i className='fa fa-user-circle-o' aria-hidden='true'></i>
                            {` ${project.founderCount} 人贊助`}
                        </span>}
                        {!!+project.currentFound && <span
                            className='fund-target-label' style={{marginRight: '2em'}}
                        >
                            <i className='fa fa-flag-checkered' aria-hidden='true'></i>
                            {
                                ` $${Core.addNumberComma(project.currentFound)} 
                                / $${Core.addNumberComma(project.foundTarget)}`
                            }
                        </span>}
                    </h4>
                </div>
                <div className="project-button-container col-md-4" style={{textAlign: 'center'}}>
                    <a href={projectButtonUrl} style={{textDecoration: 'none', color: 'white'}}>
                        <span
                            className="project-button" role='button'
                            style={Object.assign({
                                display: 'inline-block',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '0.5em',
                                padding: '1em 2em',
                                color: 'white',
                                fontWeight: '200',
                                transition: 'all .5s ease'
                            }, state.isProjectButtonHovered && {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                cursor: 'pointer',
                                color: 'rgb(250, 130, 160)'
                            })}
                            onMouseEnter={() => {this.setState({isProjectButtonHovered: true})}}
                            onMouseLeave={() => {this.setState({isProjectButtonHovered: false})}}
                        >進一步了解</span>
                    </a>
                </div>
            </div>
        </div>;
    }
}
module.exports = Slide;
