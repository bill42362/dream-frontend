// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import URLSafe from 'urlsafe-base64';
import Header from '../../../common/react/Header.react.js';
import Footer from '../../../common/react/Footer.react.js';

const ConnectedFooter = connect(state => { return {links: state.siteMap}; })(Footer);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            userSapId: '',
            paymentDatas: [],
            paymentData: {
                paymentMethod: '',
                userData: { name: '', phoneNumber: '', email: '', postcode: '', address: '', },
                receipt: { type: '', number: '', title: '' },
                remark: '',
            },
        };
        this.onGetUserSapIdSuccess = this.onGetUserSapIdSuccess.bind(this);
        if(window.PBPlusDream) {
            this.state.userSapId = PBPlusDream.userSapId;
            if(!PBPlusDream.userSapId) {
                PBPlusDream.getUserSapId(undefined, this.onGetUserSapIdSuccess);
            }
        }
    }
    onGetUserSapIdSuccess(sapId) {
        if(!sapId) {
            Toastr.warning('您必須登入後才能查詢記錄，5 秒後為您轉至登入頁。');
            window.setTimeout(() => {
                let locationBase64 = URLSafe.encode(btoa(location.pathname + location.search));
                location.href = '/login?location=' + locationBase64;
            }, 5000);
        }
        this.setState({userSapId: sapId});
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
    componentWillUnmount() { }
    render() {
        const state = this.state;
        const { userProfiles, userSapId } = state;
        return <div id='wrapper'>
            <Header fixed={false} iconSrc='/img/brand_icon_black.png' />
            <h1 className='pay-history-title'>訂單記錄</h1>
            <div className='payment-panel'>
                <div className='payment-form'>
                    <div className='payment-form-inputs'>
                        <div className='row'>
                        </div>
                    </div>
                </div>
                <div className='paper-shadow'></div>
            </div>
            <ConnectedFooter />
        </div>;
    }
}
module.exports = App;
