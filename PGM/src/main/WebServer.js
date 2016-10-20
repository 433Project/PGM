var express = require('express');
var path = require('path');
var config = require('./util/Configuration.js').web;
var monitor = require('./util/Monitor.js');

var app = express();


function start() {
    init();
}

var reqLogger = function findIP(req, res, next) {
    console.log('[PGM][WEB][' + req.originalUrl +'] IP : ' + req.ip);
    next();
}

function init() {

    app.use(reqLogger);

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    app.get('/info', function (req, res) {
        
        var from = req.query.from;
        var to = req.query.to;

        console.log('from,to =>' + from +',' + to);
        
        var result = monitor.getPerformData(from, to);
        console.log(result);
        res.send(JSON.stringify(result));
    });

    app.listen(config.port, config.ip, function () {
        console.log('[PGM][WEB] waiting  on ' + config.ip + ':' + config.port + '. . .');
    });
}

module.exports.start = start;