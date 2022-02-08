const express = require('express');
const hbs = require('express-handlebars');
const authMiddleware = require('./../services/authService.js');
const cookieParser = require('cookie-parser');
module.exports = (app) => {

    app.engine('hbs', hbs.engine({
        extname: 'hbs'
    }));
    app.set('view engine', 'hbs');
    app.use(express.urlencoded({
        extended: true
    }));

    app.use('/static', express.static('static'));
    app.use(cookieParser());
    app.use(authMiddleware());
}
