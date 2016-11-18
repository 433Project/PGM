var fs = require('fs');
var path = require('path');
var logger = require('./Logger').logger;

function FileLogger() {

    this.filePrefix = 'test_';
    this.enconding = 'utf8';
    this.extension = '.txt';
    this.fileName='';
    this.fd=0;

    this.init = function () { }

    // create file 
    this.createFile = function () {
 
        this.fileName = './logs/' + this.filePrefix + this.formatDate(new Date()) + this.extension;

        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                logger.LOG(err);
                return false;
            }
                
            this.fd = fd;

            logger.LOG('file open!');
            return true;
        });
    };

    // write log to file 
    this.writeLog = function (msg) {

        if (this.fd != 0) {
            // file opend.
            fs.write(this.fd, this.format(msg), this.encoding, function (err) {
                if (err) {
                    logger.LOG(err);
                }
            });
        }
        else {
            // file is not initialized
            this.createFile();
        }
 
    };

    this.close = () => {
        fs.close(this.fd, () => {
        });
    };

    this.format = (msg) => {
        const date = new Date();

        var str = '[';
        str += this.formatDate(date);
        str += ']';
        str += '[';
        str += date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        str += ']';

        str += msg;

        return str;
    }

    this.formatDate = (date) => {

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-') + '_' + [d.getHours(), d.getMinutes(), d.getSeconds()].join('-');
    };
}

var instance = new FileLogger();
module.exports = instance;