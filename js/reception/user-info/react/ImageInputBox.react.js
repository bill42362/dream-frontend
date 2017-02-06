// ImageInputBox.react.js
'use strict'
import React from 'react';
import MouseTracker from './MouseTracker.react.js';

const moverSize = {width: 1280, height: 720};
const defaultAction = {
    type: '',
    stretchFunction: () => ({stretch: {x: 0, y: 0}, move: {x: 0, y: 0}}),
};

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            mouseCursor: 'move',
            action: defaultAction,
        };
        this.imageType = /^image\//;
        this.selectFile = this.selectFile.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
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
    cancelEventActions(e) { e.stopPropagation(); e.preventDefault(); }
    selectFile(e) {
        const enableSelectFile = e.target.getAttribute('data-enable_select_file');
        if(!enableSelectFile) { return ;}
        const input = this.refs.fileSelector;
        if(input) {
            const event = new MouseEvent('click', {
                'view': window, 'bubbles': false, 'cancelable': true
            });
            input.dispatchEvent(event);
        }
    }
    onFileChange(e) {
        var files = e.target.files;
        if(files[0] && files[0].type && this.imageType.test(files[0].type)) {
            let url = URL.createObjectURL(files[0]);
            this.props.updateImageSource(url);
        }
    }
    onDrop(e) {
        this.cancelEventActions(e);
        var files = e.dataTransfer.files;
        if(files[0] && files[0].type && this.imageType.test(files[0].type)) {
            let url = URL.createObjectURL(files[0]);
            this.props.updateImageSource(url);
        }
    }
    onMouseMove(mouseState) {
        if(this.state.action.type) { return; }
        const { x, y } = mouseState.axis;
        const { top, left } = this.props.editorState;
        const { isOnLeft, isOnRight, isOnTop, isOnBottom } = this.checkMouseOnEdge(
            {x: x - left - moverSize.width + 60, y: y - top - moverSize.height + 60},
            this.refs.fullImageView
        );
        // Change mouse cursor while not actioning.
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
        // Setup action properties.
        if(!isOnLeft && !isOnRight && !isOnTop && !isOnBottom) {
            this.setState({action: Object.assign({}, defaultAction, {type: 'move'})});
        } else {
            const action = Object.assign({}, defaultAction, {type: 'stretch'});
            const { image } = this.props.editorState;
            const imageAspect = image.width/image.height;
            if(isOnRight) {
                action.stretchFunction = (move) => ({
                    stretch: {x: move.x, y: 0}, move: {x: 0, y: 0},
                });
            }
            if(isOnLeft) {
                action.stretchFunction = (move) => ({
                    stretch: {x: -move.x, y: 0}, move: {x: move.x, y: 0},
                });
            }
            if(isOnBottom) {
                action.stretchFunction = (move) => ({
                    stretch: {x: 0, y: move.y}, move: {x: 0, y: 0},
                });
            }
            if(isOnTop) {
                action.stretchFunction = (move) => ({
                    stretch: {x: 0, y: -move.y}, move: {x: 0, y: move.y},
                });
            }
            if(isOnBottom && isOnRight) {
                action.stretchFunction = (move) => ({
                    stretch: {x: move.x, y: move.x/imageAspect},
                    move: {x: 0, y: 0},
                });
            }
            if(isOnBottom && isOnLeft) {
                action.stretchFunction = (move) => ({
                    stretch: {x: -move.x, y: -move.x/imageAspect},
                    move: {x: move.x, y: 0},
                });
            }
            if(isOnTop && isOnRight) {
                action.stretchFunction = (move) => ({
                    stretch: {x: move.x, y: move.x/imageAspect},
                    move: {x: 0, y: -move.x/imageAspect},
                });
            }
            if(isOnTop && isOnLeft) {
                action.stretchFunction = (move) => ({
                    stretch: {x: -move.x, y: -move.x/imageAspect},
                    move: {x: move.x, y: move.x/imageAspect},
                });
            }
            this.setState({ action });
        }
    }
    onMouseUp(mouseState) { this.setState({action: Object.assign({}, defaultAction)}); }
    onDrag(mouseState) {
        const { action } = this.state;
        if('move' === action.type) {
            const { movePicture } = this.props;
            movePicture(mouseState.move);
        } else if('stretch' === action.type) {
            const { movePicture, stretchPicture } = this.props;
            const { stretch, move } = action.stretchFunction(mouseState.move);
            stretchPicture(stretch);
            movePicture(move);
        }
    }
    render() {
        const { isEditing, mouseCursor } = this.state;
        const { editorState, source, style } = this.props;
        const { top, left, width, height, image } = editorState;
        return <div
            className='image-input-box'
            style={Object.assign({position: 'relative', cursor: 'pointer'}, style)}
            title='拖曳圖片至此或點這裡選擇檔案'
            data-enable_select_file={true}
            onClick={this.selectFile}
            onDragEnter={this.cancelEventActions}
            onDragOver={this.cancelEventActions}
            onDrop={this.onDrop}
        >
            {isEditing && <img
                ref='fullImageView'
                style={{
                    position: 'absolute', opacity: 0.5,
                    border: '2px dashed black',
                    top, left, width, height
                }}
                src={image.src}
            />}
            <img
                style={{borderRadius: 60}} src={editorState.resultSource}
                data-enable_select_file={true}
            />
            {isEditing && <div
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
            </div>}
            <input
                type='file' ref='fileSelector' style={{display: 'none'}}
                accept='image/*' multiple={false}
                onChange={this.onFileChange} aria-label='file-selector'
            />
            <div
                className='edit-button' role='button'
                onClick={(e) => { e.stopPropagation(); this.setState({isEditing: !isEditing}); }}
            >
                <span className='glyphicon glyphicon-scissors'></span>
            </div>
        </div>;
    }
}

export default ImageInputBox;
