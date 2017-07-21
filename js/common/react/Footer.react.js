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
        const { links } = this.props;
        let state = this.state;
        const siteMap = links || [];
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
