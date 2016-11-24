function Protocol() {
    this.CMD_START = 1;
    this.CMD_DUMMY = 2;
    this.CMD_END = 3;
    this.CMD_DATA = 4;
    this.HEADER_SIZE = 20; // 20bytes 
}

function State() {
    this.STATE_IDEL = 0;
    this.STATE_RUNNNING = 1;
    this.STATE_END = 2;
}

module.exports.Protocol = new Protocol();
module.exports.State = new State();