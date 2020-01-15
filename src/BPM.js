import React from 'react'
import { connect } from 'react-redux'
import { bpm, bpmDisplay, editBpm, resetBpm, updateBpm } from './interactions'

const mapStateToProps = state => ({
  bpm: bpmDisplay(state),
  uncommited: bpm(state) !== bpmDisplay(state)
})

const mapDispatchToProps = dispatch => ({
  edit: e => dispatch(editBpm(e.target.value)),
  reset: () => dispatch(resetBpm()),
  update: e => e.keyCode === 13 && dispatch(updateBpm(e.target.value))
})

const BPM = ({ bpm, edit, reset, uncommited, update }) => (
  <label>
    <span>BPM</span>
    <input
      class={uncommited && 'input--uncommited'}
      type="number"
      name="bpm"
      value={bpm}
      onKeyUp={update}
      onChange={edit}
      onBlur={reset}
    />
  </label>
)

export default connect(mapStateToProps, mapDispatchToProps)(BPM)
