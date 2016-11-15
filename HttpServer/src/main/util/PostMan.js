const amqp = require('amqplib/callback_api');

const dataHolder = require('./DataHolder.js');
const async = require('async');
const Protocol = require('../types/Protocol').Protocol;
var Test = require('../types/Test');
const ConsoleLogger = require('./ConsoleLogger');

// rabbitmq receiver
function PostMan() {};

PostMan.prototype.queueName = 'asdf';
PostMan.prototype.channel = null;
PostMan.prototype.init = function (callback) {
    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            
            if (err) {
                ConsoleLogger.SimpleMessage('[HTTP] 초기화 에러.' + err);
            }
            else {
                ch.assertQueue(PostMan.prototype.queueName, { durable: false });                
                
                ConsoleLogger.SimpleMessage('message queue 초기화 완료');
                PostMan.prototype.channel = ch;
            }
            callback(null);
        });
    });// end amqp
};// end method

PostMan.prototype.subscribe = function (callback) {

    PostMan.prototype.channel.consume(PostMan.prototype.queueName, (msg) => {

        var message = JSON.parse(msg.content);

        var message = new Message();
        if (message.cmd = Protocol.CMD_START) {
            // start test
            Test.startTest();
        }
        else if (message.cmd == Protocol.CMD_END) {
            // dummy packet
            Test.endTest();
        }
        else if (message.cmd == Protocol.CMD_DATA) {
            // handle data(pps)
            Test.addData(message.data);
        }
        else {
            // not defined packet
            // error
            
        }
    }, { noAck: true }); // end subscribe
}

var postMan = new PostMan();
module.exports = postMan;