import { initialise, schedule } from './audio'

const bounded = (min, max, value) => Math.max(min, Math.min(value, max))

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
        count: (state.count && action.param === 'accent') ? state.count % action.value : state.count
      }
  }
  return state
}

// ---------- MIDDLEWARE ----------
let cancel
export const middleware = store => next => action => {
  switch (action.type) {
    case 'START':
      if (!isAudioInitialised(store.getState())) {
        return initialiseAudio()
          .then(() => { next(audioInitialised()) })
          .then(() => scheduleTick(store.getState, store.dispatch))
          .then(c => { cancel = c })
          .then(() => next(action))
      }
      // fall through
    case 'TICK':
      scheduleTick(store.getState, store.dispatch).then(c => { cancel = c })
      break
    case 'STOP':
      cancel && cancel()
  }
  return next(action)
}

const initialiseAudio = async () => {
  return initialise()
}

const scheduleTick = async (getState, dispatch) => {
  return schedule(
    () => {
      if (count(getState()) > 0) {
        dispatch(tick())
      }
    },
    (60 / bpm(getState())) * 1000
  )
}
