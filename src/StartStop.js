import React from 'react'
import { connect } from 'react-redux'
import { count, start, stop } from './interactions'

const mapStateToProps = state => ({
  started: count(state) > 0
})

const mapDispatchToProps = dispatch => ({
  toggle: started => dispatch(started ? stop() : start())
})

class StartStop extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = (e) => {
      if (e.keyCode === 32) {
        e.preventDefault()
        this.props.toggle(this.props.started)
      }
    }
  }
  componentWillMount () {
    document.addEventListener('keydown', this.toggle)
  }

  render () {
    const { started, toggle } = this.props
    return (
      <label>
        <span>Start</span>
        <input type="checkbox" checked={started} name="start" onChange={() => toggle(started)}/>
      </label>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartStop)
