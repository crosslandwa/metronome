let audioContext
let accentedBuffer
let tickBuffer

// force audio context to start on IOS by playing a short bit of silence
function forceAudioContextToStart (context) {
  const source = context.createBufferSource()
  source.buffer = context.createBuffer(1, 1, 22050)
  source.connect(context.destination)
  source.start(0)
}

export const initialise = async () => {
  if (!(window && (window.AudioContext || window.webkitAudioContext))) return Promise.resolve()
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  forceAudioContextToStart(audioContext)
  accentedBuffer = await loadSample('accented.mp3', audioContext)
  tickBuffer = await loadSample('tick.mp3', audioContext)
  return Promise.resolve()
}

async function loadSample (url, context) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    request.onload = function () {
      context.decodeAudioData(request.response, resolve)
    }
    request.send()
  })
}

export const schedule = (callback, whenMs) => (audioContext ? scheduleWithWebAudioAPI(audioContext) : scheduleWithSetTimeout)(callback, whenMs)

const scheduleWithWebAudioAPI = context => (callback, whenMs) => {
  let source = context.createBufferSource()
  let now = context.currentTime
  let numberOfSamplesInOneMs = context.sampleRate / 1000
  let scheduledAt = whenMs ? (whenMs / 1000) : now
  // a buffer length of 1 sample doesn't work on IOS, so use 1/1000th of a second
  let oneMsBuffer = context.createBuffer(1, numberOfSamplesInOneMs, context.sampleRate)
  // eslint-disable-next-line standard/no-callback-literal
  source.addEventListener('ended', () => callback(scheduledAt * 1000))
  source.buffer = oneMsBuffer
  source.connect(context.destination)
  source.start(scheduledAt - 0.001)

  return function cancel () {
    source.removeEventListener('ended', callback)
    source.stop()
  }
}

const scheduleWithSetTimeout = (callback, whenMs) => {
  const now = new Date().getTime()
  const scheduledAtMs = whenMs || now
  const interval = whenMs ? whenMs - now : 0
  const handle = setTimeout(() => callback(scheduledAtMs), interval)
  return function cancel () {
    clearTimeout(handle)
  }
}

export const play = (accented = true) => {
  if (!audioContext) return

  const source = audioContext.createBufferSource()
  source.connect(audioContext.destination)
  source.buffer = accented ? accentedBuffer : tickBuffer
  source.start()
}
