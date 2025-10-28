const port = 8080

const express = require("express")
const app = express()
const path = require('path')

const FileHelper = require('./utils/file-helper')
const fh = new FileHelper(path.dirname(__dirname), port)

const Monitor = require('./utils/monitor')
const monitor = new Monitor()

async function startServer() {
  app.get('/', function (req, res) {
    try {
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/write', async function (req, res) {
    try {
      const queryParams = req.query

      const frameID = queryParams.frameID
      if (!frameID) {
        res.status(400).send('Missing frameID')
        return
      }

      const frame = Object.entries(queryParams)
        .filter(([key]) => /^p\d+$/.test(key))
        .map(entry => entry[1].toString().replace('.', ','))
        .join('\t')

      fh.appendToFile(frame + '\n')

      monitor.recordRequest()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/new', function (req, res) {
    try {
      fh._filePath = null
      monitor.reset()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.listen(port, '127.0.0.1', () => {
    console.log(`Server started on 127.0.0.1:${port}`)
  })

  setInterval(() => monitor.update(), 1000)
}

startServer().catch(error => {
  console.log(error)
})