var express = require('express');
var path = require('path');
var config = require('./util/Configuration.js').web;
var monitor = require('./util/Monitor.js');

var app = express();


function start() {
    init();
}

function init() {

    app.get('/', function (req, res) {
        //res.set('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    app.get('/info', function (req, res) {
        res.send(JSON.stringify(monitor.performanceHolder));
    });

    app.listen(config.port, config.ip, function () {
        console.log('[PGM][WEB] waiting . . .');
    });
}


module.exports.start = start;