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
        const { newsfeeds = [], userProfiles = {} } = this.props;
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
        let eventItems = newsfeeds.map(newsfeed => {
            let nickname = 'pb+ 會員';
            let imageSrc = '/img/mock_user_icon.jpg';
            if(userProfiles[newsfeed.userPK]) {
                nickname = userProfiles[newsfeed.userPK].nickname || nickname;
                imageSrc = userProfiles[newsfeed.userPK].src || imageSrc;
            }
            return {
                nickname, imageSrc,
                type: newsfeed.type,
                text: newsfeed.message,
            };
        });
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
                                {0 < leftDays && <div className='current-state-item'>
                                    <div className='left-days'>{leftDays}</div>
                                    <div className='footnote'>剩餘天數</div>
                                </div>}
                                <div className='current-state-item'>
                                    <div className='founder-count'>{data.founderCount}</div>
                                    <div className='footnote'>贊助人數</div>
                                </div>
                                {0 >= leftDays && <div className='current-state-item'>
                                    <div className='left-days'>{'專案結束'}</div>
                                </div>}
                            </div>
                            <div className='recent-events'>
                                {eventItems.map((item, index) =>
                                    <div className='event-item' key={index}>
                                       <img className='event-item-image' src={item.imageSrc} title={item.nickname}/>
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
