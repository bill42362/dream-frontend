// Slide.react.js
'use strict'
import ClassNames from 'classnames';

class Slide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialContentZoneTop: undefined,
            contentZoneTop: undefined,
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }
    onWindowScroll(e) {
        let baseTop = this.refs.base.getBoundingClientRect().top;
        let initialContentZoneTop = this.state.initialContentZoneTop;
        let contentZoneHeight = this.refs.contentZone.clientHeight;
        let baseHeight = this.refs.base.clientHeight;
        let maxContentZoneTop = baseHeight - contentZoneHeight;
        let newZoneTop = Math.min(initialContentZoneTop - 0.5*baseTop, maxContentZoneTop);
        this.setState({contentZoneTop: newZoneTop});
    }
    componentDidMount() {
        document.addEventListener('scroll', this.onWindowScroll, false);
        let contentZoneTop = this.refs.contentZone.getBoundingClientRect().top;
        this.setState({initialContentZoneTop: contentZoneTop});
    }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        return <div id="slide" ref='base'>
            <img className="slide-image" src="http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg"/>
            <div className="slide-swipe-zone">
                <span
                    className="slide-swipe-icon swipe-left glyphicon glyphicon-menu-left"
                    aria-label="previous slide"
                ></span>
            </div>
            <div className="slide-content-zone-container">
                <div
                    className="slide-content-zone row" ref='contentZone'
                    style={{top: this.state.contentZoneTop}}
                >
                    <div className="slide-texts col-md-8">
                        <h1>世界十二強的愛 傳送溫暖至偏鄉</h1>
                        <h3>
                            pb<sup>+</sup>
                            圓夢加在看到之後便決定舉辦了一個拍賣世界12強紀念套票的活動，並將活動費用所得全數捐助給新城國小
                        </h3>
                        <h4>倒數、達標、追蹤</h4>
                    </div>
                    <div className="project-button-container col-md-4">
                        <span className="project-button">進一步了解</span>
                    </div>
                </div>
            </div>
            <div className="slide-swipe-zone">
                <span
                    className="slide-swipe-icon swipe-right glyphicon glyphicon-menu-right"
                    aria-label="next slide"
                ></span>
            </div>
        </div>;
    }
}
module.exports = Slide;

