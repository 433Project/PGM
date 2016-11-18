//---- node module
const amqp = require('amqplib/callback_api');
const async = require('async');
//---- custom module
const dataHolder = require('./DataHolder.js');

const Protocol = require('../types/Protocol').Protocol;
var Test = require('../types/Test');

const logger = require('./Logger').logger;

var clientHolder = require('./ClientHolder');

// rabbitmq receiver
function PostMan() {};

PostMan.prototype.queueName = 'pgmq';
PostMan.prototype.channel = null;
PostMan.prototype.init = function (callback) {
    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            
            if (err) {
                logger.LOG('[HTTP] 초기화 에러.' + err);
            }
            else {
                ch.assertQueue(PostMan.prototype.queueName, { durable: false });                
                
                logger.LOG('message queue 초기화 완료');
                PostMan.prototype.channel = ch;
            }
            callback(null);
        });
    });// end amqp
};// end method

PostMan.prototype.subscribe = function (callback) {

    PostMan.prototype.channel.consume(PostMan.prototype.queueName, (msg) => {

        var message = JSON.parse(msg.content);
        logger.LOG(message);

        if (message.cmd == Protocol.CMD_START) {
            // start test
            logger.LOG('[SUB] start monitoring');
            Test.startTest();
        }
        else if (message.cmd == Protocol.CMD_END) {
            // dummy packet
            logger.LOG('[SUB] end monitoring');

            Test.endTest();

            if (clientHolder.client != null)
                clientHolder.client.emit('msg', { 'cmd': Protocol.CMD_END, 'data': 0 });
        }
        else if (message.cmd == Protocol.CMD_DATA) {
            // handle data(pps)
            Test.addData(message.data); // 계산된 pps를 저장한다.

            var from;
            var to;
            Test.dataHolder.getData(from, to);

            from = Test.currentSeconds - 10;

            if (Test.currentSeconds < 10) {
                from = 0;
            }

            to = Test.currentSeconds;

            var result = Test.dataHolder.getData(from,to);

            // send pps to client
            var pps = { 'cmd': Protocol.CMD_DATA, 'data': result};

            if (clientHolder.client != null)
                clientHolder.client.emit('msg', pps);
        }
        else {
            // not defined packet
            // error
        }
    }, { noAck: true }); // end subscribe
}

var postMan = new PostMan();
module.exports = postMan;