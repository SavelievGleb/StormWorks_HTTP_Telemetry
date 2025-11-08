const defaultLayout = {
  xaxis: {
    color: '#cccccc',
    gridcolor: '#666666',
    zerolinecolor: '#666666',
    rangeslider: {
      visible: true,
      thickness: 0.1,
    },
  },
  yaxis: {
    color: '#cccccc',
    gridcolor: '#666666',
    zerolinecolor: '#666666',
    hoverformat: '.4f',
    autorange: true,
    fixedrange: false,
  },
  autosize: true,
  paper_bgcolor: '#1e1e1e',
  plot_bgcolor: '#1e1e1e',
  font: {
    color: '#cccccc'
  },
  margin: { t: 30, r: 30, b: 50, l: 60 },
  dragmode: 'pan',
  hovermode: 'x',
  clickmode: 'event'
}
const defaultConfig = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  scrollZoom: true,
  staticPlot: false,
  modeBarButtonsToRemove: ['zoom', 'pan', 'select', 'lasso', 'resetScale', 'toImage']
}

document.addEventListener('DOMContentLoaded', function () {
  Plotly.newPlot('chart', [], defaultLayout, defaultConfig)
  Plotly.relayout('chart', { 'xaxis.range': [0, 600] })
})

window.electronAPI.onMonitorUpdate((event, data) => {
  document.getElementById('request-count').textContent = data.requestCount
  document.getElementById('request-frequency').textContent = data.requestFrequency
  document.getElementById('frame-count').textContent = data.frameCount
  document.getElementById('processed-frames-count').textContent = data.frameCount
  document.getElementById('frame-frequency').textContent = data.frameFrequency
  document.getElementById('write-count').textContent = data.writeCount
})

window.electronAPI.onNewData((event, chartData) => {
  if (!chartData || chartData.size === 0) {
    return
  }
  const buffer = {}
  for (const [frameId, parameters] of chartData) {
    if (frameId === 1) {
      Plotly.newPlot('chart', [], defaultLayout, defaultConfig)
      for (let i = 0; i < parameters.length; i++) {
        Plotly.addTraces('chart', {
          type: 'scatter',
          name: parameters[i],
          mode: 'lines',
          x: [],
          y: [],
          hoverinfo: 'y',
        })
      }
    }
    else {
      for (let i = 0; i < parameters.length; i++) {
        if (!buffer[i]) {
          buffer[i] = { x: [], y: [] }
        }
        buffer[i].x.push(frameId - 2)
        buffer[i].y.push(parameters[i])
      }
    }
  }
  if (Object.keys(buffer).length > 0) {
    const traceIndices = Object.keys(buffer).map(Number)
    const updateData = {
      x: traceIndices.map(i => buffer[i].x),
      y: traceIndices.map(i => buffer[i].y)
    }
    Plotly.extendTraces('chart', updateData, traceIndices)
  }
})
