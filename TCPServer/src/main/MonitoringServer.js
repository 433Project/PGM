var net = require('net');
var process = require('process');
var path = process.cwd();
var configuration = require('./util/Configuration.js').monitoring;
var monitor = require('./util/Monitor.js');

var server;
//var monitor = new Monitor();

function start() {
    console.log("server start . . .id :" + process.env.id);
   
    initialize();
}

function initialize() {
    console.log('load server configuration');
    console.log(configuration);
    //monitor.init();

    server = net.createServer(function (socket) {

        monitor.setTimer();

        socket.on('data', function (data) {
            // packet을 받았음.
            // inc packet count

            //console.log(data.byteLength);

            // byte -> packet gen
            // send message to =>
            monitor.getPacket();
        });

        socket.on('error', function (err) {
            console.log(err);
        });

        // client와 접속이 끊기는 메시지 출력
        socket.on('close', function () {
            console.log('client disconnted.');
            monitor.clear();
        });

    });// end create server

    server.listen(configuration.port, function () {
        console.log('[PGM][Monitoring] listening on ' + configuration.port);
    });
}

module.exports.start = start;