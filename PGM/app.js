
var monitoringServer = require('./src/main/MonitoringServer.js');
var webServer = require('./src/main/WebServer.js');
var clusterConfig = require('./config/cluster.json');

var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster) {
    for (var worker = 0; worker < clusterConfig.workers; worker++) {
        cluster.fork();
    }

    console.log('[PGM][MASTER] start workers . . .');
}
else {
    monitoringServer.start();
    webServer.start();
}

