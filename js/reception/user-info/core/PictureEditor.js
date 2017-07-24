// PictureEditor.js
'use strict';

const DEFAULT_SIZE = 120;
const initedImage = new Image();
initedImage.crossOrigin="anonymous";
const defaultState = {
    top: 0, left: 0, width: DEFAULT_SIZE, height: DEFAULT_SIZE,
    image: initedImage, resultSource: '',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_POSITION':
            return Object.assign({}, state, action.position);
        case 'UPDATE_SIZE':
            return Object.assign({}, state, action.size);
        case 'UPDATE_RESULT_SOURCE':
            return Object.assign({}, state, {resultSource: action.resultSource});
        default:
            return state;
    }
}

const updateImageSource = (source) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const { image } = getState().pictureEditor;
        image.onload = () => {
            const { width, height } = image;
            const targetZoom = DEFAULT_SIZE/Math.min(width, height);
            const targetSize = {width: width*targetZoom, height: height*targetZoom};
            dispatch({type: 'UPDATE_SIZE', size: targetSize});
            dispatch({type: 'UPDATE_POSITION', position: {
                left: -0.5*targetSize.width + 0.5*DEFAULT_SIZE,
                top: -0.5*targetSize.height + 0.5*DEFAULT_SIZE,
            }});
            dispatch(updateResultSource())
            .then(resolve)
            .catch(reject);
        };
        image.src = source;
    });
}};
const movePicture = ({x, y}) => { return (dispatch, getState) => {
    const state = getState().pictureEditor;
    const top = state.top + y;
    const left = state.left + x;
    dispatch({type: 'UPDATE_POSITION', position: { top, left }});
    return dispatch(updateResultSource());
}};
const stretchPicture = ({x, y}) => { return (dispatch, getState) => {
    const state = getState().pictureEditor;
    const width = state.width + x;
    const height = state.height + y;
    dispatch({type: 'UPDATE_SIZE', size: { width, height }});
    return dispatch(updateResultSource());
}};
const updateResultSource = () => { return (dispatch, getState) => {
    const state = getState().pictureEditor;
    return new Promise((resolve, reject) => {
        const outputSize = {width: DEFAULT_SIZE, height: DEFAULT_SIZE};
        const canvas = document.createElement('canvas');
        canvas.width = outputSize.width;
        canvas.height = outputSize.height;
        const context = canvas.getContext('2d');
        const { image, left, top, width, height } = state;
        context.drawImage(
            image,
            0, 0, image.width, image.height,
            left, top, width, height
        );
        const resultSource = canvas.toDataURL();
        if(0 === resultSource.indexOf('data:image/')) {
            dispatch({type: 'UPDATE_RESULT_SOURCE', resultSource });
            resolve();
        } else {
            reject(new Error('Read context base64 fail.'));
        }
    });
}};

const Actions = { updateImageSource, movePicture, stretchPicture, updateResultSource };

export default { Reducer, Actions };
