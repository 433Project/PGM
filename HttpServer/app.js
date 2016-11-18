var globalConfig = require('./config/GlobalConfig');
var clusterConfig = require('./config/cluster.json');
var cluster = require('cluster');
var os = require('os');
var webServer = require('./src/main/WebServer.js');
var fileLogger = require('./src/main/util/FileLogger');
const logger = require('./src/main/util/logger').logger;

logger.LOG("hi");

webServer.start();
