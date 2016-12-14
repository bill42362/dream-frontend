// App.js
'use strict'
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';

var onReactDOMRendered = function() {
}

var onReadyStateChange = function() {
    if(document.readyState == 'complete') {
        window.PBPlusDream = new Dream();
        ReactDOM.render(
            <App />,
            document.getElementById('app-root'),
            onReactDOMRendered
        );
    }
}
document.addEventListener('readystatechange', onReadyStateChange, false);
