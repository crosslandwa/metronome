let audioContext

export const initialise = async () => {
  if (!(window && window.AudioContext)) return Promise.resolve()

  audioContext = new window.AudioContext()
  await loadSample('accented.wav', audioContext)
  return Promise.resolve()
}

async function loadSample (assetUrl, context, done) {
  // TODO implement
  // const request = new XMLHttpRequest()
  // request.open('GET', assetUrl, true)
  // request.responseType = 'arraybuffer'
  // request.onload = function () {
  //   context.decodeAudioData(request.response, done)
  // }
  // request.send()
}

export const schedule = (callback, whenMs) => (audioContext ? scheduleWithWebAudioAPI(audioContext) : scheduleWithSetTimeout)(callback, whenMs)

const scheduleWithWebAudioAPI = context => (callback, whenMs) => {
  let source = context.createBufferSource()
  let now = context.currentTime
  let thousandth = context.sampleRate / 1000
  let scheduledAt = now + (whenMs / 1000) - 0.001
  // a buffer length of 1 sample doesn't work on IOS, so use 1/1000th of a second
  let buffer = context.createBuffer(1, thousandth, context.sampleRate)
  source.addEventListener('ended', callback)
  source.buffer = buffer
  source.connect(context.destination)
  source.start(scheduledAt)

  return function cancel () {
    source.removeEventListener('ended', callback)
    source.stop()
  }
}

const scheduleWithSetTimeout = (callback, whenMs) => {
  const handle = setTimeout(callback, whenMs)
  return function cancel () {
    clearTimeout(handle)
  }
}
