import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { routerReducer as routing } from 'react-router-redux'
import logger from 'redux-logger'

import { counterReducer, gameReducer } from './reducers'

const config = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(config, { ...counterReducer, ...gameReducer, routing })

export default function configureStore () {
  let store = createStore(reducer, applyMiddleware(logger))
  let persistor = persistStore(store)

  return { persistor, store }
}