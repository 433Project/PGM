const amqp = require('amqplib/callback_api');

const dataHolder = require('./DataHolder.js');
const async = require('async');
const Protocol = require('../types/Protocol');
var Test = require('../types/Test');

// rabbitmq receiver
function PostMan() {
    this.queueName = "pgm3";
    this.channel = null;
    this.conn = null;
};

PostMan.prototype.init = function () {

    console.log('\n=======================================================');
    console.log('[HTTP] message queue 초기화');;

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            
            if (err) {
                console.log('[HTTP] 초기화 에러.' + err);
                console.log('=======================================================');
            }
            else {
                ch.assertQueue(this.queueName, { durable: false });                

                console.log('[HTTP] queue 생성 완료');
                console.log('[HTTP] message queue 초기화 완료');
                console.log('=======================================================');
            }

            PostMan.prototype.channel = ch;

            
            //callback(null);
        });
    });// end amqp
};// end method
// Consumer
function consumer(conn) {
    amqp.connect('amqp://localhost', function (err, conn) {

        var ok = conn.createChannel(on_open);
        function on_open(err, ch) {
            ch.assertQueue(q);
            ch.consume(this.queueName, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
            });
        }
    });// end amqp
}

/*
PostMan.prototype.subscribe = function (callback) {
    
    //var ok = PostMan.prototype.channel.assertQueue(this.queueName, { durable: false });
    console.log('bbbb');
    var result = PostMan.prototype.channel.consume(this.queueName, function (msg) {
        console.log('[HTTP][SUB] read message : ' + msg.content.toString());

        const message = JSON.parse(msg.content);

        if (message.cmd == Protocol.CMD_START) {
            // start subscribe. . .bb 
            Test.count = message.data;
            PostMan.prototype.subscribe();
        }
        else if (message.cmd == Protocol.CMD_DUMMY) {
            //console.log(message.data);
            Test.dataHolder.addData(message.data);
        }
        else {
            // CMD: CMD_END
            Test.endTime = new Date();
            console.log('테스트 종료');
            console.log('=======================================================');
        }
    });

    console.log('consume result : ' + result);
}
*/

PostMan.prototype.subscribe = function (callback) {

    console.log('bbbb');
    var result = PostMan.prototype.channel.consume(this.queueName, function (msg) {
        console.log('[HTTP][SUB] read message : ' + msg.content.toString());

        const message = JSON.parse(msg.content);

        if (message.cmd == Protocol.CMD_START) {
            // start subscribe. . .bb 
            Test.count = message.data;
            PostMan.prototype.subscribe();
        }
        else if (message.cmd == Protocol.CMD_DUMMY) {
            //console.log(message.data);
            Test.dataHolder.addData(message.data);
        }
        else {
            // CMD: CMD_END
            Test.endTime = new Date();
            console.log('테스트 종료');
            console.log('=======================================================');
        }
    });

    console.log('consume result : ' + result);
}

var postMan = new PostMan();

module.exports = postMan;