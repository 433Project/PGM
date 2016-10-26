var amqp = require('amqplib/callback_api');
//var dataHolder = require('DataHolder');
var dataHolder = require('./DataHolder.js');
var async = require('async');


function PostMan() {
    this.queueName = "pgm2";
    this.channel = null;
    // register subscriber

    /*
    this.init = function (callback) {

        console.log('\n=======================================================');
        console.log('[HTTP] message queue 초기화');;

        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {


                if (err) {
                    console.log('[HTTP] 초기화 에러.' + err);
                    console.log('=======================================================');
                }
                else {
                    ch.assertQueue(this.queueName, { durable: true });

                    console.log('[HTTP] queue 생성 완료');
                    console.log('[HTTP] message queue 초기화 완료');
                    console.log('=======================================================');
                }


                PostMan.prototype.channel = ch;
                callback(null);
            });
        });// end amqp


    };// end method

    this.subscribe = function () {

        console.log('??????');
        PostMan.prototype.channel.assertQueue(this.queueName, { durable: true });
        console.log('??????');
        PostMan.prototype.channel.consume(this.queueName, function (msg) {
            console.log('[HTTP][SUB] read message : ' + msg.content.toString());
            dataHolder.addData(JSON.parse(msg.content));
        }, { noAck: true });
        console.log('??????');
    }
    */

};


PostMan.prototype.init = function (callback) {

    console.log('\n=======================================================');
    console.log('[HTTP] message queue 초기화');;

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {

            
            if (err) {
                console.log('[HTTP] 초기화 에러.' + err);
                console.log('=======================================================');
            }
            else {
                ch.assertQueue(this.queueName, { durable: true });                

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

    console.log('??????');
    PostMan.prototype.channel.assertQueue(this.queueName, { durable: true });
    console.log('??????');
    PostMan.prototype.channel.consume(this.queueName, function (msg) {
        console.log('[HTTP][SUB] read message : ' + msg.content.toString());
        dataHolder.addData(JSON.parse(msg.content));
    }, {noAck:true});
    console.log('??????');
}

/*
function PostMan() {
    this.queueName = "pgm";
    this.channel = null;
    // register subscriber
    this.subscribe = function () {

        this.channel.assertQueue(this.queueName, { durable: false });

        this.channel.consume(this.queueName, function (msg) {
            console.log('[HTTP][SUB] read message : ' + msg.content.toString());
            dataHolder.addData(JSON.parse(msg));
        });
    }

    this.init = function () {

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
    }
};
*/

var postMan = new PostMan();
//async.series([postMan.init, postMan.subscribe]);
//postMan.init();
//postMan.subscribe();
module.exports = postMan;