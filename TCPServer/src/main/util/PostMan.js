var amqp = require('amqplib/callback_api');
var Message = require('../types/Message');

function PostMan() {
    this.queueName = 'asdf';
    this.encoding = 'utf8';
};

PostMan.prototype.queueName = 'pgmq';

PostMan.prototype.channel = null;
PostMan.prototype.init = function () {

    console.log('[TCP] message queue 초기화\n');;

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {

            if (err) {
                console.log('[TCP] 초기화 에러.' + err);
            }
            else {
                ch.assertQueue(PostMan.prototype.queueName, { durable: false });

                console.log('[TCP] queue 생성 완료');
                console.log('[TCP] message queue 초기화 완료');
            }
            PostMan.prototype.channel = ch;
        });
    });// end amqp
};// end method

PostMan.prototype.publish = (msg) => {
    console.log('[TCP][PUB] ' + msg.cmd);

    PostMan.prototype.channel.sendToQueue(PostMan.prototype.queueName, new Buffer(JSON.stringify(msg), this.encoding));
};

var postMan = new PostMan();
postMan.init();

module.exports = postMan;