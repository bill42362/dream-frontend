// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import BootstrapInput from '../../../common/react/BootstrapInput.react.js';
import BootstrapRadios from '../../../common/react/BootstrapRadios.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    onAjaxError(xhr) {
        let networkError = '網路錯誤，請檢查您的網路，或稍候再試一次。<br />'
            + 'Network error, please check your network, or try again later.';
        let systemError = '系統錯誤，請稍候再試一次。<br />System error, please try again later.';
        var errorStrings = this.staticStrings.errors;
        if(!xhr.message) {
            Toastr['error'](networkError);
        } else if(/[45]\d\d/.test(xhr.status)) {
            Toastr['error'](xhr.status + ' "' + xhr.message + '"<br />' + systemError);
        } else {
            Toastr['warning'](xhr.status + xhr.message);
        }
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const state = this.state;
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
                <div className='user-image-section'>
                    <div className='image-input-box'>
                        <img src='/img/mock_user_icon.jpg' />
                        <div className='edit-button' role='button'>
                            <span className='glyphicon glyphicon-camera'></span>
                        </div>
                    </div>
                </div>
                <div className='payment-form'>
                    <div className='payment-form-inputs'>
                        <div className='row'>
                            <BootstrapRadios
                                ref='paymentMethod' gridWidth={'12'} label={'付款方式'}
                                options={[
                                    {key: 'CVS', display: '超商付款'},
                                    {key: 'ATM', display: 'ATM 付款'},
                                    {key: 'Credit', display: '信用卡付款'},
                                ]}
                                value={'ATM'} onChange={(value) => { console.log(value); }}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='name' gridWidth={'12'}
                                label={'姓名'} title={'姓名'} autoFocus={true}
                                value={'大中天'} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='phoneNumber' gridWidth={'12'} type={'number'}
                                label={'手機號碼'} title={'手機號碼'} readOnly={true}
                                value={'0912999999'} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='email' gridWidth={'12'} type={'email'}
                                label={'電子郵件'} title={'電子郵件'}
                                value={'service@pcgbros.com'} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='postcode' gridWidth={'3'} type={'number'}
                                label={'郵遞區號'} title={'郵遞區號'}
                                value={'10694'} onChange={this.onChange}
                            />
                            <BootstrapInput
                                ref='address' gridWidth={'9'}
                                label={'地址'} title={'地址'}
                                value={'台北市大安區光復南路102號6樓之2'} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapRadios
                                ref='receiptType' gridWidth={'12'} label={'發票種類'}
                                status={'error'}
                                options={[
                                    {key: 'two', display: '二聯式發票'},
                                    {key: 'three', display: '三聯式發票'}
                                ]}
                                value={'two'} onChange={(value) => { console.log(value); }}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='receiptNumber' gridWidth={'4'}
                                label={'統一編號'} title={'統一編號'}
                                value={'54883155'} onChange={this.onChange}
                            />
                            <BootstrapInput
                                ref='receiptTitle' gridWidth={'8'}
                                label={'公司名稱'} title={'公司名稱'}
                                value={'寶悍運動平台'} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='remark' gridWidth={'12'} type={'textarea'}
                                label={'備註'} title={'備註'}
                                value={'安安你好'} onChange={this.onChange}
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
            <Footer />
        </div>;
    }
}
module.exports = App;
