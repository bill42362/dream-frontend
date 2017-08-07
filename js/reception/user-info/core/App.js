// App.js
'use strict'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import AnimateSquare from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App.react.js';
import Core from '../../../common/core/Core.js';
import Dream from '../../../common/core/Dream.js';
import Sitemap from '../../../common/core/Sitemap.js';
import PictureEditor from './PictureEditor.js';
import Navigations from '../../../common/core/Navigations.js';

window.PBPlusDream = new Dream();

const reducer = combineReducers({
    navigations: Navigations.Reducer,
    animateSquare: AnimateSquare.Reducer,
    siteMap: Sitemap.Reducer,
    pictureEditor: PictureEditor.Reducer,
})

const store = createStore(reducer, applyMiddleware(ReduxThunk));
store.dispatch(Sitemap.Actions.updateLinks());
store.dispatch(PictureEditor.Actions.updateImageSource('/img/mock_user_icon.jpg'));

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

const ConnectedApp = connect(
    state => ({userImageState: state.pictureEditor}),
    dispatch => { return { updateUserImageSource: source => {
        return dispatch(PictureEditor.Actions.updateImageSource(source));
    }}}
)(App);

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
