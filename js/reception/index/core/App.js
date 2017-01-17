// App.js
'use strict'
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Sitemap from '../../../common/core/Sitemap.js';

const footerLinksStore = createStore(Sitemap.Reducer, applyMiddleware(ReduxThunk));
footerLinksStore.dispatch(Sitemap.Actions.updateLinks());

var onReactDOMRendered = function() {
}

var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        window.PBPlusDream = new Dream();
        ReactDOM.render(
            <Provider store={footerLinksStore} >
                <App />
            </Provider>,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
