// ProjectStory.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectStory extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { expended: true, maxHeight: '', shouldUpdateMaxHeight: false};
        this.onImageLoad = this.onImageLoad.bind(this);
        this.switchExpending = this.switchExpending.bind(this);
    }
    computeMaxHeight() {
        let paddingHeight = 20;
        let maxHeight = this.refs.title.clientHeight + paddingHeight + 'px';
        if(this.state.expended) { maxHeight = this.refs.body.clientHeight + paddingHeight + 'px'; }
        return maxHeight;
    }
    switchExpending() {
        let expended = !this.state.expended;
        this.setState({expended: expended, shouldUpdateMaxHeight: true});
    }
    onImageLoad() { this.setState({shouldUpdateMaxHeight: true}); }
    componentDidMount() { this.setState({shouldUpdateMaxHeight: true}); }
    componentDidUpdate() {
        if(this.state.shouldUpdateMaxHeight) {
            this.setState({maxHeight: this.computeMaxHeight(), shouldUpdateMaxHeight: false});
        }
    }
    render() {
        let expended = this.state.expended;
        let story = { title: '...', description: '...', };
        story = Object.assign(story, this.props.story);
        let media = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        media = Object.assign(media, this.props.picture, this.props.video);
        return <div
            ref='base'
            className={ClassNames('project-story-container', {'expended': this.state.expended})}
            style={{maxHeight: this.state.maxHeight}}
        >
            <span
                className='project-story-expending-button glyphicon glyphicon-remove-circle'
                aria-hidden='true' onClick={this.switchExpending}
            ></span>
            <div ref='body' className='project-story'>
                <h2 ref='title' className='project-story-title'>{story.title}</h2>
                <div className='project-story-content'>
                    <p>{story.description}</p>
                    <img src={media.src} title={media.title} onLoad={this.onImageLoad} />
                </div>
            </div>
        </div>;
    }
}
module.exports = ProjectStory;
