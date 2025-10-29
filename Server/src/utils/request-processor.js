const FileHelper = require('./file-helper')

class RequestProcessor {
    constructor(fileHelper, options = {}) {
        this.fileHelper = fileHelper
        this.buffer = new Map()
        this.requestProcessingQueue = Promise.resolve()
        this.expectedFrameId = 1
        this.maxBufferSize = options.maxBufferSize || 180
    }

    async requestProcessing(queryParams) {
        this.requestProcessingQueue = this.requestProcessingQueue.then(async () => {
            try {
                const frameID = queryParams.frameID
                const frame = Object.entries(queryParams)
                    .filter(([key]) => /^p\d+$/.test(key))
                    .sort(([a], [b]) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
                    .map(entry => entry[1].toString().replace('.', ','))
                this.buffer.set(parseInt(frameID), frame)
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
                    await this.fileHelper.appendToFile(data.join('\t') + '\n')
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
}

module.exports = RequestProcessor