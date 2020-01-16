import { createStore, applyMiddleware, compose } from 'redux'
import { middleware, reducer } from './interactions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function createAppStore () {
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(...[middleware])
    )
  )
}

export default createAppStore
