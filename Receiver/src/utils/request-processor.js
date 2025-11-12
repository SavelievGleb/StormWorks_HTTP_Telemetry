class RequestProcessor {
    constructor(dataWriter, monitor, options = {}) {
        this.dataWriter = dataWriter
        this.monitor = monitor
        this.buffer = new Map()
        this.requestProcessingQueue = Promise.resolve()
        this.chartBuffer = new Map()
        this.expectedFrameId = 1
        this.maxBufferSize = options.maxBufferSize || 180
    }

    async requestProcessing(queryParams) {
        this.requestProcessingQueue = this.requestProcessingQueue.then(async () => {
            try {
                const frames = JSON.parse(queryParams.frames)
                for (const frame of frames) {
                    const frameID = parseInt(frame.frameID)
                    const parameters = Object.entries(frame)
                        .filter(([key]) => /^p\d+$/.test(key))
                        .map(entry => entry[1])
                    this.buffer.set(frameID, parameters)
                    this.monitor.recordFrame()
                }
                await this.writeData()
                return true
            } catch {
                return false
            }
        })
        return this.requestProcessingQueue
    }

    reset() {
        this.buffer = new Map()
        this.requestProcessingQueue = Promise.resolve()
        this.expectedFrameId = 1
    }

    async writeData() {
        let wroteSomething = true
        while (wroteSomething) {
            wroteSomething = false
            if (this.buffer.has(this.expectedFrameId)) {
                const data = this.buffer.get(this.expectedFrameId)
                try {
                    await this.dataWriter.appendToFile(Object.entries(data)
                        .map(entry => entry[1].toString().replace('.', ','))
                        .join('\t') + '\n')
                    this.chartBuffer.set(this.expectedFrameId, data)
                    this.buffer.delete(this.expectedFrameId)
                    this.expectedFrameId++
                    wroteSomething = true
                } catch (error) {
                    break
                }
            }
            else if (this.buffer.size > this.maxBufferSize) {
                wroteSomething = true
                const oldFrameId = this.expectedFrameId
                this.expectedFrameId = Math.min(...this.buffer.keys())
                const newFrameId = this.expectedFrameId
                console.log(`\rFrame processor buffer overflow. Skip frames from ${oldFrameId} to ${newFrameId}`)
            }
        }
    }

    getChartBuffer() {
        const buff = new Map(this.chartBuffer)
        this.chartBuffer.clear()
        return buff
    }
}

module.exports = RequestProcessor