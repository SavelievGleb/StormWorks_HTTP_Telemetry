const Average = require('./average')

class Monitor {
    constructor() {
        this.requestCount = 0
        this.frameCount = 0
        this.writeCount = 0
        this.lastDisplayRequestCount = 0
        this.lastDisplayFrameCount = 0
        this.lastUpdateTime = Date.now()
        this.averageRPS = new Average(3)
        this.averageFPS = new Average(3)
    }

    recordRequest() {
        this.requestCount++
    }

    recordFrame() {
        this.frameCount++
    }

    recordWrite() {
        this.writeCount++
    }

    reset() {
        this.requestCount = 0
        this.frameCount = 0
        this.writeCount = 0
        this.lastDisplayRequestCount = 0
        this.lastDisplayFrameCount = 0
    }

    update() {
        const timeDiff = (Date.now() - this.lastUpdateTime) / 1000
        const requestSinceLastUpdate = this.requestCount - this.lastDisplayRequestCount
        const frameSinceLastUpdate = this.frameCount - this.lastDisplayFrameCount

        if (timeDiff > 0.1) {
            const requestPerSecond = requestSinceLastUpdate / timeDiff
            const framePerSecond = frameSinceLastUpdate / timeDiff
            this.averageRPS.add(requestPerSecond)
            this.averageFPS.add(framePerSecond)
            process.stdout.write(`\rRequest: ${this.requestCount} ${Math.round(this.averageRPS.get())} Hz | Frame: ${this.frameCount} ${Math.round(this.averageFPS.get())} Hz | Processed: ${this.writeCount}/${this.frameCount}${' '.repeat(20)}`)
        }

        this.lastDisplayRequestCount = this.requestCount
        this.lastDisplayFrameCount = this.frameCount
        this.lastUpdateTime = Date.now()
    }
}

module.exports = Monitor