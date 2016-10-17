var fs = require('fs');
var process = require('process');
var path = process.cwd();
var configFile = require('../../../config/local.json');

var parse = function () {
    return configFile;
};

var config = parse();

module.exports = config;