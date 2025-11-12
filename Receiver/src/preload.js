const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onMonitorUpdate: (callback) => ipcRenderer.on('monitor-update', callback)
})