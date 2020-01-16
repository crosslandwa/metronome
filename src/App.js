import React from 'react'
import Accent from './Accent'
import BPM from './BPM'
import Counter from './Counter'
import StartStop from './StartStop'
import './app.css'

const App = () => (
  <>
    <h1>Metronome</h1>
    <StartStop />
    <BPM />
    <Accent />
    <Counter />
  </>
)

export default App
