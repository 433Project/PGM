var process = require('process');

var performanceHolder = null; // second from start time, count
var startTime = 0;
var duration = 0;
var countPacket = 0;

var timer = null;

function init() {
    if (performanceHolder == null) {
        performanceHolder = new Map();
    }
    setStartTime(process.hrtime());
    setTimer();

    console.log('[PGM] monitor 셋팅 완료');
}

function setStartTime(startTime) {
    this.startTime = startTime;
    return true;
}

function setTimer() {
    timer = setInterval(calculateIndicator, 1000); // 1초마다 수행
}

function stopTimer() {
    if (timer!=null){
        clearInterval(timer);
        duration = 0;
        countPacket = 0;
    }
}

function getPacket() {
    countPacket++;
}

function calculateIndicator() {

    performanceHolder.set(duration, countPacket);
    console.log(duration + ' ~ ' + (duration + 1) + '동안' + countPacket + '개 수신함');
    countPacket = 0;
    duration++;
}

module.exports.init = init;
module.exports.stopTimer = stopTimer;
module.exports.getPacket = getPacket;
module.exports.performanceHolder = performanceHolder;