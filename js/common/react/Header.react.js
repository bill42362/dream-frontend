// Header.react.js
import React from 'react';
import ClassNames from 'classnames';
import HeaderBar from 'header-bar';
import URLSafe from 'urlsafe-base64';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userIconSrc: '/img/mock_user_icon.png' };
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const state = this.state;
        const {
            headerNavs, fixed, isOnTop,
            isUserLoggedIn, displayPbplusMemberCenter,
            logout, loginEndpoint
        } = this.props;
        const { userIconSrc } = this.state;
        const locationBase64 = URLSafe.encode(btoa(location.pathname + location.search));
        const position = fixed ? 'fixed' : 'relative';
        let backgroundColor = '';
        if(fixed && isOnTop) { backgroundColor = 'rgba(255, 255, 255, 0)'; }
        let userButton = <div data-submenu_button={true} data-submenu_key='login'>
            <a href={`${loginEndpoint}&location=${locationBase64}`} title='login' style={{color: 'white'}}>登入</a>
        </div>;
        if(isUserLoggedIn) {
            userButton = <div data-submenu_button={true} data-submenu_key='profile'>
                <img src={userIconSrc} style={{height: '1.8em', borderRadius: '0.9em'}}/>
            </div>;
        }
        return <header id="header" ref='base'>
            <HeaderBar
                style={{position, zIndex: 2, backgroundColor, transition: 'background-color .6s ease'}}
                hamburger={{ src:'/img/hamburger.svg', title:'Menu' }}
                menuCloser={{ src:'/img/icon_x.svg', title:'Close menu' }}
            >
                <a href='//tw.pbplus.me' target='_self' data-logo={true}><img src='/img/logo.svg' title='Home'/></a>
                {headerNavs.map((nav, index) => {
                    return <a key={index} href={nav.url} data-nav={true} data-color={nav.color} data-match={nav.url} >
                        {nav.display}
                    </a>;
                })}
                <a
                    href='//www.facebook.com/pbplus.me/' target='_blank'
                    data-subnav={true} data-color='rgb(62, 86, 155)'
                ><img src='/img/facebook.svg'/></a>
                <a
                    href='//www.youtube.com/channel/UCgoWlpZfUggQ3CLzrTqtkGw' target='_blank'
                    data-subnav={true} data-color='rgb(229, 26, 0)'
                ><img src='/img/youtube.svg'/></a>
                <a
                    href='https://line.me/R/ti/p/%40kav1208b' target='_blank'
                    data-subnav={true} data-color='rgb(0, 181, 9)'
                ><img src='/img/line.svg'/></a>
                {userButton}
                <div data-submenu_item={true}  data-submenu_key='profile' data-submenu_position='header'>
                    <div style={{color: 'rgb(24, 155, 202)'}}>暱稱</div>
                    <div style={{color: 'rgb(24, 155, 202)'}}>Email</div>
                </div>
                <div data-submenu_item={true}  data-submenu_key='profile' data-submenu_position='body'>
                    <a title='User Info' role='button' onClick={displayPbplusMemberCenter}>使用者中心</a>
                </div>
                <div data-submenu_item={true}  data-submenu_key='profile' data-submenu_position='body'>
                    <a href='/payhistory' title='Pay history'>贊助紀錄</a>
                </div>
                <div data-submenu_item={true}  data-submenu_key='profile' data-submenu_position='footer'>
                    <a title='Logout' role='button' onClick={logout}>登出</a>
                </div>
            </HeaderBar>
        </header>;
    }
}
module.exports = Header;
