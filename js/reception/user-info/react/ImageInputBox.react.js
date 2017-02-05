// ImageInputBox.react.js
'use strict'
import React from 'react';
import MouseTracker from './MouseTracker.react.js';

const moverSize = {width: 1280, height: 720};
const defaultAction = {
    type: '',
    stretchFilter: {x: 0, y: 0},
    moveFilter: {x: 0, y: 0},
};

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseCursor: 'move',
            action: defaultAction,
        };
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
        if(this.state.action.type) { return; }
        const { x, y } = mouseState.axis;
        const { top, left } = this.props.editorState;
        const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
            {x: x - left - moverSize.width + 60, y: y - top - moverSize.height + 60},
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
        const { top, left } = this.props.editorState;
        const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
            {x: x - left - moverSize.width + 60, y: y - top - moverSize.height + 60},
            this.refs.fullImageView
        );
        if(!isOnLeft && !isOnRight && !isOnTop && !isOnBottom) {
            this.setState({action: Object.assign({}, defaultAction, {type: 'move'})});
        } else {
            const action = Object.assign({}, defaultAction, {type: 'stretch'});
            const { stretchFilter, moveFilter } = action;
            if(isOnRight) { stretchFilter.x = 1; }
            if(isOnLeft) { stretchFilter.x = -1; moveFilter.x = 1; }
            if(isOnBottom) { stretchFilter.y = 1; }
            if(isOnTop) { stretchFilter.y = -1; moveFilter.y = 1; }
            this.setState({ action });
        }
    }
    onMouseUp(mouseState) { this.setState({action: Object.assign({}, defaultAction)}); }
    onDrag(mouseState) {
        const { action } = this.state;
        const { move } = mouseState;
        if('move' === action.type) {
            const { movePicture } = this.props;
            movePicture(move);
        } else if('stretch' === action.type) {
            const { stretchFilter, moveFilter } = action;
            const { movePicture, stretchPicture } = this.props;
            stretchPicture({x: move.x*stretchFilter.x, y: move.y*stretchFilter.y});
            movePicture({x: move.x*moveFilter.x, y: move.y*moveFilter.y});
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
                    border: '2px dashed black',
                    top, left, width, height
                }}
                src={image.src}
            />
            <img style={{borderRadius: 60}} src={editorState.resultSource} />
            <div
                style={{
                    position: 'absolute',
                    width: 2*moverSize.width,
                    height: 2*moverSize.height,
                    cursor: mouseCursor,
                    top: -moverSize.height + 60,
                    left: -moverSize.width + 60
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
