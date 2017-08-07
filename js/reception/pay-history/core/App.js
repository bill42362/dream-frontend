// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Navigations from '../../../common/core/Navigations.js';
import PayHistory from './PayHistory.js';
import Sitemap from '../../../common/core/Sitemap.js';

const PBPlusDream = new Dream();
window.PBPlusDream = PBPlusDream;

const reducer = combineReducers({
    navigations: Navigations.Reducer,
    payHistories: PayHistory.Reducer,
    siteMap: Sitemap.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Sitemap.Actions.updateLinks());
if(!!PBPlusDream) {
    PBPlusDream.getUserSapIdPromise()
    .then(({ token }) => {
        return PBPlusDream.getPayHistory({userToken: token});
    })
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

const onReactDOMRendered = () => {};
var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        ReactDOM.render(
            <Provider store={store} >
                <App />
            </Provider>,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
