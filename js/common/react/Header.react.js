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
            </nav>
        </header>;
    }
}
module.exports = Header;
