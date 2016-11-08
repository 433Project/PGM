var monitoringServer = require('./src/main/MonitoringServer.js');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

// var process = require('process');

var isClustered = process.argv[2];
//console.log(process.argv[2]);

var maxCluster = numCPUs;

// one instance
if (isClustered == '1') {
    process.on('SIGINT', function () {
        console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
        // some other closing procedures go here
        process.exit();
    });

    monitoringServer.start();

    

}
else {
// multi instance

    if (isClustered > maxCluster)
        isClustered = maxCluster;

    if (cluster.isMaster) {
        // Fork workers.


        for (var i = 0; i < isClustered; i++) {
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
}

