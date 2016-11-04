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
var Header = require('./types/Header');
var ConsoleLogger = require('./util/ConsoleLogger');

var isStart = false;
var count = 0;

var startTime;
var endTime; 

var targetBuff;
var tmpBuff;


function start() {
    console.log("server start . . .id :" + process.env.id);
    initialize();
}

function initialize() {
    console.log('load server configuration');

    server = net.createServer(function (socket) {
        //monitor.setTimer();
        // 'data' callback이 끝나기 전까지는 data buffer가 비워지지 않는다.

        startTime = process.hrtime();

        tmpBuff = Buffer.alloc(0);

        socket.on('data', function (data) {

            var idx = 0;
            var header;

            try {

                /*
                targetBuff = Buffer.alloc(tmpBuff.length + data.length);

                // 이전에 keep해둔 버퍼가 있는 경우
                if (tmpBuff.length != 0) {
                    //data.copy(targetBuff, targetBuff.length, 0, data.length);
                    tmpBuff.copy(targetBuff, 0, 0, tmpBuff.length);    
                }

                data.copy(targetBuff, targetBuff.length, 0, data.length);

                */

                while (data.length >= Protocol.HEADER_SIZE && idx + Protocol.HEADER_SIZE < data.length) {

                    header = Header.bytesToHeader(data.slice(idx, idx + Protocol.HEADER_SIZE));
                    
                    idx += Protocol.HEADER_SIZE;

                    var bodyBuff = new flatbuffers.ByteBuffer(new Uint8Array(data.slice(idx, idx + header.length)));
                    var body = Packet.Body.getRootAsBody(bodyBuff);
                    
                    if (idx + header.length >= data.length) {

                        /*
                        tmpBuff = data.slice(idx, data.length);// keep 
                        break;
                        */
                        break;
                    }

                    idx += header.length;

                    if (body.cmd() == Packet.Command.PG_START) {

                        ConsoleLogger.StartMessage('Monitoring Start');

                        // publish monitoring start message
                        postMan.publish(new Message(Protocol.CMD_START, body.data()));
                    }
                    else if (body.cmd() == Packet.Command.PG_END) {
                        console.log('cmd : pg_end');

                        // publish monitoring end message
                        postMan.publish(new Message(Protocol.CMD_END, body.data()));

                        // end logic
                        console.log('packets : ' + count);
                        var diff = process.hrtime(startTime);
                        endTime = diff[0] * 1e9 + diff[1];

                        ConsoleLogger.EndMessage('Monitoring End');
                        ConsoleLogger.SimpleMessage('client disconnted');

                        monitor.clear();

                        startTime = 0;
                        count = 0;
                        endTime = 0;
                    }
                    else if (body.cmd() == Packet.Command.PG_DUMMY) {
                        // PG_DUMMY
                        count++;
                        monitor.getPacket();
                    }
                }// end loop

                

            }
            catch (err) {
                /*
                var date = new Date();
                var current = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                console.log('=================================');
                console.log('Monitoring end : ' + current);
                console.log('=================================');
                */
                //console.log('err');
                //console.log('packets : ' + count);
            }

        });

        socket.on('error', function (err) {
            console.log(err);
        });

        // client와 접속이 끊기는 메시지 출력
        socket.on('close', function () {
            console.log('packets : ' + count);

            ConsoleLogger.SimpleMessage('Socket Closed');

            //console.log('client disconnted.');

            monitor.clear();

            startTime = 0;
            count = 0;
            endTime = 0;
        });

    });// end create server

    server.listen(configuration.port, function () {
        ConsoleLogger.SimpleMessage('[PGM][Monitoring] listening on ' + configuration.port);
    });
}

module.exports.start = start;

