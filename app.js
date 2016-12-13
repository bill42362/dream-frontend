'use strict'
const Debug = require('debug');
const Fs = require('fs');
const Hapi = require('hapi');
const Http2 = require('http2');
const Inert = require('inert'); // Static file server plugin for hapi.

const App = function() {};
App.prototype.server = new Hapi.Server();
App.prototype.listener = Http2.createServer({
    key: Fs.readFileSync('./ssl/localhost.key'),
    cert: Fs.readFileSync('./ssl/localhost.crt')
});
//App.prototype.listener.prototype.address = function() { return this._server.address() }
App.prototype.routes = [
    { method: 'get', path: '/{param*}', handler: { directory: {
        path: 'dist/html/reception', redirectToSlash: true, index: ['index.html'],
    } } },
    { method: 'get', path: '/{projectId}', handler: {
        file: { path: 'dist/html/reception/project.html', },
    } },
    { method: 'get', path: '/message/{projectId}', handler: {
        file: { path: 'dist/html/reception/project-message.html', },
    } },
    { method: 'get', path: '/message', handler: {
        file: { path: 'dist/html/reception/project-message.html', },
    } },
    { method: 'get', path: '/timeline/{projectId}', handler: {
        file: { path: 'dist/html/reception/project-timeline.html', },
    } },
    { method: 'get', path: '/timeline', handler: {
        file: { path: 'dist/html/reception/project-timeline.html', },
    } },
    { method: 'get', path: '/js/{param*}', handler: { directory: { path: 'dist/js', } } },
    { method: 'get', path: '/css/{param*}', handler: { directory: { path: 'dist/css', } } },
    { method: 'get', path: '/fonts/{param*}', handler: { directory: { path: 'dist/fonts', } } },
    { method: 'get', path: '/img/{param*}', handler: { directory: { path: 'dist/img', } } },
    { method: 'get', path: '/data/{param*}', handler: { directory: { path: 'data/', } } },
];
App.prototype.run = function() {
    const server = this.server;
    server.connection({listener: this.listener, port: '3000', tls: true});
    server.register(Inert, () => {});
    server.route(this.routes);
    server.start(err => {
        err && Debug('http2:error')(err);
        Debug('http2')(`Started ${server.connections.length} connections`);
    });
};
module.exports = App;

const app = new App();
app.run();
