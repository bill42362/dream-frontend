// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import ProjectHeader from './ProjectHeader.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        let proposer = {title: 'pb+寶悍運動平台', href: '//www.pbplus.me/'};
        let banner = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        let projectFullData = {
            title: '世界十二強的愛 傳送溫暖至偏鄉',
            subtitle: 'pb+圓夢加舉辦了世界12強紀念套票拍賣活動，活動所得將全數捐給新城國小',
            description: '專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述',
            foundTarget: 500000, currentFound: 300000,
            startTimestamp: 1472869212136, dueTimestamp: 1478139612136,
            proposerId: 'proposerId', banner: 'bannerId',
        };
        return <div id='wrapper'>
            <Header fixed={false} />
            <ProjectHeader
                projectData={projectFullData} proposer={proposer} banner={banner}
            />
            <Footer />
        </div>;
    }
}
module.exports = App;
