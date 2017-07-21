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
        const {props, state} = this;
        const item = props.item;
        const now = Date.now()/1000;
        const isItemAvaliable =
            !props.isProjectFinished
            && now < item.limitedTimestamp
            && item.sponsorCount < item.limitedQuantity;
        let href = isItemAvaliable ? `/pay?p=${item.projectId}&id=${item.id}` : undefined;
        let limitedQuantityLabel = undefined;
        if(!!item.limitedQuantity) { limitedQuantityLabel = `限量 ${item.limitedQuantity} 組`; }
        const labels = [limitedQuantityLabel, ...item.labels];
        let itemStatus = Core.addNumberComma(item.sponsorCount) + ' 人';
        let media = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        media = Object.assign(media, this.props.picture, this.props.video);
        let buttonDisplay = '立即贊助專案';
        if(!isItemAvaliable) {
            if(props.isProjectFinished) { buttonDisplay = '專案已經結束'; }
            else if(now >= item.limitedTimestamp) { buttonDisplay = '已截止贊助'; }
            else if(item.sponsorCount >= item.limitedQuantity) { buttonDisplay = '贊助名額已滿'; }
            else { buttonDisplay = '已停止'; }
        }
        return <div
            ref='base' role='button'
            className={ClassNames('project-item', {'unavaliable': !isItemAvaliable})}
        >
            <a href={href} title={item.title} >
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
                    {isItemAvaliable && <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>}
                    {buttonDisplay}
                </div>
            </a>
        </div>;
    }
}
module.exports = ProjectItem;
