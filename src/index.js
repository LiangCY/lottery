import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import './index.css'

import App from './components/App'
import configureStore from './redux/create'

import registerServiceWorker from './registerServiceWorker'

const { persistor, store } = configureStore()

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App}>
          <Route path='/game' component={require('./components/Game').default} />
          <Route path='/record' component={require('./components/Record').default} />
        </Route>
      </Router>
    </Provider>
  </PersistGate>,
  document.getElementById('root')
)

registerServiceWorker();
