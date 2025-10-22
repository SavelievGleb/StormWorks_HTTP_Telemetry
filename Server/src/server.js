const port = 8080

const express = require("express")
const app = express()
const path = require('path')

const FileHelper = require('./utils/file-helper')
const fh = new FileHelper(path.dirname(__dirname), port)

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
      const frame = Object.values(queryParams)
        .map(value => value.replace('.', ','))
        .join('\t')

      const success = await fh.appendToFile(frame + '\n')
      console.log(frame)

      if (success) {
        res.status(200).send()
      } else {
        res.status(500).send('Failed to write to file')
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/new', function (req, res) {
    try {
      fh._filePath = null
      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.listen(port, '127.0.0.1', () => {
    console.log(`Server started on 127.0.0.1:${port}`)
  })
}

startServer().catch(error => {
  console.log(error)
})