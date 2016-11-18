//----- node mudule
//var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var async = require('async');

//----- custom module 
var config = require('./util/Configuration.js').web;
var postMan = require('./util/PostMan.js');
var dataHolder = require('./util/DataHolder.js');
var test = require('./types/Test');

const logger = require('./util/Logger').logger;
var clientHolder = require('./util/ClientHolder');

//----- app variable
var client;

function start() {
   
    httpInit();
    ioInit();

    test.init();
    async.series([postMan.init, postMan.subscribe]);
}

// middleware
var reqLogger = function findIP(req, res, next) {
    logger.LOG('[HTTP][' + req.originalUrl + '] IP : ' + req.ip);
    next();
}

var httpInit = () => {

    app.use(reqLogger);

    // index
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    app.get('/info', function (req, res) {

        var from = req.query.from;
        var to = req.query.to;

        var result = test.dataHolder.getData(from, to);
        res.send(JSON.stringify(result));
    });

    app.get('/test', function (req, res) {
        res.download('./logs/test2016-11-15.txt', 'asdfasdfad.txt', (err) => {
            console.log(err);
        });
    });

    server.listen(config.port, config.ip, () => {
        logger.LOG('listening . . .');
    });
}

var ioInit = () => {
    io.on('connection', function (socket) {
        logger.LOG('web client connect');

        socket.on('disconnect', () => {
            logger.LOG('client disconnect');
            clientHolder.client = null;
        });
        clientHolder.client = socket;
    });
} 

module.exports.start = start;