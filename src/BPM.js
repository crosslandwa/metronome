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
  <div class="numeric-input__wrapper">
    <input
      id="bpm"
      class={`numeric-input ${uncommited ? ' numeric-input--uncommited' : ''}`}
      type="number"
      name="bpm"
      value={bpm}
      onKeyUp={update}
      onChange={edit}
      onBlur={reset}
    />
    <label for="bpm" class="numeric-input__label">
      <span>BPM</span>
    </label>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(BPM)
