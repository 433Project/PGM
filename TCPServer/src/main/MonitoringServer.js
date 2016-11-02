var net = require('net');
var process = require('process');
var path = process.cwd();
var configuration = require('./util/Configuration.js').monitoring;
var monitor = require('./util/Monitor.js');
const postMan = require('./util/PostMan.js');

//---------- Flat Buffer 
var flatbuffers = require('../../lib/flatbuffersjs.js').flatbuffers;
var Packet = require('../../schema/Packet_generated.js').packet;
var builder = new flatbuffers.Builder(0);

//---------- RabbitMQ Protocol 
var Message = require('./types/Message');
var Protocol = require('./types/Protocol');

var isStart = false;
var count = 0;

function start() {
    console.log("server start . . .id :" + process.env.id);
    initialize();
}

function initialize() {
    console.log('load server configuration');

    server = net.createServer(function (socket) {
        monitor.setTimer();

        // 'data' callback이 끝나기 전까지는 data buffer가 비워지지 않는다.
        socket.on('data', function (data) {

            //console.log(data.length);
            
            // packet을 받았음.
            // inc packet count
            console.log(data.readInt32BE(0));

            
            var idx = 0;
            /*
            while (idx<data.length) {

                // read header
                var headerBuff = new flatbuffers.ByteBuffer(new Uint8Array(data.slice(idx, idx + Protocol.HEADER_SIZE)));
                var header = Packet.Header.getRootAsHeader(headerBuff);

                idx += Protocol.HEADER_SIZE;
                
                var bodyBuff = new flatbuffers.ByteBuffer(new Uint8Array(data.slice(idx, idx + header.length())));
                var body = Packet.Body.getRootAsBody(bodyBuff);

                idx += header.length();
                
                if (body.cmd() == Packet.Command.PG_START) {
                    console.log('cmd : pg_start');
                    // publish monitoring start message
                    postMan.publish(new Message(Protocol.CMD_START, body.data()));
                }
                else if (body.cmd() == Packet.Command.PG_END) {
                    console.log('cmd : pg_end');
                    // publish monitoring end message
                    postMan.publish(new Message(Protocol.CMD_END, body.data()));
                }
                else if(body.cmd() == Packet.Command.PG_DUMMY){
                    // PG_DUMMY
                    count++;
                    console.log('cmd: pg_dummy');
                    //console.log('data: ' + body.data());
                    monitor.getPacket();
                }

            }// end loop

            */


            /*
            while (data.length != 0) {
                count++;

                if (count == 1000) {
                    console.log('1000!');
                    count = 0;
                }

                var buf = new flatbuffers.ByteBuffer(new Uint8Array(data.slice(0, 20)));
                //var packet = Packet.Packet.getRootAsPacket(buf);

                var header = Packet.Header.getRootAsHeader(buf);

                console.log(header);
                console.log(header.length());
                console.log(header.srcCode());
                console.log(header.srcType());
                console.log(header.dstCode());
                
                var bodyBuff = new flatbuffers.ByteBuffer(new Uint8Array(data.slice(0, header.length())));
                var body = Packet.Body.getRootAsBody(bodyBuff);

                if (body.cmd() == Packet.Command.PG_START) {
                    console.log('cmd : pg_start');
                    // publish monitoring start message
                    postMan.publish(new Message(Protocol.CMD_START, body.data()));
                }
                else if (body.cmd() == Packet.Command.PG_END) {
                    console.log('cmd : pg_end');
                    // publish monitoring end message
                    postMan.publish(new Message(Protocol.CMD_END, body.data()));
                }
                else {
                    // PG_DUMMY
                    console.log('cmd: pg_dummy');
                    //console.log('data: ' + body.data());
                    monitor.getPacket();
                }
            }
            */

            /*
            // handle command 
            if (packet.header().length() != 0) {
                
                var body = packet.body();
                
                if (body.cmd() == Packet.Command.PG_START) {
                    console.log('cmd : pg_start');
                    // publish monitoring start message
                    postMan.publish(new Message(Protocol.CMD_START, body.data()));
                }
                else if (body.cmd() == Packet.Command.PG_END) {
                    console.log('cmd : pg_end');
                    // publish monitoring end message
                    postMan.publish(new Message(Protocol.CMD_END, body.data()));
                }
                else {
                    // PG_DUMMY
                    monitor.getPacket();
                }
            }
            else {
                // dummy packets
                // inc count
            }
            */
        });

        socket.on('error', function (err) {
            console.log(err);
        });

        // client와 접속이 끊기는 메시지 출력
        socket.on('close', function () {
            console.log('packets : '  + count);
            console.log('client disconnted.');
            monitor.clear();
        });

    });// end create server

    server.listen(configuration.port, function () {
        console.log('[PGM][Monitoring] listening on ' + configuration.port);
    });
}

module.exports.start = start;

