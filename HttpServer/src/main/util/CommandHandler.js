const Protocol = require('../types/Protocol');
const Test = require('../types/Test');

// RabbitMQ message의 command handle
function CommandHandler() {

    this.handle = (cmd, obj) => {

        switch (cmd){
            case Protocol.CMD_START:

                break;
            case Protocol.CMD_DUMMY:

                break;
            case Protocol.CMD_END:

                break;
        }    
    };
}





