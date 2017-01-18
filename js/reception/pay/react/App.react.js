// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import URLSafe from 'urlsafe-base64';
import Header from '../../../common/react/Header.react.js';
import ConnectedAnimateSquare from './ConnectedAnimateSquare.react.js';
import BootstrapInput from '../../../common/react/BootstrapInput.react.js';
import BootstrapRadios from '../../../common/react/BootstrapRadios.react.js';
import Footer from '../../../common/react/Footer.react.js';

const ConnectedFooter = connect(state => { return {links: state.siteMap}; })(Footer);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            project: {}, items: [], userSapId: '', userProfiles: {},
            itemId: Core.getUrlSearches().id, tradeNumber: undefined,
            paymentData: {
                paymentMethod: '',
                userData: { name: '', phoneNumber: '', email: '', postcode: '', address: '', },
                receipt: { type: '', number: '', title: '' },
                remark: '',
            },
        };
        this.submit = this.submit.bind(this);
        this.closeAllpayIframe = this.closeAllpayIframe.bind(this);
        this.onGetProjectSuccess = this.onGetProjectSuccess.bind(this);
        this.onGetUserSapIdSuccess = this.onGetUserSapIdSuccess.bind(this);
        this.onReadUserProfilesSuccess = this.onReadUserProfilesSuccess.bind(this);
        this.onCreatePaymentSuccess = this.onCreatePaymentSuccess.bind(this);
        this.onChange = this.onChange.bind(this);
        if(window.PBPlusDream) {
            let projectId = PBPlusDream.getProjectIdFromUrl();
            PBPlusDream.getProject(projectId, this.onAjaxError, this.onGetProjectSuccess);
            this.state.userSapId = PBPlusDream.userSapId;
            if(!PBPlusDream.userSapId) {
                PBPlusDream.getUserSapId(undefined, this.onGetUserSapIdSuccess);
            } else {
                PBPlusDream.readProfiles([PBPlusDream.userSapId], undefined, this.onReadUserProfilesSuccess);
            }
        }
    }
    cancel() { history.back(); }
    submit() {
        const state = this.state;
        if(window.PBPlusDream && state.project.id && state.userSapId && !state.tradeNumber) {
            PBPlusDream.createPayment(
                state.project.id, state.itemId, state.paymentData,
                (error) => { this.setState({tradeNumber: undefined}); this.onAjaxError(error); },
                this.onCreatePaymentSuccess
            );
            this.setState({tradeNumber: 'lock_submit_button'});
        }
    }
    closeAllpayIframe() {
        const { tradeNumber, formDiv, allpayFullscreenWrapper } = this.state;
        let body = document.getElementById('body');
        body.removeChild(formDiv);
        body.removeChild(allpayFullscreenWrapper);
        PBPlusDream.cancelOrder(tradeNumber);
        this.setState({
            tradeNumber: undefined,
            formDiv: undefined, allpayFullscreenWrapper: undefined,
        });
    }
    onCreatePaymentSuccess({html, tradeNumber}) {
        let body = document.getElementById('body');

        let formDiv = document.createElement('div');
        formDiv.innerHTML = html;
        body.appendChild(formDiv);

        let allpayFullscreenWrapper = document.createElement('div');
        allpayFullscreenWrapper.className = 'allpay-fullscreen-wrapper';
        body.appendChild(allpayFullscreenWrapper);

        ReactDOM.render(
            <div>
                <div className='allpay-iframe-container'>
                    <iframe className='allpay-iframe' name='allpay_iframe'/>
                </div>
                <div
                    className='allpay-cancel-button' role='button' onClick={this.closeAllpayIframe}
                >取 消</div>
            </div>,
            allpayFullscreenWrapper,
            () => {
                document.getElementById('_allpayForm').submit();
                const state = this.state;
                const item = state.items.filter(item => { return '' + item.id === state.itemId; })[0];
                window.setTimeout(this.closeAllpayIframe, item.creditcardPaymentExpireSeconds*1000);
            }
        );
        this.setState({ tradeNumber, formDiv, allpayFullscreenWrapper });
    }
    onGetProjectSuccess(response) {
        if(200 === response.status) {
            const state = this.state;
            const project = response.message[0];
            const item = response.items.filter((item) => { return '' + item.id === state.itemId; })[0];
            let paymentData = state.paymentData;
            if(item) {
                paymentData.paymentMethod = paymentData.paymentMethod || item.paymentMethods[0];
            }
            this.setState({
                project, paymentData,
                items: response.items,
            });
        } else {
            this.onAjaxError(response);
        }
    }
    onGetUserSapIdSuccess(sapId) {
        if(sapId) { PBPlusDream.readProfiles([sapId], undefined, this.onReadUserProfilesSuccess); }
        else {
            Toastr.warning('您必須登入後才能訂購，5 秒後為您轉至登入頁。');
            window.setTimeout(() => {
                let locationBase64 = URLSafe.encode(btoa(location.pathname + location.search));
                location.href = '/login?location=' + locationBase64;
            }, 5000);
        }
        this.setState({userSapId: sapId});
    }
    onReadUserProfilesSuccess(profiles) {
        let stateUserProfiles = this.state.userProfiles;
        profiles.forEach(profile => { stateUserProfiles[profile.userPK] = profile; });
        let userProfile = stateUserProfiles[this.state.userSapId];
        if(userProfile) {
            let paymentData = this.state.paymentData;
            let userData = paymentData.userData;
            userData.name = userData.name || userProfile.name || '';
            userData.phoneNumber = userData.phoneNumber || userProfile.mobile || '';
            userData.email = userData.email || userProfile.email || '';
            userData.postcode = userData.postcode || userProfile.zipcode || '';
            userData.address = userData.address || (userProfile.city || '') + (userProfile.address || '') || '';
            this.setState({paymentData: paymentData});
        }
        this.setState({userProfiles: stateUserProfiles});
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
    onChange() {
        let paymentData = {
            paymentMethod: this.refs.paymentMethod.getValue(),
            userData: {
                name: this.refs.name.getValue(),
                phoneNumber: this.refs.phoneNumber.getValue(),
                email: this.refs.email.getValue(),
                postcode: this.refs.postcode.getValue(),
                address: this.refs.address.getValue(),
            },
            receipt: { type: this.refs.receiptType.getValue(), number: '', title: '', },
            remark: this.refs.remark.getValue(),
        };
        if(this.refs.receiptNumber) { paymentData.receipt.number = this.refs.receiptNumber.getValue(); }
        if(this.refs.receiptTitle) { paymentData.receipt.title = this.refs.receiptTitle.getValue(); }
        this.setState({paymentData: paymentData});
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const state = this.state;
        const {paymentMethod, userData, receipt, remark} = state.paymentData;
        const item = state.items.filter((item) => { return '' + item.id === state.itemId; })[0];
        let itemTitle = '', itemPrice = 0, itemPaymentMethods = ['Credit'];
        if(item) {
            itemTitle = item.title;
            itemPrice = item.price;
            itemPaymentMethods = item.paymentMethods;
        }
        return <div id='wrapper'>
            <Header fixed={false} />
            <h1 className='pay-title'>訂單付款資訊</h1>
            <div className='company-info'>
                <a className='site' href='http://pcgbros.com/' title='寶悍運動平台'>寶悍運動平台</a>
                <a className='mail' href='mailto:service@pcgbros.com' title='聯絡客服單位'>
                    聯絡客服單位
                    <span className='glyphicon glyphicon-envelope' aria-hidden='true'></span>
                </a>
            </div>
            <div className='payment-panel'>
                <div className='user-image-section' style={{position: 'relative'}}>
                    <div className='image-input-box' style={{zIndex: '1'}}>
                        <img src='/img/mock_user_icon.jpg' />
                        <div className='edit-button' role='button'>
                            <span className='glyphicon glyphicon-camera'></span>
                        </div>
                    </div>
                    <ConnectedAnimateSquare canvasProps={{style: {
                        position: 'absolute',
                        width: '100%', height: '100%',
                        top: '0px', left: '0px',
                    }}} />
                </div>
                <div className='payment-form'>
                    <div className='payment-form-inputs'>
                        <div className='row'>
                            <BootstrapInput
                                gridWidth={'6'} readOnly={true}
                                label={'訂單項目'} title={'訂單項目'}
                                value={itemTitle}
                            />
                            <BootstrapInput
                                gridWidth={'6'} readOnly={true}
                                label={'贊助金額'} title={'贊助金額'}
                                value={itemPrice}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapRadios
                                ref='paymentMethod' gridWidth={'12'} label={'付款方式'}
                                options={[
                                    {key: 'CVS', display: '超商付款'},
                                    {key: 'ATM', display: 'ATM 付款'},
                                    {key: 'Credit', display: '信用卡付款'},
                                ].filter(option => {
                                    return -1 != itemPaymentMethods.indexOf(option.key);
                                })}
                                value={paymentMethod} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='name' gridWidth={'12'}
                                label={'姓名'} title={'姓名'} autoFocus={true}
                                value={userData.name} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='phoneNumber' gridWidth={'12'} type={'number'}
                                label={'手機號碼'} title={'手機號碼'} readOnly={true}
                                value={userData.phoneNumber} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='email' gridWidth={'12'} type={'email'}
                                label={'電子郵件'} title={'電子郵件'}
                                value={userData.email} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='postcode' gridWidth={'3'} type={'number'}
                                label={'郵遞區號'} title={'郵遞區號'}
                                value={userData.postcode} onChange={this.onChange}
                            />
                            <BootstrapInput
                                ref='address' gridWidth={'9'} label={'地址'} title={'地址'}
                                value={userData.address} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapRadios
                                ref='receiptType' gridWidth={'12'} label={'發票種類'}
                                options={[
                                    {key: 'two', display: '二聯式發票'},
                                    {key: 'three', display: '三聯式發票'}
                                ]}
                                value={receipt.type} onChange={this.onChange}
                            />
                        </div>
                        {'three' === receipt.type && <div className='row'>
                            <BootstrapInput
                                ref='receiptNumber' gridWidth={'4'}
                                label={'統一編號'} title={'統一編號'}
                                value={receipt.number} onChange={this.onChange}
                            />
                            <BootstrapInput
                                ref='receiptTitle' gridWidth={'8'}
                                label={'公司名稱'} title={'公司名稱'}
                                value={receipt.title} onChange={this.onChange}
                            />
                        </div>}
                        <div className='row'>
                            <BootstrapInput
                                ref='remark' gridWidth={'12'} type={'textarea'}
                                label={'備註'} title={'備註'}
                                value={remark} onChange={this.onChange}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className='payment-form-buttons row'>
                        <div
                            className='payment-form-button primary col-md-4 col-md-offset-1'
                            role='button' onClick={this.submit}
                        >前往付款</div>
                        <div
                            className='payment-form-button col-md-4 col-md-offset-2'
                            role='button' onClick={this.cancel}
                        >回上一頁</div>
                    </div>
                </div>
                <div className='paper-shadow'></div>
            </div>
            <ConnectedFooter />
        </div>;
    }
}
module.exports = App;
