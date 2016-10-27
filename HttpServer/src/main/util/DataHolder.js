

function DataHolder() {
    this.holder = null;

    this.init = function () {
        this.holder = new Map();
    }

    this.addData = function (data) {
        this.holder.set(data.duration, data.packets);
    }

    this.getData = function (from, to) {
        var result = [];

        for (var idx = from; idx < to; idx++) {
            result.push({
                'duration': idx,
                'packets': this.holder.get(idx)
            });
        }
        return result;
    }

    this.clearData = function (data) {
        this.holder.clear();
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


