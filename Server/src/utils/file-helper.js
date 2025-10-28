const fs = require('fs').promises
const path = require('path')

class FileHelper {
  constructor(dirname, port = 8080) {
    this._dirname = dirname
    this._port = port
    this._filePath = null
    this._writeQueue = Promise.resolve()
  }

  getFilePath() {
    if (this._filePath == null) {
      this.createFilePath()
    }
    return this._filePath
  }

  createFilePath() {
    this._filePath = path.join(this._dirname, 'data', `${this.getTimestamp()} (${this._port}).txt`)
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
    this._writeQueue = this._writeQueue.then(async () => {
      const targetPath = filePath || this.getFilePath()
      try {
        await fs.appendFile(targetPath, content, options)
        return true
      } catch (appendError) {
        if (appendError.code === 'ENOENT') {
          try {
            const dir = path.dirname(targetPath)
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(targetPath, content, options)
            return true
          } catch (createError) {
            return false
          }
        }
        console.log(`Failed to append to file "${targetPath}":`, appendError.message)
        return false
      }
    })
    return this._writeQueue
  }
}

module.exports = FileHelper
