// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import URLSafe from 'urlsafe-base64';
import PbplusMemberCenter from 'pbplus-member-sdk';
import Auth from '../../../common/core/Auth.js';
import Header from '../../../common/react/Header.react.js';
import PayHistories from './PayHistories.react.js';
import Footer from '../../../common/react/Footer.react.js';

const ConnectedHeader = connect(
    state => { return {
        headerNavs: state.navigations.header || [],
        loginEndpoint: `${state.auth.loginEndpoint}&token_id=${state.pbplusMemberCenter.userUuid}`,
        isUserLoggedIn: state.auth.isUserLoggedIn,
        user: {
            nickname: state.pbplusMemberCenter.personalData.nickname,
            email: state.pbplusMemberCenter.personalData.email,
            picture: state.pbplusMemberCenter.pictureEditor.resultSource,
        },
    }; },
    dispatch => ({
        logout: () => {
            dispatch(PbplusMemberCenter.Actions.renewUserUUID());
            dispatch(Auth.Actions.updateIsUserLoggedIn({isUserLoggedIn: false}));
        },
        displayPbplusMemberCenter: () => dispatch(PbplusMemberCenter.Actions.display()),
    })
)(Header);
const ConnectedFooter = connect(state => { return {links: state.siteMap}; })(Footer);
const ConnectedPayHistories = connect(state => { return {payHistories: state.payHistories}; })(PayHistories);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {userSapId: '', redirectTimeout: undefined};
    }
    onAjaxError(xhr) {
        let networkError = '網路錯誤，請檢查您的網路，或稍候再試一次。<br />'
            + 'Network error, please check your network, or try again later.';
        let systemError = '系統錯誤，請稍候再試一次。<br />System error, please try again later.';
        if(!xhr.message) {
            Toastr['error'](networkError);
        } else if(/5\d\d/.test(xhr.status)) {
            Toastr['error'](xhr.status + ' "' + xhr.message + '"<br />' + systemError);
        } else {
            Toastr['warning'](xhr.status + ', ' + xhr.message);
        }
    }
    componentDidMount() { }
    componentDidUpdate(prevProps, prevState) {
        const { redirectTimeout } = this.state;
        const { isUserLoggedIn, isLoginStateFetched, loginEndpoint } = this.props;
        if(isLoginStateFetched && !isUserLoggedIn && !redirectTimeout) {
            Toastr.warning('您必須登入後才能查詢記錄，5 秒後為您轉至登入頁。');
            const timeout = window.setTimeout(() => {
                let locationBase64 = URLSafe.encode(btoa(location.pathname + location.search));
                location.href = `${loginEndpoint}&location=${locationBase64}`;
            }, 5000);
            this.setState({redirectTimeout: timeout});
        }
    }
    componentWillUnmount() { }
    render() {
        return <div id='wrapper'>
            <ConnectedHeader fixed={false} iconSrc='/img/brand_icon_black.png' />
            <h1 className='pay-history-title'>贊助記錄</h1>
            <ConnectedPayHistories />
            <ConnectedFooter />
            <div className='pbplus-member-center-container'>
                <PbplusMemberCenter.Container />
            </div>
        </div>;
    }
}
module.exports = App;
