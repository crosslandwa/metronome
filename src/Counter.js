import React from 'react'
import { connect } from 'react-redux'
import { accent, count } from './interactions'

const mapStateToProps = state => ({
  accent: accent(state),
  count: count(state)
})

const Counter = ({ accent, count }) => {console.log('render',count);return(
  <div class="counter">
    {[...Array(accent).keys()].map(x => x + 1).map(x => {console.log('unit',x);return(
      <div class={`counter__unit${(count === x) ? ' counter__unit--active' : ''}`} />
    )})}
  </div>
)}

export default connect(mapStateToProps)(Counter)
