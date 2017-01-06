// ConnectedAnimateSquare.react.js
'use strict'
import { connect } from 'react-redux';
import { Component } from 'animate-square';

const mapStateToProps = (state) => { return {squares: state}; };
export default connect(mapStateToProps)(Component);
