
var monitoringServer = require('./src/main/MonitoringServer.js');
var webServer = require('./src/main/WebServer.js');

monitoringServer.start();
webServer.start();