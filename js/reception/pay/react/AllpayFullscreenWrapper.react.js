// AllpayFullscreenWrapper.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class AllpayFullscreenWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { initTimestamp: Date.now(), progress: 1.0, frameRequest: 0 };
        this.updateCountdownBar = this.updateCountdownBar.bind(this);
    }
    updateCountdownBar() {
        const { initTimestamp } = this.state;
        const { expireTimestamp } = this.props;
        const progress = (expireTimestamp - Date.now())/(expireTimestamp - initTimestamp);
        this.setState({progress});
        if(0 < progress) { window.requestAnimationFrame(this.updateCountdownBar); }
    }
    componentDidMount() {
        if(!!this.props.expireTimestamp) {
            this.setState({frameRequest: window.requestAnimationFrame(this.updateCountdownBar)});
        }
    }
    componentWillUnmount() { window.cancelAnimationFrame(this.state.frameRequest); }
    render() {
        const { progress } = this.state;
        const { closeAllpayIframe, expireTimestamp } = this.props;
        const offset = 0.1*(Date.now()%1000);
        return <div className='allpay-fullscreen-wrapper'>
            {!!expireTimestamp && <div className='allpay-payment-countdown'>
                {`請於 ${Math.floor((expireTimestamp - Date.now())/1000)} 秒內完成結帳`}
            </div>}
            <div className='allpay-iframe-container' style={{overflow: 'hidden'}}>
                {!!expireTimestamp && <div
                    className='allpay-payment-countdown-bar'
                    style={{
                        background: `repeating-linear-gradient(`
                            + `to left, crimson ${offset}px, tomato ${offset + 50}px, crimson ${offset + 100}px`
                        + `)`, 
                        width: `${100*progress}%`
                    }}
                ></div>}
                <iframe className='allpay-iframe' name='allpay_iframe'/>
            </div>
            <div
                className='allpay-cancel-button' role='button' onClick={closeAllpayIframe}
            >取 消</div>
        </div>;
    }
}
module.exports = AllpayFullscreenWrapper;
