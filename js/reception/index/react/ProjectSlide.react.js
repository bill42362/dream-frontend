// Slide.react.js
'use strict'
import ClassNames from 'classnames';

class Slide extends React.Component {
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
        const project = this.props.project;
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
                    position: 'absolute',
                    top: this.state.contentZoneTop,
                    width: '60%', left: '20%',
                    color: 'white'
                }}
            >
                <div className="slide-texts col-md-8">
                    <h1>{project.title || '...'}</h1>
                    <h3>{project.subtitle || '...'}</h3>
                    <h4>倒數、達標、追蹤</h4>
                </div>
                <div className="project-button-container col-md-4">
                    <span className="project-button" role='button'>進一步了解</span>
                </div>
            </div>
        </div>;
    }
}
module.exports = Slide;
