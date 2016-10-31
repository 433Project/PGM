var net = require('net');
var process = require('process');
var path = process.cwd();
var configuration = require('./util/Configuration.js').monitoring;
var monitor = require('./util/Monitor.js');

var flatbuffers = require('../../lib/flatbuffersjs.js').flatbuffers;
var Packet = require('../../schema/Packet_generated.js').packet;

var server;
//var monitor = new Monitor();
var builder = new flatbuffers.Builder(0);


function start() {
    console.log("server start . . .id :" + process.env.id);
    console.log(Packet);
    initialize();
}

function initialize() {
    console.log('load server configuration');
    console.log(configuration);

    server = net.createServer(function (socket) {

        monitor.setTimer();

        socket.on('data', function (data) {
            // packet을 받았음.
            // inc packet count
            data = new Uint8Array(data);
            
            var buf = new flatbuffers.ByteBuffer(data);
            
            var genPacket = Packet.Header.getRootAsHeader(buf);

            console.log('오?');
            console.log(genPacket);
            console.log(genPacket.length()); 
            console.log(genPacket.srcCode());
            console.log(genPacket.srcType());

            console.log(genPacket.dstCode());
            console.log(genPacket.dstType());

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