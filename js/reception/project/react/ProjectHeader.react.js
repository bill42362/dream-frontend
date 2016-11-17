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
        let proposer = this.props.proposer;
        let banner = this.props.banner;
        let data = {
            title: '世界十二強的愛 傳送溫暖至偏鄉',
            subtitle: 'pb+圓夢加舉辦了世界12強紀念套票拍賣活動 活動所得將全數捐給新城國小',
            description: '專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述',
            foundTarget: 500000, currentFound: 300000, founderCount: 50,
            startTimestamp: 1472869212136, dueTimestamp: 1478139612136,
            proposerId: 'proposerId', banner: 'bannerId',
            awares: ['專案正在募資中!', '在 2016/11/11 20:00 募資結束前，', '至少募得 $200,000 便募資成功。'],
        };
        let leftDays = (data.dueTimestamp - data.startTimestamp)/86400000;
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
