// ---------- ACTIONS ----------
export const updateAccent = accent => ({ type: 'UPDATE_ACCENT', accent })
export const updateBpm = bpm => ({ type: 'UPDATE_BPM', bpm })

// ---------- SELECTORS ----------
export const accent = state => state.accent
export const bpm = state => state.bpm
export const count = state => state.count

// ---------- REDUCER ----------
const bounded = (min, max, value) => Math.max(min, Math.min(value, max))

export const reducer = (state = { accent: 4, bpm: 120, count: undefined }, action) => {
  switch (action.type) {
    case 'UPDATE_ACCENT':
      return { ...state, accent: bounded(1, 16, action.accent) }
    case 'UPDATE_BPM':
      return { ...state, bpm: bounded(20, 300, action.bpm) }
  }
  return state
}
