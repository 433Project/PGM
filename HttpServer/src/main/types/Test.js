var DataHolder = require('../util/DataHolder');
var FileLogger = require('../util/FileLogger');

// 테스트 1개에 대한 Prototype
function Test() {

    this.count;
    this.arrivedCount;

    this.startTime;
    this.endTime;

    this.dataHolder; 

    this.logPath;
    this.fileName;

    this.state;

    this.init = () => {
        this.count = 0;
        this.arrivedCount = 0;
        this.startTime = null;
        this.endTime = null;

        this.dataHolder = DataHolder;
        this.logPath = '';
    };

    // 모니터링 시작
    // 초기화
    this.startTest = (count) => {
        this.init();
        this.clear();

        // test 패킷 수 설정
        this.count = count;
        // log용 파일 생성
        FileLogger.createFile();
    }

    this.addData = (data) => {
        this.dataHolder.addData(data);
        FileLogger.writeLog(data);
    }

    // 모니터링 종료
    // clearing
    this.endTest = () => {
        // 종료 시간 설정
        this.endTime = new Date();
        FileLogger.close();
    }

    this.getLogPath = function () {
        return this.logPath;
    }
    //?
    this.setLogPath = function (path) {
        this.logPath = path;
    }
    
    this.getFileName = ()=> { 
        return this.fileName;
    }

    this.clear = () => {
        this.count = 0;
        this.arrivedCount = 0;
        this.startTime = null;
        this.endTime = null;

        this.dataHolder.clearData();
        this.logPath = '';
    };
}

module.exports = new Test();