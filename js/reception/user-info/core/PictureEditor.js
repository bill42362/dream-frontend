// PictureEditor.js
'use strict';

const defaultState = {
    top: 0, left: 0, width: 100, height: 100,
    image: new Image(), resultSource: '',
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_POSITION':
            return Object.assign({}, state, action.position);
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
            -left, -top, image.width, image.height,
            0, 0, image.width, image.height
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

const Actions = { updateImageSource, movePicture, updateResultSource };

export default { Reducer, Actions };
