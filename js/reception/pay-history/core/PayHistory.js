// PayHistory.js
'use strict';

const defaultState = [];

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'ADD_PAY_HISTORY':
            return [...state, action.payHistory];
        case 'UPDATE_PAY_HISTORIES':
            return [...action.payHistories];
        default:
            return state;
    }
}

const payHistoryStatusDictionary = {default: 'ERROR', 0: 'NOT_PAY_YET', 1: 'PAIED', 2: 'CANCELED'};
const getPayHistoryTemplate = ({
    log_id = undefined,
    project_name = '', pid = '',
    title = '', amount = 0, basis = 'ATM', status = 0,
    payment_number = '', expire_timestamp = '',
    addressee = '', codezip = '', address = '',
    comments = '',
}) => ({
    id: log_id,
    projectTitle: project_name, projectId: pid,
    itemTitle: title, price: amount, paymentMethod: basis,
    status: payHistoryStatusDictionary[status] || payHistoryStatusDictionary.default,
    paymentNumber: payment_number, expireTimestamp: expire_timestamp,
    addressee, zipcode: codezip, address,
    comment: comments,
});

const addPayHistory = ({ payHistory }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        let resultPayHistory = getPayHistoryTemplate(payHistory);
        dispatch({type: 'ADD_PAY_HISTORY', payHistory: resultPayHistory});
        resolve(resultPayHistory);
    });
}; };

const updatePayHistories = ({ payHistories }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        let resultPayHistories = payHistories.map(getPayHistoryTemplate);
        dispatch({type: 'UPDATE_PAY_HISTORIES', payHistories: resultPayHistories});
        resolve(resultPayHistories);
    });
}; };

const Actions = { addPayHistory, updatePayHistories };

export default { Reducer, Actions, getPayHistoryTemplate };
