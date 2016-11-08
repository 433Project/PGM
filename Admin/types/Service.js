

function Service() {

    this.id;
    this.name;
    this.state;

}

Service.prototype.create = (id, name) => {
    this.id = id;
    this.name = name;
}

module.exports = Service;