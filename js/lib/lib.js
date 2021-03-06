'use strict'
let $ = require('jquery');
window.$ = $;

let Toastr = require('toastr');
window.Toastr = Toastr;

let ClassNames = require('classnames');
window.ClassNames = ClassNames;

let React = require('react');
window.React = React;

let ReactDOM = require('react-dom');
window.ReactDOM = ReactDOM;

let TinyMCE = require('react-tinymce');
window.TinyMCE = TinyMCE;

let AnimateSquare = require('animate-square');
window.AnimateSquare = AnimateSquare;

let MersenneTwister = require('mersenne-twister');
window.MersenneTwister = MersenneTwister;

let PbplusMemberSDK = require('pbplus-member-sdk');
window.PbplusMemberSDK = PbplusMemberSDK;

require('es6-promise').polyfill();
