// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import Slide from './Slide.react.js';
import Carousel from './Carousel.react.js';
import ProjectCard from '../../../common/react/ProjectCard.react.js';

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
            <Carousel />
            <div className='project-cards row'>
                <div className='col-sm-4'>
                    <ProjectCard />
                </div>
                <div className='col-sm-4'>
                    <ProjectCard />
                </div>
                <div className='col-sm-4'>
                    <ProjectCard />
                </div>
                <div className='col-sm-4'>
                    <ProjectCard />
                </div>
            </div>
        </div>;
    }
}
module.exports = App;
