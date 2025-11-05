const port = 8080

const express = require("express")
const server = express()
const path = require('path')

const Monitor = require('./utils/monitor')
const monitor = new Monitor()

const DataWriter = require('./utils/data-writer')
const dataWriter = new DataWriter(monitor, path.dirname(__dirname), port)

const RequestProcessor = require('./utils/request-processor')
const requestProcessor = new RequestProcessor(dataWriter, monitor)

async function startServer() {
  server.get('/', function (req, res) {
    try {
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  server.get('/write', async function (req, res) {
    try {
      const queryParams = req.query

      if (!queryParams.frames) {
        res.status(400).send('Bad Request')
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

  server.get('/new', function (req, res) {
    try {
      dataWriter.filePath = null
      requestProcessor.reset()
      monitor.reset()
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  server.listen(port, '127.0.0.1', () => {
    console.log(`Server started on 127.0.0.1:${port}`)
  })

  setInterval(() => monitor.update(), 1000)
}

startServer().catch(error => {
  console.log(error)
})