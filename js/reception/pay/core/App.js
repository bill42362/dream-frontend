// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import AnimateSquare from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';
import Navigations from '../../../common/core/Navigations.js';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Sitemap from '../../../common/core/Sitemap.js';

window.PBPlusDream = new Dream();

const reducer = combineReducers({
    navigations: Navigations.Reducer,
    animateSquare: AnimateSquare.Reducer,
    siteMap: Sitemap.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Sitemap.Actions.updateLinks());

for(let i = 0; i < 30; ++i) {
    store.dispatch(AnimateSquare.Actions.addRandomSquare());
}

PBPlusDream.getHeaderNavs()
.then(navs => {
    store.dispatch(Navigations.Actions.updateNavigations({key: 'header', navigations: navs}));
    return new Promise(resolve => { resolve(navs); });
})
.catch(error => { console.log(error); });

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
                <App />
            </Provider>,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
