import { initialise as initialiseAudio, play, scheduleAt, scheduleNow } from './audio'

const bounded = (min, max, value) => Math.max(min, Math.min(value, max))
const then = (x, f) => f(x)

// ---------- ACTIONS ----------
const editParam = (param, value) => ({ type: 'EDIT_PARAM', param, value })
export const editAccent = value => editParam('accent', value)
export const editBpm = value => editParam('bpm', value)
const resetParam = param => ({ type: 'RESET_PARAM', param })
export const resetAccent = () => resetParam('accent')
export const resetBpm = () => resetParam('bpm')
export const start = () => ({ type: 'START' })
export const stop = () => ({ type: 'STOP' })
export const tick = () => ({ type: 'TICK' })
const updateParam = (param, value) => ({ type: 'UPDATE_PARAM', param, value })
export const updateAccent = value => updateParam('accent', bounded(1, 16, value))
export const updateBpm = value => updateParam('bpm', bounded(20, 300, value))
const audioInitialised = () => ({ type: 'AUDIO_INITIALISED' })
// ---------- SELECTORS ----------
const displayFrom = editable => editable.display
const actualFrom = editable => editable.value

export const accent = state => actualFrom(state.accent)
export const accentDisplay = state => displayFrom(state.accent)
export const bpm = state => actualFrom(state.bpm)
export const bpmDisplay = state => displayFrom(state.bpm)
export const count = state => state.count

const isAudioInitialised = state => state.audioInitialised

// ---------- REDUCER ----------
const editable = (param, initialValue) => ({ [param]: { display: initialValue, value: initialValue } })
const edit = (editable, newValue) => ({ display: newValue, value: editable.value })
const reset = (editable) => ({ display: editable.value, value: editable.value })

const initialState = {
  count: undefined,
  ...editable('accent', 4),
  ...editable('bpm', 120),
  audioInitialised: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUDIO_INITIALISED':
      return { ...state, audioInitialised: true }
    case 'EDIT_PARAM':
      return { ...state, [action.param]: edit(state[action.param], action.value) }
    case 'RESET_PARAM':
      return { ...state, [action.param]: reset(state[action.param]) }
    case 'START':
      return { ...state, count: 1 }
    case 'STOP':
      return { ...state, count: undefined }
    case 'TICK':
      return state.count
        ? { ...state, count: (state.count % state.accent.value) + 1 }
        : state
    case 'UPDATE_PARAM':
      return {
        ...state,
        ...editable(action.param, action.value),
        count: (state.count && action.param === 'accent')
          ? then(state.count % action.value, x => x === 0 ? action.value : x)
          : state.count
      }
  }
  return state
}

// ---------- MIDDLEWARE ----------
let cancel
let lastPlayedAtMs
export const middleware = store => next => action => {
  switch (action.type) {
    case 'START':
      const afterAudioInitialised = isAudioInitialised(store.getState())
        ? Promise.resolve()
        : initialiseAudio().then(() => { next(audioInitialised()) })

      return afterAudioInitialised
        .then(() => scheduleNow((playedAtMs) => {
          lastPlayedAtMs = playedAtMs
          play(true)
          scheduleTick(store.getState, store.dispatch)
        }))
        .then(() => next(action))
    case 'TICK':
      next(action)
      scheduleTick(store.getState, store.dispatch)
      return
    case 'STOP':
      cancel && cancel()
      lastPlayedAtMs = undefined
  }
  return next(action)
}

const scheduleTick = (getState, dispatch) => {
  cancel = scheduleAt(
    (playedAtMs) => {
      if (count(getState()) > 0) {
        lastPlayedAtMs = playedAtMs
        dispatch(tick())
        const accented = count(getState()) === 1
        play(accented)
      }
    },
    lastPlayedAtMs + ((60 / bpm(getState())) * 1000)
  )
}
