/**
 * @jest-environment jsdom
 */

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
  tick,
  updateAccent,
  updateBpm
} from '../interactions'
import { initialise as mockInitialiseAudio, play as mockPlay, scheduleAt as mockScheduleAt, scheduleNow as mockScheduleNow } from '../audio'

jest.mock('../audio')

const times = (n, f) => [...Array(n).keys()].forEach(f)
const stubCancel = () => {}

describe('Metronome', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    mockInitialiseAudio.mockImplementation(() => Promise.resolve())
    mockPlay.mockImplementation(() => {})
    mockScheduleAt.mockImplementation(() => stubCancel)
    mockScheduleNow.mockImplementation(() => stubCancel)
  })

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
    it('can be started', async () => {
      const store = createStore()
      await store.dispatch(start())
      expect(count(store.getState())).toEqual(1)
    })

    it('can be stopped', () => {
      const store = createStore()
      store.dispatch(start())
      store.dispatch(stop())
      expect(count(store.getState())).toEqual(undefined)
    })

    it('advances the count each tick when metronome is started', async () => {
      const store = createStore()
      await store.dispatch(start())
      expect(count(store.getState())).toEqual(1)
      store.dispatch(tick())
      expect(count(store.getState())).toEqual(2)
      store.dispatch(tick())
      expect(count(store.getState())).toEqual(3)
      store.dispatch(tick())
      expect(count(store.getState())).toEqual(4)
    })

    it('count is bound by the accent', async () => {
      const store = createStore()
      await store.dispatch(start()) // 1
      times(4, () => store.dispatch(tick())) // 2, 3, 4, 1
      expect(count(store.getState())).toEqual(1)
    })

    it('count is bound by the accent and immediately jumps to a new count when accent < count', async () => {
      const store = createStore()
      store.dispatch(updateAccent(12))
      await store.dispatch(start()) // 1
      times(9, () => store.dispatch(tick())) // 2, 3, ..., 11
      expect(count(store.getState())).toEqual(10)
      store.dispatch(updateAccent(4))
      expect(count(store.getState())).toEqual(2)
    })

    it('count is bound by the accent and immediately jumps to max when count is an exact multiple of accent', async () => {
      const store = createStore()
      await store.dispatch(start()) // 1
      times(3, () => store.dispatch(tick())) // 2, 3, 4
      expect(count(store.getState())).toEqual(4)
      store.dispatch(updateAccent(2))
      expect(count(store.getState())).toEqual(2)
    })

    it('count is not advanced each tick when metronome is not running', () => {
      const store = createStore()
      store.dispatch(tick())
      store.dispatch(tick())
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

  it('plays an accented click every 4th click', (done) => {
    const playRequests = []
    const playRequestsAt = []
    mockPlay.mockImplementation((accented) => {
      playRequests.push(accented)
      if (playRequests.length > 7) {
        expect(playRequests).toEqual([true, false, false, false, true, false, false, false])
        expect(playRequestsAt.slice(0, playRequests.length)).toEqual([0, 500, 1000, 1500, 2000, 2500, 3000, 3500])
        done()
      }
    })
    mockScheduleAt.mockImplementation((scheduled, whenMs) => {
      playRequestsAt.push(whenMs)
      setTimeout(() => scheduled(whenMs), 0)
      return stubCancel
    })
    mockScheduleNow.mockImplementation((scheduled) => {
      playRequestsAt.push(0)
      scheduled(0)
      return stubCancel
    })

    const store = createStore()
    store.dispatch(start())
  })
})
