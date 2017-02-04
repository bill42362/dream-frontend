// ImageInputBox.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ImageInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        const { source, movePicture, style } = this.props;
        return <div className='image-input-box' style={style} >
            <img src={source} onClick={() => { movePicture({x: 5, y: 5}); }} />
            <div className='edit-button' role='button'>
                <span className='glyphicon glyphicon-camera'></span>
            </div>
        </div>;
    }
}

export default ImageInputBox;
