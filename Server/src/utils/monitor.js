const Average = require('./average')

class Monitor {
    constructor() {
        this.requestCount = 0
        this.lastDisplayCount = 0
        this.lastUpdateTime = Date.now()
        this.averageRPS = new Average(3)
    }

    recordRequest() {
        this.requestCount++
    }

    reset() {
        this.requestCount = 0
        this.lastDisplayCount = 0
    }

    update() {
        const timeDiff = (Date.now() - this.lastUpdateTime) / 1000
        const requestSinceLastUpdate = this.requestCount - this.lastDisplayCount

        if (timeDiff > 0.1) {
            const requestPerSecond = requestSinceLastUpdate / timeDiff
            this.averageRPS.add(requestPerSecond)
            process.stdout.write(`\rFrequency: ${Math.round(this.averageRPS.get())} Hz | Request count: ${this.requestCount}${' '.repeat(20)}`)
        }

        this.lastDisplayCount = this.requestCount
        this.lastUpdateTime = Date.now()
    }
}

module.exports = Monitor