function Test() {

    this.count;
    this.arrivedCount;

    this.startTime;
    this.endTime;

    this.dataHolder; 

    this.logPath;

    this.getLogPath = function () {
        return this.logPath;
    }
    this.setLogPath = function (path) {
        this.logPath = path;
    }

    this.clear = () => {

        this.count = 0;
        this.arrivedCount = 0;
        this.startTime = null;
        this.endTime = null;

        this.dataHolder = null;
        this.logPath = '';
    };

}

module.exports = new Test();