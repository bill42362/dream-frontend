// ConnectedFooter.react.js
import { connect } from 'react-redux';
import Footer from './Footer.react.js';

export default connect(state => { return {links: state}; })(Footer);
