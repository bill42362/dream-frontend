// NavbarMenu.react.js
import ClassNames from 'classnames';

class NavbarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    render() {
        let items = this.props.items;
        let currentItemKey = this.props.currentItemKey;
        let currentItem = items.filter(function(item) {
            return item.key === currentItemKey;
        })[0] || {key: 'home', display: 'Home'};
        return <div id="navbar-menu">
            <span className="menu-icon glyphicon glyphicon-list" aria-hidden="true"></span>
            <span className="menu-display">{currentItem.display}</span>
        </div>;
    }
}
module.exports = NavbarMenu;

