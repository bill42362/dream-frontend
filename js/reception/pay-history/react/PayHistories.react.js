// PayHistories.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ClassNames from 'classnames';
import PayHistory from './PayHistory.react.js';

const ConnectedPayHistory = connect(
    undefined,
    (dispatch, ownProps) => ({
        cancelOrder: () => {
            if(!window.PBPlusDream) { Toastr.error('取消贊助失敗，請稍後再試。'); return; }
            return new Promise((resolve, reject) => {
                PBPlusDream.cancelOrder({
                    userUuid: ownProps.userUuid,
                    tradeNumber: ownProps.payHistory.id,
                    errorCallback: reject,
                    successCallback: resolve
                });
            })
            .then(response => { Toastr.success('取消贊助成功。'); })
            .catch(error => { Toastr.error('取消贊助失敗，請稍後再試。'); });
        },
    })
)(PayHistory);

class PayHistories extends React.Component {
    constructor(props) { super(props); this.state = { }; }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const { userUuid, payHistories } = this.props;
        return <div className='pay-histories'>
            {payHistories.map((payHistory, index) => {
                return <ConnectedPayHistory payHistory={payHistory} userUuid={userUuid} key={index} />;
            })}
        </div>;
    }
}
module.exports = PayHistories;
