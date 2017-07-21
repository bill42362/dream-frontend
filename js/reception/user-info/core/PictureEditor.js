// PictureEditor.js
'use strict';

const initedImage = new Image();
initedImage.crossOrigin="anonymous";
const defaultState = {
    top: 0, left: 0, width: 120, height: 120,
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
            dispatch({type: 'UPDATE_SIZE', size: { width, height }});
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
        const outputSize = {width: 120, height: 120};
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
