const fs = require('fs').promises
const path = require('path')

class DataWriter {
  constructor(monitor, dirname, port = 8080) {
    this.monitor = monitor
    this.dirname = dirname
    this.port = port
    this.filePath = null
    this.writeQueue = Promise.resolve()
  }

  getFilePath() {
    if (this.filePath == null) {
      this.createFilePath()
    }
    return this.filePath
  }

  createFilePath() {
    this.filePath = path.join(this.dirname, `${this.getTimestamp()} (${this.port}).txt`)
  }

  getTimestamp() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return `${day}-${month}-${year} ${hours}-${minutes}-${seconds}`
  }

  async appendToFile(content, filePath = null, options = { encoding: 'utf-8' }) {
    this.writeQueue = this.writeQueue.then(async () => {
      const targetPath = filePath || this.getFilePath()
      try {
        await fs.appendFile(targetPath, content, options)
        this.monitor.recordWrite()
        return true
      } catch (appendError) {
        if (appendError.code === 'ENOENT') {
          try {
            const dir = path.dirname(targetPath)
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(targetPath, content, options)
            this.monitor.recordWrite()
            return true
          } catch (createError) {
            return false
          }
        }
        console.log(`Failed to append to file "${targetPath}":`, appendError.message)
        return false
      }
    })
    return this.writeQueue
  }
}

module.exports = DataWriter
