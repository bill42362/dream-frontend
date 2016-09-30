// Carousel.react.js
'use strict'
import ClassNames from 'classnames';

class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        let carouselItems = [
            {imageSrc: '/img/mock_user_icon.jpg', type: 'donation', text: 'AAA 捐了 $1000 給 BBB 計畫', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'comment', text: 'CCC 對 DDD 計畫說：加油喔！', },
            {imageSrc: '/img/mock_user_icon.jpg', type: 'facebook-like', text: 'CCC 對 DDD 計畫按讚', },
        ];
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

