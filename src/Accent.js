import React from 'react'
import { connect } from 'react-redux'
import { accent, accentDisplay, editAccent, resetAccent, updateAccent } from './interactions'

const mapStateToProps = state => ({
  accent: accentDisplay(state),
  uncommited: accentDisplay(state) !== accent(state)
})

const mapDispatchToProps = dispatch => ({
  edit: e => dispatch(editAccent(e.target.value)),
  reset: () => dispatch(resetAccent()),
  update: e => e.keyCode === 13 && dispatch(updateAccent(e.target.value))
})

const Accent = ({ accent, edit, reset, uncommited, update }) => (
  <div class="numeric-input__wrapper">
    <input
      id="accent"
      class={`numeric-input ${uncommited ? ' numeric-input--uncommited' : ''}`}
      type="number"
      value={accent}
      name="accent"
      onKeyUp={update}
      onChange={edit}
      onBlur={reset}
    />
    <label for="accent" class="numeric-input__label">
      <span>Accent</span>
    </label>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Accent)
