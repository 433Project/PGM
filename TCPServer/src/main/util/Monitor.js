var process = require('process');
var PostMan = require('PostMan');

// class constructor
function Monitor () {
    this.performanceHolder = null;
    this.startTime = 0;
    this.duration = 0;
    this.packets = 0;
    this.timer = null;

    this.init = function () {
        console.log('============================================');
        if (this.performanceHolder == null) {
            this.performanceHolder = new Map();
        }

        this.performanceHolder = new Map();

        this.setStartTime(process.hrtime());

        console.log('[TCP] monitor 셋팅 완료');
        console.log('============================================');
    }

    this.setStartTime = function (startTime) {
        this.startTime = startTime;
        return true;
    }

    this.setTimer = function () {
        console.log('============================================');
        console.log('[TCP] start timer');
        console.log('============================================');

        this.timer = setInterval(this.calculateIndicator.bind(this), 1000); // 1초마다 수행
    }

    this.stopTimer = function () {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.duration = 0;
            this.packets = 0;
        }
    }
    
    this.getPacket = function () {
        this.packets++;
    }

    this.calculateIndicator = function () {
        console.log(this.performanceHolder);

        this.performanceHolder.set(this.duration, this.packets);
        console.log(this.duration + ' ~ ' + (this.duration + 1) + '동안' + this.packets + '개 수신함');
        this.packets = 0;
        this.duration++;

        // publish
        PostMan.publish({"duration": this.duration, "packets": this.packets});

    }
    
    
    // from ~ to 의 data를 반환한다.
    // deprecated.
    this.getPerformData = function (from, to) {

        var result = [];

        for (var idx = from; idx < to; idx++) {
            result.push({
                'duration': idx,
                'packets': this.performanceHolder.get(idx)
            });
        } 
        return result;
    }
}

var monitorInstance = new Monitor();
monitorInstance.init();
module.exports = monitorInstance;
/*
모듈화 2차 
// class method
Monitor.prototype.init = function () {
    if (this.performanceHolder == null) {
        this.performanceHolder = new Map();
    }
    this.performanceHolder = new Map();
    this.setStartTime(process.hrtime());
    this.setTimer();

    console.log('[PGM] monitor 셋팅 완료');
}

Monitor.prototype.setStartTime = function (startTime) {
    this.startTime = startTime;
    return true;

}
Monitor.prototype.setTimer = function () {
    this.timer = setInterval(this.calculateIndicator, 1000); // 1초마다 수행
}

Monitor.prototype.stopTimer = function () {
    if (this.timer != null) {
        clearInterval(timer);
        this.duration = 0;
        this.packets = 0;
    }
}

Monitor.prototype.getPacket = function () {
    this.packets++;

} 

Monitor.prototype.calculateIndicator = function () {
    console.log(this.performanceHolder);
    this.performanceHolder.set(this.duration, this.packets);
    console.log(this.duration + ' ~ ' + (this.duration + 1) + '동안' + this.packets + '개 수신함');
    this.packets = 0;
    this.duration++;
}

var monitorInstance = new Monitor();
module.exports = monitorInstance;

*/



/*
모듈화 1차
var process = require('process');

var performanceHolder = null; // second from start time, count
var startTime = 0;
var duration = 0;
var packets = 0;

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
        packets = 0;
    }
}

function getPacket() {
    packets++;
}

function calculateIndicator() {

    performanceHolder.set(duration, packets);
    console.log(duration + ' ~ ' + (duration + 1) + '동안' + packets + '개 수신함');
    packets = 0;
    duration++;
}

module.exports.init = init;
module.exports.stopTimer = stopTimer;
module.exports.getPacket = getPacket;
module.exports.performanceHolder = performanceHolder;


*/