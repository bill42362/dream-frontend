// Slide.react.js
'use strict'
import ClassNames from 'classnames';

class Slide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialContentZoneTop: undefined,
            contentZoneTop: undefined,
            imageTop: 0,
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }
    onWindowScroll(e) {
        let baseTop = this.refs.base.getBoundingClientRect().top;

        let initialContentZoneTop = this.state.initialContentZoneTop;
        let contentZoneHeight = this.refs.contentZone.clientHeight;
        let baseHeight = this.refs.base.clientHeight;
        let maxContentZoneTop = baseHeight - contentZoneHeight;
        let newZoneTop = Math.min(initialContentZoneTop - 0.25*baseTop, maxContentZoneTop);

        let baseViewportPercent = 1 + (1 + baseTop)/baseHeight;
        let imageHeight = this.refs.image.clientHeight;
        let imageBottomOffset = imageHeight - baseHeight;
        let newImageTop = -imageBottomOffset*(1 - baseViewportPercent);
        this.setState({contentZoneTop: newZoneTop, imageTop: newImageTop});
    }
    componentDidMount() {
        document.addEventListener('scroll', this.onWindowScroll, false);
        let contentZoneTop = this.refs.contentZone.getBoundingClientRect().top;
        this.setState({initialContentZoneTop: contentZoneTop});
    }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        const project = this.props.project;
        return <div
            className="project-slide" ref='base'
            style={{height: '100%'}}
        >
            <div className='slide-image-container' style={{position: 'relative'}}>
                {project.bannerData && <img
                    className="slide-image" ref='image'
                    style={{position: 'absolute', top: this.state.imageTop}}
                    src={project.bannerData.src}
                />}
            </div>
            <div className="slide-content-zone-container">
                <div
                    className="slide-content-zone row" ref='contentZone'
                    style={{top: this.state.contentZoneTop}}
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
            </div>
        </div>;
    }
}
module.exports = Slide;
