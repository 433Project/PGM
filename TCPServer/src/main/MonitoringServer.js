//---------- nodejs module
var net = require('net');
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');
var process = require('process');
var path = process.cwd();

//---------- Flat Buffer 
var flatbuffers = require('../../lib/flatbuffersjs.js').flatbuffers;
var Packet = require('../../schema/Packet_generated.js').fb;
var builder = new flatbuffers.Builder(0);

//---------- RabbitMQ Protocol 
var Message = require('./types/Message');
var Protocol = require('./types/Protocol');
var Header = require('./types/Header');

//--------- application module
var configuration = require('./util/Configuration.js');
var monitor = require('./util/Monitor.js');
const postMan = require('./util/PostMan.js');
const logger = require('./util/Logger').logger;
//---------- Common Util
var ConsoleLogger = require('./util/ConsoleLogger');

//--------------------- local variable
var isStart = false;
var count = 0;


var rioSize = configuration.connection.max_packet_size;

var tmpBuff;
var targetBuff;

var dataCount = 0;
var client = null;

function connect() {

    client = net.createConnection(configuration.connection.port, configuration.connection.ip, () => {
        //ConsoleLogger.SimpleMessage('connect!');
        logger.LOG('connect TO cs');
        tmpBuff = Buffer.alloc(0);
    });

    client.on('data', (data) => {

        var idx = 0;
        var packets = 0;
        var header;

        try {
            targetBuff = Buffer.alloc(tmpBuff.length + data.length);

            // 아직 rio 1packet이 도착하지 않은 경우, 보존시킨다.
            if (targetBuff.length < rioSize) {
                console.log('targetbuff length : ' + targetBuff.length);

                tmpBuff = Buffer.alloc(data.length);
                data.copy(tmpBuff, 0, 0, data.length);
                return;
            }

            // 적당한 데이터가 있는 경우.
            tmpBuff.copy(targetBuff, 0, 0, tmpBuff.length);
            data.copy(targetBuff, tmpBuff.length, 0, data.length);

            // tmpBUff 초기화 
            tmpBuff = Buffer.alloc(0);

            // 내 tcp버퍼에 여러 패킷이 올 수도 있음.
            while (packets * rioSize < targetBuff.length) {
                idx = packets * rioSize;
                header = Header.bytesToHeader(targetBuff.slice(idx, idx + Protocol.HEADER_SIZE));

                var bodyBuff = new flatbuffers.ByteBuffer(
                    new Uint8Array(targetBuff.slice(idx + Protocol.HEADER_SIZE, idx + Protocol.HEADER_SIZE + header.length)));

                var body = Packet.Body.getRootAsBody(bodyBuff);

                //idx += header.length;
                if (body.cmd() == Packet.COMMAND.PG_START) {
                    logger.LOG('Monitoring Start');

                    //--- monitor setting
                    monitor.init();
                    monitor.start();

                    // publish monitoring start message
                    //postMan.publish(new Message(Protocol.CMD_START, body.data()));
                    postMan.publish(new Message(Protocol.CMD_START, 1));
                }
                else if (body.cmd() == Packet.COMMAND.PG_END) {
                    console.log('cmd : pg_end');

                    // publish monitoring end message
                    //postMan.publish(new Message(Protocol.CMD_END, body.data()));
                    postMan.publish(new Message(Protocol.CMD_END, 1));

                    // end logic
                    ConsoleLogger.SimpleMessage('packets : ' + count);
                    ConsoleLogger.EndMessage('Monitoring End');

                    monitor.stop();
                    monitor.clear();

                    count = 0;
                }
                else if (body.cmd() == Packet.COMMAND.PG_DUMMY) {
                    // PG_DUMMY
                    count++;
                    // inc count 
                    monitor.getPacket();
                }
                packets++;//?
            }// end loop
        }
        catch (err) {
            console.error(err);
        }
    });// end data 

    client.on('error', (err) => {
        ConsoleLogger.SimpleMessage(err);
    });
    
    client.on('close', () => {
        console.log('packets : ' + count);

        ConsoleLogger.SimpleMessage('Socket Closed');
        
        monitor.clear();

        count = 0;
        //connect();
    });    
}

function gracefulShutdown() {
    if (client != null) {
        client == null;
        ConsoleLogger.SimpleMessage('graceful shutdown');
        client.destroy();   
        monitor.clear();
    }
}

function udpListen() {

    udpServer.on('message', (data, rinfo) => {

        var idx = 0;
        var packets = 0;
        var header;

        //console.log(data.length);
        try {
            targetBuff = Buffer.alloc(tmpBuff.length + data.length);

            // 아직 rio 1packet이 도착하지 않은 경우, 보존시킨다.
            if (targetBuff.length < 100) {
                //console.log('targetbuff length : ' + targetBuff.length);
                console.log('왜 이게 걸리지?');
                tmpBuff = Buffer.alloc(data.length);
                data.copy(tmpBuff, 0, 0, data.length);
                return;
            }

            // 적당한 데이터가 있는 경우.
            tmpBuff.copy(targetBuff, 0, 0, tmpBuff.length);
            data.copy(targetBuff, tmpBuff.length, 0, data.length);

            // tmpBUff 초기화 
            tmpBuff = Buffer.alloc(0);

            // 내 tcp버퍼에 여러 패킷이 올 수도 있음.
            while (packets * 100 + Protocol.HEADER_SIZE < targetBuff.length) {

                idx = packets * 100;
                header = Header.bytesToHeader(targetBuff.slice(idx, idx + Protocol.HEADER_SIZE));

                if (idx + Protocol.HEADER_SIZE + header.length > targetBuff.length) {
                    tmpBuff = Buffer.alloc((targetBuff.length - idx) + 1);
                    data.copy(tmpBuff, 0, idx, data.length);
                    return;
                }

                var bodyBuff = new flatbuffers.ByteBuffer(
                    new Uint8Array(targetBuff.slice(idx + Protocol.HEADER_SIZE, idx + Protocol.HEADER_SIZE + header.length)));

                var body = Packet.Body.getRootAsBody(bodyBuff);

                //idx += header.length;
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

                    ConsoleLogger.EndMessage('Monitoring End');
                    ConsoleLogger.SimpleMessage('client disconnted');
                    ConsoleLogger.SimpleMessage('data counts : ' + dataCount);

                    monitor.clear();

                    count = 0;
                }
                else if (body.cmd() == Packet.Command.PG_DUMMY) {
                    // PG_DUMMY
                    //console.log(count);
                    count++;
                    monitor.getPacket();
                }

                packets++;

            }// end loop
        }
        catch (err) {
            console.log('=================================');
            console.log(err);
            console.log('=================================');
        }
    });

    udpServer.bind(10433);
}

module.exports.connect = connect;
//module.exports.listen = testListen;
module.exports.close = gracefulShutdown;