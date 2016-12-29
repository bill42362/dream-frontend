// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import BootstrapInput from '../../../common/react/BootstrapInput.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            isTabbarAboveScreen: false
        };
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }
    isAboveScreenTop(element, offset) {
        var clientRect = element.getBoundingClientRect();
        return 0 > clientRect.top + offset;
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
    onWindowScroll(e) {
        var isTabbarAboveScreen = this.state.isTabbarAboveScreen;
        var newValue = this.isAboveScreenTop(this.refs.projectTabbarContainerAnchor, 0);
        if(isTabbarAboveScreen != newValue) { this.setState({isTabbarAboveScreen: newValue}); }
    }
    componentDidMount() { document.addEventListener('scroll', this.onWindowScroll, false); }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
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
                    <div className='row'>
                        <BootstrapInput
                            ref='name' gridWidth={'12'}
                            label={'姓名'} title={'姓名'} autoFocus={true}
                            value={''} onChange={this.onChange}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;
