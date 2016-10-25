var clusterConfig = require('./config/cluster.json');

var cluster = require('cluster');
var os = require('os');
const child_process = require('child_process');

const webServer = child_process.exec('npm run start-http-server' + function (error, stdout, stderr) {
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
});

webServer.on('exit', function (code) {
    console.log('Web Server exited. . .' + code);
});

const tcpServer = child_process.exec('npm run start-tcp-server' + function (error, stdout, stderr) {
    if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
});

tcpServer.on('exit', function (code) {
    console.log('tcp Server exited. . .' + code);
});