import React from 'react'
import Accent from './Accent'
import BPM from './BPM'
import './app.css'

const OnOff = () => (
  <button></button>
)

const App = ({ accent, bpm }) => (
  <>
    <h1>Metronome</h1>
    <OnOff/>
    <BPM />
    <Accent />
  </>
)

export default App
