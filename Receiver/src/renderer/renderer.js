window.electronAPI.onMonitorUpdate((event, data) => {
  document.getElementById('request-count').textContent = data.requestCount
  document.getElementById('request-frequency').textContent = data.requestFrequency
  document.getElementById('frame-count').textContent = data.frameCount
  document.getElementById('processed-frames-count').textContent = data.frameCount
  document.getElementById('frame-frequency').textContent = data.frameFrequency
  document.getElementById('write-count').textContent = data.writeCount
})