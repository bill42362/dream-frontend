// ImageInputBox.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import MouseTracker from './MouseTracker.react.js';

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseCursor: 'move'};
        this.onDrag = this.onDrag.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }
    checkMouseOnEdge({ x, y }, element) {
        const offset = 10;
        const { width, height } = element.getBoundingClientRect();
        return {
            isOnLeft: offset > x, isOnRight: offset > width - x,
            isOnTop: offset > y, isOnBottom: offset > height - y,
        };
    }
    onMouseMove(mouseState) {
        const { isOnLeft, isOnRight, isOnTop, isOnBottom }
            = this.checkMouseOnEdge(mouseState.axis, this.refs.fullViewContainer);
        let mouseCursor = 'move';
        if(isOnLeft || isOnRight) { mouseCursor = 'ew-resize'; }
        if(isOnTop || isOnBottom) { mouseCursor = 'ns-resize'; }
        if((isOnLeft && isOnTop) || (isOnRight && isOnBottom)) { mouseCursor = 'nwse-resize'; }
        else if((isOnLeft && isOnBottom) || (isOnRight && isOnTop)) { mouseCursor = 'nesw-resize'; }
        if(mouseCursor != this.state.mouseCursor) { this.setState({ mouseCursor }); }
    }
    onDrag(mouseState) {
        const { movePicture } = this.props;
        const { move } = mouseState;
        movePicture && movePicture({x: 0.5*move.x, y: 0.5*move.y});
    }
    render() {
        const { mouseCursor } = this.state;
        const { editorState, source, movePicture, style } = this.props;
        const { top, left, width, height } = editorState;
        return <div
            className='image-input-box'
            style={Object.assign({position: 'relative'}, style)}
        >
            <img style={{borderRadius: 60}} src={editorState.resultSource} />
            <div
                ref='fullViewContainer'
                style={{
                    position: 'absolute', opacity: 0.5,
                    border: '2px dashed darkgray',
                    width: editorState.image.width,
                    height: editorState.image.height,
                    cursor: mouseCursor,
                    top, left
                }}
            >
                <img style={{ width: '100%', height: '100%' }} src={editorState.image.src} />
                <MouseTracker onMouseDrag={this.onDrag} onMouseMove={this.onMouseMove} />
            </div>
            <div className='edit-button' role='button'>
                <span className='glyphicon glyphicon-camera'></span>
            </div>
        </div>;
    }
}

export default ImageInputBox;
