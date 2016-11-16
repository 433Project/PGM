
function ClientHolder(){
    /*
    this.list = new Set();

    this.addClient = (socket) => {
        this.list.add(socket);
    }

    this.deleteClient = (socket) => {
        return this.list.delete(socket);
    }// end method
    */
    this.client;
}

module.exports = new ClientHolder();