var amqp = require('amqplib/callback_api');

function PostMan() {
    this.queueName = "pgm";   

    // publish message
    this.publish = function (msg) {
        this.channel.sendToQueue(this.queueName, new Buffer(msg));
        console.log('[TCP][PUB] send message : ' + msg);
    } 
};

PostMan.prototype.channel = null;
PostMan.prototype.init = function () {

    console.log('\n=======================================================');
    console.log('[TCP] message queue 초기화');;

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {

            if (err) {
                console.log('[TCP] 초기화 에러.' + err);
                console.log('=======================================================');
            }
            else {
                ch.assertQueue(this.queueName, { durable: false });                

                console.log('[TCP] queue 생성 완료');
                console.log('[TCP] message queue 초기화 완료');
                console.log('=======================================================');
            }
            PostMan.prototype.channel = ch;
        });
    });// end amqp
};// end method


var postMan = new PostMan();
postMan.init();

module.exports = postMan;