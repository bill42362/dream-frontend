// Carousel.react.js
'use strict'
import ClassNames from 'classnames';

class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        const { newsfeeds, userProfiles } = this.props;
        let carouselItems = newsfeeds.map(newsfeed => {
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
        return <div id="carousel">
            {carouselItems.map((item, index) =>
                <div className='carousel-item' key={index}>
                   <img className='carousel-item-image' src={item.imageSrc} />
                   <span className='carousel-item-text'>{item.text}</span>
                </div>
            )}
        </div>;
    }
}
module.exports = Carousel;

