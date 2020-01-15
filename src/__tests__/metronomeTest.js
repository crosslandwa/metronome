import createStore from '../store'
import {
  accent,
  accentDisplay,
  bpm,
  bpmDisplay,
  count,
  editAccent,
  editBpm,
  resetAccent,
  resetBpm,
  start,
  stop,
  updateAccent,
  updateBpm
} from '../interactions'

describe('Metronome', () => {
  describe('at initialisation', () => {
    it('every 4th beat is accented', () => {
      const store = createStore()
      expect(accent(store.getState())).toEqual(4)
    })
    it('is stoppped', () => {
      const store = createStore()
      expect(count(store.getState())).toEqual(undefined)
    })
    it('is set to a BPM of 120', () => {
      const store = createStore()
      expect(bpm(store.getState())).toEqual(120)
    })
  })

  describe('running', () => {
    it('can be started', () => {
      const store = createStore()
      store.dispatch(start())
      expect(count(store.getState())).toEqual(1)
    })

    it('can be stopped', () => {
      const store = createStore()
      store.dispatch(start())
      store.dispatch(stop())
      expect(count(store.getState())).toEqual(undefined)
    })
  })

  describe('accent', () => {
    it('can be edited without commiting a change', () => {
      const store = createStore()
      store.dispatch(editAccent(3))
      expect(accentDisplay(store.getState())).toEqual(3)
      expect(accentDisplay(store.getState())).not.toEqual(accent(store.getState()))
    })

    it('can be edited and reset without commiting a change', () => {
      const store = createStore()
      store.dispatch(editAccent(3))
      expect(accentDisplay(store.getState())).not.toEqual(accent(store.getState()))

      store.dispatch(resetAccent())
      expect(accentDisplay(store.getState())).toEqual(accent(store.getState()))
    })

    it('can be updated', () => {
      const store = createStore()
      store.dispatch(updateAccent(3))
      expect(accentDisplay(store.getState())).toEqual(3)
      expect(accent(store.getState())).toEqual(3)
    })

    it('is bound between 1 and 16', () => {
      const store = createStore()

      store.dispatch(updateAccent(-10))
      expect(accent(store.getState())).toEqual(1)

      store.dispatch(updateAccent(100))
      expect(accent(store.getState())).toEqual(16)
    })
  })

  describe('bpm', () => {
    it('can be edited without commiting a change', () => {
      const store = createStore()
      store.dispatch(editBpm(130))
      const display = bpmDisplay(store.getState())

      expect(display).toEqual(130)
      expect(display).not.toEqual(bpm(store.getState()))
    })

    it('can be edited and reset without commiting a change', () => {
      const store = createStore()
      store.dispatch(editBpm(130))
      expect(bpmDisplay(store.getState())).not.toEqual(bpm(store.getState()))

      store.dispatch(resetBpm())
      expect(bpmDisplay(store.getState())).toEqual(bpm(store.getState()))
    })

    it('can be updated', () => {
      const store = createStore()
      store.dispatch(updateBpm(130))
      expect(bpm(store.getState())).toEqual(130)
      expect(bpmDisplay(store.getState())).toEqual(130)
    })

    it('is bound between 20 and 300', () => {
      const store = createStore()

      store.dispatch(updateBpm(-1))
      expect(bpm(store.getState())).toEqual(20)

      store.dispatch(updateBpm(350))
      expect(bpm(store.getState())).toEqual(300)
    })
  })
})
