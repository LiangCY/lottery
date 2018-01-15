import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import './index.css'

import App from './components/App'
import configureStore from './redux/create'

import registerServiceWorker from './registerServiceWorker'

const { persistor, store } = configureStore()

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App}>
          <Route path='game' component={require('./components/Game').default} />
          <Route path='players' component={require('./components/Players').default} />
          <Route path='lottery' component={require('./components/Lottery').default} />
        </Route>
      </Router>
    </Provider>
  </PersistGate>,
  document.getElementById('root')
)

registerServiceWorker();
