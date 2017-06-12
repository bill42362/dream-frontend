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
    shareFacebook() {
        if(!FB) { return; }
        FB.ui({
            app_id: '446900555688362',
            method: 'share',
            href: location.href,
            hashtag: 'pb+運動平台',
        }, function(response) {
            console.log('FB sharing response:', response);
        });
        return;
    }
    loadFBSDKScript(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }
    componentDidMount() {
        window.fbAsyncInit = function() {
            FB.init({
                appId            : '446900555688362',
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v2.8'
            });
            FB.AppEvents.logPageView();
        };
        this.loadFBSDKScript(document, 'script', 'facebook-jssdk');
    }
    render() {
        const tabs = this.props.tabs;
        let sharingIcons = [
            {
                key: 'facebook', liClassname: 'facebook',
                component: <i className="fa fa-facebook"></i>,
                href: 'facebook.com', onClick: this.shareFacebook,
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
                            onClick={icon.onClick}
                        >{icon.component}</li>
                    )}
                </ul>
            </div>
         </div>;
    }
}
module.exports = ProjectTabbar;
