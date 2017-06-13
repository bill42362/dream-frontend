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
        }, function(response) {
            console.log('FB sharing response:', response);
        });
        return;
    }
    shareLine() {
        const url = encodeURIComponent(location.href);
        const returnUrl = 'https://timeline.line.me' + encodeURIComponent(`/social-plugin/share?url=${url}`);
        const redirect_uri = encodeURIComponent(`https://timeline.line.me/webauth/auth?returnUrl=${returnUrl}`);
        const href = `https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=1341209950&state=674581db8e8451f182c5740b5fdf59452ab2047665ee915814027f7ea54e0986&redirect_uri=${redirect_uri}`;
        const strWindowFeatures = 'location=yes,height=570,width=520,scrollbars=yes,status=yes';
        window.open(href, '_blank', strWindowFeatures);
        return;
    }
    loadJSScript({ id, src, attributes }) {
        let jsElement, firstJsElement = document.getElementsByTagName('script')[0];
        if(document.getElementById(id)) { return; }
        jsElement = document.createElement('script');
        jsElement.id = id;
        jsElement.src = src;
        Object.keys(attributes || {}).forEach(key => { jsElement[key] = attributes[key]; });
        firstJsElement.parentNode.insertBefore(jsElement, firstJsElement);
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
        this.loadJSScript({id: 'facebook-jssdk', src: '//connect.facebook.net/en_US/sdk.js'});
    }
    render() {
        const tabs = this.props.tabs;
        let sharingIcons = [
            {
                key: 'facebook', liClassname: 'facebook',
                component: <i className='fa fa-facebook'></i>,
                href: 'facebook.com', onClick: this.shareFacebook,
            },
            {
                key: 'twitter', liClassname: 'twitter',
                component: <i className='fa fa-twitter'></i>,
                href: 'twitter.com'
            },
            {
                key: 'line', liClassname: 'line',
                component: <img src='/img/line_icon_round.svg'></img>,
                href: 'timeline.line.me', onClick: this.shareLine,
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
