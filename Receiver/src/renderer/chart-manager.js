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
  margin: { t: 30, r: 30, b: 10, l: 35 },
  dragmode: 'pan',
  hovermode: 'x',
  clickmode: 'event',
  uirevision: 'global',
}
const defaultConfig = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  scrollZoom: true,
  staticPlot: false,
  modeBarButtons: [['zoomIn2d'], ['zoomOut2d'], [
    {
      name: 'autoscale',
      icon: Plotly.Icons.autoscale ,
      click: function (gd) {
        Plotly.relayout(gd, { 'yaxis.autorange': true })
      }
    }
  ]]
}
const defaultData = {
  type: 'scatter',
  mode: 'lines',
  x: [],
  y: [],
  hoverinfo: 'y',
}

class ChartManager {
  constructor() {
    this.chartName = null
    this.chart = null
    this.scrollAnimationFrameId = null
    this.lastFrameId = 0
    this.isProgramRelayout = false
    this.userControl = false
  }

  Init(name) {
    this.chart = document.getElementById(name)
    Plotly.newPlot(this.chart, [], defaultLayout, defaultConfig)
    Plotly.relayout(this.chart, { 'xaxis.range': [0, 600] })

    this.chart.on('plotly_relayouting', (eventData) => {
      this.userControl = true
    })

    this.chart.on('plotly_relayout', (eventData) => {
      if (this.isProgramRelayout) {
        return
      }
      this.userControl = false
    })
  }

  AddData(chartData) {
    if (!chartData || chartData.size === 0) {
      return
    }
    const buffer = {}
    for (const [frameId, parameters] of chartData) {
      if (frameId === 1) {
        const traceCount = this.chart.data.length;
        const indices = Array.from({ length: traceCount }, (_, i) => i);
        Plotly.deleteTraces(this.chart, indices);
        for (let i = 0; i < parameters.length; i++) {
          let data = defaultData
          data.name = parameters[i]
          Plotly.addTraces(this.chart, defaultData)
        }
        const width = this.chart.layout.xaxis.range[1] - this.chart.layout.xaxis.range[0]
        Plotly.relayout(this.chart, { 'xaxis.range': [-width, 0] })
      }
      else {
        for (let i = 0; i < parameters.length; i++) {
          if (!buffer[i]) {
            buffer[i] = { x: [], y: [] }
          }
          buffer[i].x.push(frameId - 2)
          buffer[i].y.push(parameters[i])
        }
        this.lastFrameId = frameId - 2
      }
    }
    if (Object.keys(buffer).length > 0) {
      const traceIndices = Object.keys(buffer).map(Number)
      const updateData = {
        x: traceIndices.map(i => buffer[i].x),
        y: traceIndices.map(i => buffer[i].y)
      }
      Plotly.extendTraces(this.chart, updateData, traceIndices)
    }
    this.SmoothScroll()
  }

  SmoothScroll(duration = 1000) {
    if (this.scrollAnimationFrameId) {
      cancelAnimationFrame(this.scrollAnimationFrameId)
    }
    const startTime = performance.now()
    const startPos = this.chart.layout.xaxis.range[1]
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const width = this.chart.layout.xaxis.range[1] - this.chart.layout.xaxis.range[0]
      const distance = this.lastFrameId - startPos
      const targetPos = startPos + distance * progress
      if (!this.userControl) {
        this.isProgramRelayout = true
        Plotly.relayout(this.chart, { 'xaxis.range': [targetPos - width, targetPos] })
        setTimeout(() => { this.isProgramRelayout = false }, 0)
      }
      if (progress < 1) {
        this.scrollAnimationFrameId = requestAnimationFrame(animate)
      } else {
        this.scrollAnimationFrameId = null
      }
    }
    this.scrollAnimationFrameId = requestAnimationFrame(animate)
  }
}

document.addEventListener('DOMContentLoaded', function () {
  chartManager.Init('chart')
})

const chartManager = new ChartManager()
export { chartManager }