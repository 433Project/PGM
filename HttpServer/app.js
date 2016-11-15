var clusterConfig = require('./config/cluster.json');
var cluster = require('cluster');
var os = require('os');
var webServer = require('./src/main/WebServer.js');

webServer.start();
