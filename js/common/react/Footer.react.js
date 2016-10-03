// Footer.react.js
import React from 'react';
import ClassNames from 'classnames';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        let state = this.state;
        let siteMap = [
            {title: '關羽你的歌', items: [
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
            ]},
            {title: '上杉踩稻姬', items: [
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
            ]},
            {title: '明智脫光秀', items: [
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
            ]},
            {title: '郭嘉地理頻道', items: [
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
                {display: '關於我們', href: 'http://pcgbros.com/'},
            ]},
        ];
        return <footer id='footer'>
            <div id='footer-content' >
                <div className='site-map row'>
                    {siteMap.map((column, index) =>
                        <div className='site-map-column col-sm-3' key={index}>
                            <h5 className='site-map-column-title'>{column.title}</h5>
                            <ul className='site-map-column-list'>
                                {column.items.map((item, index) =>
                                    <li className='site-map-column-item' key={index}>
                                        <a href={item.href} target='_blank' title={item.display}>
                                            {item.display}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <div>©2016 pb<sup>+</sup> 運動平台</div>
                <div>All Rights Reserved.</div>
            </div>
        </footer>;
    }
}
module.exports = Footer;
