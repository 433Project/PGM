

function DataHolder() {
    this.holder = null;

    this.init = function () {
        this.holder = new Map();
    }

    this.addData = function (data) {

    }

    this.getData = function (from, to) {

    }

    this.clearData = function (data) {

    }
}


var instance = new DataHolder();
instance.init();

module.exports = instance;
/*
module.exports.addData = instance.addData;
module.exports.getData = instance.addData;
module.exports.clearData = instance.clearData;
*/


