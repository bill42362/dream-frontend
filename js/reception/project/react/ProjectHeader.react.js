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
    reverseDigitString(string) { return string.split('').reverse().join(''); }
    addNumberComma(number) {
        let intString = Math.floor(number) + '';
        let reversedWithComma = this.reverseDigitString(intString).split(/(\d{3})/).filter(n => n).join(',');
        let result = this.reverseDigitString(reversedWithComma);
        let floatPart = (number + '').replace(/\d*\.?/, '');
        if(floatPart) { result += '.' + floatPart; }
        return result;
    }
    render() {
        let proposer = this.props.proposer;
        let banner = this.props.banner;
        let data = {
            title: '世界十二強的愛 傳送溫暖至偏鄉',
            subtitle: 'pb+圓夢加舉辦了世界12強紀念套票拍賣活動，活動所得將全數捐給新城國小',
            description: '專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述專案敘述',
            foundTarget: 500000, currentFound: 300000, founderCount: 50,
            startTimestamp: 1472869212136, dueTimestamp: 1478139612136,
            proposerId: 'proposerId', banner: 'bannerId',
        };
        let leftDays = (data.dueTimestamp - data.startTimestamp)/86400000;
        let sharingIcons = [
            {
                key: 'facebook', spanClassName: 'facebook',
                imgTitle: 'share to facebook', src: '/img/facebook_share_icon.png'
            },
            {
                key: 'googlePlus', spanClassName: 'google-plus',
                imgTitle: 'share to google+', src: '/img/google_plus_share_icon.png'
            },
            {
                key: 'twitter', spanClassName: 'twitter',
                imgTitle: 'tweet it', src: '/img/twitter_share_icon.png'
            },
            {
                key: 'tumblr', spanClassName: 'tumblr',
                imgTitle: 'share to tumblr', src: '/img/tumblr_share_icon.png'
            },
        ];
        let eventItems = [
            {imageSrc: '/img/mock_user_icon.jpg', type: 'donation', text: 'AAA 捐了 $1000 給 BBB 計畫', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'comment', text: 'CCC 對 DDD 計畫說：加油喔！', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'facebook-like', text: 'CCC 對 DDD 計畫按讚', },
        ];
        eventItems = eventItems.concat(
            eventItems, eventItems, eventItems, eventItems,
            eventItems, eventItems, eventItems, eventItems,
            eventItems, eventItems, eventItems, eventItems
        );
        return <div className='project-header'>
            <div className='title-section'>
                <h2 className='project-title'>{data.title}</h2>
                <h5 className='project-subtitle'>{data.subtitle}</h5>
            </div>
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
                <div className='col-md-4 absolute-height-100'>
                    <div className='main-content'>
                        <div className='current-state'>
                            <div className='found'>${this.addNumberComma(data.currentFound)}</div>
                            <div className='footnote'>目標 ${this.addNumberComma(data.foundTarget)}</div>
                            <div className='founder-count'>{data.founderCount}</div>
                            <div className='footnote'>人贊助</div>
                            <div className='left-days'>{leftDays}</div>
                            <div className='footnote'>剩餘天數</div>
                        </div>
                        <div className='share'>
                            {sharingIcons.map(icon =>
                                <span
                                    className={ClassNames('share-icon', icon.spanClassName)}
                                    key={icon.key}
                                >
                                    <img
                                        className='share-icon-image'
                                        title={icon.imgTitle} src={icon.src}
                                    ></img>
                                </span>
                            )}
                            <div className='footnote'>分享</div>
                        </div>
                        <div className='recent-events'>
                            {eventItems.map((item, index) =>
                                <div className='event-item' key={index}>
                                   <img className='event-item-image' src={item.imageSrc} />
                                   <span className='event-item-text'>{item.text}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
module.exports = ProjectHeader;
