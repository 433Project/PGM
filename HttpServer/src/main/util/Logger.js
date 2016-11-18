var winston = require('winston');

function Logger() {

    this.logger;

    this.init = () => {

        var logRoot = './logs/';
        var fileName = 'log';

        var date = new Date();
        fileName += date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        fileName += '.txt';

        if (process.env.stage == 'dev') {
            this.logger = new winston.Logger({
                level: 'debug',
                transports: [new (winston.transports.Console)({
                    timestamp: () => {
                        var date = new Date();
                        var current = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();

                        return current;
                    },
                    formatter: (options) => {

                        return '[' + options.timestamp() + ']' +
                            '[' + options.level.toUpperCase() + '] ' +
                            (options.message ? options.message : '');
                    }

                })]
            });
            this.logger.level = 'debug';
        }
        else if (process.env.stage == 'live') {
            this.logger = new winston.Logger({
                level: 'info',
                transports: [
                    new (winston.transports.File)({
                        json: false, 
                        timestamp: () => {
                            var date = new Date();
                            var current = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();

                            return current;
                        },
                        formatter: (options) => {

                            return '[' + options.timestamp() + ']' +
                                '[' + options.level.toUpperCase() + '] ' +
                                (options.message ? options.message : '');
                        },
                        filename: logRoot + fileName
                    })]
            });

            this.logger.level = 'info';
        }
    }

    this.LOG = (msg) => {
        this.logger.log(this.logger.level, msg);
    }
}
var instance = new Logger();
instance.init();
module.exports.logger = instance;