var clusterConfig = require('./config/cluster.json');
var cluster = require('cluster');
var os = require('os');
var webServer = require('./src/main/WebServer.js');
var fileLogger = require('./src/main/util/FileLogger');


fileLogger.createFile();

webServer.start();
