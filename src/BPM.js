import React from 'react'
import { connect } from 'react-redux'
import { bpm, updateBpm } from './interactions'

const mapStateToProps = state => ({
  bpm: bpm(state)
})

const BPM = ({ bpm, updateBpm }) => (
  <label>
    <span>BPM</span>
    <input type="number" name="bpm" value={bpm} min="20" max="300" onChange={e => updateBpm(e.target.value)}/>
  </label>
)

export default connect(mapStateToProps, { updateBpm })(BPM)
