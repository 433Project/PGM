var path = require('path');
var process = require('process');
var child_process = require('child_process');

var http = require('http');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var port = 53890;

//-----
var Service = require('./types/Service');

//var serviceList = new Map();
var serviceList=[];

serviceList.push({ 'id': 0, 'name': 'http', 'state':0 });
serviceList.push({ 'id': 1, 'name': 'tcp','state':1 });

var httpServerPath = 'D:/workspace/PGM/HTTPServer';
var httpServerInstance = null;

var tcpServerPath = 'D:/workspace/PGM/TCPServer';
var tcpServerInstance = null;

var client;

var clientList = new Set();

var reqLogger = function findIP(req, res, next) {
    console.log('[HTTP][' + req.originalUrl + '] IP : ' + req.ip);
    next();
}

app.use(reqLogger);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/service', (req, res) => {
    res.set('Content-Type', 'applicaiton/json');

    res.send(serviceList);
});

app.get('/http', (req, res) => {

    if (httpServerInstance == null) {
        httpServerInstance = child_process.exec('node app.js', {
            cwd: httpServerPath,
            shell: 'cmd.exe'
        }, (err, stdout, stderr) => {
            if (err) {
                console.error('error : ' + err);
                return;
            }

            console.log(stdout);
        });
        res.send('http server start');
    }

    else {
        res.send('http server is running');
    }
});

app.get('/tcp/:state/:instance', (req, res) => {

    var state = req.params.state;
    var instance = req.params.instance;
    console.log('state : ' + state);

    var script = '';

    if (instance > 1) {
        script = 'npm run start-server-multi-instance';
    }
    else {
        script = 'npm run start-server-one-instance';
    }

    // start app
    if (state == 1) {
        //tcpServerPath = path.join(__dirname, '..', 'TCPServer', 'app.js');
        tcpServerPath = path.join(__dirname, '..', 'TCPServer');
        console.log(tcpServerPath);

        if (tcpServerInstance == null) {
            tcpServerInstance = child_process.exec(script, { cwd: tcpServerPath, maxBuffer: 200 * 5000 }, (err, stdout, stderr) => {
                if (err) {
                    console.error('error : ' + err);
                    return;
                }

                console.log(stdout);
                console.log(stderr);
            });

            console.log(tcpServerInstance.pid);

            tcpServerInstance.on('message', (msg, handle) => {
                console.log('?');
            });

            tcpServerInstance.on('exit', (code, signal) => {
                console.log('exit' + signal);
                tcpServerInstance = null;
            });

            tcpServerInstance.on('close', (code, signal) => {
                console.log('close');
            });

            tcpServerInstance.stdout.on('data', (data) => {
                console.log(data);

                clientList.forEach((client) => { client.emit('tcp', data + '\n'); });    
            });

            tcpServerInstance.stderr.on('data', (data) => {
                console.log('stderr : ' + data);

                clientList.forEach((client) => { client.emit('tcp', data + '\n'); });
            });

            res.send('tcp server start');
        }

        else {
            res.send('tcp server is running');
        }
    }
    else {
        // shutdown app
        if (tcpServerInstance != null) {
            console.log(tcpServerInstance.pid);
            // tcpServerInstance.kill('SIGINT');
            tcpServerInstance.stderr.pause();
            tcpServerInstance.stdout.pause();
            tcpServerInstance.kill('SIGINT');
            
            // kill process
            //child_process.exec('taskkill /f /pid ' + tcpServerInstance.pid);
            res.send('shutdown');            
        }
        else
            res.send('shutdown error');
    }
});


io.on('connection', (socket) => {
    console.log('client connected');
    //client = socket;

    socket.on('disconnect', () => {
        console.log('client disconnected');   
        clientList.delete(socket);
    });

    clientList.add(socket);
});
/*
app.listen(port, () => {
    console.log('listen');
});
*/
server.listen(port, () => { console.log('listen . . . '); });