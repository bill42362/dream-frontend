// Header.react.js
import ClassNames from 'classnames';
import NavbarMenu from './NavbarMenu.react.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        let navbarMenuItems = [];
        return <header id="header" className={ClassNames({'on-top': this.props.isOnTop})}>
            <nav className={ClassNames('navbar', {'navbar-fixed-top': this.props.fixed})}>
                <NavbarMenu currentItemKey={'home'} items={navbarMenuItems} />
                <div id="brand-icon-container">
                    <a href='/'>
                        <img className="brand-icon" src="/img/brand_icon_white.png" />
                    </a>
                </div>
                <div id="navbar-buttons">
                    <span className="navbar-icon glyphicon glyphicon-search" aria-label="search"></span>
                    <span className="navbar-icon glyphicon glyphicon-user" aria-label="user icon"></span>
                </div>
            </nav>
        </header>;
    }
}
module.exports = Header;
