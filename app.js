#!/usr/bin/env node
'use strict'
const Debug = require('debug');
const Fs = require('fs');
const Express = require('express');
const BodyParser = require('body-parser');
const Session = require('express-session');
const Request = require('request');

const config = JSON.parse(Fs.readFileSync('./config.json', 'utf8'));
const App = function() {};
App.goLoginPage = function(request, response, next) {
    return response.redirect(
        config.LOGIN_URL
        || 'http://52.192.199.179:8000/page/auth?client_id=850479850ad111e6b5c10a138ae18a98'
    );
}
App.login = function(request, response, next) {
    if(request.body && request.body.token) {
        let url = 'https://api.pbplus.me/api/verification';
        let payload = { token: request.body.token, };
        Request.post(
            {url: url, json: payload,},
            (err, httpResponse, body) => {
                if('s' === body.code) {
                    request.session.sapId = request.body.user_pk;
                    request.session.token = request.body.token;
                }
                return response.redirect('/');
            }
        );
    }
}
App.session = function(request, response, next) { response.json(request.session); }
App.token = function(request, response, next) {
    response.json({token: request.session.token, sapId: request.session.sapId});
}
App.logout = function(request, response) {
    request.session.destroy();
    return response.redirect('/');
}
App.expressStaticRoutes = [
    {path: '/js/', serverPath: '/dist/js'},
    {path: '/css/', serverPath: '/dist/css'},
    {path: '/fonts/', serverPath: '/dist/fonts'},
    {path: '/img/', serverPath: '/dist/img'},
    {path: '/project(/:id)?', serverPath: '/dist/html/reception/project.html'},
    {path: '/message(/:id)?', serverPath: '/dist/html/reception/project-message.html'},
    {path: '/timeline(/:id)?', serverPath: '/dist/html/reception/project-timeline.html'},
    {path: '/:id', serverPath: '/dist/html/reception/project.html'},
    {path: '/', serverPath: '/dist/html/reception'},
];
App.prototype.server = Express();
App.prototype.run = function() {
    const server = this.server;
    let sessionConfig = {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {}
    };
    server.use(Session(sessionConfig))
    server.use(BodyParser.json());
    server.use(BodyParser.urlencoded({extended: true})); 
    if(server.get('env') === 'production') {
        server.set('trust proxy', 1) // trust first proxy 
        sessionConfig.cookie.secure = true // serve secure cookies 
    } else {
        server.get('/session', App.session)
    }
    server.post('/login', App.login);
    server.get('/login', App.goLoginPage);
    server.get('/token', App.token);
    server.get('/logout', App.logout)
    App.expressStaticRoutes.forEach(function(route) {
        server.use(route.path, Express.static(__dirname + route.serverPath));
    });
    server.listen(3000);
};
module.exports = App;

const app = new App();
app.run();
