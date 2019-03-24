class IntervalManager {
    constructor() {
        this.intervals = []
    }

    setInterval(func, timeout, immediately=true) {
        if (immediately) {
            func()
        }
        this.intervals.push(setInterval(func, timeout));
    }

    setIntervals(funcList, timeout, immediately = true) {
        for (let func of funcList) {
            this.setInterval(func, timeout, immediately);
        }
    }

    clearAll() {
        for (let item of this.intervals) {
            clearInterval(item);
        }
    }

}

export default IntervalManager;