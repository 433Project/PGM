﻿var express = require('express');
var path = require('path');
var config = require('./util/Configuration.js').web;

var postMan = require('./util/PostMan.js');
var dataHolder = require('./util/DataHolder.js');
var async = require('async');

var app = express();

function start() {
    //async.series([init, postMan.init, postMan.subscribe]);
    init();


    async.series([postMan.init, postMan.subscribe]);
    //postMan.init();
    //postMan.subscribe();
}

var reqLogger = function findIP(req, res, next) {
    console.log('[HTTP][' + req.originalUrl + '] IP : ' + req.ip);
    next();
}

function init(callback) {

    app.use(reqLogger);

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    app.get('/info', function (req, res) {

        var from = req.query.from;
        var to = req.query.to;

        console.log('from,to =>' + from + ',' + to);

        var result = dataHolder.getData(from, to);
        console.log(result);
        res.send(JSON.stringify(result));
    });

    app.get('/pub/:msg', function (req, res) {
        var msg = req.params.msg;
        console.log(msg);
        postMan.publish(msg);
    });

    app.get('/sub', function (req, res) {
        postMan.subscribe();
    })

    app.listen(config.port, config.ip, function () {
        console.log('\n=======================================================');
        console.log('[HTTP] waiting  on ' + config.ip + ':' + config.port + '. . .');
        console.log('\n=======================================================');
        //postMan.subscribe();
    });
}

module.exports.start = start;