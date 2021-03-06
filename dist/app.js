"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const logger = require("morgan");
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const dotnv = require("dotenv");
const errorHandler = require("errorhandler");
const session = require("express-session");
const config = require("config");
const passport = require("passport");
const routers_1 = require("./routers");
const winstonLogger_1 = require("./middleWares/winstonLogger");
const passportJs_1 = require("./middleWares/passportJs");
dotnv.config();
class App {
    constructor() {
        this.environmentHost = process.env.NODE_EVN || 'development';
        this.app = express();
        this.configure();
    }
    configure() {
        passportJs_1.default();
        // set up session
        this.sessionInstance = session({
            secret: config.get('session.secret'),
            cookie: {
                maxAge: 24 * 60 * 60 * 1000
            },
            resave: false,
            saveUninitialized: false
        });
        // connect mongoose
        mongoose.Promise = global.Promise;
        mongoose_1.connect(config.get('mongodb.stringConnection'))
            .then(() => {
            // mongooseConnection is useful when we want to use native mongodb
            this.mongooseConnection = mongoose.connection;
            winstonLogger_1.default.info('Mongoose connection!!');
        })
            .catch((error) => {
            winstonLogger_1.default.error(`Mongoose occurred a error: ${error}`);
        });
        // Morgan middleware
        this.environmentHost === 'development' ? this.app.use(logger('combined')) : this.app.use(logger('common'));
        // view engine
        this.app.set('view engine', 'ejs');
        // static resource config
        this.app.use(express.static(__dirname + '/../public'));
        // body parser middleware config
        this.app.use(body_parser_1.json());
        this.app.use(body_parser_1.urlencoded({
            extended: false,
            limit: '5mb',
            parameterLimit: 5000
        }));
        this.app.use(this.sessionInstance);
        // passport config
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // error handler
        this.environmentHost === 'development' ? this.app.use(errorHandler()) : undefined;
        this.app.use(routers_1.default.getRoute());
    }
}
exports.default = new App();
