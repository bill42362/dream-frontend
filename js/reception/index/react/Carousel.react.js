// Carousel.react.js
'use strict'
import { Component } from 'react';
import ClassNames from 'classnames';

class Carousel extends Component {
    constructor(props) {
        super(props);
        const mockIconPool = [
            '山羌', '鳳蝶', '黑熊', '石虎', '獼猴',
            '蛇蜥', '眼蝶', '野豬', '麝鼩', '森鼠',
            '刺鼠', '狐蝠', '雲豹', '八哥', '山雀',
            '雲雀', '卷尾', '藪眉', '畫眉', '草蜥',
        ];
        this.state = {
            mockIcons: mockIconPool.sort(() => { return Math.floor(2*Math.random()) - 1; }),
            detailBoxIndex: 0,
            detailBoxPosition: {x: 0, y: 60},
            shouldShowDetailBox: false,
        };
        this.updateDetailBoxState = this.updateDetailBoxState.bind(this);
    }
    updateDetailBoxState({ index, isEnter, targetElement }) {
        const { detailBoxIndex, shouldShowDetailBox } = this.state;
        const baseRect = this.refs.base.getBoundingClientRect();
        const itemRect = targetElement.getBoundingClientRect();
        const detailBoxPosition = {
            x: itemRect.left - baseRect.left,
            y: itemRect.bottom - baseRect.top + 4,
        };
        this.setState({ detailBoxPosition, shouldShowDetailBox: isEnter, detailBoxIndex: index});
    }
    render() {
        const { mockIcons, detailBoxIndex, shouldShowDetailBox, detailBoxPosition } = this.state;
        const { newsfeeds, userProfiles } = this.props;
        let carouselItems = newsfeeds.map(newsfeed => {
            let nickname = 'pb+ 會員';
            let imageSrc = '';
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
        return <div id="carousel" ref='base' >
            <div className='carousel-items'>
                {carouselItems.map((item, index) =>
                   <div
                       className='carousel-item' key={index}
                       onMouseEnter={(e) => { this.updateDetailBoxState({ index, isEnter: true, targetElement: e.target}); }}
                       onMouseLeave={(e) => { this.updateDetailBoxState({ index, isEnter: false, targetElement: e.target}); }}
                   >
                        <div className='carousel-item-image-wrapper'>
                            {item.imageSrc && <img className='carousel-item-image' src={item.imageSrc} />}
                            {!item.imageSrc && <div className='carousel-mock-image' >{mockIcons[index]}</div>}
                        </div>
                    </div>
                )}
            </div>
            {shouldShowDetailBox && !!carouselItems[detailBoxIndex] && <div
                className='carousel-item-detail-box'
                style={{left: detailBoxPosition.x, top: detailBoxPosition.y}}
            >
                {carouselItems[detailBoxIndex].text}
            </div>}
        </div>;
    }
}
module.exports = Carousel;

