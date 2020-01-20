import React from 'react'
import { connect } from 'react-redux'
import { bpm, bpmDisplay, editBpm, resetBpm, updateBpm } from './interactions'

const mapStateToProps = state => ({
  bpm: bpmDisplay(state),
  uncommited: bpm(state) !== bpmDisplay(state)
})

const mapDispatchToProps = dispatch => ({
  edit: e => dispatch(editBpm(e.target.value)),
  keyUp: e => {
    if (e.keyCode === 13) { // ENTER
      e.preventDefault()
      dispatch(updateBpm(e.target.value))
    } else if (e.keyCode === 27) { // ESC
      e.preventDefault()
      dispatch(resetBpm())
    }
  },
  update: e => dispatch(updateBpm(e.target.value))
})

const BPM = ({ bpm, edit, keyUp, uncommited, update }) => (
  <div class="numeric-input__wrapper">
    <input
      id="bpm"
      class={`numeric-input ${uncommited ? ' numeric-input--uncommited' : ''}`}
      type="number"
      inputMode="numeric"
      name="bpm"
      value={bpm}
      onKeyUp={keyUp}
      onChange={edit}
      onBlur={update}
      onFocus={() => document.getElementById('bpm').select()}
    />
    <label for="bpm" class="numeric-input__label">
      <span>BPM</span>
    </label>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(BPM)
