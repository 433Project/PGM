var clientLists = null; // ip:port + socket

function init() {
    if (clientLists == null) {
        clientLists = new Map();
    }
}

function addClient(client, socket) {
    return clientLists.set(client.ip+':'+client.port, socket);
}

function deleteClient(client) {
    return clientLists.delete(client.ip+':'+client.port);
}

module.exports.init = init;
module.exports.addClient = addClient;
module.exports.deleteClient = deleteClient;

