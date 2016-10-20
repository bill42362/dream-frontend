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
            title: 'item title',
            price: 500,
            sponsorCount: 10,
            content: 'item content item content item content item content item content item content ',
            labels: ['限量 100 組', 'label2', 'label3'],
            media: {
                type: 'image', title: '新城國小',
                src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
            },
        };
        let itemStatus = Core.addNumberComma(item.sponsorCount) + ' 人';
        return <div ref='base' className='project-item' >
            <div className='project-item-header'>
                <h3 className='project-item-price'>${Core.addNumberComma(item.price)}</h3>
                <h4 className='project-item-status'>{itemStatus}</h4>
            </div>
            <div className='project-item-labels'>{item.labels.map((label, index) =>
                <span className='project-item-label' key={index}>
                    {label}
                </span>
            )}</div>
            <h4 className='project-item-title'>{item.title}</h4>
            <p className='project-item-content' dangerouslySetInnerHTML={{__html: item.content}}></p>
        </div>;
    }
}
module.exports = ProjectItem;
