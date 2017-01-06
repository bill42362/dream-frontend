// App.js
'use strict'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Reducer, Actions } from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';

const animateSquaresStore = createStore(Reducer);
for(let i = 0; i < 30; ++i) {
    animateSquaresStore.dispatch(Actions.addRandomSquare());
}

const onReactDOMRendered = function() {
    let goNextStep = () => {
        animateSquaresStore.dispatch(Actions.goNextStep());
        window.requestAnimationFrame(goNextStep);
    }
    window.requestAnimationFrame(goNextStep);
}

var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        window.PBPlusDream = new Dream();
        ReactDOM.render(
            <Provider store={animateSquaresStore} >
                <App />
            </Provider>,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
