function Protocol() {
    this.CMD_START = 1;
    this.CMD_DUMMY = 2;
    this.CMD_END = 3;
    this.HEADER_SIZE = 20; // 20bytes 
}


module.exports = new Protocol();