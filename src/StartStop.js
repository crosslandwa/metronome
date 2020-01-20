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
      <div class="square square--half square--max-20">
        <div class="startstop__wrapper">
          <input
            id="start"
            class="startstop__checkbox"
            type="checkbox"
            checked={started}
            name="start"
            onChange={() => toggle(started)}
          />
          <label for="start" class="startstop__label">
            <span>Start and stop<br/>metronome</span>
          </label>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartStop)
