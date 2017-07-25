// PayHistory.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ClassNames from 'classnames';

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

class PayHistory extends React.Component {
    constructor(props) {
        super(props); this.state = { };
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const { payHistory, cancelOrder } = this.props;
        return <div className='pay-history'>
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
                            {'NOT_PAY_YET' === payHistory.status && 'Credit' === payHistory.paymentMethod && <div
                                className='pay-history-content-item-button' role='button'
                                onClick={cancelOrder}
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
    }
}
module.exports = PayHistory;
