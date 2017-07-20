// Sitemap.js
'use strict';
import Request from 'request';

const apiBase = process.env.API_BASE || 'http://localhost';

const Reducer = (state = [], action) => {
    switch(action.type) {
        case 'UPDATE_LINLS':
            return action.sitemap;
        default:
            return state;
    }
}

const Actions = {
    updateLinks: () => { return (dispatch) => {
        let url = `${apiBase}/readSitemap`;
        Request.get({url}, (err, httpResponse, body) => {
            if(err) { return; }
            else {
                const response = JSON.parse(body);
                if(response && response.Item && response.Item.sitemap) {
                    const sitemapObject = response.Item.sitemap;
                    const sitemap = Object.keys(sitemapObject).map(groupName => {
                        return {
                            title: groupName,
                            items: sitemapObject[groupName].map(link => {
                                return {
                                    display: link.title,
                                    href: link.url,
                                };
                            }),
                        };
                    });
                    dispatch({type: 'UPDATE_LINLS', sitemap});
                }
            }
        });
    }},
};

export default { Reducer, Actions };
