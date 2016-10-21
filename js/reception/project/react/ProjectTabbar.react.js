// ProjectTabbar.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectTabbar extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {};
    }
    render() {
        let tabs = [
            {key: 'story', display: 'Story', count: 0},
            {key: 'timeline', display: 'Timeline', count: 2},
            {key: 'comment', display: 'Comment', count: 3},
        ];
        return <div className='project-tabbar row' ref='base'>
            <ul className='project-tabbar-tabs col-md-8'>
                {tabs.map((tab, index) =>
                    <li
                        className={ClassNames('project-tabbar-tab', {'active': 0 === index})}
                        key={index}
                    >
                        {tab.display}
                        {!!tab.count && <span className='project-tabbar-tab-count'>{tab.count}</span>}
                    </li>
                )}
            </ul>
            <div className='project-tabbar-aside col-md-4'>
            </div>
         </div>;
    }
}
module.exports = ProjectTabbar;
