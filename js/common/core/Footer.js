// Footer.js
'use strict';
import 'isomorphic-fetch';

const defaultState = {
    setting: {
        desktopOnlyPanelKeys: [0],
        mobilePanelKeys: [2],
        maxRwdMode: 'desktop',
    },
    contents: [
        {
            data: {main_panel: true, logo: true}, href: 'http://tw.pbplus.me',
            imageSrc: '/img/logo.svg', imageTitle: 'PBPlus',
            title: '運動讓生活更有趣',
        },
        {
            data: {main_panel: true, copyright: true},
            titles: ['© 2016-2017 pbplus.', 'All Rights Reserved'],
        },
        {
            data: {main_panel: true, app: true}, href: 'http://tw.pbplus.me',
            iconSrc: 'https://tv.pbplus.me/img/icon/apple-touch-icon-114x114.png', iconTitle: 'pb+TV',
            title: 'pb+TV App立即下載',
        },
    ],
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_FOOTER':
            const assignObject = {};
            assignObject[action.key] = action.footer;
            return Object.assign({}, state, assignObject);
        default:
            return state;
    }
}

const updateFooter = ({ key, footer }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'UPDATE_FOOTER', key, footer });
        resolve({ key, footer });
    });
}};

const fetchFooter = () => { return (dispatch, getState) => {
    return fetch(`${process.env.COMMON_BASE_URL}/menu/footer/pbplus`, {
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 !== response.status) { throw new Error('Bad response from server'); }
        const { contents } = response.message;
        if(contents) {
            return dispatch(updateFooter({key: 'contents', footer: contents}));
        }
    });
}};

const Actions = { fetchFooter };

export default { Reducer, Actions };

