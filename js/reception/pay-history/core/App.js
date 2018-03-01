// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import PbplusMemberCenter from 'pbplus-member-sdk';
import Announce from '../../../common/core/Announce.js';
import Auth from '../../../common/core/Auth.js';
import Navigations from '../../../common/core/Navigations.js';
import PayHistory from './PayHistory.js';
import Footer from '../../../common/core/Footer.js';

const PBPlusDream = new Dream();
window.PBPlusDream = PBPlusDream;

const reducer = combineReducers({
    pbplusMemberCenter: PbplusMemberCenter.Reducer,
    announce: Announce.Reducer,
    auth: Auth.Reducer,
    navigations: Navigations.Reducer,
    payHistories: PayHistory.Reducer,
    footer: Footer.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Footer.Actions.fetchFooter());
if(!!PBPlusDream) {
    const { userUuid } = store.getState().pbplusMemberCenter;
    PBPlusDream.getPayHistory({ userUuid })
    .then(payHistories => {
        return store.dispatch(PayHistory.Actions.updatePayHistories({ payHistories }));
    })
    .catch(error => { console.log('getPayHistory() error:', error); });
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
        const { isLoginStateFetched, isUserLoggedIn, loginEndpoint } = state.auth;
        return {
            userUuid, isLoginStateFetched, isUserLoggedIn,
            loginEndpoint: `${loginEndpoint}&token_id=${userUuid}`,
        };
    },
    dispatch => ({})
)(App);

const onReactDOMRendered = () => {};
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
