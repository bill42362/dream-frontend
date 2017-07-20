// ProjectHeader.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Carousel from './Carousel.react.js';

class ProjectHeader extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = { };
    }
    render() {
        const { newsfeeds = [], userProfiles = {}, project } = this.props;
        let banner = Object.assign(
            {type: 'image', title: '', src: ''},
            this.props.banner
        );
        let bannerElement = <img className='project-banner-image' src={banner.src} title={banner.title} />;
        if(project.videoUrl) {
            const videoUrl = project.videoUrl;
            const videoSrcMatch = videoUrl.match(/^.*(?:youtube).*=(.*)$/) || videoUrl.match(/^.*(?:youtu\.be)\/(.*)$/);
            if(videoSrcMatch) {
                bannerElement = <iframe
                    className='project-banner-youtube'
                    src={`https://www.youtube.com/embed/${videoSrcMatch[1]}`}
                    frameBorder='0' allowFullScreen
                ></iframe>;
            }
        }
        let data = {
            title: '...', subtitle: '...', description: '...',
            foundTarget: 0, currentFound: 0, founderCount: 0,
            startTimestamp: Date.now()/1000, dueTimestamp: Date.now()/1000,
            awares: [],
        };
        data = Object.assign(data, project);
        let leftDays = (data.dueTimestamp - (Date.now()/1000))/86400;
        if(10 > leftDays) { leftDays = Math.round(10*leftDays)/10; }
        else { leftDays = Math.round(leftDays); }
        return <div className='project-header'>
            <div className='title-section'>
                <h2 className='project-title'>{data.title}</h2>
                <h5 className='project-subtitle'>{data.subtitle}</h5>
            </div>
            <div className='content-section-container'>
                <div className='content-section row'>
                    <div className='col-md-8'>
                        <div className='banner'>
                            <div className='project-banner-container'>
                                {bannerElement}
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
                                <Carousel newsfeeds={newsfeeds} />
                            </div>
                            {!!data.awares.length && <div className='awares'>
                                {data.awares.map((aware, index) =>
                                    <div className='aware' key={index}>{aware}</div>
                                )}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
module.exports = ProjectHeader;
