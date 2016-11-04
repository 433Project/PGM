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

var rioSize = 1024;

var client;
var port = 11433;
var ip = '10.100.10.6';

var starter;

function start() {
    //console.log("server start . . .id :" + process.env.id);
    initialize();
}

function connect() {

    client = net.createConnection(11433, '10.100.10.6', () => {
        ConsoleLogger.SimpleMessage('connect!');

        clearInterval(starter);
    });

    client.on('data', (data) => {

        var idx = 0;
        var packets = 0;
        var header;

        console.log(data.length);

        try {
            while (packets * rioSize< data.length) {

                idx = packets * rioSize;
                header = Header.bytesToHeader(data.slice(idx, idx + Protocol.HEADER_SIZE));
                // header null ???? 
                console.log(header);

                var bodyBuff = new flatbuffers.ByteBuffer(
                    new Uint8Array(data.slice(idx + Protocol.HEADER_SIZE, idx + Protocol.HEADER_SIZE + header.length)));
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
                packets++;
            }// end loop
        }
        catch (err) {
            console.log('=================================');
            console.log('err');
            console.log('=================================');
        }
    });

    client.on('error', (err) => {
        ConsoleLogger.SimpleMessage('error!');
    });

    client.on('close', () => {
        console.log('packets : ' + count);

        ConsoleLogger.SimpleMessage('Socket Closed');
        
        monitor.clear();

        startTime = 0;
        count = 0;
        endTime = 0;

        connect();
    });
}

function initialize() {
    Buffer.poolSize = rioSize * 1000;
    connect();
    //starter = setInterval(connect, 1000*1);
}

module.exports.start = start;