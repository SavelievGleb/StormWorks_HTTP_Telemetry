const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onMonitorUpdate: (callback) => ipcRenderer.on('monitor-update', callback),
  onNewData: (callback) => ipcRenderer.on('data-update', callback)
})