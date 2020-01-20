import React from 'react'
import { connect } from 'react-redux'
import { accent, accentDisplay, editAccent, resetAccent, updateAccent } from './interactions'

const mapStateToProps = state => ({
  accent: accentDisplay(state),
  uncommited: accentDisplay(state) !== accent(state)
})

const mapDispatchToProps = dispatch => ({
  edit: e => dispatch(editAccent(e.target.value)),
  keyUp: e => {
    if (e.keyCode === 13) { // ENTER
      e.preventDefault()
      dispatch(updateAccent(e.target.value))
    } else if (e.keyCode === 27) { // ESC
      e.preventDefault()
      dispatch(resetAccent())
    }
  },
  update: e => dispatch(updateAccent(e.target.value))
})

const Accent = ({ accent, edit, keyUp, uncommited, update }) => (
  <div class="numeric-input__wrapper">
    <input
      id="accent"
      class={`numeric-input ${uncommited ? ' numeric-input--uncommited' : ''}`}
      type="number"
      inputMode="numeric"
      value={accent}
      name="accent"
      onKeyUp={keyUp}
      onChange={edit}
      onBlur={update}
      onFocus={() => document.getElementById('accent').select()}
    />
    <label for="accent" class="numeric-input__label">
      <span>Accent</span>
    </label>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Accent)
