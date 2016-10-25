const config = require('config').fileLogger;
const date = require('date-utils');

var fs = require('fs');

function FileLogger() {

    this.fileName="";

    this.init = function () { }

    // create file 
    this.createFile = function () {
        this.fileName = './logs/' + config.filename + new Date();
    }

    // write log to file 
    this.writeLog = function (msg) {

        if (!this.fileName.contains("test")) {
            this.createFile();              
        }

        /*
        this.fs.writeFile(this.fileName, msg, function (err) {
            if (err)
                this.writeLog(msg);
        });
        */

        fs.writeFile(this.fileName, msg, config.encoding, function (err) {
            if (err)
                this.writeLog(msg);
        });
    }
}

var instance = new FileLogger();

module.exports = instance;