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

let animationFrameId = null

let chartXwidth = 600
let chartXrange = [-chartXwidth, 0]

let lastFrameId = 0

document.addEventListener('DOMContentLoaded', function () {
  Plotly.newPlot('chart', [], defaultLayout, defaultConfig)
  Plotly.relayout('chart', { 'xaxis.range': [0, chartXwidth] })
  attachChartEvents()
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
      attachChartEvents()
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
      lastFrameId = frameId - 2
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
  smoothScrollChart()
})

function attachChartEvents() {
  const chart = document.getElementById('chart')

  chart.on('plotly_relayout', (eventData) => {
    const xrange = eventData['xaxis.range'] || [eventData['xaxis.range[0]'], eventData['xaxis.range[1]']]
    if (xrange[0] && xrange[1]) {
      chartXrange = xrange
      chartXwidth = xrange[1] - xrange[0]
    }
  })
}

function smoothScrollChart(duration = 1000) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  const chart = document.getElementById('chart')
  const currentRange = chart.layout.xaxis.range
  const startX1 = currentRange[1]
  const startTime = performance.now()
  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const actualRange = chart.layout.xaxis.range
    const currentWidth = actualRange[1] - actualRange[0]
    const targetX1 = lastFrameId
    const newX1 = startX1 + (targetX1 - startX1) * progress
    const newX0 = newX1 - currentWidth

    Plotly.relayout('chart', {
      'xaxis.range': [newX0, newX1]
    })

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      animationFrameId = null
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}
