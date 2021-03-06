// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import AnimateSquare from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';
import PbplusMemberCenter from 'pbplus-member-sdk';
import Announce from '../../../common/core/Announce.js';
import Auth from '../../../common/core/Auth.js';
import Navigations from '../../../common/core/Navigations.js';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Footer from '../../../common/core/Footer.js';

window.PBPlusDream = new Dream();

const reducer = combineReducers({
    pbplusMemberCenter: PbplusMemberCenter.Reducer,
    announce: Announce.Reducer,
    auth: Auth.Reducer,
    navigations: Navigations.Reducer,
    animateSquare: AnimateSquare.Reducer,
    footer: Footer.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Footer.Actions.fetchFooter());

for(let i = 0; i < 30; ++i) {
    store.dispatch(AnimateSquare.Actions.addRandomSquare());
}

PBPlusDream.getHeaderNavs()
.then(navs => {
    store.dispatch(Navigations.Actions.updateNavigations({key: 'header', navigations: navs}));
    return new Promise(resolve => { resolve(navs); });
})
.catch(error => { console.log(error); });

store.dispatch(Announce.Actions.fetchAnnounces())
.catch(console.log);

store.dispatch(Auth.Actions.fetchLoginState())
.then(({ isUserLoggedIn }) => {
    if(isUserLoggedIn) {
        return store.dispatch(PbplusMemberCenter.Actions.updateActiveTab({activeTab: 'personal-data'}));
    }
    return {isUserLoggedIn: false};
})
.catch(error => { console.log(error); });

const ConnectedApp = connect(
    state => {
        const { userUuid } = state.pbplusMemberCenter;
        const { isLoginStateFetched, isUserLoggedIn } = state.auth;
        const {
            name, email, address, mobile: phoneNumber, zipcode: postcode
        } = state.pbplusMemberCenter.personalData;
        return {
            userUuid, isLoginStateFetched, isUserLoggedIn,
            loginEndpoint: `${state.auth.loginEndpoint}&token_id=${state.pbplusMemberCenter.userUuid}`,
            user: { name, phoneNumber, email, postcode, address },
        };
    },
    dispatch => ({})
)(App);

const onReactDOMRendered = function() {
    let goNextStep = () => {
        store.dispatch(AnimateSquare.Actions.goNextStep());
        window.requestAnimationFrame(goNextStep);
    }
    window.requestAnimationFrame(goNextStep);
}

var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        ReactDOM.render(
            <Provider store={store} >
                <ConnectedApp />
            </Provider>,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
