//const date = require('date-utils');

var fs = require('fs');
var path = require('path');


function FileLogger() {

    this.filePrefix = 'test';
    this.enconding = 'utf8';
    this.fileName='';
    this.fd;

    this.init = function () { }

    // create file 
    this.createFile = function () {
        //this.fileName = path.join(__dirname, );
        console.log('log 파일 경로 : ' + fileName); 
        this.fileName = './logs/' + this.filePrefix + this.formatDate(new Date());

        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                console.error(err);
                return false;
            }
                
            this.fd = fd;
            console.log('file open!');
            return true;
        });
    };

    // write log to file 
    this.writeLog = function (msg) {
        fs.write(this.fd, this.format(msg), this.encoding, function (err) {
            if (err) {
                console.error(err);
            }
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

    this.close = () => {
        fs.close(this.fd, () => {
            //console.log('close log file');
        });
    };

    this.formatDate = (date) => {

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

}

var instance = new FileLogger();

module.exports = instance;