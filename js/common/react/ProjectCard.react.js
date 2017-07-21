// ProjectCard.react.js
'use strict'
import ClassNames from 'classnames';

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageStyle: {position: 'absolute', top: '50%', left: '50%'},
        };
        this.onImageLoad = this.onImageLoad.bind(this);
    }
    updateImageStyle() {
        const state = this.state;
        const baseRect = this.refs.base.getBoundingClientRect();
        const imageSize = {width: this.refs.image.width, height: this.refs.image.height};
        const resizeFactor = Math.min(imageSize.width/baseRect.width, imageSize.height/baseRect.height) || 1;
        const newImageStyle = {
            marginTop: -0.5*imageSize.height/resizeFactor,
            marginLeft: -0.5*imageSize.width/resizeFactor,
            width: imageSize.width/resizeFactor,
            height: imageSize.height/resizeFactor,
        };
        let imageStyle = Object.assign({}, state.imageStyle);
        if(!!newImageStyle.height) { Object.assign(imageStyle, newImageStyle); }
        if(
            (Math.abs(1 - resizeFactor) > 0.01)
            || (Math.abs(state.marginTop - newImageStyle.marginTop) > 1)
            || (Math.abs(state.marginLeft - newImageStyle.marginLeft) > 1)
        ) { this.setState({imageStyle}); }
    }
    onImageLoad() { this.updateImageStyle(); }
    componentDidMount() { this.updateImageStyle(); }
    componentDidUpdate() { this.updateImageStyle(); }
    render() {
        const {props, state} = this;
        const project = this.props.project;
        const proposer = {title: 'pb+寶悍運動平台', src: '//www.pbplus.me/'};
        const leftSeconds = project.dueTimestamp - (Date.now()/1000);
        let leftDays = leftSeconds/86400;
        if(10 > leftDays) { leftDays = Math.round(10*leftDays)/10; }
        else { leftDays = Math.round(leftDays); }
        let href = `/project/${project.id}`;
        if('outer' === project.type) { href = project.relateUrl; }
        return <a className="project-card" href={href} ref='base'>
            <div className='ratio-fixer'>
                <img
                    className='project-banner' ref='image' style={state.imageStyle}
                    src={project.bannerData.src} title={project.bannerData.title}
                    onLoad={this.onImageLoad}
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
                            <span className='project-progress'>
                                {!!+project.currentFound && <span className='project-progress-text'>
                                    {`$${Core.addNumberComma(project.currentFound)}`}
                                    <span style={{margin: '0 0.5em', color: 'lightgray'}}>/</span>
                                    {`$${Core.addNumberComma(project.foundTarget)}`}
                                </span>}
                            </span>
                            {(0 < leftSeconds) && <span className='project-day-countdown'>{`還剩 ${leftDays} 天`}</span>}
                            {(0 >= leftSeconds) && <span className='project-day-countdown'>{`募資結束`}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </a>;
    }
}
module.exports = ProjectCard;
