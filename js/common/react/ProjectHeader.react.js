// ProjectHeader.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ProjectHeader extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        let banner = {
            type: 'image', title: '新城國小',
            src: "http://dream.pbplus.me/wp-content/uploads/2016/03/DSCN8334.jpg",
        };
        banner = Object.assign(banner, this.props.banner);
        let data = {
            title: '...', subtitle: '...', description: '...',
            foundTarget: 0, currentFound: 0, founderCount: 0,
            startTimestamp: Date.now()/1000, dueTimestamp: Date.now()/1000,
            awares: [],
        };
        data = Object.assign(data, this.props.project);
        let leftDays = (data.dueTimestamp - (Date.now()/1000))/86400;
        if(10 > leftDays) { leftDays = Math.round(10*leftDays)/10; }
        else { leftDays = Math.round(leftDays); }
        let eventItems = [
            {imageSrc: '/img/mock_user_icon.jpg', type: 'donation', text: 'AAA 捐了 $1000 給 BBB 計畫', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'comment', text: 'CCC 對 DDD 計畫說：加油喔！', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'facebook-like', text: 'CCC 對 DDD 計畫按讚', },
        ];
        eventItems = eventItems.concat(
            eventItems, eventItems, eventItems
        );
        return <div className='project-header'>
            <div className='title-section'>
                <h2 className='project-title'>{data.title}</h2>
                <h5 className='project-subtitle'>{data.subtitle}</h5>
            </div>
            <div className='content-section-container'>
                <div className='content-section row'>
                    <div className='col-md-8'>
                        <div className='banner'>
                            <div className='project-banner-image-container'>
                                <img
                                    className='project-banner-image'
                                    src={banner.src} title={banner.title}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='main-content'>
                            <div className='current-state'>
                                <div className='current-state-item'>
                                    <div className='found'>${Core.addNumberComma(data.currentFound)}</div>
                                    <div className='footnote'>目標金額 ${Core.addNumberComma(data.foundTarget)}</div>
                                </div>
                                <div className='current-state-item'>
                                    <div className='left-days'>{leftDays}</div>
                                    <div className='footnote'>剩餘天數</div>
                                </div>
                                <div className='current-state-item'>
                                    <div className='founder-count'>{data.founderCount}</div>
                                    <div className='footnote'>贊助人數</div>
                                </div>
                            </div>
                            <div className='recent-events'>
                                {eventItems.map((item, index) =>
                                    <div className='event-item' key={index}>
                                       <img className='event-item-image' src={item.imageSrc} />
                                       <span className='event-item-text'>{item.text}</span>
                                    </div>
                                )}
                            </div>
                            <div className='awares'>
                                {data.awares.map((aware, index) =>
                                    <div className='aware' key={index}>{aware}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
module.exports = ProjectHeader;
