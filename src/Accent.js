import React from 'react'
import { connect } from 'react-redux'
import { accent, updateAccent } from './interactions'

const mapStateToProps = state => ({
  accent: accent(state)
})

const mapDispatchToProps = dispatch => ({
  updateAccent: e => dispatch(updateAccent(e.target.value))
})

const Accent = ({ accent, updateAccent }) => (
  <label>
    <span>Accent</span>
    <input type="number" value={accent} name="accent" min="1" max="16" onChange={updateAccent}/>
  </label>
)

export default connect(mapStateToProps, mapDispatchToProps)(Accent)
