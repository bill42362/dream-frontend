// Header.react.js
import ClassNames from 'classnames';
import NavbarMenu from './NavbarMenu.react.js';
import ContentEditable from './ContentEditable.react.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditingSearchText: false, searchText: '',
            isUserPanelCollapsed: true, isUserPanelHidden: true,
        };
        this.switchUserPanel = this.switchUserPanel.bind(this);
        this.startEditSearchText = this.startEditSearchText.bind(this);
        this.stopEditSearchText = this.stopEditSearchText.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
    }
    switchUserPanel() {
        this.setState({
            isUserPanelCollapsed: !this.state.isUserPanelCollapsed,
            isUserPanelHidden: false,
        });
    }
    startEditSearchText() { this.setState({ isEditingSearchText: true }); }
    stopEditSearchText() { this.setState({ isEditingSearchText: false }); }
    onSearchTextChange(text) { this.setState({searchText: text}); }
    render() {
        const state = this.state;
        let navbarMenuItems = [];
        return <header id="header" className={ClassNames({'on-top': this.props.isOnTop})}>
            <nav className={ClassNames(
                'navbar', {'navbar-fixed-top': this.props.fixed},
                {'navbar-user-panel-shown': !state.isUserPanelCollapsed}
            )}>
                <NavbarMenu currentItemKey={'home'} items={navbarMenuItems} />
                <div id="brand-icon-container">
                    <a href='/'>
                        <img className="brand-icon" src="/img/brand_icon_white.png" />
                    </a>
                </div>
                <div id="navbar-buttons">
                    <div className='navbar-search-container'>
                        <div className={ClassNames('navbar-search', {'editing': this.state.isEditingSearchText})}>
                            <span
                                className="navbar-icon glyphicon glyphicon-search" aria-label="search"
                                role='button' onClick={this.startEditSearchText}
                            ></span>
                            {this.state.isEditingSearchText && <ContentEditable
                                className="navbar-search-text" role='input'
                                value={this.state.searchText} autoFocus={true}
                                onChange={this.onSearchTextChange}
                                onBlur={this.stopEditSearchText}
                            />}
                        </div>
                    </div>
                    <span
                        className="navbar-icon glyphicon glyphicon-user"
                        aria-label="user profile icon" role='button' onClick={this.switchUserPanel}
                    ></span>
                </div>
            </nav>
            <div className={ClassNames(
                'user-panel',
                {'collapse': this.state.isUserPanelCollapsed},
                {'hidden': this.state.isUserPanelHidden}
            )}>
                <div className='user-panel-profile'>
                    <div className='user-panel-profile-picture-wrapper'>
                        <img className='user-panel-picture' src='/img/mock_user_icon.jpg'/>
                    </div>
                    <div className='user-panel-profile-texts'>
                        <div className='user-panel-nickname'>USER_NICKNAME</div>
                        <div className='user-panel-email'>abc@abc.abc</div>
                    </div>
                </div>
                <hr className='user-panel-seperator' />
                <div className='user-panel-buttons'>
                    <a className='user-panel-button user-center' role='button'>使用者中心</a>
                    <a className='user-panel-button logout' role='button'>登出</a>
                </div>
            </div>
        </header>;
    }
}
module.exports = Header;
