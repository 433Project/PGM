const amqp = require('amqplib/callback_api');

const dataHolder = require('./DataHolder.js');
const async = require('async');
const Protocol = require('../types/Protocol');
var Test = require('../types/Test');
const ConsoleLogger = require('./ConsoleLogger');

// rabbitmq receiver
function PostMan() {
    this.conn = null;
};

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
    console.log('bbbb');

    PostMan.prototype.channel.consume(PostMan.prototype.queueName, (msg) => {
        ConsoleLogger.SimpleMessage(msg.content);
    }, { noAck: true });
}

var postMan = new PostMan();
module.exports = postMan;