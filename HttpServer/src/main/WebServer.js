//----- node mudule
var express = require('express');
var path = require('path');
var async = require('async');

//----- custom module 
var config = require('./util/Configuration.js').web;
var postMan = require('./util/PostMan.js');
var dataHolder = require('./util/DataHolder.js');
var test = require('./types/Test');

var app = express();

function start() {
    //fileLogger.createFile();
    init();
    test.init();
    async.series([postMan.init, postMan.subscribe]);
}

// middleware
var reqLogger = function findIP(req, res, next) {
    console.log('[HTTP][' + req.originalUrl + '] IP : ' + req.ip);
    next();
}
    
// webserver init
function init() {

    app.use(reqLogger);

    // index
    app.get('/', function (req, res) {
        //postMan.subscribe();
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    // /info?from,to
    app.get('/info', function (req, res) {

        var from = req.query.from; 
        var to = req.query.to;

        console.log('from,to =>' + from + ',' + to);

        var result = test.dataHolder.getData(from, to);
        //console.log(result);
        res.send(JSON.stringify(result));
    });

    app.get('/pub/:msg', function (req, res) {
        var msg = req.params.msg;
        console.log(msg);
        postMan.publish(msg);
    });

    app.get('/sub', function (req, res){
        postMan.subscribe();
    })

    app.get('/test', function (req, res) {

        res.sendFile(test.getLogPath(), (err) => {
            console.error(err);
        });

    });

    app.listen(config.port, config.ip, function () {
        console.log('\n=======================================================');
        console.log('[HTTP] waiting  on ' + config.ip + ':' + config.port + '. . .');
        console.log('\n=======================================================');
    });
}


module.exports.start = start;