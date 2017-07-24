#!/usr/bin/env node
'use strict'
const Debug = require('debug');
const Fs = require('fs');
const Express = require('express');
const BodyParser = require('body-parser');
const Session = require('express-session');
const Request = require('request');
const RP = require('request-promise');
const URLSafe = require('urlsafe-base64');
const atob = require('atob');

const config = JSON.parse(Fs.readFileSync('./config.json', 'utf8'));
const apiBase = config.API_BASE || 'http://localhost:3000';
const App = function() {};
App.goLoginPage = function(request, response, next) {
    let ref = '&ref=' + request.query.location || '';
    let url = config.LOGIN_URL
        || 'http://52.192.199.179:8000/page/auth?client_id=850479850ad111e6b5c10a138ae18a98';
    return response.redirect(url + ref);
}
App.login = function(request, response, next) {
    if(request.body && request.body.token) {
        let url = 'https://api.pbplus.me/api/verification';
        let payload = { token: request.body.token, };
        const quertLocation = atob(URLSafe.decode(request.body.ref));
        Request.post(
            {url: url, json: payload,},
            (err, httpResponse, body) => {
                if('s' === body.code) {
                    request.session.sapId = request.body.user_pk;
                    request.session.token = request.body.token;
                }
                return response.redirect(quertLocation);
            }
        );
    }
}
App.session = function(request, response, next) { response.json(request.session); }
App.token = function(request, response, next) {
    response.json({token: request.session.token, sapId: request.session.sapId});
}
App.logout = function(request, response) {
    const quertLocation = atob(URLSafe.decode(request.query.location));
    request.session.destroy();
    return response.redirect(quertLocation);
}
App.expressStaticRoutes = [
    {path: '/js/', serverPath: '/dist/js'},
    {path: '/css/', serverPath: '/dist/css'},
    {path: '/fonts/', serverPath: '/dist/fonts'},
    {path: '/img/', serverPath: '/dist/img'},
    {path: '/payhistory', serverPath: '/dist/html/reception/pay-history.html'},
    {path: '/pay(/:id)?', serverPath: '/dist/html/reception/pay.html'},
    {path: '/userinfo', serverPath: '/dist/html/reception/user-info.html'},
    {path: '/', serverPath: '/dist/html/reception/'},
];
App.expressRenderRoutes = [
    {path: '/project(/:id)?', ejs: 'project.ejs'},
    {path: '/message(/:id)?', ejs: 'project-message.ejs'},
    {path: '/timeline(/:id)?', ejs: 'project-timeline.ejs'},
    {path: '/:id', ejs: 'project.ejs'},
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

    server.set('view engine', 'ejs'); 
    server.set('views', __dirname + '/ejs');
    App.expressRenderRoutes.forEach(function(route) {
        server.get(route.path, function(request, response) {
            const id = request.params.id || request.query.p;
            const options = {
                url: `${apiBase}/read/${id}`, json: true,
                transform: function(response) {
                    if(200 === response.status && response.message[0]) { return response.message[0]; }
                    else { return undefined; }
                },
            };
            RP(options)
            .then(function(result) {
                return response.render(route.ejs, {
                    description: result.description,
                    og: {
                        url: `https://dream.pbplus.me/${id}`,
                        title: result.project_name,
                        description: result.description,
                        image: result.picture_src,
                    },
                });
            })
            .catch(function(error) {
                console.log('render() error:', error, ', id:', request.params.id);
                return response.render('index.ejs');
            });
        });
    });
    server.listen(3000);
};
module.exports = App;

const app = new App();
app.run();
