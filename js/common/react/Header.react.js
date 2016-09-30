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
        return <header id="header">
            <nav className="navbar navbar-fixed-top">
                <NavbarMenu currentItemKey={'home'} items={navbarMenuItems} />
                <div id="brand-icon-container">
                    <img className="brand-icon" src="/img/brand_icon_white.png" />
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
