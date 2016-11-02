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
        let sharingIcons = [
            {
                key: 'facebook', liClassname: 'facebook',
                component: <i className="fa fa-facebook"></i>,
                href: 'facebook.com'
            },
            {
                key: 'googlePlus', liClassname: 'google-plus',
                component: <i className="fa fa-google-plus"></i>,
                href: 'plus.google.com'
            },
            {
                key: 'twitter', liClassname: 'twitter',
                component: <i className="fa fa-twitter"></i>,
                href: 'twitter.com'
            },
            {
                key: 'tumblr', liClassname: 'tumblr',
                component: <i className="fa fa-tumblr"></i>,
                href: 'tumblr.com'
            },
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
                <ul className='share-icons'>
                    {sharingIcons.map(icon =>
                        <li
                            className={ClassNames('share-icon', icon.liClassname)} key={icon.key}
                        >{icon.component}</li>
                    )}
                </ul>
            </div>
         </div>;
    }
}
module.exports = ProjectTabbar;
