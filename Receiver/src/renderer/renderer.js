const defaultLayout = {
  xaxis: {
    color: '#cccccc',
    gridcolor: '#666666',
    zerolinecolor: '#666666',
    rangeslider: {
      visible: true,
      thickness: 0.1,
    },
    // fixedrange: true,
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

function generateSineSignal({
  amplitude = 1.0,
  frequency = 1.0,
  duration = 1.0,
  sampleRate = 44100,
  phase = 0
} = {}) {
  const samples = Math.floor(duration * sampleRate);
  const signal = new Float32Array(samples);
  const angularFrequency = 2 * Math.PI * frequency;

  for (let i = 0; i < samples; i++) {
    const time = i / sampleRate;
    signal[i] = amplitude * Math.sin(angularFrequency * time + phase);
  }

  return signal;
}

function createPlotData(
  name,
  params = {
    amplitude = 1.0,
    frequency = 1.0,
    duration = 1.0,
    sampleRate = 44100,
    phase = 0
  } = {}) {
  let data = {
    type: 'scatter',
    name: name,
    mode: 'lines',
    x: [],
    y: [],
    hoverinfo: 'y',
  }
  const signal = generateSineSignal(params)
  for (var i = 0; i < signal.length; i++) {
    data.x[i] = i
    data.y[i] = signal[i]
  }
  return data
}

document.addEventListener('DOMContentLoaded', function () {
  Plotly.newPlot('chart', [], defaultLayout, defaultConfig)

  Plotly.addTraces('chart', [
    createPlotData('sin 1', { sampleRate: 300, duration: 2, amplitude: 1, frequency: 1, phase: 0 }),
  ]);

  Plotly.update('chart')
})
window.electronAPI.onMonitorUpdate((event, data) => {
  document.getElementById('request-count').textContent = data.requestCount
  document.getElementById('request-frequency').textContent = data.requestFrequency
  document.getElementById('frame-count').textContent = data.frameCount
  document.getElementById('processed-frames-count').textContent = data.frameCount
  document.getElementById('frame-frequency').textContent = data.frameFrequency
  document.getElementById('write-count').textContent = data.writeCount
})