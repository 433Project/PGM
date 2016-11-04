var monitoringServer = require('./src/main/MonitoringServer.js');


var cluster = require('cluster');
var numCPUs = require('os').cpus().length;



// if master
if (cluster.isMaster) {
    // Fork workers.

    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();

        worker.send(worker.process.pid);
    }

    cluster.on('death', function (worker) {
        console.log('worker ' + worker.pid + ' died');
    });
}
else {
    // if worker

    process.on('message', function (msg) {
        console.log('[WORKER][' + msg + ']');
        process.env.id = msg;
    });

    monitoringServer.start();
}




//monitoringServer.start();