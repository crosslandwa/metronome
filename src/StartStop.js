import React from 'react'
import { connect } from 'react-redux'
import { count, start, stop } from './interactions'

const mapStateToProps = state => ({
  started: count(state) > 0
})

const mapDispatchToProps = dispatch => ({
  toggle: started => dispatch(started ? stop() : start())
})

const StartStop = ({ started, toggle }) => (
  <label>
    <span>Start</span>
    <input type="checkbox" checked={started} name="start" onChange={() => toggle(started)}/>
  </label>
)

export default connect(mapStateToProps, mapDispatchToProps)(StartStop)
