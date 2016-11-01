var net = require('net');
var process = require('process');
var path = process.cwd();
var configuration = require('./util/Configuration.js').monitoring;
var monitor = require('./util/Monitor.js');
const postMan = require('./util/PostMan.js');

var flatbuffers = require('../../lib/flatbuffersjs.js').flatbuffers;
var Packet = require('../../schema/Packet_generated.js').packet;
var builder = new flatbuffers.Builder(0);

var Message = require('./types/Message');
var Protocol = require('./types/Protocol');

var isStart = false;

function start() {
    console.log("server start . . .id :" + process.env.id);
    console.log(Packet);
    initialize();
}

function initialize() {
    console.log('load server configuration');
    //console.log(Packet.SrcDstType.CONNECTION_SERVER);
    console.log(configuration);

    server = net.createServer(function (socket) {

        //monitor.setTimer();

        // 'data' callback이 끝나기 전까지는 data buffer가 비워지지 않는다.
        socket.on('data', function (data) {
            // packet을 받았음.
            // inc packet count
            var tmp = new Uint8Array(data.slice(0,20));
            var buf = new flatbuffers.ByteBuffer(tmp);
            var header = Packet.Header.getRootAsHeader(buf);
            
            console.log(header.length()); 
            console.log(header.srcCode());
            console.log(header.srcType());
            console.log(header.dstCode());
            console.log(header.dstType());


            // handle command 
            if (header.length() != 0) {
                var tmpBody = new Uint8Array(data.slice(20, 20 + header.length()));

                var body = Packet.Body.getRootAsBody(new flatbuffers.ByteBuffer(tmpBody));
                
                if (body.cmd() == Packet.Command.PG_START) {
                    // publish monitoring start message
                    postMan.publish(new Message(Protocol.CMD_START, body.data()));
                }
                else if (body.cmd() == Packet.Command.PG_END) {
                    // publish monitoring end message
                    postMan.publish(new Message(Protocol.CMD_END, body.data()));
                }

                //console.log(body);
                //console.log('body[cmd]' + body.cmd());
                //console.log('body[data]' + body.data());
            }
            else {

                // dummy packets
                // inc count
                monitor.getPacket();
            }
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