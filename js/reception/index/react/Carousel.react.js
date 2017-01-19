// Carousel.react.js
'use strict'
import ClassNames from 'classnames';

class Carousel extends React.Component {
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
        };
    }
    render() {
        const { mockIcons } = this.state;
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
        return <div id="carousel">
            {carouselItems.map((item, index) =>
                <div className='carousel-item' key={index}>
                    <div className='carousel-item-image-wrapper'>
                        {item.imageSrc && <img className='carousel-item-image' src={item.imageSrc} />}
                        {!item.imageSrc && <div
                            className='carousel-mock-image'
                            style={{
                                width: '100%', height: '100%',
                                color: 'darkorchid', fontWeight: '600',
                                textAlign: 'center', lineHeight: '4em'
                            }}
                        >{mockIcons[index]}</div>}
                    </div>
                    <div className='carousel-item-text'>{`${item.text} ..................`}</div>
                </div>
            )}
        </div>;
    }
}
module.exports = Carousel;

