const fs = require('fs')
const readline = require('readline')

class DataReader {
    async readFile(filePath) {
        const fileStream = fs.createReadStream(filePath)
        const fileData = new Map()
        let lineNumber = 1

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })

        for await (const line of rl) {
            if (line.trim() !== '') {
                fileData.set(lineNumber++, line.split('\t').map(entry => entry.toString().replace(',', '.')))
            }
        }

        return fileData
    }
}

module.exports = DataReader