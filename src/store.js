import { createStore, applyMiddleware, compose } from 'redux'
import { reducer } from './interactions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function createAppStore () {
  const middlewares = []
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  )
}

export default createAppStore
