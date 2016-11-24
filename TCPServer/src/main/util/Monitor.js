var process = require('process');
var PostMan = require('./PostMan.js');
const Message = require('../types/Message.js');
const Protocol = require('../types/Protocol');

// class constructor
function Monitor() {

    this.performanceHolder = null;
    this.duration = 0;
    this.packets = 0;
    this.timer = null;

    this.init = function () {
        if (this.performanceHolder == null) {
            this.performanceHolder = new Map();
        }

        this.performanceHolder = new Map();

        console.log('[TCP] monitor 셋팅 완료');
    }
    // clear map.
    this.clear = function () {
        this.performanceHolder.clear();
        this.stopTimer();

        console.log('[TCP] monitor clear');
    }
    
    this.start = ()=> { 
        this.setTimer();
    }
    
    this.stop = ()=> {
        this.stopTimer();
    }

    this.setTimer = function () {
        console.log('[TCP] start timer');
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
        PostMan.publish(new Message(Protocol.CMD_DATA, { "duration": this.duration, "packets": this.packets }) );

        this.packets = 0;
        this.duration++;
    }
}

var monitorInstance = new Monitor();
monitorInstance.init();
module.exports = monitorInstance;