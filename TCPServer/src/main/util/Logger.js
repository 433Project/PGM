var winston = require('winston');

function Logger() {

    this.logger;

    this.init = () => {
        if (process.env.stage == 'dev') {
            this.logger = new winston.Logger({
                level: 'debug',
                transports: [new (winston.transports.Console)()]
            });
            this.logger.level = 'debug';
        }
        else if (process.env.stage == 'live') {
            this.logger = new winston.Logger({
                level: 'info',
                transports: [
                    new (winston.transports.File)({ filename: './logs.txt' })
                ]
            });
        }
    }

    this.LOG = (msg) => {
        this.logger.log(this.logger.level, msg);
    }

}
var instance = new Logger();
instance.init();
module.exports.logger = instance;