// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import Slide from './Slide.react.js';
import Carousel from './Carousel.react.js';
import ProjectCard from '../../../common/react/ProjectCard.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { headerOnTop: true };
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }
    onWindowScroll(e) {
        let baseTop = this.refs.base.getBoundingClientRect().top;
        let headerOnTop = -5 < baseTop;
        this.setState({headerOnTop: headerOnTop});
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        let state = this.state;
        return <div id='wrapper' ref='base'>
            <Header fixed={true} isOnTop={this.state.headerOnTop} />
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
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;
