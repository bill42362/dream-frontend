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
        const item = this.props.item;
        let limitedQuantityLabel = undefined;
        if(!!item.limitedQuantity) { limitedQuantityLabel = `限量 ${item.limitedQuantity} 組`; }
        const labels = [limitedQuantityLabel, ...item.labels];
        let itemStatus = Core.addNumberComma(item.sponsorCount) + ' 人';
        let media = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        media = Object.assign(media, this.props.picture, this.props.video);
        return <div ref='base' className='project-item' role='button'>
            <a href={'/pay?p=' + item.projectId + '&id=' + item.id} title={item.title} >
                <div className='project-item-header'>
                    <h3 className='project-item-price'>${Core.addNumberComma(item.price)}</h3>
                    <h5 className='project-item-status'>{itemStatus}</h5>
                </div>
                {0 < labels.length && <div className='project-item-labels'>
                    {labels.map((label, index) =>
                        <span className='project-item-label' key={index}>{label}</span>
                    )}
                </div>}
                <h4 className='project-item-title'>{item.title}</h4>
                <div className='project-item-content'>
                    <div className='project-item-description'>{item.description}</div>
                    <img className='project-item-picture' src={media.src} title={media.title} />
                </div>
                <div className='project-item-fake-button'>
                    <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
                    立即贊助專案
                </div>
            </a>
        </div>;
    }
}
module.exports = ProjectItem;
