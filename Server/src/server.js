const port = 8080

const express = require("express")
const app = express()
const path = require('path')

const Monitor = require('./utils/monitor')
const monitor = new Monitor()

const FileHelper = require('./utils/file-helper')
const fileHelper = new FileHelper(monitor, path.dirname(__dirname), port)

const RequestProcessor = require('./utils/request-processor')
const requestProcessor = new RequestProcessor(fileHelper)

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

      requestProcessor.requestProcessing(queryParams)

      monitor.recordRequest()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/new', function (req, res) {
    try {
      fileHelper.filePath = null
      requestProcessor.reset()
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