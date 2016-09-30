// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import Slide from './Slide.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        let state = this.state;
        return <div id='wrapper'>
            <Header />
            <Slide />
        </div>;
    }
}
module.exports = App;
