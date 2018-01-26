// Auth.js
'use strict';
import 'isomorphic-fetch';
import PbplusMemberCenter from 'pbplus-member-sdk';

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
    return dispatch(PbplusMemberCenter.Actions.checkAuthState({clientId: process.env.CLIENT_ID}))
    .then(({ isUserLoggedIn, endpoint }) => {
        return dispatch(updateIsUserLoggedIn({ isUserLoggedIn }))
        .then(() => dispatch(updateLoginEndpoint({loginEndpoint: endpoint})))
        .then(() => dispatch(updateIsLoginStateFetched({isLoginStateFetched: true})))
        .then(() => ({ isUserLoggedIn, endpoint }));
    })
    .catch(error => { console.log('fetchLoginState() error:', error); });
}; };

const Actions = { updateIsUserLoggedIn, fetchLoginState };

export default { Reducer, Actions };
