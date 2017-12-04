// Auth.js
'use strict';
import 'isomorphic-fetch';

const defaultState = {
    isLoginStateFetched: false,
    isUserLoggedIn: false,
    loginEndpoint: `https://api.pbplus.me/page/auth?client_id=${process.env.CLIENT_ID}`,
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_IS_LOGIN_STATE_FETCHED':
        case 'UPDATE_IS_USER_LOGGED_IN':
        case 'UPDATE_LOGIN_ENDPOINT':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

const updateIsLoginStateFetched = ({ isLoginStateFetched }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'UPDATE_IS_LOGIN_STATE_FETCHED', payload: { isLoginStateFetched } });
        resolve({ isLoginStateFetched });
    });
}; };

const updateIsUserLoggedIn = ({ isUserLoggedIn }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'UPDATE_IS_USER_LOGGED_IN', payload: { isUserLoggedIn } });
        resolve({ isUserLoggedIn });
    });
}; };

const updateLoginEndpoint = ({ loginEndpoint }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'UPDATE_LOGIN_ENDPOINT', payload: { loginEndpoint } });
        resolve({ loginEndpoint });
    });
}; };

const fetchLoginState = () => { return (dispatch, getState) => {
    return fetch(process.env.AUTH_URL, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            uuid: getState().pbplusMemberCenter.userUuid,
        })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        return dispatch(updateIsUserLoggedIn({isUserLoggedIn: 200 === response.status}))
        .then(() => dispatch(updateLoginEndpoint({loginEndpoint: response.message.endpoint})))
        .then(() => dispatch(updateIsLoginStateFetched({isLoginStateFetched: true})))
        .then(() => ({isUserLoggedIn: 200 === response.status}));
    })
    .catch(error => { console.log('fetchLoginState() error:', error); });
}; };

const Actions = { updateIsUserLoggedIn, fetchLoginState };

export default { Reducer, Actions };
