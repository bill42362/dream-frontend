// ImageInputBox.react.js
'use strict'
import React from 'react';
import MouseTracker from './MouseTracker.react.js';

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseCursor: 'move', action: ''};
        this.onDrag = this.onDrag.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    checkMouseOnEdge({ x, y }, element) {
        const offset = 10;
        const { width, height } = element.getBoundingClientRect();
        return {
            isOnLeft: offset > Math.abs(x), isOnRight: offset > Math.abs(width - x),
            isOnTop: offset > Math.abs(y), isOnBottom: offset > Math.abs(height - y),
        };
    }
    onMouseMove(mouseState) {
        if(this.state.action) { return; }
        const { x, y } = mouseState.axis;
        const { top, left, image } = this.props.editorState;
        const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
            {x: x - left - image.width + 60, y: y - top - image.height + 60},
            this.refs.fullImageView
        );
        let mouseCursor = 'move';
        if(isOnLeft || isOnRight) { mouseCursor = 'ew-resize'; }
        if(isOnTop || isOnBottom) { mouseCursor = 'ns-resize'; }
        if((isOnLeft && isOnTop) || (isOnRight && isOnBottom)) { mouseCursor = 'nwse-resize'; }
        else if((isOnLeft && isOnBottom) || (isOnRight && isOnTop)) { mouseCursor = 'nesw-resize'; }
        if(mouseCursor != this.state.mouseCursor) { this.setState({ mouseCursor }); }
    }
    onMouseDown(mouseState) {
        const { x, y } = mouseState.axis;
        const { top, left, image } = this.props.editorState;
        const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
            {x: x - left - image.width + 60, y: y - top - image.height + 60},
            this.refs.fullImageView
        );
        if(!isOnLeft && !isOnRight && !isOnTop && !isOnBottom) {
            this.setState({action: 'move'});
        } else { this.setState({action: 'stretch'}); }
    }
    onMouseUp(mouseState) { this.setState({action: ''}); }
    onDrag(mouseState) {
        const { action } = this.state;
        const { move } = mouseState;
        if('move' === action) {
            const { movePicture } = this.props;
            movePicture(move);
        } else if('stretch' === action) {
            const { movePicture, stretchPicture } = this.props;
            const { x, y } = mouseState.axis;
            const { top, left, image } = this.props.editorState;
            const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
                {x: x - left - image.width + 60, y: y - top - image.height + 60},
                this.refs.fullImageView
            );
            let stretchVector = {x: 0, y: 0}, moveVector = {x: 0, y: 0};
            if(isOnRight) { stretchVector.x = move.x; }
            if(isOnBottom) { stretchVector.y = move.y; }
            if(isOnTop) { stretchVector.y = -move.y; moveVector.y = move.y; }
            if(isOnLeft) { stretchVector.x = -move.x; moveVector.x = move.x; }
            stretchPicture(stretchVector);
            movePicture(moveVector);
        }
    }
    render() {
        const { mouseCursor } = this.state;
        const { editorState, source, style } = this.props;
        const { top, left, width, height, image } = editorState;
        return <div
            className='image-input-box'
            style={Object.assign({position: 'relative'}, style)}
        >
            <img
                ref='fullImageView'
                style={{
                    position: 'absolute', opacity: 0.5,
                    width, height, top, left
                }}
                src={image.src}
            />
            <img style={{borderRadius: 60}} src={editorState.resultSource} />
            <div
                style={{
                    position: 'absolute',
                    border: '2px dashed black',
                    width: 2*image.width,
                    height: 2*image.height,
                    cursor: mouseCursor,
                    top: -image.height + 60,
                    left: -image.width + 60
                }}
            >
                <MouseTracker
                    onMouseDrag={this.onDrag}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    onMouseDown={this.onMouseDown}
                />
            </div>
            <div className='edit-button' role='button'>
                <span className='glyphicon glyphicon-camera'></span>
            </div>
        </div>;
    }
}

export default ImageInputBox;
