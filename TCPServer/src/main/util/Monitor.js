var process = require('process');
var PostMan = require('./PostMan.js');
const Message = require('../types/Message.js');
const Protocol = require('../types/Protocol');

// class constructor
function Monitor() {

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
    // clear map.
    this.clear = function () {
        this.performanceHolder.clear();
        this.stopTimer();

        console.log('============================================');
        console.log('[TCP] monitor clear');
        console.log('============================================\n\n\n');
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

        // publish
        PostMan.publish(new Message(Protocol.CMD_DUMMY, { "duration": this.duration, "packets": this.packets }) );
        console.log(this.duration + ' ~ ' + (this.duration + 1) + '동안' + this.packets + '개 수신함');

        this.packets = 0;
        this.duration++;
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