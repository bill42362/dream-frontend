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
            {key: 'story', display: '專案故事', count: 0, href: '/project.html'},
            {key: 'timeline', display: '專案進度', count: 2, href: '/project-timeline.html'},
            {key: 'comment', display: '訊息回應', count: 3, href: '/project-message.html'},
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
                    <a title={tab.display} href={tab.href} key={index}>
                        <li className={ClassNames('project-tabbar-tab', {'active': location.pathname === tab.href})} >
                            {tab.display}
                            {!!tab.count && <div className='project-tabbar-tab-count'>{tab.count}</div>}
                        </li>
                    </a>
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
