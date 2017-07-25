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
const paymentMethodDictionary = {
    ERROR: '狀態異常',
    ATM: 'ATM 轉帳',
    Credit: '信用卡',
    CVS: '超商繳費',
};
const statusDictionary = {
    ERROR: '狀態異常',
    NOT_PAY_YET: '尚未付款',
    PAIED: '已付款',
    CANCELED: '已取消',
};

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
        const { payHistories } = this.props;
        return <div id='wrapper'>
            <Header fixed={false} iconSrc='/img/brand_icon_black.png' />
            <h1 className='pay-history-title'>贊助記錄</h1>
            <div className='pay-histories'>
                {payHistories.map((payHistory, index) => {
                    return <div className='pay-history' key={index}>
                        <div className='pay-history-project-title'>
                            <a href={`/project/${payHistory.projectId}`}>
                                {payHistory.projectTitle}
                            </a>
                        </div>
                        <div className='pay-history-content'>
                            <div className='pay-history-content-column'>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>訂單項目</div>
                                    <div className='pay-history-content-item-content'>{payHistory.itemTitle}</div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>贊助金額</div>
                                    <div className='pay-history-content-item-content'>{payHistory.price}</div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>付款方式</div>
                                    <div className='pay-history-content-item-content'>
                                        {paymentMethodDictionary[payHistory.paymentMethod] || paymentMethodDictionary.ERROR}
                                    </div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>付款狀態</div>
                                    <div className='pay-history-content-item-content'>
                                        {statusDictionary[payHistory.status] || statusDictionary.ERROR}
                                        {'NOT_PAY_YET' === payHistory.status && <div
                                            className='pay-history-content-item-button' role='button'
                                        >取消贊助</div>}
                                    </div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>訂單編號</div>
                                    <div className='pay-history-content-item-content'>{payHistory.id}</div>
                                </div>
                            </div>
                            <div className='pay-history-content-column'>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>繳費代碼</div>
                                    <div className='pay-history-content-item-content'>{payHistory.paymentNumber}</div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>繳費期限</div>
                                    <div className='pay-history-content-item-content'>
                                        {Core.getDateStringWithFormat(payHistory.expireTimestamp, 'YYYY/MM/DD hh:mm:ss')}
                                    </div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>收件姓名</div>
                                    <div className='pay-history-content-item-content'>{payHistory.addressee}</div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>收件地址</div>
                                    <div className='pay-history-content-item-content'>
                                        {
                                            `${!!payHistory.zipcode ? '(' : ''}`
                                            + `${payHistory.zipcode || ''}`
                                            + `${!!payHistory.zipcode ? ') ' : ''}` 
                                            + `${payHistory.address}`
                                        }
                                    </div>
                                </div>
                                <div className='pay-history-content-item'>
                                    <div className='pay-history-content-item-title'>備註</div>
                                    <div className='pay-history-content-item-content'>{payHistory.comment}</div>
                                </div>
                            </div>
                        </div>
                        <div className='paper-shadow'></div>
                    </div>;
                })}
            </div>
            <ConnectedFooter />
        </div>;
    }
}
module.exports = App;
