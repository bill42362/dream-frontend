// Navigations.js
'use strict';

const defaultState = {
    header: [
        {url: '//dream.pbplus.me', color: 'rgb(226, 147, 192)', display: '運動募資'},
    ],
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_NAVIGATIONS':
            const assignObject = {};
            assignObject[action.key] = action.navigations;
            return Object.assign({}, state, assignObject);
        default:
            return state;
    }
}

const updateNavigations = ({ key, navigations }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'UPDATE_NAVIGATIONS', key, navigations });
        resolve({ key, navigations });
    });
}};

const Actions = { updateNavigations };

export default { Reducer, Actions };
