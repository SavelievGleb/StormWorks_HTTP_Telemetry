const express = require("express")
const app = express()

const port = 8080

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

      console.info(frame)

      res.status(200).send()
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })

  app.get('/new', function (req, res) {
    try {
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