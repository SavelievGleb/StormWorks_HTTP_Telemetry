const port = 8080

const os = require('os')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const express = require("express")
const server = express()
const path = require('path')

const filesPath = path.join(os.homedir(), 'Desktop', 'HTTP Telemetry data')

const Monitor = require('./utils/monitor')
const monitor = new Monitor()

const DataWriter = require('./utils/data-writer')
const dataWriter = new DataWriter(monitor, filesPath, port)

const DataReader = require('./utils/data-reader')
const dataReader = new DataReader()

const RequestProcessor = require('./utils/request-processor')
const requestProcessor = new RequestProcessor(dataWriter, monitor)

window = null

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

  setInterval(() => {
    if (window) {
      try {
        window.webContents.send('monitor-update', monitor.update())
        window.webContents.send('data-update', requestProcessor.getChartBuffer())
      } catch { }
    }
  }, 1000)
}

startServer().catch(error => {
  console.log(error)
})

app.whenReady().then(() => {
  window = new BrowserWindow({
    width: 800,
    minWidth: 600,
    height: 600,
    minHeight: 400,
    icon: path.join(__dirname, 'renderer', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  window.setMenuBarVisibility(false)
  window.loadFile(path.join(__dirname, 'renderer', 'index.html'))
})

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    defaultPath: filesPath,
    properties: ['openFile'],
    filters: [
      { name: 'Record', extensions: ['txt'] }
    ]
  })
  if (canceled) {
    return
  }
  window.webContents.send('data-update', await dataReader.readFile(filePaths[0]))
})
