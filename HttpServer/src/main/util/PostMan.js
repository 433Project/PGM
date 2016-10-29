var amqp = require('amqplib/callback_api');
//var dataHolder = require('DataHolder');
var dataHolder = require('./DataHolder.js');
var async = require('async');


function PostMan() {
    this.queueName = "pgm3";
    this.channel = null;
};

PostMan.prototype.init = function (callback) {

    console.log('\n=======================================================');
    console.log('[HTTP] message queue 초기화');;

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {

            /*
            if(ch.checkQueue(this.queueName)){
                console.log('[HTTP] delete existed queue');
                ch.purgeQueue(this.queueName);            
            }
            */
            
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
            callback(null);
        });
    });// end amqp
};// end method


PostMan.prototype.subscribe = function (callback) {
    
    var ok = PostMan.prototype.channel.assertQueue(this.queueName, { durable: false });
    console.log('??????');    
    
    var result = PostMan.prototype.channel.consume(this.queueName, function (msg) {
        console.log('[HTTP][SUB] read message : ' + msg.content.toString());
        dataHolder.addData(JSON.parse(msg.content));
    });

    console.log('consume result : ' + result);
}

/*
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


PostMan.prototype.subscribe = function () {
    
    PostMan.prototype.channel.assertQueue(this.queueName, { durable: false });
    
    PostMan.prototype.channel.consume(this.queueName, function (msg) {
        console.log('[HTTP][SUB] read message : ' + msg.content.toString());
        dataHolder.addData(JSON.parse(msg.content));
    });
    console.log('??????');
}

*/


var postMan = new PostMan();
//async.series([postMan.init, postMan.subscribe]);
//postMan.init();
//setTimeout(postMan.subscribe(), 1000*1);

module.exports = postMan;