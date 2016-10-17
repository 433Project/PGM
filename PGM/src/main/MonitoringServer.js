var net = require('net');
var process = require('process');
var path = process.cwd();
var configuration = require('./util/Configuration.js').monitoring;
var monitor = require('./util/Monitor.js');

var server;

function start() {
    console.log("server start . . .");
    initialize();
}

function initialize() {
    console.log('load server configuration');
    console.log(configuration);

    server = net.createServer(function (socket) {
        monitor.init();

        socket.on('data', function (data) {
            monitor.getPacket();
        });

        // client와 접속이 끊기는 메시지 출력
        socket.on('close', function () {
            console.log('client disconnted.');
        });
    });// end create server

    server.listen(configuration.port, function () {
        console.log('[PGM][Monitoring] listening on ' + configuration.port);    
    });
}

module.exports.start = start;