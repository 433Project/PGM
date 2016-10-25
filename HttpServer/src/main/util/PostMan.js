var amqp = require('amqplib/callback_api');

function PostMan() {
    this.queueName = "testq";   

    // publish message
    this.publish = function (msg) {
        this.channel.sendToQueue(this.queueName, new Buffer(msg));
        console.log('[HTTP][PUB] send message : ' + msg);
    } 

    // add subscribe
    this.subscribe = function () {

        this.channel.assertQueue(this.queueName, { durable: false });

        this.channel.consume(this.queueName, function (msg) {
            console.log('[HTTP][SUB] read message : ' + msg.content.toString());
            return msg.content.toString();
        });
    }
};

PostMan.prototype.channel = null;
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
        });
    });// end amqp
};// end method


var postMan = new PostMan();
postMan.init();

module.exports = postMan;