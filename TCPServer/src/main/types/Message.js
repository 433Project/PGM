
function Message(cmd, data){
    this.cmd = cmd;
    this.data = data;

    this.getCmd = function(){
        return this.cmd;
    }

    this.getData = function(){
        return this.data;
    }
}

module.exports = Message;