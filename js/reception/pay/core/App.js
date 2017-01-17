// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import AnimateSquare from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Sitemap from '../../../common/core/Sitemap.js';

const reducer = combineReducers({
    animateSquare: AnimateSquare.Reducer,
    siteMap: Sitemap.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Sitemap.Actions.updateLinks());

for(let i = 0; i < 30; ++i) {
    store.dispatch(AnimateSquare.Actions.addRandomSquare());
}

const onReactDOMRendered = function() {
    let goNextStep = () => {
        store.dispatch(AnimateSquare.Actions.goNextStep());
        window.requestAnimationFrame(goNextStep);
    }
    window.requestAnimationFrame(goNextStep);
}

var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        window.PBPlusDream = new Dream();
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
