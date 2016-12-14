// ProjectItem.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectItem extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
    }
    componentDidMount() {}
    componentDidUpdate() {}
    render() {
        let item = {
            title: '贊助主題贊助主題贊助主題贊助主題贊助主題',
            price: 500,
            sponsorCount: 10,
            description: '贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容贊助內容',
            labels: ['限量 100 組', 'label2', 'label3'],
        };
        item = Object.assign(item, this.props.item);
        let itemStatus = Core.addNumberComma(item.sponsorCount) + ' 人';
        let media = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        media = Object.assign(media, this.props.picture, this.props.video);
        return <div ref='base' className='project-item' role='button'>
            <div className='project-item-header'>
                <h3 className='project-item-price'>${Core.addNumberComma(item.price)}</h3>
                <h5 className='project-item-status'>{itemStatus}</h5>
            </div>
            {0 < item.labels.length && <div className='project-item-labels'>{item.labels.map((label, index) =>
                <span className='project-item-label' key={index}>{label}</span>
            )}</div>}
            <h4 className='project-item-title'>{item.title}</h4>
            <div className='project-item-content'>
                <div className='project-item-description'>{item.description}</div>
                <img className='project-item-picture' src={media.src} title={media.title} />
            </div>
            <div className='project-item-fake-button'>
                <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
                立即贊助專案
            </div>
        </div>;
    }
}
module.exports = ProjectItem;
