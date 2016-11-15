function ConsoleLogger() {

    this.StartMessage = (msg) => {

        //console.log('==============================================================');
        //console.log('==============================================================');
        //console.log('==============================================================');
        //console.log('==============================================================');
        console.log('[' + this.currentTime() + ']' + msg);
    };

    this.EndMessage = (msg) => {

        console.log('[' + this.currentTime() + ']' + msg);
        //console.log('==============================================================');
        //console.log('==============================================================');
        //console.log('==============================================================');
        //console.log('==============================================================');
    }

    this.SimpleMessage = (msg) => {
        //console.log('==============================================================');
        console.log('[' + this.currentTime() + ']' + msg);
        //console.log('==============================================================');
    }

    this.currentTime = () => {
        var date = new Date();
        var current = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        return current;
    }
}

module.exports = new ConsoleLogger();