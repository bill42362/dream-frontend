// ImageInputBox.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import MouseTracker from './MouseTracker.react.js';

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.onDrag = this.onDrag.bind(this);
    }
    onDrag(mouseState) {
        const { movePicture } = this.props;
        const { move } = mouseState;
        movePicture && movePicture({x: 0.5*move.x, y: 0.5*move.y});
    }
    render() {
        const { editorState, source, movePicture, style } = this.props;
        const { top, left, width, height } = editorState;
        return <div
            className='image-input-box'
            style={Object.assign({position: 'relative'}, style)}
        >
            <img style={{borderRadius: 60}} src={editorState.resultSource} />
            <div
                style={{
                    position: 'absolute', opacity: 0.5,
                    width: editorState.image.width,
                    height: editorState.image.height,
                    cursor: 'move',
                    top, left
                }}
            >
                <img style={{ width: '100%', height: '100%' }} src={editorState.image.src} />
                <MouseTracker onMouseDrag={this.onDrag} />
            </div>
            <div className='edit-button' role='button'>
                <span className='glyphicon glyphicon-camera'></span>
            </div>
        </div>;
    }
}

export default ImageInputBox;
